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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from "uuid";

const DetalheCCS = ({ requisicoes }) => {

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

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

    // Toolbar para a Tabela

    function TableToolbar(props) {
        const { numSelected } = props;
        return (
            <Toolbar>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Solicitações Recentes
                </Typography>
                <Tooltip title="exportar">
                    <Button onClick={() => exportarCCS()} style={{ marginInlineEnd: 20, float: 'right' }} variant="contained" size="small" >
                        Exportar
                    </Button>
                </Tooltip>
            </Toolbar>
        );
    }

    // Função para Montar a LINHA de Cabeçalho

    function Head() {
        return (
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>CPF/CNPJ</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Data Início</TableCell>
                    <TableCell>Data Fim</TableCell>
                    <TableCell>Caso</TableCell>
                    <TableCell>Detalhamento</TableCell>
                </TableRow>
            </TableHead>
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
                    sx={{ cursor: 'pointer', "& > *": { borderBottom: "unset" } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{requisicao.cpfCnpjConsulta}</TableCell>
                    <TableCell>{requisicao.nome}</TableCell>
                    <TableCell>{dataInicioConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{dataFimConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{requisicao.caso}</TableCell>
                    <TableCell>{totalResposta} / {requisicao.relacionamentosCCS.length}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={7}>
                        {open ? (
                            <>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Relacionamentos
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow >
                                                <TableCell>Número Banco</TableCell>
                                                <TableCell>Nome Banco</TableCell>
                                                <TableCell>Data Início</TableCell>
                                                <TableCell>Data Fim</TableCell>
                                                <TableCell>Responde Detalhamento</TableCell>
                                                <TableCell>Resposta</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requisicao.relacionamentosCCS.map((relacionamento) => (
                                                <TableRow key={requisicao.relacionamentosCCS.indexOf(relacionamento)}>
                                                    <TableCell component="th" scope="evento">{relacionamento.numeroBancoResponsavel}</TableCell>
                                                    <TableCell>{relacionamento.nomeBancoResponsavel}</TableCell>
                                                    <TableCell>{relacionamento.dataInicioRelacionamento}</TableCell>
                                                    <TableCell>{relacionamento.dataFimRelacionamento ? relacionamento.dataFimRelacionamento : null}</TableCell>
                                                    <TableCell>{relacionamento.respondeDetalhamento ? 'Sim' : 'Não'}</TableCell>
                                                    <TableCell>{relacionamento.respondeDetalhamento && (relacionamento.resposta ? 'Sim' : 'Não')}</TableCell>
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
        );
    }

    return (

        <React.Fragment>
            <Grid item xs={12} md={12}>
                <TableToolbar />
                <TableContainer component={Paper} id="table">
                    <Table sx={{ minWidth: 1200 }} size="small" aria-label="a dense table">
                        <Head />
                        <TableBody>
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