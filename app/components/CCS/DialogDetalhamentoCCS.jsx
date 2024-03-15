'use client'

import React from 'react';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import { v4 as uuidv4 } from "uuid";

// Componente DIALOG (popup) para mostrar o andamento da solicitação de Detalhamento

export default function DialogDetalhamentoCCS(props) {

  // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
  function Row(props) {
    const lista = props.lista;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell variant="overline">{lista.banco}</TableCell>
          <TableCell variant="overline">{lista.msg}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }


  return (
    <>
      <Dialog open={props.openDialogDetalhamentoCCS}>
        <DialogTitle>
          {(!props.statusDetalhamentos) ? 'Solicitando Detalhamento...' : 'Solicitação Concluída'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {(!props.statusDetalhamentos) ? 'Por favor, aguarde...' : 'Solicitação de Detalhamento Concluída. O prazo para respostas leva cerca de 24 horas.'}
          </DialogContentText>
          <Table>
            <TableBody>
              {props.listaDetalhamentos && props.listaDetalhamentos.map((lista) => (
                <Row key={uuidv4()} lista={lista} />
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        {(props.statusDetalhamentos) &&
          <DialogActions>
            <Button onClick={() => props.setOpenDialogDetalhamentoCCS(false)} >OK</Button>
          </DialogActions>}
      </Dialog>
    </>
  );
}