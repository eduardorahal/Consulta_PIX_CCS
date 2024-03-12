// CPF Denis 05485620914
"use client";

import { Checkbox, TextField, Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
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
import * as React from "react";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { v4 as uuidv4 } from "uuid";

// Serviços de Geração de Relatórios em PDF, usando pdfmake
import RelatorioResumidoPIX from "../../relatorios/pix/resumido";
import RelatorioDetalhadoPIX from "../../relatorios/pix/detalhado";

const ConsultaCCS = () => {
  // variáveis para armazenar CPF, CNPJ, Chave PIX e Motivo da consulta
  const [cpfCnpj, setCpfCnpj] = React.useState("");
  const [dataInicio, setDataInicio] = React.useState("");
  const [dataFim, setDataFim] = React.useState("");
  const [numProcesso, setNumProcesso] = React.useState("");
  const [motivo, setMotivo] = React.useState("");

  //variável para controle de carregamento de página
  const [loading, setLoading] = React.useState(false)

  // variável de controle de abertura de popup para Exportação de Dados
  const [exportDialog, setExportDialog] = React.useState([false, null]);

  const [errorDialog, setErrorDialog] = React.useState(false);

  const handleClose = () => {
    setErrorDialog(false);
  };

  // variável para armazenar a lista de Chaves PIX exibidas no FrontEnd
  const [lista, setLista] = React.useState([]);
  const [relacionamentos, setRelacionamentos] = React.useState([]);

  // Alterar variável value de acordo com alteração do Radio Button
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Formatar Campo CPF / CNPJ para excluir caracteres não numéricos do campo de Pesquisa
  const formatarCampo = (event) => {
    let new_string = event.target.value.replace(/[^0-9]/g, "");
    setCpfCnpj(new_string);
  };

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
      novadata
        .getDate()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }) +
      "/" +
      (novadata.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "/" +
      novadata.getFullYear()
    );
  };

  // Chamada da API para Buscar Vínculos CCS no Banco Central
  const buscaCCS = async () => {
    if (
      cpfCnpj != "" &&
      dataInicio != "" &&
      dataFim != "" &&
      numProcesso != "" &&
      motivo != ""
    ) {
      setLoading(true)
      await axios
        .get(
          "/api/bacen/ccs/relacionamento?cpfCnpj=" +
          cpfCnpj +
          "&dataInicio=" +
          dataInicio +
          "&dataFim=" +
          dataFim +
          "&numProcesso=" +
          numProcesso +
          "&motivo=" +
          motivo
        )
        .then((response) => response.data[0])
        .then((relacionamentos) => {
          if (
            relacionamentos.length == 0 ||
            relacionamentos == "0002 - ERRO_CPF_CNPJ_INVALIDO"
          ) {
            setErrorDialog(true);
            setLoading(false)
          } else {
            setLista(relacionamentos);
            setRelacionamentos(relacionamentos.relacionamentosCCS.create);
            setLoading(false)
          }
        })
        .catch((err) => console.error(err));
      setCpfCnpj("");
      setMotivo("");
      setDataInicio("");
      setDataFim("");
      setNumProcesso("");
    } else {
      alert("Necessário preencher todos os campos!");
    }
  };

  // Chamada da API para Buscar Detalhamentos dos Relacionamentos CCS no Banco Central
  const detalhaCCS = () => {
    relacionamentos.map(async (relacionamento) => {
      await axios
        .get(
          "/api/bacen/ccs/detalhamento?numeroRequisicao=" +
          lista.numeroRequisicao +
          "&cpfCnpj=" +
          lista.cpfCnpj +
          "&cnpjResponsavel=" +
          relacionamento.cnpj +
          "&cnpjParticipante=" +
          relacionamento.cnpjParticipante +
          "&dataInicioRelacionamento=" +
          relacionamento.dataInicioRelacionamento +
          "&caso=" +
          relacionamento.caso
        )
        .then((response) => response.data[0])
        .then((res) => {
          console.log(res)
        })
        .catch((err) => console.error(err));
    });
  };

  // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
  function Row(props) {
    const { relacionamento } = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell component="th" scope="item">
            {lista.cpfCnpj ? formatCnpjCpf(lista.cpfCnpj) : null}
          </TableCell>
          <TableCell>
            {lista.tipoPessoa == "F"
              ? "PF"
              : lista.tipoPessoa == "J"
                ? "PJ"
                : ""}
          </TableCell>
          <TableCell>{lista.nome}</TableCell>
          <TableCell>
            {relacionamento.numeroBanco + " - " + relacionamento.nomeBanco}
          </TableCell>
          <TableCell>{relacionamento.dataInicioRelacionamento}</TableCell>
          <TableCell align="right">
            {relacionamento.dataFimRelacionamento
              ? relacionamento.dataFimRelacionamento
              : ""}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  // Função para Exportar Dados em diversos formatos
  function exporta(tipo) {
    // if (lista.length != 0) {
    switch (tipo) {
      case "pdf_resumido":
        RelatorioResumidoPIX(lista);
        break;
      case "pdf_detalhado":
        RelatorioDetalhadoPIX(lista);
        break;
      case "csv_completo":
        alert("Exportação ainda não disponível.");
        break;
      case "json_completo":
        var file = window.document.createElement("a");
        file.href = window.URL.createObjectURL(
          new Blob([JSON.stringify({ vinculosPix: lista })]),
          { type: "application/json" }
        );
        file.download = "vinculosPix.json";
        document.body.appendChild(file);
        file.click();
        document.body.removeChild(file);
        break;
      //     }
      // } else {
      //     alert('Pesquisa vazia')
    }
    setExportDialog(null);
  }

  // Componente DIALOG (popup) para Mensagem de Erro
  function ErrorDialog() {
    return (
      <>
        <Dialog onClose={handleClose} open={errorDialog}>
          <DialogTitle>
            {value == "chave"
              ? "CHAVE PIX NÃO ENCONTRADA"
              : "CPF / CNPJ NÃO ENCONTRADO"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Não foi possível localizar{" "}
              {value == "chave" ? "a CHAVE PIX" : "o CPF / CNPJ"} na base de
              Vínculos PIX do Banco Central. Verifique os dados informados.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Componente DIALOG (popup) para mostrar que a página está sendo carregada

  function LoadingDialog() {
    return (
      <>
        <Dialog open={loading}>
          <DialogTitle>
            Carregando...
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Por favor, aguarde.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Componente DIALOG (popup) para Exportação de Arquivos
  function ExportDialog() {
    return (
      <>
        <Dialog open={exportDialog[0]} onClose={() => setExportDialog(null)}>
          <DialogTitle>Selecione o Tipo de Relatório</DialogTitle>
          <List sx={{ pt: 0 }}>
            {exportDialog[1] == "pdf" ? (
              <>
                <ListItem>
                  <ListItemButton onClick={() => exporta("pdf_resumido")}>
                    Relatório Resumido
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton onClick={() => exporta("pdf_detalhado")}>
                    Relatório Detalhado
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem>
                  <ListItemButton onClick={() => exporta("csv_completo")}>
                    Arquivo CSV
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton onClick={() => exporta("json_completo")}>
                    Arquivo JSON - Esprites
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Dialog>
      </>
    );
  }

  // Retorno do Componente Principal, com o Formulário de Consulta e a chamada da Tabela, já com cabeçalho
  return (
    <Box style={{ margin: 10 }}>
      <Grid container spacing={2}>
        <FormLabel style={{ fontSize: 16 }}>Consulta CCS BACEN</FormLabel>
        <Grid container spacing={2}>
          <Grid item xs={2} md={2} xl={2}>
            <TextField
              fullWidth
              style={{}}
              value={cpfCnpj}
              onChange={(e) => formatarCampo(e)}
              size="small"
              id="standard-basic"
              label="CPF/CNPJ"
              variant="standard"
              placeholder="CPF/CNPJ"
            />
          </Grid>
          <Grid item xs={2} md={2} xl={2}>
            <TextField
              fullWidth
              style={{}}
              size="small"
              id="standard-basic"
              label="Data Início"
              variant="standard"
              placeholder="Data Início"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} md={2} xl={2}>
            <TextField
              fullWidth
              style={{}}
              size="small"
              id="standard-basic"
              label="Data Fim"
              variant="standard"
              placeholder="Data Fim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </Grid>
          <Grid item xs={3} md={3} xl={3}>
            <TextField
              fullWidth
              style={{}}
              size="small"
              id="standard-basic"
              label="Número do Processo"
              variant="standard"
              placeholder="Número do Processo"
              value={numProcesso}
              onChange={(e) => setNumProcesso(e.target.value)}
            />
          </Grid>
          <Grid item xs={3} md={3} xl={3}>
            <TextField
              fullWidth
              style={{}}
              size="small"
              id="standard-basic"
              label="Motivo"
              variant="standard"
              placeholder="Motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </Grid>
        </Grid>
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
            onClick={() => setLista([])}
          >
            Limpar
          </Button>
          {relacionamentos.length > 0 ? (
            <>
              <Button
                style={{ marginInlineEnd: 20 }}
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setExportDialog([true, "pdf"])}
              >
                Exportar PDF
              </Button>
              <Button
                style={{ marginInlineEnd: 20 }}
                variant="outlined"
                color="success"
                size="small"
                onClick={() => setExportDialog([true, "etc"])}
              >
                Exportar ...
              </Button>
            </>
          ) : (
            <></>
          )}
          {exportDialog && <ExportDialog />}
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
              <TableHead>
                <TableRow>
                  <TableCell>CPF/CNPJ</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell align="right">Data Início</TableCell>
                  <TableCell align="right">Data Fim</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && <LoadingDialog />}
                {relacionamentos.map((relacionamento) => (
                      <Row key={uuidv4()} relacionamento={relacionamento} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {errorDialog && <ErrorDialog />}
    </Box>
  );
};

export default ConsultaCCS;
