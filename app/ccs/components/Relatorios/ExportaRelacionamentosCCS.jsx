'use client'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import React from 'react';

// Serviços de Geração de Relatórios em PDF, usando pdfmake
import RelatorioResumidoCCS from './resumidoCCS';

// Componente DIALOG (popup) para Exportação de Arquivos
export default function DialogExportaRelacionamentosCCS(props) {

  let requisicoes = props.requisicoes

  // Função para Exportar Dados em diversos formatos
  function exportaRelatorio(tipo, requisicoes) {
    switch (tipo) {
      case "pdf_detalhado":
        RelatorioResumidoCCS(requisicoes);
        break;
    }
    props.setOpenDialogRelatorio(false);
  }

  return (
    <>
      <Dialog open={props.openDialogRelatorio} onClose={() => props.setOpenDialogRelatorio(false)} >
        <DialogTitle>Selecione o Tipo de Relatório</DialogTitle>
        <List sx={{ pt: 0 }}>
                <>
                  <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_detalhado', requisicoes)}>Relatório Detalhado PDF</ListItemButton></ListItem>
                </>
        </List>
      </Dialog>
    </>
  )
}