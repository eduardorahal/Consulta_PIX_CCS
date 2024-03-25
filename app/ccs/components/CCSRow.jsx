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
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { v4 as uuidv4 } from "uuid";

const CCSRow = ({ requisicoes }) => {

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const [selected, setSelected] = React.useState([]);

    // Variável para armazenar quais itens serão detalhados
    const [detalhe, setDetalhe] = React.useState([]);

    React.useEffect(() => {

    }, [selected, detalhe])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newDetalhe = requisicoes.map((n) => n);
            setDetalhe(newDetalhe)
            localStorage.setItem("detalhe", JSON.stringify(requisicoes));
            const newSelected = requisicoes.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
        setDetalhe([]);
        localStorage.setItem("detalhe", "");
    };

    const handleClick = (event, id) => {
        const requisicao = requisicoes.find(x => x.id === id);
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        let newDetalhe = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
            newDetalhe = newDetalhe.concat(detalhe, requisicao);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newDetalhe = newDetalhe.concat(detalhe.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newDetalhe = newDetalhe.concat(detalhe.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newDetalhe = newDetalhe.concat(
                detalhe.slice(0, selectedIndex),
                detalhe.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setDetalhe(newDetalhe);
        localStorage.setItem("detalhe", JSON.stringify(newDetalhe));
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

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
                {numSelected > 0 ? (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Solicitações Recentes
                        </Typography>
                        <Tooltip title="detalhar">
                            <Link
                                href={{
                                    pathname: '/ccs/detalha',
                                    query: { selected: 'true' },
                                }}
                            >
                                <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" >
                                    Detalhar
                                </Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title="exportar">
                                <Button onClick={() => exportarCCS()} style={{ marginInlineEnd: 20, float: 'right' }} variant="contained" size="small" >
                                    Exportar
                                </Button>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Solicitações Recentes
                        </Typography>
                    </>
                )}
            </Toolbar>
        );
    }

    // Função para Montar a LINHA de Cabeçalho

    function Head(props) {
        const { onSelectAllClick, numSelected, rowCount } = props;
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>
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
        const isItemSelected = isSelected(requisicao.id);
        var dataInicioConsulta = new Date(requisicao.dataInicioConsulta);
        var dataFimConsulta = new Date(requisicao.dataFimConsulta);

        const totalResposta = requisicao.relacionamentosCCS.filter(rel => rel.resposta === true).length

        return (
            <React.Fragment>
                <TableRow hover
                    onClick={(event) => handleClick(event, requisicao.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={requisicao.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer', "& > *": { borderBottom: "unset" } }}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                        />
                    </TableCell>
                    <TableCell>{requisicao.cpfCnpjConsulta}</TableCell>
                    <TableCell>{requisicao.nome}</TableCell>
                    <TableCell>{dataInicioConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{dataFimConsulta.toLocaleDateString()}</TableCell>
                    <TableCell>{requisicao.caso}</TableCell>
                    <TableCell>{totalResposta} / {requisicao.relacionamentosCCS.length}</TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (

        <React.Fragment>
            <Grid item xs={12} md={12}>
                <TableToolbar numSelected={selected.length} />
                <TableContainer component={Paper} id="table">
                    <Table sx={{ minWidth: 1200 }} size="small" aria-label="a dense table">
                        <Head
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={requisicoes.length}
                        />
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

export default CCSRow