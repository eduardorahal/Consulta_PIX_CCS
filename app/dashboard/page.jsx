import { Card, CardContent, Typography, CardActionArea, Box, CardMedia, Grid } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import withAuth from '../auth/withAuth';

const Dashboard = () => {
    return (
        <Box style={{display: 'flex'}}>
            {/* <Box width='300px' padding='20px'>
                <Card sx={{ minWidth: 275, minHeight: 200 }}>
                    <CardActionArea component={Link} href="/solicitacoes/formLab">
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
            </Box> */}
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
                                Consulta ao BACEN pelo CPF ou Ag/Conta do investigado
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        </Box>
    )
}

export default withAuth(Dashboard)