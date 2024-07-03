'use client'

import { Suspense, useContext, useEffect, useState, useCallback } from 'react';
import { Context, Provider } from '../context';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from '@mui/material/Button';
import Link from 'next/link';
import USERRow from './components/USERRow';
import withAuth from '@/app/auth/withAuth';


const DashUser = () => {

    const { state, dispatch } = useContext(Context);

    //variável para controle de carregamento de página
    const [loading, setLoading] = useState(true)

    // variável para armazenar a lista de Requisições exibidas no FrontEnd
    const [usuarios, setUsuarios] = useState([]);

    const cpfResponsavel = state.cpf;
    const token = state.token;

    // Chamada da API para Buscar Usuarios no Banco de Dados

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        await axios
            .get(
                "/api/user/list?token=" + token
            )
            .then((response) => response.data)
            .then((res) => {
                setUsuarios(res)
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])


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

    return (
        <Box style={{ margin: 10 }}>
            <Grid container spacing={2}>
                {
                    loading ?
                        <LoadingDialog />
                        :
                        <>
                            <Suspense fallback={<p>CARREGANDO USUÁRIOS...</p>}>
                                <USERRow usuarios={usuarios} fetchUsers={fetchUsers} />
                            </Suspense>
                        </>
                }

            </Grid>
        </Box>
    )
}

export default withAuth(DashUser)