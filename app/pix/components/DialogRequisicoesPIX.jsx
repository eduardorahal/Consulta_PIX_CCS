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

export default function DialogRequisicoesPIX(props) {

  // Formatar CPF / CNPJ para apresentação no FrontEnd
  const formatCnpjCpf = (value) => {
    const cnpjCpf = value.replace(/\D/g, "");
    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    }
    return cnpjCpf.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      "$1.$2.$3/$4-$5"
    );
  };


  // Função para Montar as LINHAS da Tabela no FrontEnd (sem o cabeçalho, pois o cabeçalho está no return)
  function Row(props) {
    const message = props.message;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell style={{ width: '50%', fontWeight: 'bold' }} variant="overline">{(message.cpfCnpj) ? formatCnpjCpf(message.cpfCnpj) : message.chave}</TableCell>
          <TableCell style={{ width: '50%', color: ((message.status == 'Recebido com Sucesso') ? 'blue' : 'red') }} variant="overline">{message.status}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }


  return (
    <>
      <Dialog open={props.openDialogRequisicoesPIX}>
        <DialogTitle>
          {(!props.statusRequisicoes) ? 'Solicitando Chaves PIX...' : 'Solicitação Concluída'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {(!props.statusRequisicoes) ? 'Por favor, aguarde...' : 'Solicitação de Chaves Concluída.'}
          </DialogContentText>
          <Table>
            <TableBody>
              {props.message && props.message.map((message) => (
                <Row key={uuidv4()} message={message} />
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        {(props.statusRequisicoes) &&
          <DialogActions>
            <Button onClick={() => props.setOpenDialogRequisicoesPIX(false)} >OK</Button>
          </DialogActions>}
      </Dialog>
    </>
  );
}