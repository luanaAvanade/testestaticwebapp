import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Card, CardHeader, CardContent, Box, InputAdornment, Table } from '@material-ui/core';
import _ from 'lodash';
import { TableRow, TableCell, TableHead, Button, Modal, FormInput } from '@/components';
import { translate, translateWithHtml } from '@/locales';
import theme from '@/theme';
import { checkError } from '@/utils/validation';
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
			//setCabecalho(cabecalhoInicial);
		};
	}, []);

	useEffect(
		() => {
			if (!cabecalhoPreenchido && dadosDREList.value.length > 0) {
				//PreencherCabecalho();
				//setCabecalhoPreenchido(true);
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


//////////////////////////////////////ANO 1/////////////////////////////////////////////////

	const [
		receitaOperacionalLiquida,
		metadataReceitaOperacionalLiquida
	] = getFieldProps('receitaOperacionalLiquida', 'text');

	const [
		custoProdutosVendidosMercadoriasVendidasServicosPrestados,
		metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestados
	] = getFieldProps('custoProdutosVendidosMercadoriasVendidasServicosPrestados', 'text');

	const [
		resultadoOperacionalBruto,
		metadataResultadoOperacionalBruto
	] = getFieldProps('resultadoOperacionalBruto', 'text');

	const [
		despesasVendasAdministrativasGeraisOutras,
		metadataDespesasVendasAdministrativasGeraisOutras
	] = getFieldProps('despesasVendasAdministrativasGeraisOutras', 'text');

	const [
		despesasFinanceiras,
		metadataDespesasFinanceiras
	] = getFieldProps('despesasFinanceiras', 'text');

	const [
		receitasFinanceiras,
		metadataReceitasFinanceiras
	] = getFieldProps('receitasFinanceiras', 'text');

	const [
		resultadoOperacionalAntesIrCssl,
		metadataResultadoOperacionalAntesIrCssl
	] = getFieldProps('resultadoOperacionalAntesIrCssl', 'text');

	const [
		resultadoLiquidoPeriodo,
		metadataResultadoLiquidoPeriodo
	] = getFieldProps('resultadoLiquidoPeriodo', 'text');


//////////////////////////////////////ANO 2/////////////////////////////////////////////////

const [
	receitaOperacionalLiquidaAnoDois,
	metadataReceitaOperacionalLiquidaAnoDois
] = getFieldProps('receitaOperacionalLiquidaAnoDois', 'text');

const [
	custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois,
	metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois
] = getFieldProps('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois', 'text');

const [
	resultadoOperacionalBrutoAnoDois,
	metadataResultadoOperacionalBrutoAnoDois
] = getFieldProps('resultadoOperacionalBrutoAnoDois', 'text');

const [
	despesasVendasAdministrativasGeraisOutrasAnoDois,
	metadataDespesasVendasAdministrativasGeraisOutrasAnoDois
] = getFieldProps('despesasVendasAdministrativasGeraisOutrasAnoDois', 'text');

const [
	despesasFinanceirasAnoDois,
	metadataDespesasFinanceirasAnoDois
] = getFieldProps('despesasFinanceirasAnoDois', 'text');

const [
	receitasFinanceirasAnoDois,
	metadataReceitasFinanceirasAnoDois
] = getFieldProps('receitasFinanceirasAnoDois', 'text');

const [
	resultadoOperacionalAntesIrCsslAnoDois,
	metadataResultadoOperacionalAntesIrCsslAnoDois
] = getFieldProps('resultadoOperacionalAntesIrCsslAnoDois', 'text');

const [
	resultadoLiquidoPeriodoAnoDois,
	metadataResultadoLiquidoPeriodoAnoDois
] = getFieldProps('resultadoLiquidoPeriodoAnoDois', 'text');



//////////////////////////////////////ANO 3/////////////////////////////////////////////////

const [
	receitaOperacionalLiquidaAnoTres,
	metadataReceitaOperacionalLiquidaAnoTres
] = getFieldProps('receitaOperacionalLiquidaAnoTres', 'text');

const [
	custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres,
	metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres
] = getFieldProps('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres', 'text');

const [
	resultadoOperacionalBrutoAnoTres,
	metadataResultadoOperacionalBrutoAnoTres
] = getFieldProps('resultadoOperacionalBrutoAnoTres', 'text');

const [
	despesasVendasAdministrativasGeraisOutrasAnoTres,
	metadataDespesasVendasAdministrativasGeraisOutrasAnoTres
] = getFieldProps('despesasVendasAdministrativasGeraisOutrasAnoTres', 'text');

const [
	despesasFinanceirasAnoTres,
	metadataDespesasFinanceirasAnoTres
] = getFieldProps('despesasFinanceirasAnoTres', 'text');

const [
	receitasFinanceirasAnoTres,
	metadataReceitasFinanceirasAnoTres
] = getFieldProps('receitasFinanceirasAnoTres', 'text');

const [
	resultadoOperacionalAntesIrCsslAnoTres,
	metadataResultadoOperacionalAntesIrCsslAnoTres
] = getFieldProps('resultadoOperacionalAntesIrCsslAnoTres', 'text');

const [
	resultadoLiquidoPeriodoAnoTres,
	metadataResultadoLiquidoPeriodoAnoTres
] = getFieldProps('resultadoLiquidoPeriodoAnoTres', 'text');


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
		<Box paddingTop={`${theme.spacing(1)}px`}>


				<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('dadosDemonstracaoResultadoExercicio') + '2022'}
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
					<Box display='flex' flexDirection='row'>
		
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('despesasVendasAdministrativasGeraisOutras')}:`}
							value={soNumero(despesasVendasAdministrativasGeraisOutras.value)}
							onChange={event => setFieldValue('despesasVendasAdministrativasGeraisOutras', event.target.value)}
							onFocus={() => setFieldTouched('despesasVendasAdministrativasGeraisOutras', true)}
							error={checkError(submitCount, metadataDespesasVendasAdministrativasGeraisOutras)}
							//disabled={disableEdit}
						/>
		
						</Box>


						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('custoProdutosVendidosMercadoriasVendidasServicosPrestados')}:`}
								value={soNumero(custoProdutosVendidosMercadoriasVendidasServicosPrestados.value)}
								onChange={event => setFieldValue('custoProdutosVendidosMercadoriasVendidasServicosPrestados', event.target.value)}
								onFocus={() => setFieldTouched('custoProdutosVendidosMercadoriasVendidasServicosPrestados', true)}
								error={checkError(submitCount, metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestados)}
								//disabled={disableEdit}
							/>
						
						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>
					
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('resultadoOperacionalBruto')}:`}
								value={soNumero(resultadoOperacionalBruto.value)}
								onChange={event => setFieldValue('resultadoOperacionalBruto', event.target.value)}
								onFocus={() => setFieldTouched('resultadoOperacionalBruto', true)}
								error={checkError(submitCount, metadataResultadoOperacionalBruto)}
								//disabled={disableEdit}
							/>
						
						</Box>

		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('despesasFinanceiras')}:`}
							value={soNumero(despesasFinanceiras.value)}
							onChange={event => setFieldValue('despesasFinanceiras', event.target.value)}
							onFocus={() => setFieldTouched('despesasFinanceiras', true)}
							error={checkError(submitCount, metadataDespesasFinanceiras)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('receitasFinanceiras')}:`}
							value={soNumero(receitasFinanceiras.value)}
							onChange={event => setFieldValue('receitasFinanceiras', event.target.value)}
							onFocus={() => setFieldTouched('receitasFinanceiras', true)}
							error={checkError(submitCount, metadataReceitasFinanceiras)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('resultadoOperacionalAntesIrCssl')}:`}
							value={soNumero(resultadoOperacionalAntesIrCssl.value)}
							onChange={event => setFieldValue('resultadoOperacionalAntesIrCssl', event.target.value)}
							onFocus={() => setFieldTouched('resultadoOperacionalAntesIrCssl', true)}
							error={checkError(submitCount, metadataResultadoOperacionalAntesIrCssl)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('resultadoLiquidoPeriodo')}:`}
							value={soNumero(resultadoLiquidoPeriodo.value)}
							onChange={event => setFieldValue('resultadoLiquidoPeriodo', event.target.value)}
							onFocus={() => setFieldTouched('resultadoLiquidoPeriodo', true)}
							error={checkError(submitCount, metadataResultadoLiquidoPeriodo)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('receitaOperacionalLiquida')}:`}
							value={soNumero(receitaOperacionalLiquida.value)}
							onChange={event => setFieldValue('receitaOperacionalLiquida', event.target.value)}
							onFocus={() => setFieldTouched('receitaOperacionalLiquida', true)}
							error={checkError(submitCount, metadataReceitaOperacionalLiquida)}
							//disabled={disableEdit}
						/>
		
						</Box>


					</Box>		
					
				</CardContent>
				</Card>



