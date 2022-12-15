import React, { useEffect, Fragment, useState } from 'react';
import { Card, CardContent, Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { useFormik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Button } from '@/components';
import theme from '@/theme';
import _ from 'lodash';
import DadosGrupoFornecimento from './dadosGrupoFornecimento';
import DadosBancarios from './dadosBancarios';
import EmpresaService from '@/services/empresa';
import DadosDocumentacaoDc from './dadosDocumentacaoDc';
import { translate, translateWithHtml } from '@/locales';
import { snackSuccess, snackError } from '@/utils/snack';
import moment from 'moment';
import {
	COMANDO_CADASTRO_FORNECEDOR,
	SELECT_TIPO_FORNECEDOR,
	CADASTRO_DESCENTRALIZADO,
	SUBDIRETORIO_LINK,
	TAB_DADOS_COMPLEMENTAR
} from '@/utils/constants';
import { getDisableEdit, getStatusItem } from '../aprovacao/util';
import { DisplayDiv } from '@/screens/fornecedor/autoCadastro/aprovacao/style';
import TermosAceite from '@/screens/fornecedor/termosAceite/fornecedor/listarTermosAceite';
import ObjectHelper from '@/utils/objectHelper';

export default function DadosComplementar({
	empresa,
	preCadastro,
	empresaFindById,
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
	tab,
	setAcao,
	setChanged
}) {
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	// Efeitos
	useEffect(() => {
		if (empresa) {
			setDadosEmpresa(empresa);
		}
		return () => {
			limparFormulario();
		};
	}, []);

	useEffect(
		() => {
			if (acao && acao !== null && tab === TAB_DADOS_COMPLEMENTAR) {
				switch (acao) {
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
			}
			if (acao && acao === COMANDO_CADASTRO_FORNECEDOR.validar && !isValid) {
				handleSubmit();
			}
			if (acao === COMANDO_CADASTRO_FORNECEDOR.descartarAlteracoes) {
				setDadosEmpresa(empresa);
				setDadosComplementaresIsValid(isValid);
			}
		},
		[
			acao
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

	const setDadosEmpresa = dados => {
		setValues({
			grupoFornecimentoList: dados.GruposFornecimento,
			banco: dados.DadosBancarios && dados.DadosBancarios.Banco ? dados.DadosBancarios.Banco.Id : 0,
			agencia: dados.DadosBancarios ? dados.DadosBancarios.Agencia : '',
			digitoAgencia: dados.DadosBancarios ? dados.DadosBancarios.DigitoAgencia : '',
			conta: dados.DadosBancarios ? dados.DadosBancarios.Conta : '',
			digitoConta: dados.DadosBancarios ? dados.DadosBancarios.DigitoConta : '',
			documentacao: [],
			documentacaoRemover: [],
			tipoFornecedor: 0
		});
		setKey(key + 1);
	};

	const setDocumentos = documentos => {
		let buildDocumentos = [];
		if (documentos) {
			documentos.forEach(documento => {
				let files = [];
				let file = new File(
					[
						''
					],
					documento.Arquivo.NomeArquivo
				);

				let newfile = { file, dataEmissao: '', arquivoId: '' };
				newfile.dataEmissao = moment(documento.DataBasePeriodo).format('YYYY-MM-DD');
				newfile.arquivoId = documento.Arquivo.Id;
				files.push(newfile);

				const doc_db = _.find(buildDocumentos, doc => doc.tipoId === documento.TipoDocumento.Id);

				if (doc_db) {
					doc_db.files = doc_db.files.concat(files);
				} else {
					let newDocumento = {
						tipoId: documento.TipoDocumento.Id,
						tipo: '',
						tipoArquivo: 0,
						files: []
					};

					newDocumento.tipo = documento.TipoDocumento.Nome;
					newDocumento.files = files;
					buildDocumentos.push(newDocumento);
				}
			});
		}
		setDocumentosDB(buildDocumentos);
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
		return list;
	};

	const getDadosBancarios = () => {
		return {
			BancoId: values.banco,
			Agencia: values.agencia,
			DigitoAgencia: values.digitoAgencia,
			Conta: values.conta,
			DigitoConta: values.digitoConta
		};
	};

	const getDocumentacao = () => {
		if (values.documentacao && values.documentacao.length > 0) {
			const documentacao = [];
			values.documentacao.forEach(tipo => {
				const tipoId = tipo.tipoId;
				if (tipo.files && tipo.files.length > 0) {
					tipo.files.forEach(arquivo => {
						documentacao.push({
							EmpresaId: empresa.Id,
							DataBasePeriodo: !arquivo.dataEmissao
								? new Date().toISOString()
								: new Date(arquivo.dataEmissao).toISOString(),
							TipoDocumentoId: tipoId,
							Arquivo: arquivo.file
						});
					});
				}
			});
			EmpresaService.importDocumento(documentacao, empresa.Id);
		}
		if (values.documentacaoRemover && values.documentacaoRemover.length > 0) {
			values.documentacaoRemover.forEach(doc => {
				EmpresaService.removeDocumento(doc);
			});
		}
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

	const getDadosComplementares = () => {
		const url = `@/..{document.location.origin}@/..{SUBDIRETORIO_LINK}`;
		return {
			GruposFornecimento: getGrupoFornecimentoList(),
			DadosBancarios: getDadosBancarios(),
			Documentacao: getDocumentacao(),
			AnaliseCadastro: getAnaliseCadastro(),
			TermoAceiteEmpresa: getTermosAceite(),
			Comentarios: getComentarios(),
			LinkCadastro: `@/..{url}/cadastro-complementar/@/..{empresa.Id}`
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

	const update = async () => {
		dispatch(LoaderCreators.setLoading());

		try {
			const response = await EmpresaService.update(empresa.Id, getDadosComplementares());
			if (response.data && response.data.Empresa_update) {
				empresaFindById();
				callbackMensagemSucesso();
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
		documentacao: [],
		documentacaoRemover: []
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
		grupoFornecimentoList: Yup.mixed().test(
			'grupoFornecimentoList',
			translate('adicionePeloMenosUmGrupoFornecimento'),
			value => value.length > 0 || empresa.TipoCadastro === CADASTRO_DESCENTRALIZADO.codigo
		),
		banco: Yup.mixed().test('banco', translate('campoObrigatorio'), value => value !== 0),
		agencia: Yup.string().nullable().required(translate('campoObrigatorio')),
		conta: Yup.string().nullable().required(translate('campoObrigatorio')),
		digitoConta: Yup.string().nullable().required(translate('campoObrigatorio')),
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
				if (empresa.Documentos.length > 0) {
					setDocumentos(empresa.Documentos);
				}
			}
			setDadosComplementaresIsValid(isValid);
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

	return (
		<Form onSubmit={handleSubmit}>
			<Fragment>
				{empresa.TipoCadastro !== CADASTRO_DESCENTRALIZADO.codigo && (
					<DadosGrupoFornecimento
						formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						setItensAnalise={setItensAnalise}
						comentarios={comentarios}
						setComentarios={setComentarios}
						user={user}
						historicoEmpresa={empresa.Historico}
						disableEdit={getDisableEdit(
							user,
							empresa.AnaliseCadastro,
							getStatusItem(itensAnalise, 'Grupos_Fornecimento')
						)}
						statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
					/>
				)}

				<DadosBancarios
					formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
					itensAnalise={itensAnalise}
					setItensAnalise={setItensAnalise}
					comentarios={comentarios}
					setComentarios={setComentarios}
					user={user}
					historicoEmpresa={empresa.Historico}
					disableEdit={getDisableEdit(
						user,
						empresa.AnaliseCadastro,
						getStatusItem(itensAnalise, 'Dados_Bancarios')
					)}
					tab={tab}
					statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
				/>

				{empresa.TipoCadastro !== CADASTRO_DESCENTRALIZADO.codigo && (
					<DadosDocumentacaoDc
						key={key}
						documentos_db={documentosDB}
						formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						setItensAnalise={setItensAnalise}
						user={user}
						historicoEmpresa={empresa.Historico}
						tab={tab}
						statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
					/>
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
