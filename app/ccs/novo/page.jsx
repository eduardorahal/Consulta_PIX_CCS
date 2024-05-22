// CPF Denis 05485620914
"use client";

import { IconButton, TextField, Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import * as React from "react";
import axios from "axios";
import DialogRelacionamentoCCS from "../components/DialogRelacionamentoCCS";
import DialogDetalhamentoCCS from "@/app/ccs/components/DialogDetalhamentoCCS";
import { Context } from "@/app/context";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { v4 as uuidv4 } from "uuid";
import withAuth from '@/app/auth/withAuth';

const ConsultaCCS = () => {

  // variáveis para armazenar CPF, CNPJ, Chave PIX e Motivo da consulta
  let initialValues = {
    cpfCnpj: '',
    motivo: '',
    numProcesso: '',
    dataInicio: dayjs(new Date(new Date().setFullYear(new Date().getFullYear() - 5))),
    dataFim: dayjs(new Date())
  }
  let [argsBusca, setArgsBusca] = React.useState([initialValues])

  // variável para recuperar o CPF do usuário do Context
  const { state, dispatch } = React.useContext(Context)
  const cpfResponsavel = state.cpf
  const token = state.token

  // variável para controle de soliticação de relacionamentos
  const [lista, setLista] = React.useState([]);
  const [relacionamentos, setRelacionamentos] = React.useState([]);
  const [openDialogRelacionamentoCCS, setOpenDialogRelacionamentoCCS] = React.useState(false);
  const [statusRelacionamentos, setStatusRelacionamentos] = React.useState(false);
  const [deAcordo, setDeAcordo] = React.useState(false);

  // variável para controle de soliticação de detalhamento
  const [openDialogDetalhamentoCCS, setOpenDialogDetalhamentoCCS] = React.useState(false);
  const [listaDetalhamentos, setListaDetalhamentos] = React.useState([]);
  const [statusDetalhamentos, setStatusDetalhamentos] = React.useState(false);

  // Função para Adicionar mais um item à consulta
  function addConsulta() {
    let lastIndex = argsBusca.length - 1;
    let newObject = {
      cpfCnpj: '',
      motivo: argsBusca[lastIndex].motivo,
      numProcesso: argsBusca[lastIndex].numProcesso,
      dataInicio: argsBusca[lastIndex].dataInicio,
      dataFim: argsBusca[lastIndex].dataFim
    };
    setArgsBusca([
      ...argsBusca,
      newObject
    ])
  }

  // Função para Remover um item da consulta
  function remConsulta(i) {
    let newArr = [...argsBusca];
    newArr.splice(i, 1);
    setArgsBusca(newArr);
  }

  // Função para Preenchimento do Array de Busca ao digitar nos campos, bem como para Formatar Campo CPF / CNPJ para excluir caracteres não numéricos do campo de Pesquisa
  const setFormValues = (e, i, name = '') => {
    let newArr = [...argsBusca];
    if (name == 'dataInicio') {
      newArr[i].dataInicio = e
    } else if (name == 'dataFim') {
      newArr[i].dataFim = e
    }
    else {
      switch (e.target.name) {
        case 'cpfCnpj':
          newArr[i].cpfCnpj = e.target.value.replace(/[^0-9]/g, "")
          break;
        case 'motivo':
          newArr[i].motivo = e.target.value
          break;
        case 'numProcesso':
          newArr[i].numProcesso = e.target.value
          break;
      }
    }
    setArgsBusca(newArr)
  }

  // Formatar CPF / CNPJ para apresentação no FrontEnd
  const formatCnpjCpf = (value) => {
    const cnpjCpf = value.replace(/\D/g, "");
    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    }
    return cnpjCpf.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      "$1.$2.$3/$4-$5"
    );
  };

  // Formatar Datas para apresentação no FrontEnd
  const formatarData = (data) => {
    let novadata = new Date(data);
    return (
      ((novadata.getDate())).toLocaleString('en-GB', { minimumIntegerDigits: 2, useGrouping: false }) +
      "/" +
      (novadata.getMonth() + 1).toLocaleString("en-GB", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "/" +
      novadata.getFullYear()
    );
  };

  // Formatar Datas para Solicitação CCS
  const formatarDataCCS = (data) => {
    return (
      data.$y + "-" +
      ((data.$M + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })) + "-" +
      ((data.$D).toLocaleString('en-US', { minimumIntegerDigits: 2 }))
    );
  };

  // Chamada da API para Buscar Vínculos CCS no Banco Central
  const buscaCCS = async () => {
    if (argsBusca.some(arg =>
      arg.cpfCnpj == '' ||
      arg.dataInicio == '' ||
      arg.dataFim == '' ||
      arg.numProcesso == '' ||
      arg.motivo == ''
    )) {
      alert("Necessário preencher todos os campos!");
    } else {
      if (deAcordo) {
        setOpenDialogRelacionamentoCCS(true)
        argsBusca.map(async (arg, i, arr) => {

          await axios
            .get(
              "/api/bacen/ccs/relacionamento?cpfCnpj=" +
              arg.cpfCnpj +
              "&dataInicio=" +
              formatarDataCCS(arg.dataInicio) +
              "&dataFim=" +
              formatarDataCCS(arg.dataFim) +
              "&numProcesso=" +
              arg.numProcesso +
              "&motivo=" +
              arg.motivo +
              "&cpfResponsavel=" +
              cpfResponsavel + 
              '&token=' + 
              token
            )
            .then((response) => response.data[0])
            .then((rel) => {
              setLista((lista) => [...lista, rel]);
              (rel.relacionamentosCCS) && (
                rel.relacionamentosCCS.map((item) => {
                  setRelacionamentos((relacionamentos) => [...relacionamentos, item])
                }))
              if (arr.length - 1 === i) {
                setStatusRelacionamentos(true)
              }
            })
            .catch((err) => console.error(err));
          setArgsBusca([initialValues])
        })
      } else {
        alert("Necessário CONCORDAR com os termos da consulta!");
      }

    }
  };

  // Chamada da API para Buscar Detalhamentos dos Relacionamentos CCS no Banco Central
  const detalhaCCS = async () => {
    setListaDetalhamentos([])
    setOpenDialogDetalhamentoCCS(true)
    relacionamentos.map(async (relacionamento, i, arr) => {
      await axios
        .get(
          "/api/bacen/ccs/detalhamento?numeroRequisicao=" +
          relacionamento.numeroRequisicao +
          "&cpfCnpj=" +
          relacionamento.idPessoa +
          "&cnpjResponsavel=" +
          relacionamento.cnpjResponsavel +
          "&cnpjParticipante=" +
          relacionamento.cnpjParticipante +
          "&dataInicioRelacionamento=" +
          relacionamento.dataInicioRelacionamento +
          "&caso=" +
          relacionamento.caso +
          "&idRelacionamento=" +
          relacionamento.id +
          "&nomeBancoResponsavel=" +
          relacionamento.nomeBancoResponsavel +
          "&cpfResponsavel=" +
          cpfResponsavel +
          '&token=' + 
          token
        )
        .then((response) => {
          setListaDetalhamentos((listaDetalhamentos) => [...listaDetalhamentos, response.data[0]])
          if (arr.length - 1 === i) {
            setStatusDetalhamentos(true)
          }
        })
        .catch((err) => console.error(err));
    });

  };

  const limpaTela = () => {
    setLista([]);
    setRelacionamentos([]);
    setArgsBusca([initialValues])
  }

  // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
  function Row(props) {
    const { relacionamento } = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell style={{ width: '15%' }} component="th" scope="item">
            {relacionamento.idPessoa ? formatCnpjCpf(relacionamento.idPessoa) : null}
          </TableCell>
          <TableCell style={{ width: '5%' }}>
            {relacionamento.tipoPessoa == "F"
              ? "PF"
              : relacionamento.tipoPessoa == "J"
                ? "PJ"
                : ""}
          </TableCell>
          <TableCell style={{ width: '25%' }}>{relacionamento.nomePessoa}</TableCell>
          <TableCell style={{ width: '35%' }}>
            {relacionamento.numeroBancoResponsavel + " - " + relacionamento.nomeBancoResponsavel}
          </TableCell>
          <TableCell style={{ width: '10%' }} align="right">{formatarData(relacionamento.dataInicioRelacionamento)}</TableCell>
          <TableCell style={{ width: '10%' }} align="right">
            {relacionamento.dataFimRelacionamento
              ? formatarData(relacionamento.dataFimRelacionamento)
              : "VIGENTE"}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  // Retorno do Componente Principal, com o Formulário de Consulta e a chamada da Tabela, já com cabeçalho
  return (
    <Box style={{ margin: 10 }}>
      <Grid container spacing={2}>
        <FormLabel style={{ fontSize: 16 }}>Consulta CCS BACEN</FormLabel>

        {argsBusca.map((arg, i) => (
          <Grid key={i} container spacing={2}>
            <Grid container item direction="row" justifyContent="space-between" alignItems="flex-end" xs={0.7} md={0.7} xl={0.7}>
              {
                (argsBusca.length == 1) ? (
                  <>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                      <IconButton onClick={() => addConsulta()}>
                        <AddCircleOutlineIcon sx={{ fontSize: 25 }} color="primary" />
                      </IconButton>
                    </Grid>
                  </>
                ) : (
                  ((i) == (argsBusca.length - 1)) ? (
                    <>
                      <Grid item xs={6}>
                        <IconButton onClick={() => remConsulta(i)}>
                          <RemoveCircleOutlineIcon sx={{ fontSize: 25 }} color='error' />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6}>
                        <IconButton onClick={() => addConsulta()}>
                          <AddCircleOutlineIcon sx={{ fontSize: 25 }} color="primary" />
                        </IconButton>
                      </Grid>
                    </>
                  ) :
                    (
                      <>
                        <IconButton onClick={() => remConsulta(i)}>
                          <RemoveCircleOutlineIcon sx={{ fontSize: 25 }} color='error' />
                        </IconButton>
                      </>
                    )
                )
              }
            </Grid>
            <Grid item xs={2.1} md={2.1} xl={2.1}>
              <TextField
                required
                fullWidth
                style={{}}
                name="cpfCnpj"
                value={arg.cpfCnpj}
                size="small"
                id="standard-basic"
                label="CPF/CNPJ"
                variant="standard"
                placeholder="CPF/CNPJ"
                onChange={e => setFormValues(e, i)}
              />
            </Grid>
            <Grid item xs={3} md={3} xl={3}>
              <TextField
                required
                fullWidth
                style={{}}
                name="numProcesso"
                size="small"
                id="standard-basic"
                label="Número do Processo"
                variant="standard"
                placeholder="Número do Processo"
                value={arg.numProcesso}
                onChange={e => setFormValues(e, i)}
              />
            </Grid>
            <Grid item xs={3} md={3} xl={3}>
              <TextField
                required
                fullWidth
                style={{}}
                name="motivo"
                size="small"
                id="standard-basic"
                label="Motivo"
                variant="standard"
                placeholder="Motivo"
                value={arg.motivo}
                onChange={e => setFormValues(e, i)}
              />
            </Grid>
            <Grid item xs={1.6} md={1.6} xl={1.6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                  name="dataInicio"
                  label="Data Início"
                  value={arg.dataInicio}
                  onChange={e => setFormValues(e, i, 'dataInicio')}
                  slotProps={{ textField: { size: 'small', variant: 'standard' } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={1.6} md={1.6} xl={1.6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                  name="dataFim"
                  label="Data Fim"
                  value={arg.dataFim}
                  onChange={e => setFormValues(e, i, 'dataFim')}
                  slotProps={{ textField: { size: 'small', variant: 'standard' } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        ))}
        {(argsBusca[0] != initialValues) && (
          <>
            <Grid item xs={0.6}></Grid>
            <Grid item xs={11.4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deAcordo}
                    onChange={() => setDeAcordo(!deAcordo)}
                  />
                }
                label="Declaro que a presente Consulta está sendo realizada mediante CONHECIMENTO E AUTORIZAÇÃO da Autoridade Responsável."
              />
            </Grid>
          </>
        )}
        <Grid
          item
          xs={12}
          md={12}
          style={{
            display: "flex",
            alignItems: "right",
            justifyContent: "right",
          }}
        >
          <Button
            style={{ marginInlineEnd: 20 }}
            variant="contained"
            size="small"
            onClick={buscaCCS}
          >
            Pesquisar
          </Button>
          <Button
            style={{ marginInlineEnd: 20 }}
            variant="outlined"
            size="small"
            onClick={() => limpaTela()}
          >
            Limpar
          </Button>
        </Grid>
        <Grid>
          {relacionamentos.length > 0 ? (
            <>
              <Button
                style={{ marginInlineEnd: 20 }}
                variant="contained"
                size="small"
                onClick={detalhaCCS}
              >
                Solicitar Detalhamentos
              </Button>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper} id="table">
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
              {openDialogRelacionamentoCCS &&
                <DialogRelacionamentoCCS
                  openDialogRelacionamentoCCS={openDialogRelacionamentoCCS}
                  setOpenDialogRelacionamentoCCS={setOpenDialogRelacionamentoCCS}
                  lista={lista}
                  statusRelacionamentos={statusRelacionamentos}
                />
              }
              {
                (relacionamentos.length > 0) && (
                  <>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: '15%', fontWeight: 'bold' }}>CPF/CNPJ</TableCell>
                        <TableCell style={{ width: '5%', fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell style={{ width: '25%', fontWeight: 'bold' }}>Nome</TableCell>
                        <TableCell style={{ width: '35%', fontWeight: 'bold' }}>Banco</TableCell>
                        <TableCell style={{ width: '10%', fontWeight: 'bold' }} align="right">Data Início</TableCell>
                        <TableCell style={{ width: '10%', fontWeight: 'bold' }} align="right">Data Fim</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {openDialogDetalhamentoCCS &&
                        <DialogDetalhamentoCCS
                          openDialogDetalhamentoCCS={openDialogDetalhamentoCCS}
                          setOpenDialogDetalhamentoCCS={setOpenDialogDetalhamentoCCS}
                          listaDetalhamentos={listaDetalhamentos}
                          statusDetalhamentos={statusDetalhamentos}
                        />
                      }
                      {relacionamentos.map((relacionamento) => (
                        <Row key={uuidv4()} relacionamento={relacionamento} />
                      ))}
                    </TableBody>
                  </>
                )
              }
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withAuth(ConsultaCCS);
