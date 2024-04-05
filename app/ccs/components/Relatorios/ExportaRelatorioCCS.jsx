'use client'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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

  let requisicoes = props.requisicoes

  // Função para Exportar Dados em diversos formatos
  function exportaRelatorio(tipo, requisicoes) {
    switch (tipo) {
      case "pdf_resumido":
        ExportaTXT(requisicoes)
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
          {tipoRelatorio == 'pdf' ?
            <>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_resumido', requisicoes)}>Relatório Resumido</ListItemButton></ListItem>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_detalhado', requisicoes)}>Relatório Detalhado</ListItemButton></ListItem>
            </>
            :
            <>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('csv_completo', requisicoes)}>Arquivo CSV</ListItemButton></ListItem>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('json_completo', requisicoes)}>Arquivo JSON - Esprites</ListItemButton></ListItem>
            </>
          }

        </List>
      </Dialog>
    </>
  )
}