// CPF Denis 05485620914
'use client'

import { TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
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

const ConsultaPix = () => {

    // variável para armazenar se a consulta será feita por CPF ou Chave PIX
    const [value, setValue] = React.useState('cpfCnpj');

    // variáveis para armazenar CPF, CNPJ, Chave PIX e Motivo da consulta
    const [cpfCnpj, setCpfCnpj] = React.useState('');
    const [chave, setChave] = React.useState('');
    const [motivo, setMotivo] = React.useState('');

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
        return data.match(/\d{2}[-\w\_\.\/]\d{2}[-\w\_\.\/]\d{4}/gi)
    }

    // Chamada da API para Buscar Chaves PIX no Banco Central
    const buscaPIX = async () => {

        if (value === 'cpfCnpj' && cpfCnpj != '' && motivo != '') {
            setLoading(true)
            await axios.get('/api/bacen/pix/cpfCnpj?cpfCnpj=' + cpfCnpj + '&motivo=' + motivo)
                .then(response => response.data[0])
                .then((vinculos) => {
                    if (vinculos.length == 0 || vinculos == '0002 - ERRO_CPF_CNPJ_INVALIDO') {
                        setErrorDialog(true)
                        setLoading(false)
                    } else {
                        vinculos.map((vinculo) => {
                            setLista((lista) => [...lista, vinculo])
                            setLoading(false)
                        })
                    }
                })
                .catch(err => console.error(err))
            setCpfCnpj('')
            setMotivo('')
        } else {
            if (value === 'chave' && chave != '' && motivo != '') {
                setLoading(true)
                await axios.get('/api/bacen/pix/chave?chave=' + chave + '&motivo=' + motivo)
                    .then((response) => {
                        return response.data
                    })
                    .then((vinculo) => {
                        vinculo.map((vinculo) => {
                            setLista((lista) => [...lista, vinculo])
                            setLoading(false)
                        })
                        if (vinculo.length == 0) {
                            setErrorDialog(true)
                            setLoading(false)
                        }
                    })
                    .catch(err => console.error(err))
                setChave('')
                setMotivo('')
            } else {
                alert('Necessário preencher todos os campos!')
            }
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
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="item">
                            {item.chave}
                        </TableCell>
                        <TableCell>{item.tipoChave}</TableCell>
                        <TableCell>{item.cpfCnpj ? formatCnpjCpf(item.cpfCnpj) : null}</TableCell>
                        <TableCell>{item.nomeProprietario ? item.nomeProprietario.toUpperCase() : null}</TableCell>
                        <TableCell>
                            {item.numerobanco + ' ' + item.nomebanco}
                            <br />Agência: {item.agencia}
                            <br />Conta: {parseInt(item.numeroConta, 10)}
                            <br />Tipo: {item.tipoConta}
                        </TableCell>
                        <TableCell align="right">{item.status}</TableCell>
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
                <Grid item xs={2} md={2}>
                    <FormControl style={{ verticalAlign: 'middle', marginInline: 20 }}>
                        <FormLabel id="demo-controlled-radio-buttons-group" style={{ fontSize: 16 }}>Consulta PIX BACEN</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel id="cpf_cnpj" value="cpfCnpj" control={<Radio size='small' style={{ margin: 0, alignItems: 'center', padding: 5 }} />} label={<Typography style={{ fontSize: 14 }}>Por CPF/CNPJ</Typography>} />
                            <FormControlLabel value="chave" control={<Radio size='small' style={{ margin: 0, alignItems: 'center', padding: 5 }} />} label={<Typography style={{ fontSize: 14 }}>Por Chave PIX</Typography>} />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={5} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    {value === 'cpfCnpj' ?
                        <TextField style={{ marginInlineEnd: 20 }} value={cpfCnpj} onChange={(e) => formatarCampo(e)} size="small" id="standard-basic" label="CPF/CNPJ" variant="standard" placeholder='CPF/CNPJ' />
                        : null
                    }
                    {value === 'chave' ?
                        <TextField fullWidth style={{ marginInlineEnd: 20 }} value={chave} onChange={(e) => setChave(e.target.value)} size="small" id="standard-basic" label="Chave PIX" variant="standard" placeholder='Chave PIX' />
                        : null
                    }
                    <TextField fullWidth size="small" id="standard-basic" label="Motivo" variant="standard" placeholder='Motivo' value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                </Grid>
                <Grid item xs={5} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} >
                    <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" onClick={buscaPIX} >
                        Pesquisar
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} variant="outlined" size="small" onClick={() => setLista([])} >
                        Limpar
                    </Button>
                    {lista.length > 0 ?
                        <>
                            <Button style={{ marginInlineEnd: 20 }} variant="outlined" color='error' size="small" onClick={() => setExportDialog([true, 'pdf'])} >
                                Exportar PDF
                            </Button>
                            <Button style={{ marginInlineEnd: 20 }} variant="outlined" color='success' size="small" onClick={() => setExportDialog([true, 'etc'])} >
                                Exportar ...
                            </Button>
                        </> : <></>
                    }
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
                                    <TableCell>Chave</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell >CPF/CNPJ</TableCell>
                                    <TableCell >Nome</TableCell>
                                    <TableCell >Banco</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && <LoadingDialog />}
                                {lista.map((item) => (
                                    <Row key={item.chave} item={item} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {errorDialog && <ErrorDialog />}
        </Box>
    )
}

export default ConsultaPix