{/* ///////////////////////////////////////////////////////////////////////////////////////// */}

				<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('dadosDemonstracaoResultadoExercicio') + '2021'}
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
					<Box display='flex' flexDirection='row'>
		
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('despesasVendasAdministrativasGeraisOutras')}:`}
							value={soNumero(despesasVendasAdministrativasGeraisOutrasAnoDois.value)}
							onChange={event => setFieldValue('despesasVendasAdministrativasGeraisOutrasAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('despesasVendasAdministrativasGeraisOutrasAnoDois', true)}
							error={checkError(submitCount, metadataDespesasVendasAdministrativasGeraisOutrasAnoDois)}
							//disabled={disableEdit}
						/>
		
						</Box>


						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('custoProdutosVendidosMercadoriasVendidasServicosPrestados')}:`}
								value={soNumero(custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois.value)}
								onChange={event => setFieldValue('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois', true)}
								error={checkError(submitCount, metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>
					
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('resultadoOperacionalBruto')}:`}
								value={soNumero(resultadoOperacionalBrutoAnoDois.value)}
								onChange={event => setFieldValue('resultadoOperacionalBrutoAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('resultadoOperacionalBrutoAnoDois', true)}
								error={checkError(submitCount, metadataResultadoOperacionalBrutoAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>

		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('despesasFinanceiras')}:`}
							value={soNumero(despesasFinanceirasAnoDois.value)}
							onChange={event => setFieldValue('despesasFinanceirasAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('despesasFinanceirasAnoDois', true)}
							error={checkError(submitCount, metadataDespesasFinanceirasAnoDois)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('receitasFinanceiras')}:`}
							value={soNumero(receitasFinanceirasAnoDois.value)}
							onChange={event => setFieldValue('receitasFinanceirasAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('receitasFinanceirasAnoDois', true)}
							error={checkError(submitCount, metadataReceitasFinanceirasAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('resultadoOperacionalAntesIrCssl')}:`}
							value={soNumero(resultadoOperacionalAntesIrCsslAnoDois.value)}
							onChange={event => setFieldValue('resultadoOperacionalAntesIrCsslAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('resultadoOperacionalAntesIrCsslAnoDois', true)}
							error={checkError(submitCount, metadataResultadoOperacionalAntesIrCsslAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('resultadoLiquidoPeriodo')}:`}
							value={soNumero(resultadoLiquidoPeriodoAnoDois.value)}
							onChange={event => setFieldValue('resultadoLiquidoPeriodoAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('resultadoLiquidoPeriodoAnoDois', true)}
							error={checkError(submitCount, metadataResultadoLiquidoPeriodoAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('receitaOperacionalLiquida')}:`}
							value={soNumero(receitaOperacionalLiquidaAnoDois.value)}
							onChange={event => setFieldValue('receitaOperacionalLiquidaAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('receitaOperacionalLiquidaAnoDois', true)}
							error={checkError(submitCount, metadataReceitaOperacionalLiquidaAnoDois)}
							//disabled={disableEdit}
						/>
		
						</Box>


					</Box>		
					
				</CardContent>
				</Card>




{/* ///////////////////////////////////////////////////////////////////////////////////////// */}

<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('dadosDemonstracaoResultadoExercicio') + '2020'}
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
					<Box display='flex' flexDirection='row'>
		
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('despesasVendasAdministrativasGeraisOutras')}:`}
							value={soNumero(despesasVendasAdministrativasGeraisOutrasAnoTres.value)}
							onChange={event => setFieldValue('despesasVendasAdministrativasGeraisOutrasAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('despesasVendasAdministrativasGeraisOutrasAnoTres', true)}
							error={checkError(submitCount, metadataDespesasVendasAdministrativasGeraisOutrasAnoTres)}
							//disabled={disableEdit}
						/>
		
						</Box>


						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('custoProdutosVendidosMercadoriasVendidasServicosPrestados')}:`}
								value={soNumero(custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres.value)}
								onChange={event => setFieldValue('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres', true)}
								error={checkError(submitCount, metadataCustoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>
					
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('resultadoOperacionalBruto')}:`}
								value={soNumero(resultadoOperacionalBrutoAnoTres.value)}
								onChange={event => setFieldValue('resultadoOperacionalBrutoAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('resultadoOperacionalBrutoAnoTres', true)}
								error={checkError(submitCount, metadataResultadoOperacionalBrutoAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>

		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('despesasFinanceiras')}:`}
							value={soNumero(despesasFinanceirasAnoTres.value)}
							onChange={event => setFieldValue('despesasFinanceirasAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('despesasFinanceirasAnoTres', true)}
							error={checkError(submitCount, metadataDespesasFinanceirasAnoTres)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('receitasFinanceiras')}:`}
							value={soNumero(receitasFinanceirasAnoTres.value)}
							onChange={event => setFieldValue('receitasFinanceirasAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('receitasFinanceirasAnoTres', true)}
							error={checkError(submitCount, metadataReceitasFinanceirasAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('resultadoOperacionalAntesIrCssl')}:`}
							value={soNumero(resultadoOperacionalAntesIrCsslAnoTres.value)}
							onChange={event => setFieldValue('resultadoOperacionalAntesIrCsslAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('resultadoOperacionalAntesIrCsslAnoTres', true)}
							error={checkError(submitCount, metadataResultadoOperacionalAntesIrCsslAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('resultadoLiquidoPeriodo')}:`}
							value={soNumero(resultadoLiquidoPeriodoAnoTres.value)}
							onChange={event => setFieldValue('resultadoLiquidoPeriodoAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('resultadoLiquidoPeriodoAnoTres', true)}
							error={checkError(submitCount, metadataResultadoLiquidoPeriodoAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
							label={`${translate('receitaOperacionalLiquida')}:`}
							value={soNumero(receitaOperacionalLiquidaAnoTres.value)}
							onChange={event => setFieldValue('receitaOperacionalLiquidaAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('receitaOperacionalLiquidaAnoTres', true)}
							error={checkError(submitCount, metadataReceitaOperacionalLiquidaAnoTres)}
							//disabled={disableEdit}
						/>
		
						</Box>


					</Box>		
					
				</CardContent>
				</Card>




		</Box>
	);
}
