'use client'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import React from 'react';

// Serviços de Geração de Relatórios em PDF, usando pdfmake
// import RelatorioResumidoPix from "./resumidoPIX";
import RelatorioDetalhadoCCS from './detalhadoCCS';
import ExportaTXT from './exportaTXT';

// Componente DIALOG (popup) para Exportação de Arquivos
export default function DialogRelatorioCCS(props) {

  const [tipoRelatorio, setTipoRelatorio] = React.useState(props.tipoRelatorio);
  const [mostraTexto, setMostraTexto] = React.useState(false)
  const [numeroSimba, setNumeroSimba] = React.useState('024-PCSC-0000000-00')

  let requisicoes = props.requisicoes

  // Função para Exportar Dados em diversos formatos
  function exportaRelatorio(tipo, requisicoes) {
    switch (tipo) {
      case "txt_simba":
        ExportaTXT(requisicoes, numeroSimba)
        break;
      case "pdf_detalhado":
        RelatorioDetalhadoCCS(requisicoes);
        break;
    }
    props.setOpenDialogRelatorio(false);
  }

  return (
    <>
      <Dialog open={props.openDialogRelatorio} onClose={() => props.setOpenDialogRelatorio(false)} >
        <DialogTitle>Selecione o Tipo de Relatório</DialogTitle>
        <List sx={{ pt: 0 }}>
              <ListItem><ListItemButton onClick={() => setMostraTexto(!mostraTexto)} >Arquivo TXT - Simba/Esprits</ListItemButton></ListItem>
              {mostraTexto && (
                <>
                  <ListItem>
                    <TextField autoFocus fullWidth variant='standard' onChange={(e) => setNumeroSimba(e.target.value)} placeholder='024-PCSC-000000-00' label='Preencha caso tenha o número SIMBA:'></TextField>
                    <ListItemButton onClick={() => exportaRelatorio('txt_simba', requisicoes)} >OK</ListItemButton>  
                  </ListItem>
                </>
              )
              }
              {!mostraTexto && (
                <>
                  <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_detalhado', requisicoes)}>Relatório Detalhado PDF</ListItemButton></ListItem>
                </>
              )}
        </List>
      </Dialog>
    </>
  )
}