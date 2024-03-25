'use client'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import React from 'react';

// Serviços de Geração de Relatórios em PDF, usando pdfmake
import RelatorioResumidoPix from "./resumidoPIX";
import RelatorioDetalhadoPix from "./detalhadoPIX";

// Componente DIALOG (popup) para Exportação de Arquivos
export default function DialogRelatorioPIX(props) {

  const [tipoRelatorio, setTipoRelatorio] = React.useState(props.tipoRelatorio);

  let lista = props.lista

  // Função para Exportar Dados em diversos formatos
  function exportaRelatorio(tipo, lista) {
    // if (lista.length != 0) {
    switch (tipo) {
      case "pdf_resumido":
        RelatorioResumidoPix(lista);
        break;
      case "pdf_detalhado":
        RelatorioDetalhadoPix(lista);
        break;
      case "csv_completo":
        alert("Exportação ainda não disponível.");
        break;
      case "json_completo":
        var file = window.document.createElement("a");
        file.href = window.URL.createObjectURL(
          new Blob([JSON.stringify({ vinculosPix: lista })]),
          { type: "application/json" }
        );
        file.download = "vinculosPix.json";
        document.body.appendChild(file);
        file.click();
        document.body.removeChild(file);
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
              <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_resumido', lista)}>Relatório Resumido</ListItemButton></ListItem>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('pdf_detalhado', lista)}>Relatório Detalhado</ListItemButton></ListItem>
            </>
            :
            <>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('csv_completo', lista)}>Arquivo CSV</ListItemButton></ListItem>
              <ListItem><ListItemButton onClick={() => exportaRelatorio('json_completo', lista)}>Arquivo JSON - Esprites</ListItemButton></ListItem>
            </>
          }

        </List>
      </Dialog>
    </>
  )
}