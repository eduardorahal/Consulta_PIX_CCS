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
    const lista = props.lista;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell style={{ width: '30%', fontWeight: 'bold' }} variant="overline">{formatCnpjCpf(lista.cpfCnpj)}</TableCell>
          <TableCell style={{ width: '30%', color: ((lista.status == 'Sucesso') ? 'blue' : 'red') }} variant="overline">{lista.numeroRequisicao ? ('Requisição nº ' + lista.numeroRequisicao) : lista.status}</TableCell>
          <TableCell style={{ width: '40%', color: ((lista.status == 'Sucesso') ? 'blue' : 'red') }} variant="overline">{lista.relacionamentosCCS ? (lista.relacionamentosCCS.length + ' relacionamentos no período solicitado.') : lista.msg} </TableCell>
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