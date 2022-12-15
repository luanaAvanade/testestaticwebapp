import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Card, CardHeader, CardContent, Box } from '@material-ui/core';
import _ from 'lodash';
import { Button, Modal, FormInput } from 'react-axxiom';
import { moedaMask, moeda } from '@/utils/mascaras';
import { translate, translateWithHtml } from '@/locales';
import { checkError } from '@/utils/validation';
import theme from '@/theme';
import { BALANCO_PATRIMONIAL, ENUM_ITEMS_ANALISE } from '@/utils/constants';
import ObjectHelper from '@/utils/objectHelper';
import { soNumero } from '@/utils/mascaras';
import { CabecalhoHorizontal } from './style';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function DadosBalancoPatrimonial({
	dadosMocadoBalanco,
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
		{ codigo: '', label: '' }
	];

	const [
		cabecalho,
		setCabecalho
	] = useState(cabecalhoInicial);

	// Efeitos

	useEffect(() => {
		return () => {
			//limparFormulario();
		};
	}, []);

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



//////////////////////////////////////ANO 1/////////////////////////////////////////////////

	const [
		ativoTotal,
		metadataAtivoTotal
	] = getFieldProps('ativoTotal', 'text');

	const [
		circulanteAtivo,
		metadataCirculanteAtivo
	] = getFieldProps('circulanteAtivo', 'text');

	const [
		outrosAtivosCirculante,
		metadataOutrosAtivosCirculante
	] = getFieldProps('outrosAtivosCirculante', 'text');

	const [
		disponibilidades,
		metadataDisponibilidades
	] = getFieldProps('disponibilidades', 'text');

	const [
		estoques,
		metadataEstoques
	] = getFieldProps('estoques', 'text');

	const [
		ativoNaoCirculante,
		metadataAtivoNaoCirculante
	] = getFieldProps('ativoNaoCirculante', 'text');

	const [
		passivoTotal,
		metadataPassivoTotal
	] = getFieldProps('passivoTotal', 'text');

	const [
		circulantePassivo,
		metadataCirculantePassivo
	] = getFieldProps('circulantePassivo', 'text');
	
	const [
		emprestimosFinanciamentoCirculante,
		metadataEmprestimosFinanciamentoCirculante
	] = getFieldProps('emprestimosFinanciamentoCirculante', 'text');

	const [
		outrosPassivosCirculantes,
		metadataOutrosPassivosCirculantes
	] = getFieldProps('outrosPassivosCirculantes', 'text');

	const [
		naoCirculantePassivo,
		metadataNaoCirculantePassivo
	] = getFieldProps('naoCirculantePassivo', 'text');

	const [
		emprestimosFinanciamentoNaoCirculante,
		metadataEmprestimosFinanciamentoNaoCirculante
	] = getFieldProps('emprestimosFinanciamentoNaoCirculante', 'text');

	const [
		outrosPassivosNaoCirculantes,
		metadataOutrosPassivosNaoCirculantes
	] = getFieldProps('outrosPassivosNaoCirculantes', 'text');

	const [
		patrimonioLiquido,
		metadataPatrimonioLiquido
	] = getFieldProps('patrimonioLiquido', 'text');



	/////////////////////////////////////// ANO 2 /////////////////////////////////////////////


	const [
		ativoTotalAnoDois,
		metadataAtivoTotalAnoDois
	] = getFieldProps('ativoTotalAnoDois', 'text');

	const [
		circulanteAtivoAnoDois,
		metadataCirculanteAtivoAnoDois
	] = getFieldProps('circulanteAtivoAnoDois', 'text');

	const [
		outrosAtivosCirculanteAnoDois,
		metadataOutrosAtivosCirculanteAnoDois
	] = getFieldProps('outrosAtivosCirculanteAnoDois', 'text');

	const [
		disponibilidadesAnoDois,
		metadataDisponibilidadesAnoDois
	] = getFieldProps('disponibilidadesAnoDois', 'text');

	const [
		estoquesAnoDois,
		metadataEstoquesAnoDois
	] = getFieldProps('estoquesAnoDois', 'text');

	const [
		ativoNaoCirculanteAnoDois,
		metadataAtivoNaoCirculanteAnoDois
	] = getFieldProps('ativoNaoCirculanteAnoDois', 'text');

	const [
		passivoTotalAnoDois,
		metadataPassivoTotalAnoDois
	] = getFieldProps('passivoTotalAnoDois', 'text');

	const [
		circulantePassivoAnoDois,
		metadataCirculantePassivoAnoDois
	] = getFieldProps('circulantePassivoAnoDois', 'text');
	
	const [
		emprestimosFinanciamentoCirculanteAnoDois,
		metadataEmprestimosFinanciamentoCirculanteAnoDois
	] = getFieldProps('emprestimosFinanciamentoCirculanteAnoDois', 'text');

	const [
		outrosPassivosCirculantesAnoDois,
		metadataOutrosPassivosCirculantesAnoDois
	] = getFieldProps('outrosPassivosCirculantesAnoDois', 'text');

	const [
		naoCirculantePassivoAnoDois,
		metadataNaoCirculantePassivoAnoDois
	] = getFieldProps('naoCirculantePassivoAnoDois', 'text');

	const [
		emprestimosFinanciamentoNaoCirculanteAnoDois,
		metadataEmprestimosFinanciamentoNaoCirculanteAnoDois
	] = getFieldProps('emprestimosFinanciamentoNaoCirculanteAnoDois', 'text');

	const [
		outrosPassivosNaoCirculantesAnoDois,
		metadataOutrosPassivosNaoCirculantesAnoDois
	] = getFieldProps('outrosPassivosNaoCirculantesAnoDois', 'text');

	const [
		patrimonioLiquidoAnoDois,
		metadataPatrimonioLiquidoAnoDois
	] = getFieldProps('patrimonioLiquidoAnoDois', 'text');


	//////////////////////////////////////ANO 3/////////////////////////////////////////////////

	const [
		ativoTotalAnoTres,
		metadataAtivoTotalAnoTres
	] = getFieldProps('ativoTotalAnoTres', 'text');

	const [
		circulanteAtivoAnoTres,
		metadataCirculanteAtivoAnoTres
	] = getFieldProps('circulanteAtivoAnoTres', 'text');

	const [
		outrosAtivosCirculanteAnoTres,
		metadataOutrosAtivosCirculanteAnoTres
	] = getFieldProps('outrosAtivosCirculanteAnoTres', 'text');

	const [
		disponibilidadesAnoTres,
		metadataDisponibilidadesAnoTres
	] = getFieldProps('disponibilidadesAnoTres', 'text');

	const [
		estoquesAnoTres,
		metadataEstoquesAnoTres
	] = getFieldProps('estoquesAnoTres', 'text');

	const [
		ativoNaoCirculanteAnoTres,
		metadataAtivoNaoCirculanteAnoTres
	] = getFieldProps('ativoNaoCirculanteAnoTres', 'text');

	const [
		passivoTotalAnoTres,
		metadataPassivoTotalAnoTres
	] = getFieldProps('passivoTotalAnoTres', 'text');

	const [
		circulantePassivoAnoTres,
		metadataCirculantePassivoAnoTres
	] = getFieldProps('circulantePassivoAnoTres', 'text');
	
	const [
		emprestimosFinanciamentoCirculanteAnoTres,
		metadataEmprestimosFinanciamentoCirculanteAnoTres
	] = getFieldProps('emprestimosFinanciamentoCirculanteAnoTres', 'text');

	const [
		outrosPassivosCirculantesAnoTres,
		metadataOutrosPassivosCirculantesAnoTres
	] = getFieldProps('outrosPassivosCirculantesAnoTres', 'text');

	const [
		naoCirculantePassivoAnoTres,
		metadataNaoCirculantePassivoAnoTres
	] = getFieldProps('naoCirculantePassivoAnoTres', 'text');

	const [
		emprestimosFinanciamentoNaoCirculanteAnoTres,
		metadataEmprestimosFinanciamentoNaoCirculanteAnoTres
	] = getFieldProps('emprestimosFinanciamentoNaoCirculanteAnoTres', 'text');

	const [
		outrosPassivosNaoCirculantesAnoTres,
		metadataOutrosPassivosNaoCirculantesAnoTres
	] = getFieldProps('outrosPassivosNaoCirculantesAnoTres', 'text');

	const [
		patrimonioLiquidoAnoTres,
		metadataPatrimonioLiquidoAnoTres
	] = getFieldProps('patrimonioLiquidoAnoTres', 'text');


	
	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			<Modal
				open={openMsgErroRevisaoBalanco}
				handleClose={() => setOpenMsgErroRevisaoBalanco(false)}
				onClickButton={() => setOpenMsgErroRevisaoBalanco(false)}
				title={translate('revisaoDadosBalanco')}
				textButton={translate('ok')}
			>
				{/* <p>{erros}</p> */}
			</Modal>

				<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('Dados do Balanço Patrimonial 2022')}
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
					<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('ativoTotal')}:`}
								value={soNumero(ativoTotal.value)}
								onChange={event => setFieldValue('ativoTotal', event.target.value)}
								onFocus={() => setFieldTouched('ativoTotal', true)}
								error={checkError(submitCount, metadataAtivoTotal)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('circulanteAtivo')}:`}
								value={soNumero(circulanteAtivo.value)}
								onChange={event => setFieldValue('circulanteAtivo', event.target.value)}
								onFocus={() => setFieldTouched('circulanteAtivo', true)}
								error={checkError(submitCount, metadataCirculanteAtivo)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('outrosAtivosCirculante')}:`}
								value={soNumero(outrosAtivosCirculante.value)}
								onChange={event => setFieldValue('outrosAtivosCirculante', event.target.value)}
								onFocus={() => setFieldTouched('outrosAtivosCirculante', true)}
								error={checkError(submitCount, metadataOutrosAtivosCirculante)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('disponibilidades')}:`}
								value={soNumero(disponibilidades.value)}
								onChange={event => setFieldValue('disponibilidades', event.target.value)}
								onFocus={() => setFieldTouched('disponibilidades', true)}
								error={checkError(submitCount, metadataDisponibilidades)}
								//disabled={disableEdit}
							/>
						
						</Box>

						</Box>

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('estoques')}:`}
							value={soNumero(estoques.value)}
							onChange={event => setFieldValue('estoques', event.target.value)}
							onFocus={() => setFieldTouched('estoques', true)}
							error={checkError(submitCount, metadataEstoques)}
							//disabled={disableEdit}
						/>

						</Box>
		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('ativoNaoCirculante')}:`}
							value={soNumero(ativoNaoCirculante.value)}
							onChange={event => setFieldValue('ativoNaoCirculante', event.target.value)}
							onFocus={() => setFieldTouched('ativoNaoCirculante', true)}
							error={checkError(submitCount, metadataAtivoNaoCirculante)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('passivoTotal')}:`}
							value={soNumero(passivoTotal.value)}
							onChange={event => setFieldValue('passivoTotal', event.target.value)}
							onFocus={() => setFieldTouched('passivoTotal', true)}
							error={checkError(submitCount, metadataPassivoTotal)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('circulantePassivo')}:`}
							value={soNumero(circulantePassivo.value)}
							onChange={event => setFieldValue('circulantePassivo', event.target.value)}
							onFocus={() => setFieldTouched('circulantePassivo', true)}
							error={checkError(submitCount, metadataCirculantePassivo)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('emprestimosFinanciamentoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoCirculante.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoCirculante', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoCirculante', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoCirculante)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('emprestimosFinanciamentoNaoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoNaoCirculante.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoNaoCirculante', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoNaoCirculante', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoNaoCirculante)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosNaoCirculantes')}:`}
							value={soNumero(outrosPassivosNaoCirculantes.value)}
							onChange={event => setFieldValue('outrosPassivosNaoCirculantes', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosNaoCirculantes', true)}
							error={checkError(submitCount, metadataOutrosPassivosNaoCirculantes)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>		

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosCirculantes')}:`}
							value={soNumero(outrosPassivosCirculantes.value)}
							onChange={event => setFieldValue('outrosPassivosCirculantes', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosCirculantes', true)}
							error={checkError(submitCount, metadataOutrosPassivosCirculantes)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('naoCirculantePassivo')}:`}
							value={soNumero(naoCirculantePassivo.value)}
							onChange={event => setFieldValue('naoCirculantePassivo', event.target.value)}
							onFocus={() => setFieldTouched('naoCirculantePassivo', true)}
							error={checkError(submitCount, metadataNaoCirculantePassivo)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('patrimonioLiquido')}:`}
							value={soNumero(patrimonioLiquido.value)}
							onChange={event => setFieldValue('patrimonioLiquido', event.target.value)}
							onFocus={() => setFieldTouched('patrimonioLiquido', true)}
							error={checkError(submitCount, metadataPatrimonioLiquido)}
							//disabled={disableEdit}
						/>

						</Box>

						</Box>	
					
				</CardContent>
				</Card>







{/* /////////////////////////////////////////////////////////////////////////////////// */}






<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('Dados do Balanço Patrimonial 2021')}
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
					<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('ativoTotal')}:`}
								value={soNumero(ativoTotalAnoDois.value)}
								onChange={event => setFieldValue('ativoTotalAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('ativoTotalAnoDois', true)}
								error={checkError(submitCount, metadataAtivoTotalAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('circulanteAtivo')}:`}
								value={soNumero(circulanteAtivoAnoDois.value)}
								onChange={event => setFieldValue('circulanteAtivoAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('circulanteAtivoAnoDois', true)}
								error={checkError(submitCount, metadataCirculanteAtivoAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('outrosAtivosCirculante')}:`}
								value={soNumero(outrosAtivosCirculanteAnoDois.value)}
								onChange={event => setFieldValue('outrosAtivosCirculanteAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('outrosAtivosCirculanteAnoDois', true)}
								error={checkError(submitCount, metadataOutrosAtivosCirculanteAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('disponibilidades')}:`}
								value={soNumero(disponibilidadesAnoDois.value)}
								onChange={event => setFieldValue('disponibilidadesAnoDois', event.target.value)}
								onFocus={() => setFieldTouched('disponibilidadesAnoDois', true)}
								error={checkError(submitCount, metadataDisponibilidadesAnoDois)}
								//disabled={disableEdit}
							/>
						
						</Box>

						</Box>

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('estoques')}:`}
							value={soNumero(estoquesAnoDois.value)}
							onChange={event => setFieldValue('estoquesAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('estoquesAnoDois', true)}
							error={checkError(submitCount, metadataEstoquesAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>
		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('ativoNaoCirculante')}:`}
							value={soNumero(ativoNaoCirculanteAnoDois.value)}
							onChange={event => setFieldValue('ativoNaoCirculanteAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('ativoNaoCirculanteAnoDois', true)}
							error={checkError(submitCount, metadataAtivoNaoCirculanteAnoDois)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('passivoTotal')}:`}
							value={soNumero(passivoTotalAnoDois.value)}
							onChange={event => setFieldValue('passivoTotalAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('passivoTotalAnoDois', true)}
							error={checkError(submitCount, metadataPassivoTotalAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('circulantePassivo')}:`}
							value={soNumero(circulantePassivoAnoDois.value)}
							onChange={event => setFieldValue('circulantePassivoAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('circulantePassivoAnoDois', true)}
							error={checkError(submitCount, metadataCirculantePassivoAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('emprestimosFinanciamentoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoCirculanteAnoDois.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoCirculanteAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoCirculanteAnoDois', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoCirculanteAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('emprestimosFinanciamentoNaoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoNaoCirculanteAnoDois.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoNaoCirculanteAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoNaoCirculanteAnoDois', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoNaoCirculanteAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosNaoCirculantes')}:`}
							value={soNumero(outrosPassivosNaoCirculantesAnoDois.value)}
							onChange={event => setFieldValue('outrosPassivosNaoCirculantesAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosNaoCirculantesAnoDois', true)}
							error={checkError(submitCount, metadataOutrosPassivosNaoCirculantesAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>		

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosCirculantes')}:`}
							value={soNumero(outrosPassivosCirculantesAnoDois.value)}
							onChange={event => setFieldValue('outrosPassivosCirculantesAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosCirculantesAnoDois', true)}
							error={checkError(submitCount, metadataOutrosPassivosCirculantesAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('naoCirculantePassivo')}:`}
							value={soNumero(naoCirculantePassivoAnoDois.value)}
							onChange={event => setFieldValue('naoCirculantePassivoAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('naoCirculantePassivoAnoDois', true)}
							error={checkError(submitCount, metadataNaoCirculantePassivoAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('patrimonioLiquido')}:`}
							value={soNumero(patrimonioLiquidoAnoDois.value)}
							onChange={event => setFieldValue('patrimonioLiquidoAnoDois', event.target.value)}
							onFocus={() => setFieldTouched('patrimonioLiquidoAnoDois', true)}
							error={checkError(submitCount, metadataPatrimonioLiquidoAnoDois)}
							//disabled={disableEdit}
						/>

						</Box>

						</Box>	
					
				</CardContent>
				</Card>


{/* /////////////////////////////////////////////////////////////////////////////////// */}






<Card style={{ marginTop: 8 }}>
					<CardHeader
						title={translateWithHtml('Dados do Balanço Patrimonial 2020')}
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
					<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('ativoTotal')}:`}
								value={soNumero(ativoTotalAnoTres.value)}
								onChange={event => setFieldValue('ativoTotalAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('ativoTotalAnoTres', true)}
								error={checkError(submitCount, metadataAtivoTotalAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('circulanteAtivo')}:`}
								value={soNumero(circulanteAtivoAnoTres.value)}
								onChange={event => setFieldValue('circulanteAtivoAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('circulanteAtivoAnoTres', true)}
								error={checkError(submitCount, metadataCirculanteAtivoAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('outrosAtivosCirculante')}:`}
								value={soNumero(outrosAtivosCirculanteAnoTres.value)}
								onChange={event => setFieldValue('outrosAtivosCirculanteAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('outrosAtivosCirculanteAnoTres', true)}
								error={checkError(submitCount, metadataOutrosAtivosCirculanteAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>
		
						<FormInput
								label={`${translate('disponibilidades')}:`}
								value={soNumero(disponibilidadesAnoTres.value)}
								onChange={event => setFieldValue('disponibilidadesAnoTres', event.target.value)}
								onFocus={() => setFieldTouched('disponibilidadesAnoTres', true)}
								error={checkError(submitCount, metadataDisponibilidadesAnoTres)}
								//disabled={disableEdit}
							/>
						
						</Box>

						</Box>

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('estoques')}:`}
							value={soNumero(estoquesAnoTres.value)}
							onChange={event => setFieldValue('estoquesAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('estoquesAnoTres', true)}
							error={checkError(submitCount, metadataEstoquesAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>
		
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('ativoNaoCirculante')}:`}
							value={soNumero(ativoNaoCirculanteAnoTres.value)}
							onChange={event => setFieldValue('ativoNaoCirculanteAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('ativoNaoCirculanteAnoTres', true)}
							error={checkError(submitCount, metadataAtivoNaoCirculanteAnoTres)}
							//disabled={disableEdit}
						/>
		
						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('passivoTotal')}:`}
							value={soNumero(passivoTotalAnoTres.value)}
							onChange={event => setFieldValue('passivoTotalAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('passivoTotalAnoTres', true)}
							error={checkError(submitCount, metadataPassivoTotalAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('circulantePassivo')}:`}
							value={soNumero(circulantePassivoAnoTres.value)}
							onChange={event => setFieldValue('circulantePassivoAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('circulantePassivoAnoTres', true)}
							error={checkError(submitCount, metadataCirculantePassivoAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>

						<Box display='flex' flexDirection='row'>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

<						FormInput
							label={`${translate('emprestimosFinanciamentoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoCirculanteAnoTres.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoCirculanteAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoCirculanteAnoTres', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoCirculanteAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='35%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('emprestimosFinanciamentoNaoCirculante')}:`}
							value={soNumero(emprestimosFinanciamentoNaoCirculanteAnoTres.value)}
							onChange={event => setFieldValue('emprestimosFinanciamentoNaoCirculanteAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('emprestimosFinanciamentoNaoCirculanteAnoTres', true)}
							error={checkError(submitCount, metadataEmprestimosFinanciamentoNaoCirculanteAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='30%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosNaoCirculantes')}:`}
							value={soNumero(outrosPassivosNaoCirculantesAnoTres.value)}
							onChange={event => setFieldValue('outrosPassivosNaoCirculantesAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosNaoCirculantesAnoTres', true)}
							error={checkError(submitCount, metadataOutrosPassivosNaoCirculantesAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>
						</Box>		

						<Box display='flex' flexDirection='row'>
						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('outrosPassivosCirculantes')}:`}
							value={soNumero(outrosPassivosCirculantesAnoTres.value)}
							onChange={event => setFieldValue('outrosPassivosCirculantesAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('outrosPassivosCirculantesAnoTres', true)}
							error={checkError(submitCount, metadataOutrosPassivosCirculantesAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('naoCirculantePassivo')}:`}
							value={soNumero(naoCirculantePassivoAnoTres.value)}
							onChange={event => setFieldValue('naoCirculantePassivoAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('naoCirculantePassivoAnoTres', true)}
							error={checkError(submitCount, metadataNaoCirculantePassivoAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						<Box width='25%' paddingRight={`${theme.spacing(1)}px`}>

						<FormInput
							label={`${translate('patrimonioLiquido')}:`}
							value={soNumero(patrimonioLiquidoAnoTres.value)}
							onChange={event => setFieldValue('patrimonioLiquidoAnoTres', event.target.value)}
							onFocus={() => setFieldTouched('patrimonioLiquidoAnoTres', true)}
							error={checkError(submitCount, metadataPatrimonioLiquidoAnoTres)}
							//disabled={disableEdit}
						/>

						</Box>

						</Box>	
					
				</CardContent>
				</Card>				


		</Box>
	);
}
