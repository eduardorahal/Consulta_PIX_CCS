'use client'

import * as React from 'react';
import { Box, Grid, FormControl, FormLabel, Typography, TextField } from '@mui/material';

const FormLAB = () => {

    return (

        <Box style={{ margin: 10 }}>
            <Grid container spacing={2}>
                <FormControl style={{ verticalAlign: 'middle', marginInline: 20 }}>
                    <FormLabel style={{ fontSize: 16 }}>Nova Solicitação ao LAB</FormLabel>
                    
					<div>
						<div>

                        
								<FormLabel>INFORMAÇÕES SOBRE O DEMANDANTE</FormLabel>
							
							

							<div >
								<div >
									<div >
										<TextField placeholder="Nome" label="Nome" variant="standard"  fullWidth />
									</div>
								</div>
								
                                
								<div >
									<div >
										<FormLabel>Cargo </FormLabel>
										<select  id="cargo" name="cargo">
											<option>DELEGADO DE POLICIA CIVIL</option>
											<option>AGENTE DE POLICIA CIVIL</option>
											<option>ESCRIVÃO DE POLICIA CIVIL</option>
											<option>PROMOTOR DE JUSTIÇA</option>
											<option>OUTROS</option>
										</select>

										<TextField placeholder="CPF" label="CPF" variant="standard"/>
										<TextField placeholder="Matrícula" label="Matrícula" variant="standard" />
									</div>
								</div>
								
								<div >
									<div >
										<FormLabel >Email Funcional </FormLabel>
										<TextField type="text"  id="email" name="email" required />
									</div>
								</div>
								
								<div >
									<div >
										<FormLabel>Telefone </FormLabel>
										<TextField type="text"  id="telefone" name="telefone" maxLength="15" required />
									</div>
								</div>
							</div>
							
							<div >
								<div >
									<div >
										<FormLabel>Unidade </FormLabel>
										<select  data-live-search="true" id="unidade" name="unidade" required>
											<option value="1">Selecione sua Unidade</option>
											
										</select>

									</div>
								</div>

							</div>
							
                            
							
								<span ></span>
								<FormLabel>INFORMAÇÕES SOBRE O CASO</FormLabel>
							
							
							<div >
								
                                <div >
									<div >
										<FormLabel>Nome do Caso/Operação</FormLabel>
										<TextField type="text"  id="nome_caso" name="nome_caso" required />
									</div>
								</div>
								
								<div >
									<div >
									<FormLabel>Número do Procedimento (IP, BO, VPI, APF e/ou outros)</FormLabel>
										<TextField type="text"  id="procedimento" name="procedimento" required />
									</div>
								</div>
							</div>
							<div >
								
								<div >
									<div >
										<FormLabel>Medidas Investigativas já¡ Adotadas</FormLabel>
										<TextField type="text"  id="medida" name="medida" maxLength="1000" />
									</div>
								</div>
							
								<div >
									<div >
										<FormLabel>Número do Processo</FormLabel>
										<TextField type="text"  name="n_processo" maxLength="1000" />
									</div>
								</div>
							</div>
							<div >
						
								<div >
									<div >
										<FormLabel>Vara/Tribunal </FormLabel>
										<select  data-live-search="true" id="vara" name="vara">
											<option value="1">Selecione Vara/Unidade</option>
											
										</select>
									</div>
								</div>
								
								<div >
									<div >
										<FormLabel>Juiz</FormLabel>
										<TextField type="text"  id="juiz" name="juiz" maxLength="1000" />
									</div>
								</div>
							</div>
							<div >
								
								<div >
									<div >
										<FormLabel>Tipos Penais em Apuração </FormLabel>
										<select  data-live-search="true" id="tipo[]" name="tipo[]" data-width="100%" multiple data-actions-box="true">
											
										</select>
									</div>
								</div>
							</div>
							<div >
								
								<div >
									<div >
										<FormLabel>Resumo dos Fatos </FormLabel>
										<textarea  rows="3" id="fato" name="fato" required></textarea>
									</div>
								</div>
							</div>
							<div >
								
								<div >
									<div >
										<FormLabel >Questionamentos a serem Respondidos pelo LAB-LD </FormLabel>
										<textarea  rows="3" id="quesito" name="quesito" required></textarea>
									</div>
								</div>
							</div>
							<div >
								
								<div >
									<div >
										<FormLabel >Caso a investigação atinja outros estados, discrimine-os:</FormLabel>
										<TextField type="text"  id="estado" name="estado" maxLength="1000" />
									</div>
								</div>
							</div>
							
							
							
								<span ></span>
								<FormLabel>SOLICITAÇÕES AO LAB-LD </FormLabel>
							
							
							
									<div id="proof" >
										<p><b>Selecione a(s) consulta(s) desejada(s) entre as opções abaixo: </b></p>
																				<div >
											<TextField  type="checkbox" id="ColetaDados" name="ColetaDados[]" value="Chave PIX" />
											<FormLabel >Chave PIX</FormLabel>
										</div>

										
										<div >
											<TextField  type="checkbox" id="ColetaDados" name="ColetaDados[]" value="CENSEC" />
											<FormLabel >Escrituras e ProcuraÃ§Ãµes PÃºblicas (CENSEC)</FormLabel>
										</div>
										<div >
											<TextField  type="checkbox" id="ColetaDados" name="ColetaDados[]" value="ONR" />
											<FormLabel >Matrícula de Imóveis (ONR)</FormLabel>
										</div>

										<div >
											<TextField  type="checkbox" id="ColetaDados" name="ColetaDados[]" value="Parentesco" />
											<FormLabel >Parentesco</FormLabel>
										</div>

								
									</div>
							





							<div >
								<div  >
									<div >
										<FormLabel data-toggle="tooltip" title="Para solicitar AnÃ¡lise BancÃ¡ria Ã© obrigatÃ³rio informar o NÂº do Caso Simba">Número da Cooperação Técnica Simba </FormLabel>
										<TextField type="text"  placeholder="000-PCSC-000000-00" name="coop_tecnica_simba" id="coop_tecnica_simba" maxLength="1000" alt="Campo obrigatÃ³rio para solicitaÃ§Ã£o de RelatÃ³rio de AnÃ¡lise BancÃ¡ria" disabled required />
									</div>
								</div>
							</div>


							

							<div  id="simba">
								
								<div >
									<div >
										<FormLabel >Data Inicial</FormLabel>
										<TextField type="text"  id="dti" name="dti" maxLength="10" />
									</div>
								</div>
								
								<div >
									<div >
										<FormLabel >Data Final</FormLabel>
										<TextField type="text"  id="dtf" name="dtf" maxLength="10" />
									</div>
								</div>
							</div>
							
							 <span >
								</span> <FormLabel>ARQUIVOS</FormLabel>
							
							
							<div >
								<div >
									<div >
										<FormLabel >Descrição do Arquivo</FormLabel>
										<TextField type="text"  id="descricao_arquivo" name="descricao_arquivo" />
									</div>
								</div>
								<div >
									<div >
										<FormLabel >Arquivo</FormLabel>
										<TextField type="file"  name="lob_upload" id="lob_upload" />
									</div>
								</div>
							</div>

							
							 <span >
								</span> <FormLabel>INVESTIGADOS</FormLabel>
							
						
							
							<div id="details-table">

							</div>
							
								<FormLabel>
									<button type="button" id="btn-add-item">
									Adicionar Investigado
									</button>
								</FormLabel>
							


							<br />


							<div >
								<div >
									<div >
													<div >
													<TextField  type="checkbox" id="declaracao" name="declaracao" value="declaracao" required />
													<FormLabel >Declaro estar ciente de que as solicitações devem ser realizadas diretamente ou mediante ordem do Delegado de Polícia responsÃ¡vel pelo caso. </FormLabel>
													</div>
									</div>
								</div>
								</div>





							
							<br />
						</div>
						<div >
							<div >
								
								<div >
									<button type="submit"  >Enviar Formulário <span ></span></button>
								</div>
							</div>

						</div>
					</div>

                </FormControl>
            </Grid>
        </Box>
    )
}

export default FormLAB;