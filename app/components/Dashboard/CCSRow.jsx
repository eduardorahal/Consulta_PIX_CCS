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
import { v4 as uuidv4 } from "uuid";

const CCSRow = ({ requisicoes }) => {

    console.log(requisicoes)

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
    function Row(props) {
        const { requisicao } = props;
        var dataInicioConsulta = new Date(requisicao.dataInicioConsulta);
        var dataFimConsulta = new Date(requisicao.dataFimConsulta);
        return (
            <React.Fragment>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell>{requisicao.cpfCnpjConsulta}</TableCell>
                    <TableCell>{requisicao.nome}</TableCell>
                    <TableCell>{dataInicioConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{dataFimConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{requisicao.caso}</TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (

        <React.Fragment>
            <Grid item xs={12} md={12}>
                Requisições CCS
                <TableContainer component={Paper} id="table">
                    <Table sx={{ minWidth: 600, maxHeight: 440 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>CPF/CNPJ</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Data Início</TableCell>
                                <TableCell>Data Fim</TableCell>
                                <TableCell>Caso</TableCell>
                            </TableRow>
                        </TableHead>
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
                    rowsPerPageOptions={[5, 10, 20]}
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

export default CCSRow