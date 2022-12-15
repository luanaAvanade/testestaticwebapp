import React, { useState, Fragment, useEffect } from 'react';
import _ from 'lodash';
import { useFormik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Confirm, Button, Card, Modal } from '@/components';
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
import DadosDocumentacao from './dadosDocumentacao';
import { getDisableEdit, getStatusItem } from '../aprovacao/util';
import TermosAceite from '@/screens/fornecedor/termosAceite/fornecedor/listarTermosAceite';

export default function DadosFinanceiros({
	empresa,
	preCadastro,
	empresaFindById,
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
	tab,
	setAcao,
	setChanged
}) {
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const dadosMocadoBalanco = [
		{
			DataReferencia: '2017-12-31T00:00:00',
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
		},
		{
			AtivoNaoCirculante: 0,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			CirculantePassivo: 0,
			DataReferencia: '2018-12-31T00:00:00',
			Disponibilidades: 0,
			EmprestimosFinanciamentoCirculante: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			Estoques: 0,
			NaoCirculantePassivo: 0,
			OutrosAtivosCirculante: 0,
			OutrosPassivosCirculantes: 0,
			OutrosPassivosNaoCirculantes: 0,
			PassivoTotal: 0,
			PatrimonioLiquido: 0
		},
		{
			AtivoNaoCirculante: 0,
			AtivoTotal: 0,
			CirculanteAtivo: 0,
			CirculantePassivo: 0,
			DataReferencia: '2016-12-31T00:00:00',
			Disponibilidades: 0,
			EmprestimosFinanciamentoCirculante: 0,
			EmprestimosFinanciamentoNaoCirculante: 0,
			Estoques: 0,
			NaoCirculantePassivo: 0,
			OutrosAtivosCirculante: 0,
			OutrosPassivosCirculantes: 0,
			OutrosPassivosNaoCirculantes: 0,
			PassivoTotal: 0,
			PatrimonioLiquido: 0
		}
	];

	const dadosMocadoDRE = [
		{
			DataReferencia: '2017-12-31T00:00:00',
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		},
		{
			DataReferencia: '2018-12-31T00:00:00',
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		},
		{
			DataReferencia: '2019-12-31T00:00:00',
			ReceitaOperacionalLiquida: 0,
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: 0,
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		}
	];

	// const dadosRetornoRoboBalancoMocado = [
	// 	{}
	// ];

	const dadosRetornoRoboBalancoMocado = [
		{
			dataReferencia: '31/12/2018',
			cnpj: '00.138.806/0001-40',
			entidade: 'COMTRAFO INDÚSTRIA DE TRANSFORMADORES ELÉTRICOS S.A.',
			tipo: 'B',
			ativoCirculante: '131711731.25',
			passivoCirculante: '67603735.16',
			patrimonioLiquido: null
		}
	];

	const dadosRetornoRoboDREMocado = [
		{
			DataReferencia: '2017-12-31T00:00:00',
			ReceitaOperacionalLiquida: '1254',
			CustoProdutosVendidosMercadoriasVendidasServicosPrestados: 0,
			ResultadoOperacionalBruto: 0,
			DespesasVendasAdministrativasGeraisOutras: '148751',
			DespesasFinanceiras: 0,
			ReceitasFinanceiras: 0,
			ResultadoOperacionalAntesIrCssl: 0,
			ResultadoLiquidoPeriodo: 0
		}
	];

	// Estado Local

	const balancoRobo = [];

	const [
		retornoRobo,
		setRetornoRobo
	] = useState(false);

	const [
		documentosDB,
		setDocumentosDB
	] = useState([]);

	const [
		openMsgErroRevisaoBalanco,
		setOpenMsgErroRevisaoBalanco
	] = useState(false);

	const [
		openMsgErroRevisaoDRE,
		setOpenMsgErroRevisaoDRE
	] = useState(false);

	const [
		novoErrosTeste,
		setNovoErrosTeste
	] = useState(0);

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
		if (empresa) {
			setDadosEmpresa(empresa);
			if (empresa.Documentos.length > 0) {
				setDocumentos(empresa.Documentos);
			}
		}
		return () => {
			limparFormulario();
		};
	}, []);

	useEffect(
		() => {
			if (acao && acao !== null && tab === TAB_DADOS_FINANCEIROS) {
				switch (acao) {
					case COMANDO_CADASTRO_FORNECEDOR.criarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.enviarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.reprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarRessalvasCadastro:
						verificarErrosFinanceiros();
						break;
					case COMANDO_CADASTRO_FORNECEDOR.salvar:
						update();
						break;
				}
				setAcao(null);
			}
			if (acao && acao === COMANDO_CADASTRO_FORNECEDOR.validar && !isValid) {
				handleSubmit();
			}
			if (acao === COMANDO_CADASTRO_FORNECEDOR.descartarAlteracoes) {
				setDadosEmpresa(empresa);
				setDadosFinanceirosIsValid(isValid);
			}
		},
		[
			acao
		]
	);

	const limparFormulario = () => {
		resetForm(initialValues);
	};

	// Documentacao

	const setDocumentos = documentos => {
		const buildDocumentos = [];
		if (documentos) {
			documentos.forEach(documento => {
				const files = [];
				const file = new File(
					[
						''
					],
					documento.Arquivo.NomeArquivo
				);

				const newfile = { file, dataEmissao: '' };
				newfile.dataEmissao = moment(documento.DataBasePeriodo).format('YYYY-MM-DD');
				files.push(newfile);

				const docDb = _.find(buildDocumentos, doc => doc.tipoId === documento.TipoDocumento.Id);

				if (docDb) {
					docDb.files.concat(files);
				} else {
					const newDocumento = {
						tipoId: documento.TipoDocumento.Id,
						nome: documento.TipoDocumento.Nome,
						tipo: '',
						files: []
					};

					newDocumento.tipo = documento.TipoDocumento.Nome;
					newDocumento.files = files;
					buildDocumentos.push(newDocumento);
				}
			});
		}
		setDocumentosDB(buildDocumentos);
	};

	// Formulário

	const initialValues = {
		dadosBalancoPatrimonialList: [],
		dadosDREList: [],
		documentacao: []
	};

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
		documentacao: Yup.mixed().test(
			'documentacao',
			translate('adicionePeloMenosUmArquivoParaCadaDocumento'),
			docList => test(docList)
		)
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
			if (!preCadastro && !_.isEmpty(touched)) {
				setChanged(true);
			}
		},
		[
			touched
		]
	);

	const { dadosBalancoPatrimonialList, dadosDREList } = values;

	// Ações da Tela

	const setDadosListDadosDRE = dadosListDRERobo => {
		for (var i = 0; i < dadosListDRERobo.length; i++) {
			//dadosDREList[i].Id.value = dadosListDRERobo[i].Id;
			dadosDREList[i].ReceitaOperacionalLiquida.value =
				dadosListDRERobo[i].ReceitaOperacionalLiquida;
			dadosDREList[i].CustoProdutosVendidosMercadoriasVendidasServicosPrestados.value =
				dadosListDRERobo[i].CustoProdutosVendidosMercadoriasVendidasServicosPrestados;
			dadosDREList[i].ResultadoOperacionalBruto.value =
				dadosListDRERobo[i].ResultadoOperacionalBruto;
			dadosDREList[i].DespesasVendasAdministrativasGeraisOutras.value =
				dadosListDRERobo[i].DespesasVendasAdministrativasGeraisOutras;
			dadosDREList[i].DespesasFinanceiras.value = dadosListDRERobo[i].DespesasFinanceiras;
			dadosDREList[i].ReceitasFinanceiras.value = dadosListDRERobo[i].ReceitasFinanceiras;
			dadosDREList[i].ResultadoOperacionalAntesIrCssl.value =
				dadosListDRERobo[i].ResultadoOperacionalAntesIrCssl;
			dadosDREList[i].ResultadoLiquidoPeriodo.value = dadosListDRERobo[i].ResultadoLiquidoPeriodo;
		}
	};

	const setDadosListDadosBalancoPatrimonial = dadosListBalancoPatrimonialRobo => {
		for (var i = 0; i < dadosListBalancoPatrimonialRobo.length; i++) {
			//dadosBalancoPatrimonialList[i].Id.value = dadosListBalancoPatrimonialRobo[i].Id;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].AtivoNaoCirculante;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.modificado = true;
			dadosBalancoPatrimonialList[i].AtivoTotal.value =
				dadosListBalancoPatrimonialRobo[i].AtivoTotal;
			dadosBalancoPatrimonialList[i].CirculanteAtivo.value =
				dadosListBalancoPatrimonialRobo[i].CirculanteAtivo;
			dadosBalancoPatrimonialList[i].CirculantePassivo.value =
				dadosListBalancoPatrimonialRobo[i].CirculantePassivo;
			dadosBalancoPatrimonialList[i].Disponibilidades.value =
				dadosListBalancoPatrimonialRobo[i].Disponibilidades;
			dadosBalancoPatrimonialList[i].EmprestimosFinanciamentoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].EmprestimosFinanciamentoCirculante;
			dadosBalancoPatrimonialList[i].EmprestimosFinanciamentoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].EmprestimosFinanciamentoNaoCirculante;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].Estoques;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].NaoCirculantePassivo;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].OutrosAtivosCirculante;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].OutrosPassivosCirculantes;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].OutrosPassivosNaoCirculantes;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].PassivoTotal;
			dadosBalancoPatrimonialList[i].AtivoNaoCirculante.value =
				dadosListBalancoPatrimonialRobo[i].PatrimonioLiquido;
		}
	};

	const setDadosEmpresa = () => {
		setValues({
			dadosBalancoPatrimonialList: montarLista(dadosMocadoBalanco, BALANCO_PATRIMONIAL),
			// montarLista(dados.DadosBalancosPatrimoniais)
			dadosDREList: montarLista(dadosMocadoDRE, DRE),
			// montarLista(dados.DadosDREList, BALANCO_PATRIMONIAL)
			documentacao: []
		});
		setKey(key + 1);
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
		return list;
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

	const getTermosAceite = () => {
		const t = ObjectHelper.clone(listTermosAceiteEmpresa);
		t.forEach(item => {
			delete item.EmpresaId;
			delete item.TermosAceite;
			delete item.TermosAceiteId;
		});
		return t;
	};

	const getDocumentacao = async () => {
		dispatch(LoaderCreators.setLoading());
		if (retornoRobo === true) {
			return false;
		}
		if (empresa.Documentos && empresa.Documentos.length > 0) {
			if (
				empresa.Documentos[0].TipoDocumento.Nome ===
					'Demonstração do Resultado do Exercício (DRE)' ||
				empresa.Documentos[0].TipoDocumento.Nome === 'Balanço Patrimonial (BP)'
			) {
				return false;
			}
		}
		if (values.documentacao && values.documentacao.length > 0) {
			// let dadosFinaceirosDreBP = values.documentacao.filter(x => x.tipoId === 88);
			// let letdadosDocumentacao = values.documentacao.filter(x => x.tipoId !== 88);
			// console.log('RESULTADO DOS OUTROS DOCUMENTOS: ');
			// console.log(letdadosDocumentacao);
			const response = await EmpresaService.importDocumentoDadosFinanceiros(
				values.documentacao,
				empresa.Id
			);
			// if (letdadosDocumentacao.length > 0) {
			// 	const response2 = await EmpresaService.importDocumento(letdadosDocumentacao, empresa.Id);
			// }

			setTimeout(() => {
				// empresa.Documentos[0].TipoDocumento.Id = response.data.Empresa_update.TipoDocumento.Id;
				setRetornoRobo(true);
				if (response.data) {
					console.log('DADOS DE RETORNO DO ROBÔ: ');
					console.log(response.data);
					setDadosListDadosBalancoPatrimonial(
						response.data.Empresa_update.DadosBalancosPatrimoniais
					);
					setDadosListDadosDRE(response.data.Empresa_update.DadosDREs);
				} else {
					callbackError('Erro ao atualizar dodos');
				}
				dispatch(LoaderCreators.disableLoading());
			}, 3000);
		}
		if (values.documentacaoRemover && values.documentacaoRemover.length > 0) {
			values.documentacaoRemover.forEach(doc => {
				EmpresaService.removeDocumento(doc);
			});
		}
	};

	const getDadosFinanceiros = () => {
		const url = `@/..{document.location.origin}@/..{SUBDIRETORIO_LINK}`;
		console.log('balanco', getDadosBalancoPatrimonialList());
		console.log('DRE', getDadosDREList());
		console.log('analise cadastro', getAnaliseCadastro());
		console.log('termos aceite', getTermosAceite());
		console.log('documentacao', getDocumentacao());
		console.log('comentarios', getComentarios());

		return {
			DadosBalancosPatrimoniais: getDadosBalancoPatrimonialList(),
			DadosDREs: getDadosDREList(),
			AnaliseCadastro: getAnaliseCadastro(),
			TermoAceiteEmpresa: getTermosAceite(),
			Documentos: getDocumentacao(),
			Comentarios: getComentarios(),
			LinkCadastro: `@/..{url}/cadastro-complementar/@/..{empresa.Id}`
		};
	};

	const processarArquivosNoRobo = () => {
		dispatch(LoaderCreators.setLoading('Processando Arquivos'));

		setTimeout(() => {
			dispatch(LoaderCreators.disableLoading());
			enqueueSnackbar('', snackError('Erro ao processar o Arquivo!', closeSnackbar));
			setRetornoRobo(true);
		}, 5000);
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
			const response = await EmpresaService.update(empresa.Id, getDadosFinanceiros());
			console.log('RETORNO DO UPDATE: ');
			console.log(response);
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
		} catch (error) {
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
				<DadosDocumentacao
					key={key}
					setRetornoRobo={setRetornoRobo}
					documentosDb={documentosDB}
					formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
					itensAnalise={itensAnalise}
					setItensAnalise={setItensAnalise}
					user={user}
					dataAbertura={empresa.DataAbertura}
					tab={tab}
					historicoEmpresa={empresa.Historico}
				/>
				{retornoRobo && (
					<Fragment>
						{/* <p
							style={{
								marginTop: 32,
								padding: 8,
								backgroundColor: '#F8D7DA',
								color: '#721C24',
								borderRadius: 5
							}}
						>
							{translate('msgErroRobo')}
						</p> */}
						<DadosBalancoPatrimonial
							key={key}
							formulario={{ submitCount, getFieldProps, setFieldValue, setFieldTouched }}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							user={user}
							historicoEmpresa={empresa.Historico}
							dataAbertura={empresa.DataAbertura}
							disableEdit={getDisableEdit(
								user,
								empresa.AnaliseCadastro,
								getStatusItem(itensAnalise, 'Dados_Balanco_Patrimonial')
							)}
							statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
						/>
						<DadosDRE
							formulario={{ submitCount, getFieldProps, setFieldValue, setFieldTouched }}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							user={user}
							historicoEmpresa={empresa.Historico}
							dataAbertura={empresa.DataAbertura}
							disableEdit={getDisableEdit(
								user,
								empresa.AnaliseCadastro,
								getStatusItem(itensAnalise, 'Dados_DRE')
							)}
							statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
						/>
					</Fragment>
				)}
				{!preCadastro &&
				listTermosAceiteEmpresa.length > 0 && (
					<TermosAceite
						listTermosAceiteEmpresa={listTermosAceiteEmpresa}
						setListTermosAceiteEmpresa={setListTermosAceiteEmpresa}
						erroTermoAceite={erroTermoAceite}
						setErroTermoAceite={setErroTermoAceite}
						getTermoNaoAceitos={getTermoNaoAceitos}
						setChanged={setChanged}
					/>
				)}
			</Fragment>
		</Form>
	);
}
