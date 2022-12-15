import React, { useState, Fragment, useEffect } from 'react';
import _ from 'lodash';
import { useFormik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Confirm, Button, Card, Modal } from 'react-axxiom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { translate, translateWithHtml } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackSuccess, snackError } from '@/utils/snack';
import DadosBalancoPatrimonial from './dadosBalancoPatrimonial';
import EmpresaService from '@/services/empresa';
import DadosDRE from './dadosDRE';
import {
	BALANCO_PATRIMONIAL,
	DRE,
	COMANDO_CADASTRO_FORNECEDOR,
	SUBDIRETORIO_LINK,
	TAB_DADOS_FINANCEIROS
} from '@/utils/constants';
import ObjectHelper from '@/utils/objectHelper';
import { getDisableEdit, getStatusItem } from '../aprovacao/util';

export default function DadosFinanceiros({
	empresaId,
	setEmpresaId,
	empresa,
	preCadastro,
	itensAnalise,
	setItensAnalise,
	getAnaliseCadastro,
	comentarios,
	setComentarios,
	getComentarios,
	setDadosFinanceirosIsValid,
	setBalancoPatrimonialIsValid,
	setBalancoDREIsValid,
	listTermosAceiteEmpresa,
	setListTermosAceiteEmpresa,
	erroTermoAceite,
	setErroTermoAceite,
	getTermoNaoAceitos,
	user,
	acao,
	acaoCadastroFinanceiro,
	setAcaoCadastroFinanceiro,
	tab,
	setAcao,
	setChanged
}) {
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const dadosMocadoBalanco = 
		{
			DataReferencia: Date.now,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			OutrosAtivosCirculante: 0,
			Disponibilidades: 0,
			Estoques: 0,
			AtivoNaoCirculante: 0,
			PassivoTotal: 0,
			CirculantePassivo: 0,
			EmprestimosFinanciamentoCirculante: 0,
			OutrosPassivosCirculantes: 0,
			NaoCirculantePassivo: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			OutrosPassivosNaoCirculantes: 0,
			PatrimonioLiquido: 0
		};

		const dadosBalancoAnoUm = 
		{
			DataReferencia: Date.now,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			OutrosAtivosCirculante: 0,
			Disponibilidades: 0,
			Estoques: 0,
			AtivoNaoCirculante: 0,
			PassivoTotal: 0,
			CirculantePassivo: 0,
			EmprestimosFinanciamentoCirculante: 0,
			OutrosPassivosCirculantes: 0,
			NaoCirculantePassivo: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			OutrosPassivosNaoCirculantes: 0,
			PatrimonioLiquido: 0
		};

		const dadosBalancoAnoDois = 
		{
			DataReferencia: Date.now,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			OutrosAtivosCirculante: 0,
			Disponibilidades: 0,
			Estoques: 0,
			AtivoNaoCirculante: 0,
			PassivoTotal: 0,
			CirculantePassivo: 0,
			EmprestimosFinanciamentoCirculante: 0,
			OutrosPassivosCirculantes: 0,
			NaoCirculantePassivo: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			OutrosPassivosNaoCirculantes: 0,
			PatrimonioLiquido: 0
		};

		const dadosBalancoAnoTres = 
		{
			DataReferencia: Date.now,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			OutrosAtivosCirculante: 0,
			Disponibilidades: 0,
			Estoques: 0,
			AtivoNaoCirculante: 0,
			PassivoTotal: 0,
			CirculantePassivo: 0,
			EmprestimosFinanciamentoCirculante: 0,
			OutrosPassivosCirculantes: 0,
			NaoCirculantePassivo: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			OutrosPassivosNaoCirculantes: 0,
			PatrimonioLiquido: 0
		};


	const dadosDREAnoUm = 
		{
			DataReferencia: Date.now,
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		};


	const dadosDREAnoDois = 
		{
			DataReferencia: Date.now,
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		};

	
    const dadosDREAnoTres = 
		{
			DataReferencia: Date.now,
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		};




	// Estado Local

	const [
		retornoRobo,
		setRetornoRobo
	] = useState(false);

	const [
		openMsgErroRevisaoBalanco,
		setOpenMsgErroRevisaoBalanco
	] = useState(false);

	const [
		openMsgErroRevisaoDRE,
		setOpenMsgErroRevisaoDRE
	] = useState(false);

	const [
		key,
		setKey
	] = useState(0);

	const [
		erros,
		setErros
	] = useState(translate('dadosLancadosContemErro'));

	// Efeitos
	useEffect(() => {
		//empresaFindById();
		if (empresa) {
			//setDadosEmpresa(empresa);
			//if (empresa.Documentos.length > 0) {
			//	setDocumentos(empresa.Documentos);
			//}
		}
		//setDadosEmpresa();
		return () => {
			//limparFormulario();
		};
	}, []);


	useEffect(
		() => {
			if (empresa) {
				setDadosFinanceiros(empresa);
			}
		},
		[
			empresa
		]
	);

	useEffect(
		() => {
			if ((acao && acao !== null && tab === TAB_DADOS_FINANCEIROS) || (acaoCadastroFinanceiro && acaoCadastroFinanceiro !== null)
			&& (acao !== COMANDO_CADASTRO_FORNECEDOR.validar)
			) {
				var acaoExecutar = null;

				if(acao && acao !== null) {
					acaoExecutar = acao;
				}
				else{
					acaoExecutar = acaoCadastroFinanceiro;
				}
				switch (acaoExecutar) {
					case COMANDO_CADASTRO_FORNECEDOR.criarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.enviarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.reprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarRessalvasCadastro:
						//verificarErrosFinanceiros();
						handleSubmit();
						break;
					case COMANDO_CADASTRO_FORNECEDOR.salvar:
						update();
						break;
				}
				setAcao(null);
				setAcaoCadastroFinanceiro(null);
			}
			if (acaoCadastroFinanceiro && acaoCadastroFinanceiro === COMANDO_CADASTRO_FORNECEDOR.validar && !isValid) {
				update();
			}
			if (acaoCadastroFinanceiro === COMANDO_CADASTRO_FORNECEDOR.descartarAlteracoes) {
				//setDadosEmpresa(empresa);
				//setDadosFinanceirosIsValid(isValid);
			}
		},
		[
			acaoCadastroFinanceiro
		]
	);

	const empresaFindById = async () => {
		try {
			const response = await EmpresaService.findById(empresaId);
			if (response.data && response.data.Empresa_list.length > 0) {
				setDadosFinanceiros(response.data.Empresa_list[0]);
				dispatch(LoaderCreators.disableLoading());
			} else {
				dispatch(LoaderCreators.disableLoading());
				//callbackError(translate('erroCarregamentoDadosEmpresa'));
			}
			dispatch(LoaderCreators.disableLoading());
		} catch (error) {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const limparFormulario = () => {
		resetForm(initialValues);
	};


	// Formulário

	const initialValues = {
		receitaOperacionalLiquida: '',
		custoProdutosVendidosMercadoriasVendidasServicosPrestados: '',
		resultadoOperacionalBruto: '',
		despesasVendasAdministrativasGeraisOutras: '',
		despesasFinanceiras: '',
		receitasFinanceiras: '',
		resultadoOperacionalAntesIrCssl: '',
		resultadoLiquidoPeriodo: '',



		receitaOperacionalLiquidaAnoDois: '',
		custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois: '',
		resultadoOperacionalBrutoAnoDois: '',
		despesasVendasAdministrativasGeraisOutrasAnoDois: '',
		despesasFinanceirasAnoDois: '',
		receitasFinanceirasAnoDois: '',
		resultadoOperacionalAntesIrCsslAnoDois: '',
		resultadoLiquidoPeriodoAnoDois: '',



		receitaOperacionalLiquidaAnoTres: '',
		custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres: '',
		resultadoOperacionalBrutoAnoTres: '',
		despesasVendasAdministrativasGeraisOutrasAnoTres: '',
		despesasFinanceirasAnoTres: '',
		receitasFinanceirasAnoTres: '',
		resultadoOperacionalAntesIrCsslAnoTres: '',
		resultadoLiquidoPeriodoAnoTres: '',


		ativoTotal: '',
		circulanteAtivo: '',
		outrosAtivosCirculante: '',
		disponibilidades: '',
		estoques: '',
		ativoNaoCirculante: '',
		passivoTotal: '',
		circulantePassivo: '',
		emprestimosFinanciamentoCirculante: '',
		outrosPassivosCirculantes: '',
		naoCirculantePassivo: '',
		emprestimosFinanciamentoNaoCirculante: '',
		outrosPassivosNaoCirculantes: '',
		patrimonioLiquido: '',

		ativoTotalAnoDois: '',
		circulanteAtivoAnoDois: '',
		outrosAtivosCirculanteAnoDois: '',
		disponibilidadesAnoDois: '',
		estoquesAnoDois: '',
		ativoNaoCirculanteAnoDois: '',
		passivoTotalAnoDois: '',
		circulantePassivoAnoDois: '',
		emprestimosFinanciamentoCirculanteAnoDois: '',
		outrosPassivosCirculantesAnoDois: '',
		naoCirculantePassivoAnoDois: '',
		emprestimosFinanciamentoNaoCirculanteAnoDois: '',
		outrosPassivosNaoCirculantesAnoDois: '',
		patrimonioLiquidoAnoDois: '',


		ativoTotalAnoTres: '',
		circulanteAtivoAnoTres: '',
		outrosAtivosCirculanteAnoTres: '',
		disponibilidadesAnoTres: '',
		estoquesAnoTres: '',
		ativoNaoCirculanteAnoTres: '',
		passivoTotalAnoTres: '',
		circulantePassivoAnoTres: '',
		emprestimosFinanciamentoCirculanteAnoTres: '',
		outrosPassivosCirculantesAnoTres: '',
		naoCirculantePassivoAnoTres: '',
		emprestimosFinanciamentoNaoCirculanteAnoTres: '',
		outrosPassivosNaoCirculantesAnoTres: '',
		patrimonioLiquidoAnoTres: '',


		dadosBalancoPatrimonialList: [],
		dadosDREList: [],
		documentacao: []
	};


	const getDREAnoUmList = () => {
		dadosDREAnoUm.DataReferencia= Date.now;
		dadosDREAnoUm.ReceitaOperacionalLiquida=receitaOperacionalLiquida;
		dadosDREAnoUm.CustoProdutosVendidosMercadoriasVendidasServicosPrestados= custoProdutosVendidosMercadoriasVendidasServicosPrestados;
		dadosDREAnoUm.ResultadoOperacionalBruto= resultadoOperacionalBruto;
		dadosDREAnoUm.DespesasVendasAdministrativasGeraisOutras= despesasVendasAdministrativasGeraisOutras;
		dadosDREAnoUm.DespesasFinanceiras= despesasFinanceiras;
		dadosDREAnoUm.ReceitasFinanceiras= receitasFinanceiras;
		dadosDREAnoUm.ResultadoOperacionalAntesIrCssl= resultadoOperacionalAntesIrCssl;
		dadosDREAnoUm.ResultadoLiquidoPeriodo= resultadoLiquidoPeriodo;
		return dadosDREAnoUm;
	}


	const getDREAnoDoisList = () => {
		dadosDREAnoDois.DataReferencia= Date.now;
		dadosDREAnoDois.ReceitaOperacionalLiquida=receitaOperacionalLiquidaAnoDois;
		dadosDREAnoDois.CustoProdutosVendidosMercadoriasVendidasServicosPrestados= custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois;
		dadosDREAnoDois.ResultadoOperacionalBruto= resultadoOperacionalBrutoAnoDois;
		dadosDREAnoDois.DespesasVendasAdministrativasGeraisOutras= despesasVendasAdministrativasGeraisOutrasAnoDois;
		dadosDREAnoDois.DespesasFinanceiras= despesasFinanceirasAnoDois;
		dadosDREAnoDois.ReceitasFinanceiras= receitasFinanceirasAnoDois;
		dadosDREAnoDois.ResultadoOperacionalAntesIrCssl= resultadoOperacionalAntesIrCsslAnoDois;
		dadosDREAnoDois.ResultadoLiquidoPeriodo= resultadoLiquidoPeriodoAnoDois;
		return dadosDREAnoDois;
	}


	const getDREAnoTresList = () => {
		dadosDREAnoTres.DataReferencia= Date.now;
		dadosDREAnoTres.ReceitaOperacionalLiquida=receitaOperacionalLiquidaAnoTres;
		dadosDREAnoTres.CustoProdutosVendidosMercadoriasVendidasServicosPrestados= custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres;
		dadosDREAnoTres.ResultadoOperacionalBruto= resultadoOperacionalBrutoAnoTres;
		dadosDREAnoTres.DespesasVendasAdministrativasGeraisOutras= despesasVendasAdministrativasGeraisOutrasAnoTres;
		dadosDREAnoTres.DespesasFinanceiras= despesasFinanceirasAnoTres;
		dadosDREAnoTres.ReceitasFinanceiras= receitasFinanceirasAnoTres;
		dadosDREAnoTres.ResultadoOperacionalAntesIrCssl= resultadoOperacionalAntesIrCsslAnoTres;
		dadosDREAnoTres.ResultadoLiquidoPeriodo= resultadoLiquidoPeriodoAnoTres;
		return dadosDREAnoTres;
	}


	const getBalancoPatrimonialAnoUmList = () => {

		dadosBalancoAnoUm.DataReferencia = Date.now;
		dadosBalancoAnoUm.AtivoTotal = ativoTotal;
		dadosBalancoAnoUm.CirculanteAtivo = circulanteAtivo;
		dadosBalancoAnoUm.OutrosAtivosCirculante= outrosAtivosCirculante;
		dadosBalancoAnoUm.Disponibilidades= disponibilidades;
		dadosBalancoAnoUm.Estoques= estoques;
		dadosBalancoAnoUm.AtivoNaoCirculante= ativoNaoCirculante;
		dadosBalancoAnoUm.PassivoTotal= passivoTotal;
		dadosBalancoAnoUm.CirculantePassivo= circulantePassivo;
		dadosBalancoAnoUm.EmprestimosFinanciamentoCirculante= emprestimosFinanciamentoCirculante;
		dadosBalancoAnoUm.OutrosPassivosCirculantes= outrosPassivosCirculantes;
		dadosBalancoAnoUm.NaoCirculantePassivo= naoCirculantePassivo;
		dadosBalancoAnoUm.EmprestimosFinanciamentoNaoCirculante= emprestimosFinanciamentoNaoCirculante;
		dadosBalancoAnoUm.OutrosPassivosNaoCirculantes= outrosPassivosNaoCirculantes;
		dadosBalancoAnoUm.PatrimonioLiquido= patrimonioLiquido;


		return dadosBalancoAnoUm;
	}

	const getBalancoPatrimonialAnoDoisList = () => {

		dadosBalancoAnoDois.DataReferencia = Date.now;
		dadosBalancoAnoDois.AtivoTotal = ativoTotalAnoDois;
		dadosBalancoAnoDois.CirculanteAtivo = circulanteAtivoAnoDois;
		dadosBalancoAnoDois.OutrosAtivosCirculante= outrosAtivosCirculanteAnoDois;
		dadosBalancoAnoDois.Disponibilidades= disponibilidadesAnoDois;
		dadosBalancoAnoDois.Estoques= estoquesAnoDois;
		dadosBalancoAnoDois.AtivoNaoCirculante= ativoNaoCirculanteAnoDois;
		dadosBalancoAnoDois.PassivoTotal= passivoTotalAnoDois;
		dadosBalancoAnoDois.CirculantePassivo= circulantePassivoAnoDois;
		dadosBalancoAnoDois.EmprestimosFinanciamentoCirculante= emprestimosFinanciamentoCirculanteAnoDois;
		dadosBalancoAnoDois.OutrosPassivosCirculantes= outrosPassivosCirculantesAnoDois;
		dadosBalancoAnoDois.NaoCirculantePassivo= naoCirculantePassivoAnoDois;
		dadosBalancoAnoDois.EmprestimosFinanciamentoNaoCirculante= emprestimosFinanciamentoNaoCirculanteAnoDois;
		dadosBalancoAnoDois.OutrosPassivosNaoCirculantes= outrosPassivosNaoCirculantesAnoDois;
		dadosBalancoAnoDois.PatrimonioLiquido= patrimonioLiquidoAnoDois;


		return dadosBalancoAnoDois;
	}

	const getBalancoPatrimonialAnoTresList = () => {

		dadosBalancoAnoTres.DataReferencia = Date.now;
		dadosBalancoAnoTres.AtivoTotal = ativoTotalAnoTres;
		dadosBalancoAnoTres.CirculanteAtivo = circulanteAtivoAnoTres;
		dadosBalancoAnoTres.OutrosAtivosCirculante= outrosAtivosCirculanteAnoTres;
		dadosBalancoAnoTres.Disponibilidades= disponibilidadesAnoTres;
		dadosBalancoAnoTres.Estoques= estoquesAnoTres;
		dadosBalancoAnoTres.AtivoNaoCirculante= ativoNaoCirculanteAnoTres;
		dadosBalancoAnoTres.PassivoTotal= passivoTotalAnoTres;
		dadosBalancoAnoTres.CirculantePassivo= circulantePassivoAnoTres;
		dadosBalancoAnoTres.EmprestimosFinanciamentoCirculante= emprestimosFinanciamentoCirculanteAnoTres;
		dadosBalancoAnoTres.OutrosPassivosCirculantes= outrosPassivosCirculantesAnoTres;
		dadosBalancoAnoTres.NaoCirculantePassivo= naoCirculantePassivoAnoTres;
		dadosBalancoAnoTres.EmprestimosFinanciamentoNaoCirculante= emprestimosFinanciamentoNaoCirculanteAnoTres;
		dadosBalancoAnoTres.OutrosPassivosNaoCirculantes= outrosPassivosNaoCirculantesAnoTres;
		dadosBalancoAnoTres.PatrimonioLiquido= patrimonioLiquidoAnoTres;


		return dadosBalancoAnoTres;
	}

	const test = docList => {
		if (docList.length > 0) {
			let retorno = [];
			docList.forEach(documento => {
				if (documento.files.length > 0) {
					retorno.push('contem');
				} else {
					retorno.push('naoContem');
				}
			});
			return !retorno.includes('naoContem');
		}
		return false;
	};

	const validationSchema = Yup.object().shape({
		ativoTotal: Yup.string().required(translate('campoObrigatorio')),
		circulanteAtivo: Yup.string().required(translate('campoObrigatorio')),
		outrosAtivosCirculante: Yup.string().required(translate('campoObrigatorio')),
		disponibilidades: Yup.string().required(translate('campoObrigatorio')),
		estoques: Yup.string().required(translate('campoObrigatorio')),	
		ativoNaoCirculante: Yup.string().required(translate('campoObrigatorio')),
		passivoTotal: Yup.string().required(translate('campoObrigatorio')),
		circulantePassivo: Yup.string().required(translate('campoObrigatorio')),
		emprestimosFinanciamentoCirculante: Yup.string().required(translate('campoObrigatorio')),	
		outrosPassivosCirculantes: Yup.string().required(translate('campoObrigatorio')),
		naoCirculantePassivo: Yup.string().required(translate('campoObrigatorio')),
		emprestimosFinanciamentoNaoCirculante: Yup.string().required(translate('campoObrigatorio')),
		outrosPassivosNaoCirculantes: Yup.string().required(translate('campoObrigatorio')),	
		patrimonioLiquido: Yup.string().required(translate('campoObrigatorio')),
		receitaOperacionalLiquida: Yup.string().required(translate('campoObrigatorio')),
		custoProdutosVendidosMercadoriasVendidasServicosPrestados: Yup.string().required(translate('campoObrigatorio')),
		resultadoOperacionalBruto: Yup.string().required(translate('campoObrigatorio')),	
		despesasVendasAdministrativasGeraisOutras: Yup.string().required(translate('campoObrigatorio')),
		despesasFinanceiras: Yup.string().required(translate('campoObrigatorio')),
		receitasFinanceiras: Yup.string().required(translate('campoObrigatorio')),
		resultadoOperacionalAntesIrCssl: Yup.string().required(translate('campoObrigatorio')),	
		resultadoLiquidoPeriodo: Yup.string().required(translate('campoObrigatorio'))
	});



	const {
		handleSubmit,
		isValid,
		submitCount,
		setFieldValue,
		setFieldTouched,
		getFieldProps,
		values,
		errors,
		resetForm,
		setValues,
		touched
	} = useFormik({
		initialValues,
		validationSchema,
		onSubmit: () => save()
	});

	useEffect(
		() => {
			setDadosFinanceirosIsValid(isValid);
		},
		[
			isValid
		]
	);

	useEffect(
		() => {
			if (preCadastro && !_.isEmpty(touched)) {
				setChanged(true);
			}
		},
		[
			touched
		]
	);

	const { 
		dadosBalancoPatrimonialList, 
		dadosDREList, 

		receitaOperacionalLiquida,
		custoProdutosVendidosMercadoriasVendidasServicosPrestados,
		resultadoOperacionalBruto,
		despesasVendasAdministrativasGeraisOutras,
		despesasFinanceiras,
		receitasFinanceiras,
		resultadoOperacionalAntesIrCssl,
		resultadoLiquidoPeriodo,


		receitaOperacionalLiquidaAnoDois,
		custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoDois,
		resultadoOperacionalBrutoAnoDois,
		despesasVendasAdministrativasGeraisOutrasAnoDois,
		despesasFinanceirasAnoDois,
		receitasFinanceirasAnoDois,
		resultadoOperacionalAntesIrCsslAnoDois,
		resultadoLiquidoPeriodoAnoDois,



		receitaOperacionalLiquidaAnoTres,
		custoProdutosVendidosMercadoriasVendidasServicosPrestadosAnoTres,
		resultadoOperacionalBrutoAnoTres,
		despesasVendasAdministrativasGeraisOutrasAnoTres,
		despesasFinanceirasAnoTres,
		receitasFinanceirasAnoTres,
		resultadoOperacionalAntesIrCsslAnoTres,
		resultadoLiquidoPeriodoAnoTres,


		ativoTotalAnoDois,
		outrosAtivosCirculanteAnoDois,
		disponibilidadesAnoDois,
		estoquesAnoDois,
		ativoNaoCirculanteAnoDois,
		passivoTotalAnoDois,
		circulantePassivoAnoDois,
		emprestimosFinanciamentoCirculanteAnoDois,
		outrosPassivosCirculantesAnoDois,
		naoCirculantePassivoAnoDois,
		emprestimosFinanciamentoNaoCirculanteAnoDois,
		outrosPassivosNaoCirculantesAnoDois,
		patrimonioLiquidoAnoDois,
		circulanteAtivoAnoDois,




		ativoTotalAnoTres,
		outrosAtivosCirculanteAnoTres,
		disponibilidadesAnoTres,
		estoquesAnoTres,
		ativoNaoCirculanteAnoTres,
		passivoTotalAnoTres,
		circulantePassivoAnoTres,
		emprestimosFinanciamentoCirculanteAnoTres,
		outrosPassivosCirculantesAnoTres,
		naoCirculantePassivoAnoTres,
		emprestimosFinanciamentoNaoCirculanteAnoTres,
		outrosPassivosNaoCirculantesAnoTres,
		patrimonioLiquidoAnoTres,
		circulanteAtivoAnoTres,


		ativoTotal,
		outrosAtivosCirculante,
		disponibilidades,
		estoques,
		ativoNaoCirculante,
		passivoTotal,
		circulantePassivo,
		emprestimosFinanciamentoCirculante,
		outrosPassivosCirculantes,
		naoCirculantePassivo,
		emprestimosFinanciamentoNaoCirculante,
		outrosPassivosNaoCirculantes,
		patrimonioLiquido,
		circulanteAtivo
	} = values;


	// Ações da Tela

	const setDadosFinanceiros = dados => {
		
		if(dados && dados.DadosDREs && dados.DadosDREs != null && dados.DadosDREs.length > 0){
			var item = dados.DadosDREs[0];			
				setFieldValue('receitaOperacionalLiquida', '"'+ item.ReceitaOperacionalLiquida + '"');
				setFieldValue('custoProdutosVendidosMercadoriasVendidasServicosPrestados', '"'+ item.CustoProdutosVendidosMercadoriasVendidasServicosPrestados+ '"');
				setFieldValue('resultadoOperacionalBruto', '"'+ item.ResultadoOperacionalBruto);
				setFieldValue('despesasVendasAdministrativasGeraisOutras', '"'+ item.DespesasVendasAdministrativasGeraisOutras+ '"');
				setFieldValue('despesasFinanceiras', '"'+ item.DespesasFinanceiras+ '"');
				setFieldValue('receitasFinanceiras', '"'+ item.ReceitasFinanceiras+ '"');
				setFieldValue('resultadoOperacionalAntesIrCssl', '"'+ item.ResultadoOperacionalAntesIrCssl+ '"');
				setFieldValue('resultadoLiquidoPeriodo', '"'+ item.ResultadoLiquidoPeriodo+ '"');				
		}
	
			
		if(dados && dados.DadosBalancosPatrimoniais && dados.DadosBalancosPatrimoniais != null && dados.DadosBalancosPatrimoniais.length > 0){
			var itemBalanco = dados.DadosBalancosPatrimoniais[0];
					
			setFieldValue('ativoTotal', '"'+ itemBalanco.AtivoTotal + '"');
			setFieldValue('outrosAtivosCirculante', '"'+ itemBalanco.OutrosAtivosCirculante+ '"');
			setFieldValue('disponibilidades', '"'+ itemBalanco.Disponibilidades);
			setFieldValue('estoques', '"'+ itemBalanco.Estoques+ '"');
			setFieldValue('ativoNaoCirculante', '"'+ itemBalanco.AtivoNaoCirculante+ '"');
			setFieldValue('passivoTotal', '"'+ itemBalanco.PassivoTotal+ '"');
			setFieldValue('circulantePassivo', '"'+ itemBalanco.CirculantePassivo+ '"');
			setFieldValue('emprestimosFinanciamentoCirculante', '"'+ itemBalanco.EmprestimosFinanciamentoCirculante+ '"');		
			setFieldValue('outrosPassivosCirculantes', '"'+ itemBalanco.OutrosPassivosCirculantes+ '"');
			setFieldValue('naoCirculantePassivo', '"'+ itemBalanco.NaoCirculantePassivo+ '"');
			setFieldValue('emprestimosFinanciamentoNaoCirculante', '"'+ itemBalanco.EmprestimosFinanciamentoNaoCirculante+ '"');
			setFieldValue('outrosPassivosNaoCirculantes', '"'+ itemBalanco.OutrosPassivosNaoCirculantes+ '"');		
			setFieldValue('patrimonioLiquido', '"'+ itemBalanco.PatrimonioLiquido+ '"');
			setFieldValue('circulanteAtivo', '"'+ itemBalanco.CirculanteAtivo+ '"');		

		}
	
	};

	const montarLista = (lista, listaColuna) => {
		const list = ObjectHelper.clone(lista);

		listaColuna.forEach(coluna => {
			list.forEach(balanco => {
				balanco[coluna.codigo] = {
					value: balanco[coluna.codigo],
					modificado: balanco[coluna.codigo] == null,
					erro: false
				};
			});
		});
					//dadosBalancoPatrimonialList.values = list;
	};

	const getDadosBalancoPatrimonialList = () => {
		// validar se tem id
		const list = [];
		values.dadosBalancoPatrimonialList.forEach(dbp => {
			list.push({
				Id: dbp.Id === '' ? 0 : dbp.Id,
				AtivoNaoCirculante: dbp.AtivoNaoCirculante.value === '' ? 0 : dbp.AtivoNaoCirculante.value,
				AtivoTotal: dbp.AtivoTotal.value === '' ? 0 : dbp.AtivoTotal.value,
				CirculanteAtivo: dbp.CirculanteAtivo.value === '' ? 0 : dbp.CirculanteAtivo.value,
				CirculantePassivo: dbp.CirculantePassivo.value === '' ? 0 : dbp.CirculantePassivo.value,
				Disponibilidades: dbp.Disponibilidades.value === '' ? 0 : dbp.Disponibilidades.value,
				EmprestimosFinanciamentoCirculante:
					dbp.EmprestimosFinanciamentoCirculante.value === ''
						? 0
						: dbp.EmprestimosFinanciamentoCirculante.value,
				EmprestimosFinanciamentoNaoCirculante:
					dbp.EmprestimosFinanciamentoNaoCirculante.value === ''
						? 0
						: dbp.EmprestimosFinanciamentoNaoCirculante.value,
				Estoques: dbp.Estoques.value === '' ? 0 : dbp.Estoques.value,
				NaoCirculantePassivo:
					dbp.NaoCirculantePassivo.value === '' ? 0 : dbp.NaoCirculantePassivo.value,
				OutrosAtivosCirculante:
					dbp.OutrosAtivosCirculante.value === '' ? 0 : dbp.OutrosAtivosCirculante.value,
				OutrosPassivosCirculantes:
					dbp.OutrosPassivosCirculantes.value === '' ? 0 : dbp.OutrosPassivosCirculantes.value,
				OutrosPassivosNaoCirculantes:
					dbp.OutrosPassivosNaoCirculantes.value === ''
						? 0
						: dbp.OutrosPassivosNaoCirculantes.value,
				PassivoTotal: dbp.PassivoTotal.value === '' ? 0 : dbp.PassivoTotal.value,
				PatrimonioLiquido: dbp.PatrimonioLiquido.value === '' ? 0 : dbp.PatrimonioLiquido.value
			});
		});
		return list;
	};

	const getDadosDREList = () => {
		const list = [];
		values.dadosDREList.forEach(dd => {
			list.push({
				Id: dd.Id === '' ? 0 : dd.Id,
				ReceitaOperacionalLiquida:
					dd.ReceitaOperacionalLiquida.value === '' ? 0 : dd.ReceitaOperacionalLiquida.value,
				CustoProdutosVendidosMercadoriasVendidasServicosPrestados:
					dd.CustoProdutosVendidosMercadoriasVendidasServicosPrestados.value === ''
						? 0
						: dd.CustoProdutosVendidosMercadoriasVendidasServicosPrestados.value,
				ResultadoOperacionalBruto:
					dd.ResultadoOperacionalBruto.value === '' ? 0 : dd.ResultadoOperacionalBruto.value,
				DespesasVendasAdministrativasGeraisOutras:
					dd.DespesasVendasAdministrativasGeraisOutras.value === ''
						? 0
						: dd.DespesasVendasAdministrativasGeraisOutras.value,
				DespesasFinanceiras: dd.DespesasFinanceiras.value === '' ? 0 : dd.DespesasFinanceiras.value,
				ReceitasFinanceiras: dd.ReceitasFinanceiras.value === '' ? 0 : dd.ReceitasFinanceiras.value,
				ResultadoOperacionalAntesIrCssl:
					dd.ResultadoOperacionalAntesIrCssl.value === ''
						? 0
						: dd.ResultadoOperacionalAntesIrCssl.value,
				ResultadoLiquidoPeriodo:
					dd.ResultadoLiquidoPeriodo.value === '' ? 0 : dd.ResultadoLiquidoPeriodo.value
			});
		});
		return list;
	};

	const getDadosFinanceiros = () => {
		const url = `${document.location.origin}${SUBDIRETORIO_LINK}`;
        var dreList = [];
		var balancoPatrimonialList = [];

		var retornoDreAnoUm = getDREAnoUmList();
		var retornoDreAnoDois = getDREAnoDoisList();
		var retornoDreAnoTres = getDREAnoTresList();
		var retornoBalancoPatrimonialAnoUm = getBalancoPatrimonialAnoUmList();
		var retornoBalancoPatrimonialAnoDois = getBalancoPatrimonialAnoDoisList();
		var retornoBalancoPatrimonialAnoTres = getBalancoPatrimonialAnoTresList();

		dreList.push(retornoDreAnoUm);
		dreList.push(retornoDreAnoDois);
		dreList.push(retornoDreAnoTres);
		balancoPatrimonialList.push(retornoBalancoPatrimonialAnoUm);
		balancoPatrimonialList.push(retornoBalancoPatrimonialAnoDois);
		balancoPatrimonialList.push(retornoBalancoPatrimonialAnoTres);		
		return {
			DadosBalancosPatrimoniais: balancoPatrimonialList,
			AnaliseCadastro: getAnaliseCadastro(),
			DadosDREs: dreList
		};
	};

	
	// método que trata e exibe a mensagem de sucesso
	const callbackMensagemSucesso = async () => {
		if (acao == COMANDO_CADASTRO_FORNECEDOR.enviarCadastro) {
			callback(translateWithHtml('fornecedorAtualizadoSucesso'));
		} else {
			if (preCadastro) {
				callback(translateWithHtml('fornecedorCadatradoSucesso'));
			} else {
				callback(translateWithHtml('cadastroSalvoComSucesso'));
			}
		}
	};

	const save = () => {
		if (isValid) {
			update();
		}
	};

	const verificarErrosFinanceiros = () => {
		if(retornoRobo){
			RevisarBalanco();
		}
		// else {
		// 	update
		// }
	};

	const VerificaData = data => {
		const dataAtual = new Date().getUTCFullYear();
		const resultOperacao = dataAtual - data.substring(0, 4);
		if (resultOperacao > 4 || resultOperacao === 4) {
			return 3;
		}
		switch (resultOperacao) {
			case 3: {
				return 3;
			}
			case 2: {
				return 2;
			}
			case 1: {
				return 1;
			}
			case 0: {
				return 0;
			}
			default: {
				return 0;
			}
		}
	};

	const update = async () => {
		try {
			dispatch(LoaderCreators.setLoading());
			var dadosFinanceiros = getDadosFinanceiros();
			const response = await EmpresaService.update(empresaId, dadosFinanceiros);
			if (response.data && response.data.Empresa_update) {
				if (acao == COMANDO_CADASTRO_FORNECEDOR.enviarCadastro) {
					callback(translateWithHtml('fornecedorAtualizadoSucesso'));
				} else {
					callback(translate('cadastroEfetuadoComSucesso'));
				}
			} else {
				dispatch(LoaderCreators.disableLoading());
				callbackError(translate('erroInesperado'));
			}
			if (empresa.Documentos && empresa.Documentos.length > 0) {
				dispatch(LoaderCreators.disableLoading());
			}
			dispatch(LoaderCreators.disableLoading());
		} 
		catch (error) {
			dispatch(LoaderCreators.disableLoading());
			callbackError(translateWithHtml('erroInesperado'));
		}
	};

	// Ações de retorno

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const RevisarBalanco = () => {
		let novoErros = 0;
		const list = ObjectHelper.clone(dadosBalancoPatrimonialList);
		dadosBalancoPatrimonialList.forEach((balanco, index) => {
			//Limpa os validadores de erro dos atributos
			Object.keys(list[index]).forEach(i => list[index][i].erro && (list[index][i].erro = false));
			//Verifica se algum atributo é nulo e seta o numero de 'novoErros'.
			Object.keys(list[index]).forEach(i => list[index][i].value === null && novoErros++);

			// Ativo
			if (
				balanco.AtivoTotal.value !==
				balanco.CirculanteAtivo.value + balanco.AtivoNaoCirculante.value
			) {
				list[index].AtivoTotal.erro = true;
				list[index].CirculanteAtivo.erro = true;
				list[index].AtivoNaoCirculante.erro = true;

				if (
					list[index].AtivoTotal.modificado == true ||
					list[index].CirculanteAtivo.modificado == true ||
					list[index].AtivoNaoCirculante.modificado == true
				) {
					novoErros++;
				}
			}

			if (
				balanco.CirculanteAtivo.value !==
				balanco.Disponibilidades.value +
					balanco.Estoques.value +
					balanco.OutrosAtivosCirculante.value
			) {
				list[index].CirculanteAtivo.erro = true;
				list[index].Disponibilidades.erro = true;
				list[index].Estoques.erro = true;
				list[index].OutrosAtivosCirculante.erro = true;

				if (
					list[index].CirculanteAtivo.modificado == true ||
					list[index].Disponibilidades.modificado == true ||
					list[index].Estoques.modificado == true ||
					list[index].OutrosAtivosCirculante.modificado == true
				) {
					novoErros++;
				}
			}

			// Passivo
			if (
				balanco.PassivoTotal.value !==
				balanco.CirculantePassivo.value +
					balanco.NaoCirculantePassivo.value +
					balanco.PatrimonioLiquido.value
			) {
				list[index].PassivoTotal.erro = true;
				list[index].CirculantePassivo.erro = true;
				list[index].NaoCirculantePassivo.erro = true;
				list[index].PatrimonioLiquido.erro = true;

				if (
					list[index].PassivoTotal.modificado == true ||
					list[index].CirculantePassivo.modificado == true ||
					list[index].NaoCirculantePassivo.modificado == true ||
					list[index].PatrimonioLiquido.modificado == true
				) {
					novoErros++;
				}
			}

			if (
				balanco.CirculantePassivo.value !==
				balanco.EmprestimosFinanciamentoCirculante.value + balanco.OutrosPassivosCirculantes.value
			) {
				list[index].CirculantePassivo.erro = true;
				list[index].EmprestimosFinanciamentoCirculante.erro = true;
				list[index].OutrosPassivosCirculantes.erro = true;

				if (
					list[index].CirculantePassivo.modificado == true ||
					list[index].EmprestimosFinanciamentoCirculante.modificado == true ||
					list[index].OutrosPassivosCirculantes.modificado == true
				) {
					novoErros++;
				}
			}

			if (
				balanco.NaoCirculantePassivo.value !==
				balanco.EmprestimosFinanciamentoNaoCirculante.value +
					balanco.OutrosPassivosNaoCirculantes.value
			) {
				list[index].NaoCirculantePassivo.erro = true;
				list[index].EmprestimosFinanciamentoNaoCirculante.erro = true;
				list[index].OutrosPassivosNaoCirculantes.erro = true;

				if (
					list[index].NaoCirculantePassivo.modificado == true ||
					list[index].EmprestimosFinanciamentoNaoCirculante.modificado == true ||
					list[index].OutrosPassivosNaoCirculantes.modificado == true
				) {
					novoErros++;
				}
			}
		});
		if (novoErros == 0) {
			setFieldValue('dadosBalancoPatrimonialList', list);
			setErros(translate('dadosLancadosSucesso'));
			RevisarDRE();
		} else {
			setFieldValue('dadosBalancoPatrimonialList', list);
			setErros(translate('dadosLancadosContemErro'));
			dispatch(LoaderCreators.disableLoading());
			setOpenMsgErroRevisaoBalanco(true);
			return false;
		}

		setOpenMsgErroRevisaoBalanco(true);
	};

	const RevisarDRE = () => {
		let novoErros = 0;
		const list = ObjectHelper.clone(dadosDREList);
		dadosDREList.forEach((dados, index) => {
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
			setErros(translate('dadosLancadosSucesso'));
		} else {
			setFieldValue('dadosDREList', list);
			setErros(translate('dadosLancadosContemErro'));
			setOpenMsgErroRevisaoDRE(true);
			return false;
		}
	};

	return (
		<Form id='DadosFinanceiros' onSubmit={handleSubmit}>
			<Modal
				open={openMsgErroRevisaoBalanco}
				handleClose={() => setOpenMsgErroRevisaoBalanco(false)}
				onClickButton={() => setOpenMsgErroRevisaoBalanco(false)}
				title={translate('revisaoDadosBalanco')}
				textButton={translate('ok')}
			>
				<p>{erros}</p>
			</Modal>

			<Modal
				open={openMsgErroRevisaoDRE}
				handleClose={() => setOpenMsgErroRevisaoDRE(false)}
				onClickButton={() => setOpenMsgErroRevisaoDRE(false)}
				title={translate('revisaoDadosDRE')}
				textButton={translate('ok')}
			>
				<p>{erros}</p>
			</Modal>

			<Fragment>
					<Fragment>
						<DadosBalancoPatrimonial
							key={key}
							dadosMocadoBalanco={dadosMocadoBalanco}
							formulario={{ submitCount, getFieldProps, setFieldValue, setFieldTouched }}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							user={user}
							historicoEmpresa={null}
							disableEdit={getDisableEdit(
								user,
								getStatusItem(itensAnalise, 'Dados_Balanco_Patrimonial')
							)}
						/>
						<DadosDRE
							formulario={{ submitCount, getFieldProps, setFieldValue, setFieldTouched }}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							user={user}
							historicoEmpresa={null}
							disableEdit={getDisableEdit(
								user,
								getStatusItem(itensAnalise, 'Dados_DRE')
							)}
						/>
					</Fragment>
			</Fragment>
		</Form>
	);
}
