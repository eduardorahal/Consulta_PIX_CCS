'use client'

import React, { useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from '@mui/material/TablePagination';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { v4 as uuidv4 } from "uuid";
import DialogRelatorioCCS from './Relatorios/ExportaRelatorioCCS';

const DetalheCCS = ({ requisicoes }) => {

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [openAll, setOpenAll] = useState(false)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Function para Exportar CCS

    const exportarCCS = () => {
        console.log('Selected: ', selected);
        console.log('Detalhe: ', detalhe);
    }

    // Formatar CPF / CNPJ para apresentação no FrontEnd

    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '')
        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }
        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    }

    // variáveis e funções de controle de abertura de popup para Exportação de Dados
    const [openDialogRelatorio, setOpenDialogRelatorio] = React.useState(false);
    const [tipoRelatorio, setTipoRelatorio] = React.useState();

    const callExportDialog = (tipo) => {
        setTipoRelatorio(tipo)
        setOpenDialogRelatorio(true)
    }

    // Formatar Datas para apresentação no FrontEnd
    const formatarData = (data) => {
        let novadata = new Date(data);
        return (
            ((novadata.getDate() + 1)).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) +
            "/" +
            (novadata.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
            }) +
            "/" +
            novadata.getFullYear()
        );
    };

    // Toolbar para a Tabela

    function TableToolbar(props) {
        const { numSelected } = props;
        return (
            <Toolbar sx={{ width: '100%' }}>
                <Grid item container xs={6}>
                    <Typography
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Solicitações Recentes
                    </Typography>
                </Grid>
                <Grid item container justifyContent='flex-end' xs={6}>

                    <Tooltip title="exportar">
                        <Button onClick={() => callExportDialog('pdf')} style={{ marginInlineEnd: 20, float: 'right' }} variant="contained" size="small" >
                            Exportar
                        </Button>
                    </Tooltip>
                </Grid>
                {
                    openDialogRelatorio &&
                    <DialogRelatorioCCS
                        openDialogRelatorio={openDialogRelatorio}
                        setOpenDialogRelatorio={setOpenDialogRelatorio}
                        tipoRelatorio={tipoRelatorio}
                        requisicoes={requisicoes}
                    />
                }
            </Toolbar>
        );
    }

    // Função para Montar a LINHA de Cabeçalho

    function Head() {
        return (
            <TableHead sx={{ backgroundColor: 'lightblue', border: 'none' }}>
                <TableRow>
                    <TableCell style={{ width: '5%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenAll(!openAll)}
                        >
                            {openAll ? <KeyboardArrowDownIcon color='primary' /> : <KeyboardArrowRightIcon color='primary' />}
                        </IconButton>
                    </TableCell>
                    <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>CPF/CNPJ</TableCell>
                    <TableCell style={{ width: '30%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Nome</TableCell>
                    <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Data Início</TableCell>
                    <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Data Fim</TableCell>
                    <TableCell style={{ width: '15%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Caso</TableCell>
                    <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Detalhamento</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    //Linhas de Vínculos

    function Vinculo(props) {
        const { vinculo } = props;
        return (
            <>
                <TableRow key={uuidv4()}>
                    <TableCell style={{ padding: 0, width: '3%', }}></TableCell>
                    <TableCell style={{ padding: 0, width: '10%' }} component="th" scope="evento">{formatCnpjCpf(vinculo.idPessoa)}</TableCell>
                    <TableCell style={{ padding: 0, width: '30%' }}>{vinculo.nomePessoa}</TableCell>
                    <TableCell style={{ padding: 0, width: '10%' }}>{formatarData(vinculo.dataInicio)}</TableCell>
                    <TableCell style={{ padding: 0, width: '10%' }}>{vinculo.dataFim ? formatarData(vinculo.dataFim) : 'Vigente'}</TableCell>
                    <TableCell style={{ padding: 0, width: '25%' }}>
                        {vinculo.tipo == '1' ? 'TITULAR' : (vinculo.tipo == '2' ? 'CO-TITULAR' : (vinculo.tipo == '3' ? 'PROCURADOR, RESPONSÁVEL OU REPRESENTANTE' : null))}
                    </TableCell>
                </TableRow>
            </>
        )
    }

    //Linhas de Bem, Direito e Valor

    function BDV(props) {
        const { bdv } = props;
        const [openDetail, setOpenDetail] = React.useState(false);
        return (
            <>
                <TableRow key={uuidv4()} onClick={() => setOpenDetail(!openDetail)}>
                    <TableCell style={{ width: '5%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenDetail(!openDetail)}
                        >
                            {
                                (bdv.vinculados.length > 0) ?
                                    <>
                                        {(openDetail || openAll) ? <KeyboardArrowDownIcon color='primary' /> : <KeyboardArrowRightIcon color='primary' />}
                                    </>
                                    :
                                    <>
                                        <KeyboardArrowRightIcon color='disabled' />
                                    </>
                            }
                        </IconButton>
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }} component="th" scope="evento">Ag.: {bdv.agencia}</TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>Ct.: {bdv.conta}</TableCell>
                    <TableCell style={{ width: '20%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>
                        {bdv.tipo == '1' ? 'CONTA CORRENTE' : (bdv.tipo == '2' ? 'CONTA DE POUPANÇA' : (bdv.tipo == '3' ? 'CONTA DE INVESTIMENTO' : (bdv.tipo == '4' ? 'OUTRAS APLICAÇÕES FINANCEIRAS' : (bdv.tipo == '5' ? 'CONTA DE NÃO RESIDENTE' : (bdv.tipo == '6' ? 'CONTA DE PAGAMENTO' : null)))))}
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{formatarData(bdv.dataInicio)}</TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{bdv.dataFim ? formatarData(bdv.dataFim) : 'Vigente'}</TableCell>
                    <TableCell style={{ width: '25%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>
                        {bdv.vinculo == '1' ? 'TITULAR' : (bdv.vinculo == '2' ? 'CO-TITULAR' : (bdv.vinculo == '3' ? 'PROCURADOR, RESPONSÁVEL OU REPRESENTANTE' : null))}
                    </TableCell>
                </TableRow >
                <TableRow key={uuidv4()}>
                    <TableCell style={{ padding: 0 }} colSpan={7}>
                        {(openDetail || openAll) ? (
                            <>
                                <Box>
                                    <Table style={{ marginLeft: '2%', maxWidth: '98%', overflow: 'auto' }} size="small" aria-label="a dense table">
                                        {bdv.vinculados.length > 0 &&
                                            <>
                                                <TableHead sx={{ textTransform: 'uppercase', border: 'none' }}>
                                                    <TableRow>
                                                        <TableCell style={{ padding: '0', width: '3%', border: 'none', fontWeight: 'bold' }}></TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>CPF</TableCell>
                                                        <TableCell style={{ padding: '0', width: '30%', border: 'none', fontWeight: 'bold' }}>Nome</TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Data Início</TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Data Fim</TableCell>
                                                        <TableCell style={{ padding: '0', width: '25%', border: 'none', fontWeight: 'bold' }}>Titularidade</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            </>
                                        }
                                        <TableBody>
                                            {bdv.vinculados.map((vinculo) => (
                                                <Vinculo key={uuidv4()} vinculo={vinculo} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        ) : <></>}
                    </TableCell>
                </TableRow>
            </>
        )
    }

    // Linhas de Detalhamento
    function Detalhamento(props) {
        const { relacionamento } = props;
        const [openDetail, setOpenDetail] = React.useState(false);
        return (
            <>
                <TableRow
                    key={uuidv4()}
                    onClick={() => setOpenDetail(!openDetail)}

                >
                    <TableCell style={{ width: '5%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenDetail(!openDetail)}
                        >
                            {(openDetail || openAll) ? <KeyboardArrowDownIcon color='primary' /> : <KeyboardArrowRightIcon color='primary' />}
                        </IconButton>
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{relacionamento.numeroBancoResponsavel}</TableCell>
                    <TableCell style={{ width: '30%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{relacionamento.nomeBancoResponsavel}</TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{formatarData(relacionamento.dataInicioRelacionamento)}</TableCell>
                    <TableCell style={{ width: '10%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{relacionamento.dataFimRelacionamento ? formatarData(relacionamento.dataFimRelacionamento) : 'Vigente'}</TableCell>
                    <TableCell style={{ width: '25%', padding: 0, backgroundColor: (openDetail ? 'lightblue' : '') }}>{relacionamento.respondeDetalhamento ? (relacionamento.resposta ? 'Detalhamento Concluído' : 'Detalhamento NÃO Recebido') : 'IF NÃO Responde Detalhamento'}</TableCell>
                </TableRow>
                <TableRow key={uuidv4()}>
                    <TableCell style={{ padding: 0, border: 'none' }} colSpan={7}>
                        {(openDetail || openAll) ? (
                            <>
                                <Box>
                                    <Table style={{ marginLeft: '2%', maxWidth: '98%', overflow: 'auto' }} size="small" aria-label="a dense table">
                                        {relacionamento.bemDireitoValorCCS.length > 0 &&
                                            <>
                                                <TableHead sx={{ textTransform: 'uppercase', border: 'none' }}>
                                                    <TableRow>
                                                        <TableCell style={{ padding: '0', width: '5%', border: 'none', fontWeight: 'bold' }}></TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Agência</TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Conta</TableCell>
                                                        <TableCell style={{ padding: '0', width: '20%', border: 'none', fontWeight: 'bold' }}>Tipo</TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Data Início</TableCell>
                                                        <TableCell style={{ padding: '0', width: '10%', border: 'none', fontWeight: 'bold' }}>Data Fim</TableCell>
                                                        <TableCell style={{ padding: '0', width: '25%', border: 'none', fontWeight: 'bold' }}>Titularidade</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            </>
                                        }
                                        <TableBody>
                                            {relacionamento.bemDireitoValorCCS.map((bdv) => (
                                                <BDV key={uuidv4()} bdv={bdv} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        ) : <></>}
                    </TableCell>
                </TableRow>
            </>
        )
    }

    // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
    function Row(props) {
        const { requisicao } = props;

        var dataInicioConsulta = new Date(requisicao.dataInicioConsulta);
        var dataFimConsulta = new Date(requisicao.dataFimConsulta);

        const [open, setOpen] = React.useState(false);

        const totalResposta = requisicao.relacionamentosCCS.filter(rel => rel.resposta === true).length

        return (
            <React.Fragment>
                <TableRow hover
                    tabIndex={-1}
                    key={requisicao.id}
                    onClick={() => setOpen(!open)}
                >
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {(open || openAll) ? <KeyboardArrowDownIcon color='primary' /> : <KeyboardArrowRightIcon color='primary' />}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{formatCnpjCpf(requisicao.cpfCnpjConsulta)}</TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{requisicao.nome}</TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{dataInicioConsulta.toLocaleDateString()}</TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{dataFimConsulta.toLocaleDateString()}</TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{requisicao.caso}</TableCell>
                    <TableCell sx={{ backgroundColor: (open ? 'lightblue' : ''), border: 'none' }}>{totalResposta} / {requisicao.relacionamentosCCS.length}</TableCell>
                </TableRow>
                <TableRow >
                    <TableCell style={{ padding: 0, border: 'none' }} colSpan={7}>
                        {(open || openAll) ? (
                            <>
                                <Box>
                                    <Table style={{ marginLeft: '2%', maxWidth: '98%', overflow: 'auto' }} padding='none' size="small" aria-label="a dense table">
                                        {requisicao.relacionamentosCCS.length > 0 &&
                                            <>
                                                <TableHead sx={{ textTransform: 'uppercase', border: 'none' }}>
                                                    <TableRow>
                                                        <TableCell style={{ width: '5%', border: 'none', fontWeight: 'bold' }} />
                                                        <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold' }}>Banco</TableCell>
                                                        <TableCell style={{ width: '30%', border: 'none', fontWeight: 'bold' }}>Nome Banco</TableCell>
                                                        <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold' }}>Data Início</TableCell>
                                                        <TableCell style={{ width: '10%', border: 'none', fontWeight: 'bold' }}>Data Fim</TableCell>
                                                        <TableCell style={{ width: '25%', border: 'none', fontWeight: 'bold' }}>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            </>
                                        }
                                        <TableBody sx={{ textTransform: 'uppercase', border: 'none' }}>
                                            {requisicao.relacionamentosCCS.map((relacionamento) => (
                                                <Detalhamento key={uuidv4()} relacionamento={relacionamento} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        ) : <></>}
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (

        <React.Fragment>
            <Grid container justifyContent='flex-end' style={{ width: '100%', border: 'none' }}>
                <TableToolbar />
                <TableContainer sx={{ width: '100%', border: 'none' }} component={Paper} id="table">
                    <Table padding='none' sx={{ minWidth: '100%', overflow: 'auto', border: 'none' }} size="small" aria-label="collapsible table">
                        <Head />
                        <TableBody style={{ border: 'none' }} >
                            {requisicoes
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((requisicao) => (
                                    <Row key={uuidv4()} requisicao={requisicao} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={requisicoes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </React.Fragment>
    )

}

export default DetalheCCS