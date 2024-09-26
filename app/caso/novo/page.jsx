'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Context } from '@/app/context';
import { TextField, Checkbox, FormControlLabel, Button, Box, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CriarCaso = () => {
    const { state } = React.useContext(Context);

    const [numeroCaso, setNumeroCaso] = useState('');
    const [nomeCaso, setNomeCaso] = useState('');
    const [consultas, setConsultas] = useState([{ cpf_cnpj: '', nome: '', consulta_pix: false, consulta_ccs: false, data_inicio: '', data_fim: '' }]);

    const adicionarConsulta = () => {
        setConsultas([...consultas, { cpf_cnpj: '', nome: '', consulta_pix: false, consulta_ccs: false, data_inicio: '', data_fim: '' }]);
    };

    const removerConsulta = (index) => {
        setConsultas(consultas.filter((_, i) => i !== index));
    };

    const handleChangeConsulta = (index, event) => {
        const { name, value, type, checked } = event.target;
        const newConsultas = consultas.map((consulta, i) => (
            i === index ? { ...consulta, [name]: type === 'checkbox' ? checked : value } : consulta
        ));
        setConsultas(newConsultas);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const novoCaso = {
            numero_caso: numeroCaso,
            nome_caso: nomeCaso,
            lotacao_responsavel: state.lotacao,
            cpf_abertura: state.cpf,
            consultas
        };
        await axios.post('/casos', novoCaso);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 1200, mx: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <TextField label="Número do Caso" value={numeroCaso} onChange={(e) => setNumeroCaso(e.target.value)} required fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField label="Nome do Caso" value={nomeCaso} onChange={(e) => setNomeCaso(e.target.value)} required fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField label="Lotação" value={state.lotacao} InputProps={{ readOnly: true }} fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField label="CPF" value={state.cpf} InputProps={{ readOnly: true }} fullWidth />
                </Grid>
            </Grid>

            {consultas.map((consulta, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={1}>
                        <IconButton onClick={adicionarConsulta} color="primary" variant="outlined">
                            <AddIcon />
                        </IconButton>
                        {consultas.length > 1 && (
                            <IconButton onClick={() => removerConsulta(index)} color="secondary" variant="outlined">
                                <RemoveIcon />
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="CPF/CNPJ" name="cpf_cnpj" value={consulta.cpf_cnpj} onChange={(e) => handleChangeConsulta(index, e)} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="Nome" name="nome" value={consulta.nome} InputProps={{ readOnly: true }} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <FormControlLabel control={<Checkbox checked={consulta.consulta_pix} onChange={(e) => handleChangeConsulta(index, e)} name="consulta_pix" />} label="PIX" />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <FormControlLabel control={<Checkbox checked={consulta.consulta_ccs} onChange={(e) => handleChangeConsulta(index, e)} name="consulta_ccs" />} label="CCS" />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="Data Início" name="data_inicio" type="date" value={consulta.data_inicio} onChange={(e) => handleChangeConsulta(index, e)} InputLabelProps={{ shrink: true }} fullWidth />
                    </Grid> q
                    <Grid item xs={12} md={2}>
                        <TextField label="Data Fim" name="data_fim" type="date" value={consulta.data_fim} onChange={(e) => handleChangeConsulta(index, e)} InputLabelProps={{ shrink: true }} fullWidth />
                    </Grid>
                </Grid>
            ))}

            <Button type="submit" variant="contained" color="primary">Criar Caso</Button>
        </Box>
    );
};

export default CriarCaso;