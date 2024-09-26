'use client'

import { Card, CardContent, Typography, CardActionArea, Box, CardMedia, Grid } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import withAuth from '../auth/withAuth';
import { Context } from '../context';
import axios from 'axios';

const Dashboard = () => {

    const { state, dispatch } = React.useContext(Context);

    //variável para controle de carregamento de página
    const [loading, setLoading] = React.useState(true)

    // variável para recuperar o CPF do usuário do Context
    const cpfResponsavel = state.cpf
    const token = state.token

    // Chamada da API para Buscar Requisições armazenadas no Banco de Dados

    React.useEffect(() => {
        const atualizaCCS = async () => {
            setLoading(true)
            await axios
                .get(
                    "api/utils/processaFilaCCS?cpfResponsavel=" + cpfResponsavel + '&token=' + token
                )
                .then((response) => response.data)
                .catch((err) => console.error(err));
            await axios
                .get(
                    "/api/utils/recebeBDVCCS?cpfResponsavel=" + cpfResponsavel + '&token=' + token
                )
                .then((response) => response.data)
                .then((res) => {
                    setLoading(false);
                })
                .catch((err) => console.error(err));
        };
        atualizaCCS();
    }, [cpfResponsavel, token])


    return (
        <Box style={{display: 'flex'}}>
            <Box width='300px' padding='20px'>
                <Card sx={{ minWidth: 275, minHeight: 200 }}>
                    <CardActionArea component={Link} href="/caso/novo">
                        <CardContent sx={{ minWidth: 275, minHeight: 200 }}>
                            <Typography variant="h5" component="div" align='center' padding='10px'>
                                LAB-LD
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary" align='justify'>
                                Solicitações de Coleta de Dados, Análises Bancárias e Fiscais e outras envolvendo Combate a Lavagem de Dinheiro
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
            <Box width='300px' padding='20px'>
                <Card sx={{ minWidth: 275, minHeight: 200 }}>
                    <CardActionArea  component={Link} href="/pix">
                        <CardContent sx={{ minWidth: 275, minHeight: 200 }}>
                            <Typography variant="h5" component="div" align='center' padding='10px'>
                                Consulta PIX
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary" align='justify'>
                                Consulta ao BACEN pelo CPF ou CNPJ do investigado, bem como pela chave PIX (Telefone, E-mail ou Chave Aleatória)
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
            <Box width='300px' padding='20px'>
                <Card sx={{ minWidth: 275, minHeight: 200 }}>
                    <CardActionArea  component={Link} href="/ccs">
                        <CardContent sx={{ minWidth: 275, minHeight: 200 }}>
                            <Typography variant="h5" component="div" align='center' padding='10px'>
                                Consulta CCS
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary" align='justify'>
                                Consulta ao BACEN pelo CPF ou CNPJ, visando saber com quais Instituições Financeiras o investigado possui relacionamentos.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        </Box>
    )
}

export default withAuth(Dashboard)