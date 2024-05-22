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
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { v4 as uuidv4 } from "uuid";

const PIXRow = (props) => {

    const { requisicoes } = props;

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Variável para armazenar quais itens estão checados no CheckBox
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

    // Formatar CPF / CNPJ para apresentação no FrontEnd

    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '')
        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }
        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
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
                                    pathname: '/pix/novo',
                                    query: { selected: 'true' },
                                }}
                            >
                                <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" >
                                    Detalhar
                                </Button>
                            </Link>
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
                    <TableCell>Chave de Busca</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Caso</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
    function Row(props) {
        const { requisicao } = props;
        const isItemSelected = isSelected(requisicao.id);
        var dataRequisicao = new Date(requisicao.data);
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
                    <TableCell>{requisicao.tipoBusca == 'cpf/cnpj' ? formatCnpjCpf(requisicao.chaveBusca) : requisicao.chaveBusca}</TableCell>
                    <TableCell>{requisicao.resultado == 'Sucesso' ? (requisicao.tipoBusca == 'cpf/cnpj' ? (requisicao.vinculos[0].nomeProprietario ? requisicao.vinculos[0].nomeProprietario : requisicao.vinculos[0].nomeProprietarioBusca) : requisicao.vinculos.nomeProprietario).toUpperCase() : requisicao.resultado.toUpperCase()}</TableCell>
                    <TableCell>{(requisicao.tipoBusca).toUpperCase()}</TableCell>
                    <TableCell>{dataRequisicao.toLocaleDateString()}</TableCell>
                    <TableCell>{requisicao.caso}</TableCell>
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
                            {
                                (requisicoes.length > 0) &&
                                requisicoes
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((requisicao) => (
                                        <Row key={uuidv4()} requisicao={requisicao} />
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={requisicoes.length > 0 ? requisicoes.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </React.Fragment>

    )

}

export default PIXRow;