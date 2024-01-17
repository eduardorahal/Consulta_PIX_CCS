// CPF Denis 05485620914
'use client'

import { TextField, Typography } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Serviços de Geração de Relatórios em PDF, usando pdfmake
import RelatorioResumidoPIX from '../../relatorios/pix/resumido';
import RelatorioDetalhadoPIX from '../../relatorios/pix/detalhado';

const ConsultaCCS = () => {

    // variáveis para armazenar CPF, CNPJ, Chave PIX e Motivo da consulta
    const [cpfCnpj, setCpfCnpj] = React.useState('');
    const [dataInicio, setDataInicio] = React.useState('');
    const [dataFim, setDataFim] = React.useState('');
    const [numProcesso, setNumProcesso] = React.useState('');
    const [motivo, setMotivo] = React.useState('');

    // variável de controle de abertura de popup para Exportação de Dados
    const [exportDialog, setExportDialog] = React.useState([false, null]);

    const [errorDialog, setErrorDialog] = React.useState(false);

    const handleClose = () => {
        setErrorDialog(false);
    };

    // variável para armazenar a lista de Chaves PIX exibidas no FrontEnd
    const [lista, setLista] = React.useState([]);

    // Alterar variável value de acordo com alteração do Radio Button
    const handleChange = (event) => {
        setValue(event.target.value)
    };

    // Formatar Campo CPF / CNPJ para excluir caracteres não numéricos do campo de Pesquisa
    const formatarCampo = event => {
        let new_string = event.target.value.replace(/[^0-9]/g, "");
        setCpfCnpj(new_string)
    };

    // Formatar CPF / CNPJ para apresentação no FrontEnd
    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '')
        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }
        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    }

    // Formatar Datas para apresentação no FrontEnd
    const formatarData = (data) => {
        let novadata = new Date(data)
        return novadata.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + (novadata.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + novadata.getFullYear()
    }

    // Chamada da API para Buscar Chaves PIX no Banco Central
    const buscaCCS = async () => {

        if (cpfCnpj != '' && dataInicio != '' && dataFim != '' && numProcesso != '' && motivo != '') {
            await axios.get('/api/bacen/ccs?cpfCnpj=' + cpfCnpj + '&dataInicio=' + dataInicio + '&dataFim=' + dataFim + '&numProcesso=' + numProcesso + '&motivo=' + motivo)
                .then(response => response.data[0])
                .then(json => JSON.parse(json))
                .then((relacionamentos) => {
                    if (relacionamentos.length == 0 || relacionamentos == '0002 - ERRO_CPF_CNPJ_INVALIDO') {
                        setErrorDialog(true)
                    } else {
                        setLista(lista => [...lista, relacionamentos.requisicaoRelacionamento.clientes])
                    }
                })
                .catch(err => console.error(err))
            setCpfCnpj('')
            setMotivo('')
        } else {
            alert('Necessário preencher todos os campos!')
        }
    }

    // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
    function Row(props) {
        const { item } = props;
        const [open, setOpen] = React.useState(false);
        return (
            <React.Fragment>
                <TableRow
                    key={item.chave}
                    sx={{ '& > *': { borderBottom: 'unset' } }}
                >
                    <TableCell>
                        {/* Aqui vai o checkbox para seleção de Detalhamento */}
                    </TableCell>
                    <TableCell component="th" scope="item">
                        {item.id ? formatCnpjCpf(item.id) : null}
                    </TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>

                    </TableCell>
                    <TableCell align="right">

                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={7}>
                        {open ? (
                            <>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Histórico da Chave
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow >
                                                <TableCell>Data</TableCell>
                                                <TableCell>Evento</TableCell>
                                                <TableCell>Motivo</TableCell>
                                                <TableCell>CPF/CNPJ</TableCell>
                                                <TableCell>Nome</TableCell>
                                                <TableCell>Banco</TableCell>
                                                <TableCell>Abertura Conta</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.eventosVinculo.map((evento) => (
                                                <TableRow key={item.eventosVinculo.indexOf(evento)}>
                                                    <TableCell component="th" scope="evento">{formatarData(evento.dataEvento)}</TableCell>
                                                    <TableCell>{evento.tipoEvento}</TableCell>
                                                    <TableCell>{evento.motivoEvento}</TableCell>
                                                    <TableCell>{evento.cpfCnpj ? formatCnpjCpf(evento.cpfCnpj) : null}</TableCell>
                                                    <TableCell>{evento.nomeProprietario ? evento.nomeProprietario.toUpperCase() : null}</TableCell>
                                                    <TableCell>
                                                        {evento.numerobanco + ' ' + evento.nomebanco}
                                                        <br />Agência: {evento.agencia}
                                                        <br />Conta: {parseInt(evento.numeroConta, 10)}
                                                        <br />Tipo: {evento.tipoConta}
                                                    </TableCell>
                                                    <TableCell>{formatarData(evento.dataAberturaConta)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        ) : <></>}
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }

    // Função para Exportar Dados em diversos formatos
    function exporta(tipo) {
        // if (lista.length != 0) {
        switch (tipo) {
            case 'pdf_resumido': RelatorioResumidoPIX(lista)
                break;
            case 'pdf_detalhado': RelatorioDetalhadoPIX(lista)
                break;
            case 'csv_completo': alert('Exportação ainda não disponível.')
                break;
            case 'json_completo':
                var file = window.document.createElement('a');
                file.href = window.URL.createObjectURL(new Blob([JSON.stringify({ vinculosPix: lista })]), { type: "application/json" });
                file.download = 'vinculosPix.json';
                document.body.appendChild(file);
                file.click();
                document.body.removeChild(file);
                break;
            //     }
            // } else {
            //     alert('Pesquisa vazia')
        }
        setExportDialog(null)
    }

    // Componente DIALOG (popup) para Mensagem de Erro
    function ErrorDialog() {
        return (
            <>
                <Dialog onClose={handleClose} open={errorDialog}>
                    <DialogTitle>{value == 'chave' ? 'CHAVE PIX NÃO ENCONTRADA' : 'CPF / CNPJ NÃO ENCONTRADO'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Não foi possível localizar {value == 'chave' ? 'a CHAVE PIX' : 'o CPF / CNPJ'} na base de Vínculos PIX do Banco Central. Verifique os dados informados.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>OK</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    // Componente DIALOG (popup) para Exportação de Arquivos
    function ExportDialog() {
        return (
            <>
                <Dialog open={exportDialog[0]} onClose={() => setExportDialog(null)} >
                    <DialogTitle>Selecione o Tipo de Relatório</DialogTitle>
                    <List sx={{ pt: 0 }}>
                        {exportDialog[1] == 'pdf' ?
                            <>
                                <ListItem><ListItemButton onClick={() => exporta('pdf_resumido')}>Relatório Resumido</ListItemButton></ListItem>
                                <ListItem><ListItemButton onClick={() => exporta('pdf_detalhado')}>Relatório Detalhado</ListItemButton></ListItem>
                            </>
                            :
                            <>
                                <ListItem><ListItemButton onClick={() => exporta('csv_completo')}>Arquivo CSV</ListItemButton></ListItem>
                                <ListItem><ListItemButton onClick={() => exporta('json_completo')}>Arquivo JSON - Esprites</ListItemButton></ListItem>
                            </>
                        }

                    </List>
                </Dialog>
            </>
        )
    }

    // Retorno do Componente Principal, com o Formulário de Consulta e a chamada da Tabela, já com cabeçalho
    return (
        <Box style={{ margin: 10 }}>
            <Grid container spacing={2}>
                <FormLabel style={{ fontSize: 16 }}>Consulta CCS BACEN</FormLabel>
                <Grid container spacing={2}>
                    <Grid item xs={2} md={2} xl={2} >
                        <TextField fullWidth style={{}} value={cpfCnpj} onChange={(e) => formatarCampo(e)} size="small" id="standard-basic" label="CPF/CNPJ" variant="standard" placeholder='CPF/CNPJ' />
                    </Grid>
                    <Grid item xs={2} md={2} xl={2} >
                        <TextField fullWidth style={{}} size="small" id="standard-basic" label="Data Início" variant="standard" placeholder='Data Início' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                    </Grid>
                    <Grid item xs={2} md={2} xl={2} >
                        <TextField fullWidth style={{}} size="small" id="standard-basic" label="Data Fim" variant="standard" placeholder='Data Fim' value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                    </Grid>
                    <Grid item xs={3} md={3} xl={3} >
                        <TextField fullWidth style={{}} size="small" id="standard-basic" label="Número do Processo" variant="standard" placeholder='Número do Processo' value={numProcesso} onChange={(e) => setNumProcesso(e.target.value)} />
                    </Grid>
                    <Grid item xs={3} md={3} xl={3} >
                        <TextField fullWidth style={{}} size="small" id="standard-basic" label="Motivo" variant="standard" placeholder='Motivo' value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} style={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }} >
                    <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" onClick={buscaCCS} >
                        Pesquisar
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} variant="outlined" size="small" onClick={() => setLista([])} >
                        Limpar
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} variant="outlined" color='error' size="small" onClick={() => setExportDialog([true, 'pdf'])} >
                        Exportar PDF
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} variant="outlined" color='success' size="small" onClick={() => setExportDialog([true, 'etc'])} >
                        Exportar ...
                    </Button>
                    {
                        exportDialog && <ExportDialog />
                    }
                </Grid>
                <Grid item xs={12} md={12}>
                    <TableContainer component={Paper} id='table'>
                        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>CPF/CNPJ</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Banco</TableCell>
                                    <TableCell align="right">Data Início</TableCell>
                                    <TableCell align="right">Data Fim</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {lista.map((item) => (
                                    <Row key={item.id} item={item} />
                                ))} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {errorDialog && <ErrorDialog />}
        </Box>
    )
}

export default ConsultaCCS