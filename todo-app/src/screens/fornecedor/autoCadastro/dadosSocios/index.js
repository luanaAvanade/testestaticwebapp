import React, { useEffect, Fragment, useState } from 'react';
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { Box } from '@material-ui/core';
import { Button } from '@/components';
import CadastroSocios from './cadastroSocios';
import DadosContrato from './dadosContrato';
import CadastroAssinaturasSocios from './cadastroAssinaturasSocios';
import { translate, translateWithHtml } from '@/locales';
import theme from '@/theme';
import EmpresaService from '@/services/empresa';
import SocioService from '@/services/socios';
import { useSnackbar } from 'notistack';
import { snackSuccess, snackError } from '@/utils/snack';
import { moeda, moedaMask } from '@/utils/mascaras';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import {
	ENUM_TIPO_SOCIO,
	SELECT_TIPO_ASSINATURAS,
	ENUM_STATUS_ANALISE,
	TAB_DADOS_SOCIOS
} from '@/utils/constants';
import DadosDocumentacao from './dadosDocumentacao';
import moment from 'moment';
import { Translate } from '@material-ui/icons';
import { DisplayDiv } from '@/screens/fornecedor/autoCadastro/aprovacao/style';
import TermosAceite from '@/screens/fornecedor/termosAceite/fornecedor/listarTermosAceite';
import { getDisableEdit, getStatusItem } from '../aprovacao/util';
import { COMANDO_CADASTRO_FORNECEDOR, SUBDIRETORIO_LINK } from '@/utils/constants';
import ObjectHelper from '@/utils/objectHelper';
import { nothing } from 'immer';

