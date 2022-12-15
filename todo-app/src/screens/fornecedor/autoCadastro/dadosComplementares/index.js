import React, { useEffect, Fragment, useState } from 'react';
import { Card, CardContent, Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { useFormik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import _ from 'lodash';
import DadosGrupoFornecimento from './dadosGrupoFornecimento';
import DadosBancarios from './dadosBancarios';
import EmpresaService from '@/services/empresa';
import { translate, translateWithHtml } from '@/locales';
import { snackSuccess, snackError } from '@/utils/snack';
import {
	COMANDO_CADASTRO_FORNECEDOR,
	SELECT_TIPO_FORNECEDOR,
	CADASTRO_DESCENTRALIZADO,
	SUBDIRETORIO_LINK,
	TAB_DADOS_COMPLEMENTAR
} from '@/utils/constants';

export default function DadosComplementar({
	empresa,
	empresaId,
	setEmpresaId,
	preCadastro,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	getComentarios,
	setDadosComplementaresIsValid,
	getAnaliseCadastro,
	listTermosAceiteEmpresa,
	setListTermosAceiteEmpresa,
	erroTermoAceite,
	setErroTermoAceite,
	getTermoNaoAceitos,
	user,
	acao,
	acaoCadastroComplementar,
	tab,
	setAcao,
	setAcaoCadastroComplementar,
	setChanged
}) {
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	// Efeitos
	useEffect(() => {
		//empresaFindById();
		if (empresa) {
			//setDadosEmpresa(empresa);
		}
		return () => {
			limparFormulario();
		};
	}, []);

	useEffect(
		() => {
			if ((acao && acao !== null && acao !== "validar" && tab === TAB_DADOS_COMPLEMENTAR) || (acaoCadastroComplementar && acaoCadastroComplementar !== "validar")) {
				
				var acaoExecutar = null;
				if(acao && acao !== null){
					acaoExecutar = acao;
				}
				else{
					acaoExecutar = acaoCadastroComplementar;
				}
				
				switch (acaoExecutar) {
					case COMANDO_CADASTRO_FORNECEDOR.criarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.enviarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.reprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarCadastro:
					case COMANDO_CADASTRO_FORNECEDOR.aprovarRessalvasCadastro:
						handleSubmit();
						break;
					case COMANDO_CADASTRO_FORNECEDOR.salvar:
						update();
						break;
				}
				setAcao(null);
				setAcaoCadastroComplementar(null);
			}
			if (acaoCadastroComplementar && acaoCadastroComplementar === COMANDO_CADASTRO_FORNECEDOR.validar && !isValid) {
				handleSubmit();
			}
			if (acao === COMANDO_CADASTRO_FORNECEDOR.descartarAlteracoes) {
				setDadosEmpresa(empresa);
				setDadosComplementaresIsValid(isValid);
			}
		},
		[
			acaoCadastroComplementar
		]
	);

	const [
		key,
		setKey
	] = useState(0);

	const [
		documentosDB,
		setDocumentosDB
	] = useState([]);

	const limparFormulario = () => {
		resetForm(initialValues);
	};
	

	// Ações da Tela

	const empresaFindById = async () => {
		try {
			const response = await EmpresaService.findById(empresaId);
			if (response.data && response.data.Empresa_list.length > 0) {
				setDadosEmpresa(response.data.Empresa_list[0]);
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


	const setDadosEmpresa = dados => {
		setValues({
			grupoFornecimentoList: dados.GruposFornecimento,
			banco: dados.DadosBancarios && dados.DadosBancarios.Banco ? dados.DadosBancarios.Banco.Id : 0,
			agencia: dados.DadosBancarios ? dados.DadosBancarios.Agencia : '',
			digitoAgencia: dados.DadosBancarios ? dados.DadosBancarios.DigitoAgencia : '',
			conta: dados.DadosBancarios ? dados.DadosBancarios.Conta : '',
			digitoConta: dados.DadosBancarios ? dados.DadosBancarios.DigitoConta : '',
			tipoFornecedor: 0
		});
		setKey(key + 1);
	};

	const getGrupoFornecimentoList = () => {
		const list = [];
		values.grupoFornecimentoList.forEach(gp => {
			list.push({
				GrupoCategoriaId: gp.GrupoCategoria.Id,
				TipoFornecimento: SELECT_TIPO_FORNECEDOR.find(x => x.valorEnum === gp.TipoFornecimento)
					.label
			});
		});
		console.log('DADOS DO GRUPO DE FORNECIMENTO');
		console.log(list);
		console.log(values.banco);
		return list;
	};

	const getDadosBancarios = () => {
		return {
			BancoId: 1,
			Agencia: values.agencia,
			DigitoAgencia: values.digitoAgencia,
			Conta: values.conta,
			DigitoConta: values.digitoConta
		};
	};

	const getDadosComplementares = () => {
		const url = `${document.location.origin}${SUBDIRETORIO_LINK}`;
		return {
			GruposFornecimento: getGrupoFornecimentoList(),
			DadosBancarios: getDadosBancarios(),
			//Documentacao: getDocumentacao(),
			AnaliseCadastro: getAnaliseCadastro(),
			//TermoAceiteEmpresa: getTermosAceite(),
			//Comentarios: getComentarios(),
			//LinkCadastro: `@/..{url}/cadastro-complementar/@/..{empresa.Id}`
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
			update();
	};

	const update = async () => {
		dispatch(LoaderCreators.setLoading());

		try {
			const response = await EmpresaService.update(empresaId, getDadosComplementares());
			if (response.data && response.data.Empresa_update) {
				//empresaFindById();
				callbackMensagemSucesso();
				setDadosComplementaresIsValid(true);
			} else {
				callbackError(translateWithHtml('erroInesperado'));
			}
			dispatch(LoaderCreators.disableLoading());
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

	// Formulário
	const initialValues = {
		grupoFornecimentoList: [],
		banco: 0,
		agencia: '',
		digitoAgencia: '',
		conta: '',
		digitoConta: '',
		tipoFornecedor: 0,
	};


	const validationSchema = Yup.object().shape({
		grupoFornecimentoList: Yup.mixed().test(
		'grupoFornecimentoList',
			translate('adicionePeloMenosUmGrupoFornecimento'),
			value => value.length > 0),
		//banco: Yup.mixed().test('banco', translate('campoObrigatorio')),
		agencia: Yup.string().nullable().required(translate('campoObrigatorio')),
		conta: Yup.string().nullable().required(translate('campoObrigatorio')),
		digitoConta: Yup.string().nullable().required(translate('campoObrigatorio'))
		//documentacao: Yup.mixed().test(
		//	'documentacao',
		//	translate('adicionePeloMenosUmArquivoParaCadaDocumento'),
		//	docList => test(docList)
		//)
	});

	const {
		handleSubmit,
		isValid,
		submitCount,
		setFieldValue,
		setFieldTouched,
		getFieldProps,
		values,
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
			if (empresa) {
				setDadosEmpresa(empresa);
			}
		},
		[
			empresa
		]
	);

	useEffect(
		() => {
			if (empresa) {
				//setDadosEmpresa(empresa);
				//if (empresa.Documentos.length > 0) {
				//	setDocumentos(empresa.Documentos);
				}
			},
			//setDadosComplementaresIsValid(isValid);
		//},
		//[
		//	isValid
		//]
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

	return (
		<Form onSubmit={handleSubmit}>
			<Fragment>
					<DadosGrupoFornecimento
						formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						setItensAnalise={setItensAnalise}
						comentarios={comentarios}
						setComentarios={setComentarios}
						user={user}
					/>
				<DadosBancarios
					formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
					itensAnalise={itensAnalise}
					setItensAnalise={setItensAnalise}
					comentarios={comentarios}
					setComentarios={setComentarios}
					user={user}
				/>
			</Fragment>
		</Form>
	);
}
