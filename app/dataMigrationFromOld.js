const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateData() {
    // Fetch RequisicaoPix records with vinculos not null
    const requisicoes = await prisma.requisicaoPix.findMany({
        where: {
            vinculos: {
                not: {
                    equals: null,
                },
            },
        },
        include: {
            chaves: true, // Include existing ChavePix if needed
        },
    });

    for (const requisicaoPix of requisicoes) {
        const vinculos = requisicaoPix.vinculos;

        // Determine if vinculos is a valid JSON string or an object
        let chaves;
        try {
            if (typeof vinculos === 'string') {
                chaves = JSON.parse(vinculos);
            } else if (typeof vinculos === 'object') {
                chaves = requisicaoPix.tipoBusca === 'cpf/cnpj' ? vinculos : [vinculos];
            } else {
                console.warn('Unexpected vinculos format:', vinculos);
                continue; // Skip this record if format is unexpected
            }
        } catch (error) {
            console.error('Error parsing vinculos:', error);
            continue; // Skip this record if there is a parsing error
        }

        for (const chave of chaves) {
            // Check if ChavePix already exists with the same chave and idRequisicao
            let chavePix = await prisma.chavePix.findUnique({
                where: {
                    chave_idRequisicao: {
                        chave: chave.chave,
                        idRequisicao: requisicaoPix.id,
                    },
                },
            });

            if (!chavePix) {
                // Create ChavePix if it does not exist
                chavePix = await prisma.chavePix.create({
                    data: {
                        chave: chave.chave,
                        tipoChave: chave.tipoChave,
                        status: chave.status,
                        dataAberturaReivindicacao: chave.dataAberturaReivindicacao,
                        cpfCnpj: chave.cpfCnpj,
                        nomeProprietario: chave.nomeProprietario,
                        nomeFantasia: chave.nomeFantasia,
                        participante: chave.participante,
                        agencia: chave.agencia,
                        numeroConta: chave.numeroConta,
                        tipoConta: chave.tipoConta,
                        dataAberturaConta: chave.dataAberturaConta,
                        proprietarioDaChaveDesde: chave.proprietarioDaChaveDesde,
                        dataCriacao: chave.dataCriacao,
                        ultimaModificacao: chave.ultimaModificacao,
                        numeroBanco: chave.numerobanco,
                        nomeBanco: chave.nomebanco,
                        cpfCnpjBusca: chave.cpfCnpjBusca,
                        nomeProprietarioBusca: chave.nomeProprietarioBusca,
                        idRequisicao: requisicaoPix.id,
                        eventosVinculo: {
                            create: chave.eventosVinculo.map(evento => ({
                                tipoEvento: evento.tipoEvento,
                                motivoEvento: evento.motivoEvento,
                                dataEvento: evento.dataEvento,
                                chave: evento.chave,
                                tipoChave: evento.tipoChave,
                                cpfCnpj: evento.cpfCnpj,
                                nomeProprietario: evento.nomeProprietario,
                                nomeFantasia: evento.nomeFantasia,
                                participante: evento.participante,
                                agencia: evento.agencia,
                                numeroConta: evento.numeroConta,
                                tipoConta: evento.tipoConta,
                                dataAberturaConta: evento.dataAberturaConta,
                                numeroBanco: evento.numerobanco,
                                nomeBanco: evento.nomebanco,
                            })),
                        },
                    },
                });

                console.log(`Inserted ChavePix with ID: ${chavePix.id}`);
            } else {
                console.log(`ChavePix with chave: ${chave.chave} and idRequisicao: ${requisicaoPix.id} already exists. Skipping.`);
            }
        }
    }
}

// Call the migration function
migrateData()
    .then(() => {
        console.log('Data migration completed successfully.');
    })
    .catch((error) => {
        console.error('Error during migration:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