export default function DadosSocios({
	key,
	setKey,
	empresaId,
	setEmpresaId,
	empresa,
	preCadastro,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	getComentarios,
	setSocioIsValid,
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
	acaoCadastroSocios,
	setAcaoCadastroSocios,
	setChanged
}) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const [
		capitalSocialTotalPronto,
		setCapitalSocialTotalPronto
	] = useState(0);

	const initialValues = {
		capitalSocialTotal: '',
		dataRegistro: '',
		sociosList: [],
		assinaturasSociosList: [],
		initialSociosIds: [],
		initialGruposAss: [],
		documentacao: []
	};

	const [
		documentosDB,
		setDocumentosDB
	] = useState([]);

	const testCapitalSocialTotal = value => {
		if (value == undefined || value === 0) {
			return false;
		}
		return true;
	};

	const testDataRegistro = value => {
		if (value === undefined) {
			return false;
		}
		return true;
	};

	const testSocio = value => {
		if (value.length === 0) {
			return false;
		}
		return true;
	};

	const testAssSocio = value => {
		if (value.length === 0) {
			return false;
		}
		return true;
	};

	const testPercentualTotal = value => {
		let somatorio = 0.0;
		value.forEach(item => {
			somatorio += item.ValorParticipacao;
		});
		return somatorio === values.capitalSocialTotal;
	};

	const [
		listTermosAceite,
		setListTermosAceite
	] = useState([]);

	const termosAceiteFindAll = async () => {
		setListTermosAceite(listTermosAceiteEmpresa);
	};

	const validationSchema = Yup.object().shape({
		capitalSocialTotal: Yup.mixed().test(
			'capitalSocialTotal',
			translate('campoObrigatorio'),
			value => testCapitalSocialTotal(value)
		),
		dataRegistro: Yup.mixed().test('dataRegistro', translate('campoObrigatorio'), value =>
			testDataRegistro(value)
		),
		sociosList: Yup.mixed().test('sociosList', translate('campoObrigatorio'), value =>
			testSocio(value)
		),
		assinaturasSociosList: Yup.mixed().test(
			'assinaturasSociosList',
			translate('campoObrigatorio'),
			value => testAssSocio(value)
		),
		sociosList: Yup.mixed().test('sociosList', translate('percentualTotalInvalido'), value =>
			testPercentualTotal(value)
		)
	});

	const {
		getFieldProps,
		isValid,
		values,
		handleSubmit,
		submitCount,
		setFieldValue,
		setFieldTouched,
		resetForm,
		setValues,
		touched,
		errors
	} = useFormik({
		initialValues,
		validationSchema,
		onSubmit: () => save()
	});

	// Efeitos
	useEffect(() => {
		//empresaFindById();
		if (empresa) {
			//setDadosSocios(empresa);
			//if (empresa.Documentos.length > 0) {
			//	setDocumentos(empresa.Documentos);
			//}
		}
		return () => {
			limparFormulario();
		};
	}, []);

	useEffect(
		() => {
			setSocioIsValid(isValid);
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

	useEffect(
		() => {
			setPercent(values.sociosList);
		},
		[
			values.sociosList
		]
	);

	useEffect(
		() => {
			if (empresa) {
				setDadosSocios(empresa);
			}
		},
		[
			empresa
		]
	);

	useEffect(
		() => {
			if ((acao && acao !== null && tab === TAB_DADOS_SOCIOS) || (acaoCadastroSocios && acaoCadastroSocios !== null)
			&& (acao !== COMANDO_CADASTRO_FORNECEDOR.validar)) {
				var acaoExecutar = null;

				if(acao && acao !== null) {
					acaoExecutar = acao;
				}
				else{
					acaoExecutar = acaoCadastroSocios;
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
						create();
						break;
				}
				setAcao(null);
				setAcaoCadastroSocios(null);
			}
			if (acaoCadastroSocios && acaoCadastroSocios === COMANDO_CADASTRO_FORNECEDOR.validar && !isValid) {
				handleSubmit();
			}
			if (acaoCadastroSocios === COMANDO_CADASTRO_FORNECEDOR.descartarAlteracoes) {
				setDadosSocios(empresa);
				setSocioIsValid(isValid);
			}
		},
		[
			acaoCadastroSocios
		]
	);

	const limparFormulario = () => {
		resetForm(initialValues);
	};
	// Ações da Tela

	const save = () => {
		if (isValid) {
			create();
		}
	};

	const getSociosList = () => {
		const list = [];
		values.sociosList.forEach(socio => {
			delete socio.Percentual;
			const tipo = ENUM_TIPO_SOCIO.find(itemTipo => itemTipo.value === socio.TipoPessoa);
			socio.TipoPessoa = tipo != undefined ? tipo.internalName : tipo;
			socio.TipoSocio = 'Socio';
			list.push(socio);
		});
		return list;
	};

	const getAssSociosList = dados => {
		const list = [];
		values.assinaturasSociosList.forEach(grupo => {
			const newGrupo = {
				TipoAssinatura: SELECT_TIPO_ASSINATURAS.find(item => item.value === grupo.TipoAssinatura)
					.internalName,
				ValorLimite: Number(grupo.ValorLimite),
				Assinaturas: grupo.Assinaturas.map(item => {
					const obj = {
						SocioId: dados.find(x => x.Codigo === item.Codigo).Id,
						Obrigatoriedade: +item.Obrigatoriedade
					};
					if (item.hasOwnProperty('Id')) {
						obj.Id = item.Id;
					}
					return obj;
				})
			};
			if (grupo.hasOwnProperty('Id')) {
				newGrupo.Id = grupo.Id;
			}
			list.push(newGrupo);
		});
		return list;
	};

	const empresaFindById = async () => {
		try {
			const response = await EmpresaService.findById(empresaId);
			if (response.data && response.data.Empresa_list.length > 0) {
				setDadosSocios(response.data.Empresa_list[0]);
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

	const setDadosSocios = dados => {
		setPercent(dados.Socios);
		setValues({
			sociosList:
				dados.Socios /*.map(itemSocio => {
				itemSocio.TipoPessoa = ENUM_TIPO_SOCIO.find(
					itemTipo => itemTipo.value === itemSocio.TipoPessoa
				).internalName;
				return itemSocio;
			})*/,
			documentacao: [],
			capitalSocialTotal:
				dados.CapitalSocialTotalSociedade === ''
					? ''
					: moeda(dados.CapitalSocialTotalSociedade),
			dataRegistro: dados.DataRegistroSociedade
				? dados.DataRegistroSociedade.split('T')[0]
				: dados.DataRegistroSociedade,
			assinaturasSociosList: dados.GruposDeAssinatura.map(item => {
				item.Assinaturas = item.Assinaturas.map(itemAss => {
					itemAss.Codigo = dados.Socios.find(x => x.Id === itemAss.SocioId).Codigo;
					return itemAss;
				});
				return item;
			}),
			initialSociosIds: dados.Socios.map(itemSocio => itemSocio.Id),
			initialGruposAss: dados.GruposDeAssinatura.map(item => {
				item.Assinaturas = item.Assinaturas.map(itemAss => {
					itemAss.Codigo = dados.Socios.find(x => x.Id === itemAss.SocioId).Codigo;
					return itemAss;
				});
				return item;
			})
		});
		setKey(3);
	};

	const setDadosAssSocios = dados => {
		setValues({
			assinaturasSociosList: dados.GruposDeAssinatura
		});
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

	const create = async () => {
		dispatch(LoaderCreators.setLoading());
		const url = `${document.location.origin}${SUBDIRETORIO_LINK}`;
		let empresaSave = {
			CapitalSocialTotalSociedade:
				values.capitalSocialTotal === '' ? null : values.capitalSocialTotal,
			DataRegistroSociedade: values.dataRegistro === '' ? null : values.dataRegistro,
			Socios: getSociosList()
		};

		const r = await removeGrupos(empresaSave);
		empresaSave.Socios = getSociosList();

		try {
			const insertResponse = await insereDadosSocios(empresaSave);
			if (insertResponse.data && insertResponse.data.Empresa_update.Id !== undefined) {
				empresaSave = {
					GruposDeAssinatura: getAssSociosList(insertResponse.data.Empresa_update.Socios),
					AnaliseCadastro: getAnaliseCadastro()
				};
				const insertGruposResponse = await insereDadosSocios(empresaSave);
				if (insertGruposResponse.data && insertGruposResponse.data.Empresa_update) {
					setChanged(false);
					callbackMensagemSucesso();
				} else {
					callbackError(translateWithHtml('erroInesperado'), insertResponse);
				}
			} else {
				callbackError(translateWithHtml('erroInesperado'), insertResponse);
			}
		} catch (error) {
			callbackError(translateWithHtml('erroInesperado'));
		}
		dispatch(LoaderCreators.disableLoading());
	};

	const insereDadosSocios = async empresaSave => {
		const responseInsert = await EmpresaService.update(empresaId, empresaSave);
		return responseInsert;
	};

	const removeGrupos = async empresaSave => {
		const listGrupo = [];
		const listAss = [];

		const removeIds = values.initialSociosIds.filter(
			item => empresaSave.Socios.findIndex(x => x.hasOwnProperty('Id') && x.Id === item) === -1
		);

		values.initialGruposAss.forEach(item => {
			item.Assinaturas.forEach(itemAss => {
				if (removeIds.findIndex(x => x === itemAss.SocioId) >= 0) {
					listAss.push(itemAss.Id);
				} else {
					const grupo = values.assinaturasSociosList.find(
						x => x.hasOwnProperty('Id') && x.Id === item.Id
					);
					if (grupo) {
						const assIndex = grupo.Assinaturas.findIndex(
							x => x.hasOwnProperty('Id') && x.Id === itemAss.Id
						);
						if (assIndex === -1) {
							listAss.push(itemAss.Id);
						}
					}
				}
			});
		});

		const responseDeleteAss = await SocioService.removeManyAssinaturasSocios(listAss);
		if (responseDeleteAss.data && responseDeleteAss.data.AssinaturaSocio_deleteMany === null) {
			return true;
		} else {
			return false;
		}
	};

	function setPercent(sociosListTemp) {
		if (sociosListTemp.length === 0) {
			return;
		}
		const totalParticipacao = sociosListTemp
			.map(socio => socio.ValorParticipacao)
			.reduce((total, valor) => total + Number(valor));
		for (let i = 0; i < sociosListTemp.length; i += 1) {
			if (totalParticipacao > 0) {
				let percentual =
					!isNaN(Number(sociosListTemp[i].ValorParticipacao)) &&
					Number(sociosListTemp[i].ValorParticipacao) > 0
						? sociosListTemp[i].ValorParticipacao
						: 0.0;
				sociosListTemp[i].Percentual =
					values.capitalSocialTotal > 0 ? percentual / parseFloat(values.capitalSocialTotal) : 0.0;
			} else {
				sociosListTemp[i].Percentual = 0.0;
			}
		}
	}

	// Documentacao

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

				let newfile = { file, dataEmissao: '' };
				newfile.dataEmissao = moment(documento.DataBasePeriodo).format('YYYY-MM-DD');
				files.push(newfile);

				const doc_db = _.find(buildDocumentos, doc => doc.tipoId === documento.TipoDocumento.Id);

				if (doc_db) {
					doc_db.files.concat(files);
				} else {
					let newDocumento = {
						tipoId: documento.TipoDocumento.Id,
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
		setKey(key + 1);
	};

	// Ações de retorno

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = (mensagem, response) => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	return (
		<Fragment>
			<Form onSubmit={handleSubmit} id='formSocios'>
				<Fragment>
					<DadosContrato
						formulario={{ getFieldProps, setFieldValue, submitCount, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						setItensAnalise={setItensAnalise}
						comentarios={comentarios}
						setComentarios={setComentarios}
						setCapitalSocialTotalPronto={setCapitalSocialTotalPronto}
						user={user}
						//historicoEmpresa={empresa.Historico}
						//disableEdit={getDisableEdit(
						//	user,
					//		empresa.AnaliseCadastro,
					//		getStatusItem(itensAnalise, 'Dados_Contrato_Social')
					//	)}
						//statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
					/> 
					<CadastroSocios
						formulario={{ getFieldProps, setFieldValue, submitCount, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						comentarios={comentarios}
						setComentarios={setComentarios}
						capitalSocialTotalPronto={capitalSocialTotalPronto}
						setItensAnalise={setItensAnalise}
						user={user}
						// disableEdit={getDisableEdit(
						// 	user,
						// 	empresa.AnaliseCadastro,
						// 	getStatusItem(itensAnalise, 'Cadastro_Socios')
						// )}
						//statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
					/>
					<CadastroAssinaturasSocios
						formulario={{ getFieldProps, setFieldValue, submitCount, values, setFieldTouched }}
						itensAnalise={itensAnalise}
						comentarios={comentarios}
						setComentarios={setComentarios}
						capitalSocialTotalPronto={capitalSocialTotalPronto}
						setItensAnalise={setItensAnalise}
						user={user}
						// disableEdit={getDisableEdit(
						// 	user,
						// 	empresa.AnaliseCadastro,
						// 	getStatusItem(itensAnalise, 'Cadastro_Signatario')
						// )}
						// statusEmpresa={empresa.AnaliseCadastro ? empresa.AnaliseCadastro.StatusAnalise : null}
					/>
					{/* <DadosDocumentacao
						key={key}
						documentos_db={documentosDB}
						formulario={{ submitCount, getFieldProps, setFieldValue, values, setFieldTouched }}
						tab={tab}
					/> */}
					
				</Fragment>
			</Form>
		</Fragment>
	);
}
