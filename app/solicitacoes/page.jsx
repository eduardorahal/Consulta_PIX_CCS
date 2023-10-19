import { Card, CardContent, Typography, CardActionArea, Box, CardMedia, Grid } from '@mui/material';
import React from 'react';
import Link from '@mui/material';

const Solicitacoes = () => {
    return (
        <Box style={{display: 'flex'}}>
            <Box width='300px' padding='20px'>
                <Card sx={{ minWidth: 275 }}>
                    <CardActionArea component={Link} to="/solicitacoes/formLab">
                        <CardMedia style={{ padding: 20 }} component='img' image='/Logo_Lab.jpg' />
                        <CardContent>
                            <Typography variant="h4" component="div" align='center' padding='10px'>
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
                <Card sx={{ minWidth: 275 }}>
                    <CardActionArea  component="a" href="/solicitacoes/pix">
                        <CardMedia style={{ padding: 20 }} component='img' image='/logo_pix.png' />
                        <CardContent>
                            <Typography variant="h4" component="div" align='center' padding='10px'>
                                Consulta PIX
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary" align='justify'>
                                Consulta ao BACEN pelo CPF ou CNPJ do investigado, bem como pela chave PIX (Telefone, E-mail ou Chave Aleatória)
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        </Box>
    )
}

export default Solicitacoes