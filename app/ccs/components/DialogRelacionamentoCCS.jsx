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

export default function DialogRelacionamentoCCS(props) {
  // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
  function Row(props) {
    const lista = props.lista;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell variant="overline">{lista.cpfCnpj}</TableCell>
          <TableCell variant="overline">{lista.numeroRequisicao}</TableCell>
          <TableCell variant="overline">{lista.relacionamentosCCS.length} relacionamentos para o período solicitado.</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }


  return (
    <>
      <Dialog open={props.openDialogRelacionamentoCCS}>
        <DialogTitle>
          {(!props.statusRelacionamentos) ? 'Solicitando Relacionamentos...' : 'Solicitação Concluída'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {(!props.statusRelacionamentos) ? 'Por favor, aguarde...' : 'Solicitação de Relacionamentos Concluída.'}
          </DialogContentText>
          <Table>
            <TableBody>
              {props.lista && props.lista.map((lista) => (
                <Row key={uuidv4()} lista={lista} />
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        {(props.statusRelacionamentos) &&
          <DialogActions>
            <Button onClick={() => props.setOpenDialogRelacionamentoCCS(false)} >OK</Button>
          </DialogActions>}
      </Dialog>
    </>
  );
}