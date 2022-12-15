import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Card, CardHeader, CardContent, Box, InputAdornment, Table } from '@material-ui/core';
import _ from 'lodash';
import { TableRow, TableCell, TableHead, Button, Modal, FormInput } from '@/components';
import { moedaMask, moeda } from '@/utils/mascaras';
import { translate, translateWithHtml } from '@/locales';
import theme from '@/theme';
import { BALANCO_PATRIMONIAL, ENUM_ITEMS_ANALISE } from '@/utils/constants';
import ObjectHelper from '@/utils/objectHelper';
import { soNumero } from '@/utils/mascaras';
import { CabecalhoHorizontal } from './style';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function DadosBalancoPatrimonial({
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
		openMsgErroRevisaoBalanco,
		setOpenMsgErroRevisaoBalanco
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

	// Formulario
	const [
		dadosBalancoPatrimonialList,
		metadataDataDadosBalancoPatrimonialList
	] = getFieldProps('dadosBalancoPatrimonialList', 'text');

	// Efeitos

	useEffect(
		() => {
			return () => {
				setCabecalho(cabecalhoInicial);
			};
		},
		[
			0
		]
	);

	useEffect(
		() => {
			if (!cabecalhoPreenchido && dadosBalancoPatrimonialList.value.length > 0) {
				PreencherCabecalho();
				setCabecalhoPreenchido(true);
			}
		},
		[
			dadosBalancoPatrimonialList.value
		]
	);

	const PreencherCabecalho = () => {
		let quant = 0;
		const count = VerificaData(dataAbertura);
		let ano = new Date().getUTCFullYear();
		const arrayCabecalho = ObjectHelper.clone(cabecalho);
		dadosBalancoPatrimonialList.value.map(c => {
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
		const list = ObjectHelper.clone(dadosBalancoPatrimonialList.value);
		list[index][campo].value = value ? parseFloat(value) : null;
		list[index][campo].modificado = true;
		setFieldValue('dadosBalancoPatrimonialList', list);
		setFieldTouched('dadosBalancoPatrimonialList', true);
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

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Modal
				open={openMsgErroRevisaoBalanco}
				handleClose={() => setOpenMsgErroRevisaoBalanco(false)}
				onClickButton={() => setOpenMsgErroRevisaoBalanco(false)}
				title={translate('revisaoDadosBalanco')}
				textButton={translate('ok')}
			>
				<p>{erros}</p>
			</Modal>

			{cabecalhoDinamico && (
				<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('dadosBalancoPatrimonial')}
						action={
							<Fragment>
								<Box>
									<Aprovacao
										itensAnalise={itensAnalise}
										setItensAnalise={setItensAnalise}
										comentarios={comentarios}
										setComentarios={setComentarios}
										tipoItem={
											ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Dados_Balanco_Patrimonial')
												.value
										}
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
								{BALANCO_PATRIMONIAL.map(cabecalhoColumn => {
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

											{dadosBalancoPatrimonialList.value.map((balanco, index) => {
												if (dataVerificacao === index || dataVerificacao < index) {
													return false;
												} else {
													return (
														<TableCell
															key={index}
															label={
																<FormInput
																	value={moedaMask(
																		balanco[cabecalhoColumn.codigo].value == 0 ||
																		balanco[cabecalhoColumn.codigo].value == '' ||
																		balanco[cabecalhoColumn.codigo].value == null
																			? ''
																			: balanco[cabecalhoColumn.codigo].value
																	)}
																	onChange={event =>
																		VerificaDados(
																			index,
																			cabecalhoColumn.codigo,
																			soNumero(event.target.value)
																		)}
																	error={
																		balanco[cabecalhoColumn.codigo].value === null ||
																		balanco[cabecalhoColumn.codigo].value === '' ||
																		balanco[cabecalhoColumn.codigo].value === 0 ||
																		(balanco[cabecalhoColumn.codigo].erro &&
																			balanco[cabecalhoColumn.codigo].modificado)
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
