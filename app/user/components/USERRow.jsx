'use client'

import React, { useState, useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { pink } from '@mui/material/colors';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, Box, DialogContentText } from '@mui/material';
import axios from 'axios';
import withAuth from '@/app/auth/withAuth';
import { v4 as uuidv4 } from 'uuid';

const USERRow = (props) => {

    const { usuarios, fetchUsers } = props;

    // Variáveis e Funções para apresentação de Tabelas
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [editingUser, setEditingUser] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
    };

    const handleAdd = () => {
        setEditingUser({
            cpf: '',
            nome: '',
            email: '',
            password: '',
            lotacao: '',
            matricula: '',
            admin: false
        });
    };

    const handleClose = () => {
        setEditingUser(null);
    };

    const handleSave = async () => {
        try {
            // Se editingUser tem um ID, então estamos editando um usuário existente
            if (editingUser.id) {
                await axios.post(`/api/user/edit`, editingUser);
            } else {
                // Se não tem um ID, estamos adicionando um novo usuário
                await axios.post(`/api/user/register`, editingUser);
            }
            // Após a requisição bem-sucedida, atualize a lista de usuários e feche o diálogo
            fetchUsers();
            handleClose();
        } catch (error) {
            // Em caso de erro, registre o erro no console
            console.error("Erro ao salvar usuário:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.post(`/api/user/delete`, { id: userToDelete });
            fetchUsers(); // Atualiza a lista de usuários após a exclusão
            handleCloseConfirmDialog();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    };

    const handleOpenConfirmDialog = (id) => {
        setUserToDelete(id);
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setUserToDelete(null);
        setConfirmDialogOpen(false);
    };

    // Formatar CPF / CNPJ para apresentação no FrontEnd
    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '')
        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
        }
        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
    }

    // Toolbar para a Tabela
    function TableToolbar() {
        return (
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Usuários Cadastrados
                    </Typography>
                    <Button color="primary" variant="contained" onClick={handleAdd} size='small'>
                        Novo Usuário
                    </Button>
                </Box>
            </Toolbar>
        );
    }

    // Função para Montar a LINHA de Cabeçalho
    function Head() {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>CPF</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Lotação</TableCell>
                    <TableCell>Acesso</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
        );
    }

    // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
    function Row(props) {
        const { usuario } = props;

        return (
            <React.Fragment>
                <TableRow hover
                    role="checkbox"
                    tabIndex={-1}
                    key={usuario.id}
                    sx={{ cursor: 'pointer', "& > *": { borderBottom: "unset" } }}>
                    <TableCell>{formatCnpjCpf(usuario.cpf)}</TableCell>
                    <TableCell>{(usuario.nome).toUpperCase()}</TableCell>
                    <TableCell>{(usuario.lotacao)}</TableCell>
                    <TableCell>{(usuario.admin === true) ? "Admin" : "Consulta"}</TableCell>
                    <TableCell onClick={() => handleEdit(usuario)}><EditIcon color="primary" /></TableCell>
                    <TableCell onClick={() => handleOpenConfirmDialog(usuario.id)}><ClearIcon sx={{ color: pink[500] }} /></TableCell>
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
                            {
                                (usuarios.length > 0) &&
                                usuarios
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((usuario) => (
                                        <Row key={uuidv4()} usuario={usuario} />
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={usuarios.length > 0 ? usuarios.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>

            <Dialog open={!!editingUser} onClose={handleClose}>
                <DialogTitle>{editingUser?.id ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="cpf"
                        label="CPF"
                        value={editingUser ? editingUser.cpf : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, cpf: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="nome"
                        label="Nome"
                        value={editingUser ? editingUser.nome : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email"
                        value={editingUser ? editingUser.email : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        value={editingUser ? editingUser.password : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="lotacao"
                        label="Unidade"
                        value={editingUser ? editingUser.lotacao : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, lotacao: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="matricula"
                        label="Matrícula"
                        value={editingUser ? editingUser.matricula : ''}
                        onChange={(e) => setEditingUser({ ...editingUser, matricula: e.target.value })}
                    />
                    <Box mt={2}> {/* Adiciona margem superior entre Matrícula e Consulta */}
                        <Select
                            fullWidth
                            value={editingUser ? editingUser.admin : false}
                            onChange={(e) => setEditingUser({ ...editingUser, admin: e.target.value })}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }} // Igualando a cor do texto aos outros campos
                        >
                            <MenuItem value={true}>Admin</MenuItem>
                            <MenuItem value={false}>Consulta</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem certeza que deseja excluir este usuário?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Não
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
}

export default withAuth(USERRow);