import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Card, CardHeader, CardContent, Box, InputAdornment, Table } from '@material-ui/core';
import _ from 'lodash';
import { TableRow, TableCell, TableHead, Button, Modal, FormInput } from '@/components';
import { translate, translateWithHtml } from '@/locales';
import theme from '@/theme';
import { DRE } from '@/utils/constants';
import ObjectHelper from '@/utils/objectHelper';
import { soNumero, moedaMask, moeda } from '@/utils/mascaras';
import { CabecalhoHorizontal } from './style';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function DadosDRE({
	formulario,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	historicoEmpresa,
	dataAbertura,
	user,
	disableEdit,
	statusEmpresa
}) {
	const { submitCount, getFieldProps, setFieldValue, setFieldTouched } = formulario;

	// Estado Local

	const [
		openMsgErroRevisaoDRE,
		setOpenMsgErroRevisaoDRE
	] = useState(false);

	const [
		erros,
		setErros
	] = useState(translate('dadosLancadosContemErro'));

	const cabecalhoInicial = [
		{ codigo: 'Descricao', label: 'Descrição' }
	];

	const [
		cabecalho,
		setCabecalho
	] = useState(cabecalhoInicial);

	const [
		cabecalhoPreenchido,
		setCabecalhoPreenchido
	] = useState(false);

	const [
		cabecalhoDinamico,
		setCabecalhoDinamico
	] = useState(false);

	const [
		dataVerificacao,
		setDataVerificacao
	] = useState(0);

	const [
		titulo,
		setTitulo
	] = useState('');

	// Formulario
	const [
		dadosDREList,
		metadataDRElList
	] = getFieldProps('dadosDREList', 'text');

	// Efeito Inicial

	useEffect(() => {
		return () => {
			setCabecalho(cabecalhoInicial);
		};
	}, []);

	useEffect(
		() => {
			if (!cabecalhoPreenchido && dadosDREList.value.length > 0) {
				PreencherCabecalho();
				setCabecalhoPreenchido(true);
			}
		},
		[
			dadosDREList.value
		]
	);

	const PreencherCabecalho = () => {
		let quant = 0;
		const count = VerificaData(dataAbertura);
		let ano = new Date().getUTCFullYear();
		const arrayCabecalho = ObjectHelper.clone(cabecalho);
		dadosDREList.value.map(c => {
			if (quant === count) {
				return false;
			} else {
				++quant;
				arrayCabecalho.push({
					codigo: 'DataReferencia',
					label: moment(--ano + '-12-31T00:00:00').format('DD/MM/YYYY')
				});
			}
		});
		setCabecalho(arrayCabecalho, setCabecalhoDinamico(true));
	};

	const VerificaDados = (index, campo, value) => {
		const list = ObjectHelper.clone(dadosDREList.value);
		list[index][campo].value = value ? parseFloat(value) : null;
		list[index][campo].modificado = true;
		setFieldValue('dadosDREList', list);
		setFieldTouched('dadosDREList', true);
	};

	const RevisarDRE = () => {
		let novoErros = 0;
		const list = ObjectHelper.clone(dadosDREList.value);
		dadosDREList.value.forEach((dados, index) => {
			//Limpa os validadores de erro dos atributos
			Object.keys(list[index]).forEach(i => list[index][i].erro && (list[index][i].erro = false));
			//Verifica se algum atributo é nulo e seta o numero de 'novoErros'.
			Object.keys(list[index]).forEach(i => list[index][i].value === null && novoErros++);

			//Receita Operacional Líquida
			if (
				dados.ReceitaOperacionalLiquida.value !==
				dados.CustoProdutosVendidosMercadoriasVendidasServicosPrestados.value
			) {
				list[index].ReceitaOperacionalLiquida.erro = true;
				list[index].CustoProdutosVendidosMercadoriasVendidasServicosPrestados.erro = true;

				if (
					list[index].ReceitaOperacionalLiquida.modificado == true ||
					list[index].CustoProdutosVendidosMercadoriasVendidasServicosPrestados.modificado == true
				) {
					novoErros++;
				}
			}

			// Resultado Operacional Bruto
			if (
				dados.ResultadoOperacionalBruto.value !==
				dados.DespesasVendasAdministrativasGeraisOutras.value +
					dados.DespesasFinanceiras.value +
					dados.ReceitasFinanceiras.value
			) {
				list[index].ResultadoOperacionalBruto.erro = true;
				list[index].DespesasVendasAdministrativasGeraisOutras.erro = true;
				list[index].DespesasFinanceiras.erro = true;
				list[index].ReceitasFinanceiras.erro = true;

				if (
					list[index].ResultadoOperacionalBruto.modificado == true ||
					list[index].DespesasVendasAdministrativasGeraisOutras.modificado == true ||
					list[index].DespesasFinanceiras.modificado == true ||
					list[index].ReceitasFinanceiras.modificado == true
				) {
					novoErros++;
				}
			}
		});
		if (novoErros == 0) {
			setFieldValue('dadosDRElList', list);
			setFieldTouched('dadosDREList', true);
			setErros(translate('dadosLancadosSucesso'));
		} else {
			setFieldValue('dadosDREList', list);
			setFieldTouched('dadosDREList', true);
			setErros(translate('dadosLancadosContemErro'));
		}
		setOpenMsgErroRevisaoDRE(true);
	};

	const VerificaData = data => {
		const dataAtual = new Date().getUTCFullYear();
		const resultOperacao = dataAtual - data.substring(0, 4);
		if (resultOperacao > 4 || resultOperacao === 4) {
			setDataVerificacao(3);
			return 3;
		}
		switch (resultOperacao) {
			case 3: {
				setDataVerificacao(3);
				return 3;
			}
			case 2: {
				setDataVerificacao(2);
				return 2;
			}
			case 1: {
				setDataVerificacao(1);
				return 1;
			}
			case 0: {
				setDataVerificacao(0);
				return 0;
			}
			default: {
				setDataVerificacao(0);
				return 0;
			}
		}
	};

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			{cabecalhoDinamico && (
				<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('dadosDemonstracaoResultadoExercicio')}
						action={
							<Fragment>
								<Box>
									<Aprovacao
										itensAnalise={itensAnalise}
										setItensAnalise={setItensAnalise}
										comentarios={comentarios}
										setComentarios={setComentarios}
										tipoItem={ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Dados_DRE').value}
										historicoEmpresa={historicoEmpresa}
										user={user}
										disableEdit={disableEdit}
										statusEmpresa={statusEmpresa}
									/>
								</Box>
							</Fragment>
						}
					/>
					<CardContent>
						<Box paddingTop='8px'>
							<Table>
								<TableHead columns={cabecalho} />
								{DRE.map(cabecalhoColumn => {
									return (
										<TableRow>
											<TableCell
												label={
													<CabecalhoHorizontal
														paddingLeft={cabecalhoColumn.paddingLeft}
														negrito={cabecalhoColumn.negrito}
													>
														{cabecalhoColumn.label}
													</CabecalhoHorizontal>
												}
											/>
											{dadosDREList.value.map((dados, index) => {
												if (dataVerificacao === index || dataVerificacao < index) {
													return false;
												} else {
													return (
														<TableCell
															key={index}
															label={
																<FormInput
																	value={moedaMask(
																		dados[cabecalhoColumn.codigo].value == 0 ||
																		dados[cabecalhoColumn.codigo].value == '' ||
																		dados[cabecalhoColumn.codigo].value == null
																			? ''
																			: dados[cabecalhoColumn.codigo].value
																	)}
																	onChange={event =>
																		VerificaDados(
																			index,
																			cabecalhoColumn.codigo,
																			soNumero(event.target.value)
																		)}
																	error={
																		dados[cabecalhoColumn.codigo].value === null ||
																		dados[cabecalhoColumn.codigo].value === '' ||
																		dados[cabecalhoColumn.codigo].value === 0 ||
																		(dados[cabecalhoColumn.codigo].erro &&
																			dados[cabecalhoColumn.codigo].modificado)
																	}
																	InputProps={{
																		startAdornment: <InputAdornment position='start' />
																	}}
																/>
															}
														/>
													);
												}
											})}
										</TableRow>
									);
								})}
							</Table>
						</Box>
					</CardContent>
				</Card>
			)}
		</Box>
	);
}
