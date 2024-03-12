'use client'

import { Suspense, useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from '@mui/material/Button';
import Link from 'next/link';

import PIXRow from '../components/Dashboard/PIXRow';

const DashPIX = () => {

    const { state, dispatch } = useContext(Context);

    //variável para controle de carregamento de página
    const [loading, setLoading] = useState(true)

    // variável para armazenar a lista de Requisições exibidas no FrontEnd
    const [requisicoesPIX, setRequisicoesPIX] = useState([]);

    const cpfResponsavel = "32547375800";

    // Chamada da API para Buscar Requisições armazenadas no Banco de Dados

    useEffect(() => {
        const buscaRequisicoes = async () => {
            setLoading(true)
            await axios
                .get(
                    "/api/requisicoespix?cpfCnpj=" + cpfResponsavel
                )
                .then((response) => response.data)
                .then((res) => {
                    setRequisicoesPIX(res)
                    setLoading(false);
                })
                .catch((err) => console.error(err));
        };
        buscaRequisicoes();
    }, [])


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
                <Grid item xs={5} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }} >
                    <Link href="/pix/novo">
                        <Button style={{ marginInlineEnd: 20 }} variant="contained" size="small" >
                            Nova Solicitação
                        </Button>
                    </Link>
                </Grid>

                {
                    loading ?
                        <LoadingDialog />
                        :
                        <>
                            <Suspense fallback={<p>CARREGANDO REQUISIÇÕES PIX...</p>}>
                                <PIXRow requisicoes={requisicoesPIX} />
                            </Suspense>
                        </>
                }

            </Grid>
        </Box>
    )
}

export default () => (
    <DashPIX />
)