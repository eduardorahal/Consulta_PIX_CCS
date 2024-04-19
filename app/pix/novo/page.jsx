// CPF Denis 05485620914
'use client'

import { TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSearchParams } from 'next/navigation'
import DialogRelatorioPIX from '@/app/pix/components/Relatorios/ExportaRelatorioPIX';
import DialogRequisicoesPIX from '../components/DialogRequisicoesPIX';
import { Context } from '@/app/context';
import { v4 as uuidv4 } from "uuid";

const ConsultaPix = () => {

    // variável para armazenar se a consulta será feita por CPF ou Chave PIX
    const [value, setValue] = React.useState('cpfCnpj');

    // Alterar variável value de acordo com alteração do Radio Button
    const handleChange = (event) => {
        setValue(event.target.value)
    };

    // variáveis para armazenar CPF, CNPJ, Chave PIX e Motivo da consulta
    let initialValues = {
        cpfCnpj: '',
        motivo: '',
        chave: ''
    }
    let [argsBusca, setArgsBusca] = React.useState([initialValues])

    //variável para controle de carregamento de página
    const [loading, setLoading] = React.useState(false)

    // variáveis para controle de soliticação de chaves
    const [openDialogRequisicoesPIX, setOpenDialogRequisicoesPIX] = React.useState(false);
    const [statusRequisicoes, setStatusRequisicoes] = React.useState(false);
    const [message, setMessage] = React.useState([]);
    const [deAcordo, setDeAcordo] = React.useState(false);

    // variável para armazenar a lista de Chaves PIX exibidas no FrontEnd
    const [lista, setLista] = React.useState([]);

    // variável para recuperar o CPF do usuário do Context
    const { state, dispatch } = React.useContext(Context)
    const cpfResponsavel = state.cpf

    // Caso haja solicitação de detalhamento, as informações ficam nessa variável antes de serem atribuídas para a lista
    const searchParams = useSearchParams()
    const query = searchParams.get('selected')

    React.useEffect(() => {
        if (query === 'true') {
            setLoading(true)
            const detalhe = JSON.parse(localStorage.getItem("detalhe"))
            for (let i = 0; i < detalhe.length; i++) {
                let vinculos = detalhe[i].vinculos;
                if (detalhe[i].vinculos) {
                    for (let j = 0; j < vinculos.length; j++) {
                        setLista((lista) => [...lista, vinculos[j]])
                    }
                }
                setLoading(false)
            }
        }
    }, [])

    // Função para Adicionar mais um item à consulta
    function addConsulta() {
        let lastIndex = argsBusca.length - 1;
        let newObject = {
            cpfCnpj: '',
            chave: '',
            motivo: argsBusca[lastIndex].motivo,
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
        switch (e.target.name) {
            case 'cpfCnpj':
                newArr[i].cpfCnpj = e.target.value.replace(/[^0-9]/g, "")
                break;
            case 'motivo':
                newArr[i].motivo = e.target.value
                break;
            case 'chave':
                newArr[i].chave = e.target.value
                break;
        }
        setArgsBusca(newArr)
    }

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


    // variáveis e funções de controle de abertura de popup para Exportação de Dados
    const [openDialogRelatorio, setOpenDialogRelatorio] = React.useState(false);
    const [tipoRelatorio, setTipoRelatorio] = React.useState();

    const callExportDialog = (tipo) => {
        setTipoRelatorio(tipo)
        setOpenDialogRelatorio(true)
    }

    // Chamada da API para Buscar Chaves PIX no Banco Central
    const buscaPIX = async () => {
        if (deAcordo) {
            if (value === 'cpfCnpj') {
                if (argsBusca.some(arg =>
                    arg.cpfCnpj == '' ||
                    arg.motivo == ''
                )) {
                    alert("Necessário preencher todos os campos!");
                } else {
                    setOpenDialogRequisicoesPIX(true)
                    argsBusca.map(async (arg, i, arr) => {
                        await axios.get('/api/bacen/pix/cpfCnpj?cpfCnpj=' + arg.cpfCnpj + '&motivo=' + arg.motivo + '&cpfResponsavel=' + cpfResponsavel)
                            .then(response => response.data[0])
                            .then((vinculos) => {
                                if (vinculos.length == 0 || vinculos == 'CPF/CNPJ não encontrado' || vinculos == "Nenhuma Chave PIX encontrada") {
                                    setMessage((message) => [...message, { cpfCnpj: arg.cpfCnpj, status: vinculos }])
                                } else {
                                    setMessage((message) => [...message, { cpfCnpj: arg.cpfCnpj, status: 'Recebido com Sucesso' }])
                                    vinculos.map((vinculo) => {
                                        setLista((lista) => [...lista, vinculo])
                                    })
                                }
                                if (arr.length - 1 === i) {
                                    setStatusRequisicoes(true)
                                }
                            })
                            .catch(err => console.error(err))
                        setArgsBusca([initialValues])
                    })
                }
            }
            if (value === 'chave') {
                if (argsBusca.some(arg =>
                    arg.chave == '' ||
                    arg.motivo == ''
                )) {
                    alert("Necessário preencher todos os campos!");
                } else {
                    setOpenDialogRequisicoesPIX(true)
                    argsBusca.map(async (arg, i, arr) => {
                        await axios.get('/api/bacen/pix/chave?chave=' + arg.chave + '&motivo=' + arg.motivo + '&cpfResponsavel=' + cpfResponsavel)
                            .then((response) => {
                                return response.data
                            })
                            .then((vinculo) => {
                                setMessage((message) => [...message, { chave: arg.chave, status: 'Recebido com Sucesso' }])
                                vinculo.map((vinculo) => {
                                    setLista((lista) => [...lista, vinculo])
                                })
                                if (vinculo.length == 0) {
                                    setMessage((message) => [...message, { chave: arg.chave, status: 'Chave não Encontrada' }])
                                }
                                if (arr.length - 1 === i) {
                                    setStatusRequisicoes(true)
                                }
                            })
                            .catch(err => console.error(err))
                        setArgsBusca([initialValues])
                    })
                }
            }
        } else {
            alert("Necessário CONCORDAR com os termos da consulta!");
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

    // Retorno do Componente Principal, com o Formulário de Consulta e a chamada da Tabela, já com cabeçalho
    return (
        <Box style={{ margin: 10 }}>
            <Grid container spacing={2} justifyContent="space-between">
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

                <Grid container direction='row' item xs={5} md={5} xl={5}>
                    {argsBusca.map((arg, i) => (
                        <React.Fragment key={i}>



                            <Grid container direction='row' item xs={12} md={12} xl={12}>
                                <Grid container item direction="row" justifyContent="space-between" alignItems="flex-end" xs={2} md={2} xl={2}>
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

                                <Grid item xs={10} md={10} xl={10} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

                                    {value === 'cpfCnpj' ?
                                        <TextField
                                            style={{ marginInlineEnd: 20 }}
                                            name='cpfCnpj'
                                            value={arg.cpfCnpj}
                                            onChange={e => setFormValues(e, i)}
                                            size="small"
                                            id="standard-basic"
                                            label="CPF/CNPJ"
                                            variant="standard"
                                            placeholder='CPF/CNPJ'
                                        /> : null
                                    }

                                    {value === 'chave' ?
                                        <TextField
                                            fullWidth
                                            style={{ marginInlineEnd: 20 }}
                                            name='chave'
                                            value={arg.chave}
                                            onChange={e => setFormValues(e, i)}
                                            size="small"
                                            id="standard-basic"
                                            label="Chave PIX"
                                            variant="standard"
                                            placeholder='Chave PIX'
                                        /> : null
                                    }

                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="standard-basic"
                                        label="Motivo"
                                        variant="standard"
                                        placeholder='Motivo'
                                        name='motivo'
                                        value={arg.motivo}
                                        onChange={e => setFormValues(e, i)}
                                    />

                                </Grid>
                            </Grid>



                        </React.Fragment>
                    ))}
                </Grid>

                <Grid item xs={5} md={5} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'right' }} >
                    <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" onClick={buscaPIX} >
                        Pesquisar
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} variant="outlined" size="small" onClick={() => setLista([])} >
                        Limpar
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} disabled={(lista.length == 0) && true} variant="outlined" color='error' size="small" onClick={() => callExportDialog('pdf')} >
                        Exportar PDF
                    </Button>
                    <Button style={{ marginInlineEnd: 20 }} disabled={(lista.length == 0) && true} variant="outlined" color='success' size="small" onClick={() => callExportDialog('etc')} >
                        Exportar ...
                    </Button>
                    {
                        openDialogRelatorio &&
                        <DialogRelatorioPIX
                            openDialogRelatorio={openDialogRelatorio}
                            setOpenDialogRelatorio={setOpenDialogRelatorio}
                            tipoRelatorio={tipoRelatorio}
                            lista={lista}
                        />
                    }
                </Grid>
                {(argsBusca[0] != initialValues) && (
                    <>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={11}>
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

                <Grid item xs={12} md={12}>
                    <TableContainer component={Paper} id='table'>
                        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                            {openDialogRequisicoesPIX &&
                                <DialogRequisicoesPIX
                                    openDialogRequisicoesPIX={openDialogRequisicoesPIX}
                                    setOpenDialogRequisicoesPIX={setOpenDialogRequisicoesPIX}
                                    message={message}
                                    statusRequisicoes={statusRequisicoes}
                                />
                            }
                            {
                                (lista.length > 0) && (
                                    <>
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
                                    </>
                                )
                            }
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ConsultaPix