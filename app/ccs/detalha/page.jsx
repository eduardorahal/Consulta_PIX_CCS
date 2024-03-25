'use client'

import { Suspense, useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DetalheCCS from '../components/DetalheCCS';
import { useSearchParams } from 'next/navigation'


const DetalhaCCS = () => {

    //variável para controle de carregamento de página
    const [loading, setLoading] = useState(true)

    // variável para armazenar a lista de Chaves PIX exibidas no FrontEnd
    const [requisicoes, setRequisicoes] = useState([]);

    // Caso haja solicitação de detalhamento, as informações ficam nessa variável antes de serem atribuídas para a lista

    const searchParams = useSearchParams()
    const query = searchParams.get('selected')

    useEffect(() => {
        if (query === 'true') {
            setLoading(true)
            const detalhe = JSON.parse(localStorage.getItem("detalhe"))
            for (let i = 0; i < detalhe.length; i++) {
                setRequisicoes((requisicoes) => [...requisicoes, detalhe[i]])
                if(i == (detalhe.length - 1)){
                    setLoading(false)
                }
            }
        }
    }, [])


    // Componente DIALOG (popup) para mostrar que a página está sendo carregada

    function LoadingDialog() {
        return (
            <>
                <Dialog open={loading}>
                    <DialogTitle>
                        Carregando...
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Por favor, aguarde.
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <Box style={{ margin: 10 }}>
            <Grid container spacing={2}>
                {
                    loading ?
                        <LoadingDialog />
                        :
                        <>
                            <Suspense fallback={<span>Carregando Requisição CCS...</span>}>
                                <DetalheCCS requisicoes={requisicoes} />
                            </Suspense>
                        </>
                }

            </Grid>
        </Box>
    )
}

export default () => (
    <DetalhaCCS />
)