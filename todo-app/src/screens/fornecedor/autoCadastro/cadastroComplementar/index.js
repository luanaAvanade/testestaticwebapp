import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs, Tab, Box, Typography } from '@material-ui/core';
import useReactRouter from 'use-react-router';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { snackError, snackWarning } from '@/utils/snack';
import { getUser } from '@/utils/auth';
import theme from '@/theme';
import _ from 'lodash';
import paths from '@/utils/paths';
import { translate } from '@/locales';
import { Title, LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import DadosBasicos from '@/screens/fornecedor/autoCadastro/dadosBasicos';
import DadosComplementar from '@/screens/fornecedor/autoCadastro/dadosComplementares';
import DadosFinanceiros from '@/screens/fornecedor/autoCadastro/dadosFinanceiros';
import QualificacaoaRiscoFinanceiro from '@/screens/fornecedor/qualificacaoRiscoFinanceiro';
import DadosSocios from '@/screens/fornecedor/autoCadastro/dadosSocios';
import EmpresaService from '@/services/empresa';
import ObjectHelper from '@/utils/objectHelper';
import {
	ENUM_ITEMS_ANALISE,
	ENUM_STATUS_ANALISE,
	COMANDO_CADASTRO_FORNECEDOR,
	CADASTRO_DESCENTRALIZADO,
	TAB_DADOS_BASICOS,
	TAB_DADOS_SOCIOS,
	TAB_DADOS_COMPLEMENTAR,
	TAB_DADOS_FINANCEIROS,
	TAB_QUALIFICACAO,
	CADASTRO_PENDENTE_ANALISE,
	CADASTRO_CRIADO
} from '@/utils/constants';
import { DisplayDiv } from './style';
import { Done, Clear } from '@material-ui/icons';

import { Confirm, Button, Card, Modal } from 'react-axxiom';
import { BotoesCadastro } from '@/screens/fornecedor/autoCadastro/componentesLayout/botoesCadastro';
import { BotoesDadosComplementares } from '@/screens/fornecedor/autoCadastro/componentesLayout/botoesDadosComplementares';
import { StatusEmpresa } from '@/screens/fornecedor/autoCadastro/componentesLayout/statusEmpresa';
import { BotoesDadosFinanceiros } from '@/screens/fornecedor/autoCadastro/componentesLayout/botoesDadosFinanceiros';
import { BotoesDadosSocios } from '@/screens/fornecedor/autoCadastro/componentesLayout/botoesDadosSocios';
import { getDisableEdit } from '../aprovacao/util';
import TermosAceiteEmpresaService from '@/services/termoAceiteEmpresa';
import { Valid, Invalid } from './style';

export default function CadastroComplemetar() {
	const { history, match } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	 const idParam = match.isExact
	 	? null
	 	: parseInt(window.location.pathname.split(`${match.url}/`)[1], 10);

   // const idParam = 1;
	//Mocar historico

	const historicoEmpresa = [
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Mariana Athayde Garcia',
				Perfil: 0
			},
			DataCriacao: '2019-10-20',
			Categoria: 0,
			Valor: 0,
			Item: null,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Cadastro Criado`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Mariana Athayde Garcia',
				Perfil: 0
			},
			DataCriacao: '2019-10-20',
			Categoria: 0,
			Valor: 2,
			Item: null,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Pendente de Análise`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Rafael Lima Souza',
				Perfil: 0
			},
			DataCriacao: '2019-10-25',
			Categoria: 1,
			Valor: 9,
			Item: null,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Análise Assumida`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Rafael Lima Souza',
				Perfil: 0
			},
			DataCriacao: '2019-10-25',
			Categoria: 3,
			Valor: 4,
			Item: 5,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Dados Sócios Aprovado`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Rafael Lima Souza',
				Perfil: 0
			},
			DataCriacao: '2019-10-25',
			Categoria: 3,
			Valor: 4,
			Item: 5,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Dados Sócios Aprovado`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Rafael Lima Souza',
				Perfil: 0
			},
			DataCriacao: '2019-10-25',
			Categoria: 3,
			Valor: 4,
			Item: 5,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Dados Sócios Aprovado`
		},
		{
			Id: 1,
			Autor: {
				Id: 1,
				Name: 'Rafael Lima Souza',
				Perfil: 0
			},
			DataCriacao: '2019-10-25',
			Categoria: 3,
			Valor: 4,
			Item: 5,
			Comentario: null,
			EmpresaId: 135,
			ArquivoId: null,
			UsuarioId: null,
			Descricao: `Dados Sócios Aprovado`
		}
	];

	// Estados locais

	const [
		tab,
		setTab
	] = useState(0);

	const [
		tabAdd,
		setTabAdd
	] = useState(0);

	const [
		empresaId,
		setEmpresaId
	] = useState(0);

	const [
		empresa,
		setEmpresa
	] = useState(null);

	const [
		key,
		setKey
	] = useState(0);

	const [
		itensAnalise,
		setItensAnalise
	] = useState([]);

	const [
		comentarios,
		setComentarios
	] = useState([]);

	const [
		socioIsValid,
		setSocioIsValid
	] = useState(false);

	const [
		qualificacaoRiscoFinanceiroIsValid,
		setQualificacaoRiscoFinanceiroIsValid
	] = useState(false);

	const [
		dadosBasicosIsValid,
		setDadosBasicosIsValid
	] = useState(false);

	const [
		dadosFinanceirosIsValid,
		setDadosFinanceirosIsValid
	] = useState(false);

	const [
		balancoPatrimonialIsValid,
		setBalancoPatrimonialIsValid
	] = useState(false);

	const [
		balancoDREIsValid,
		setBalancoDREIsValid
	] = useState(false);

	const [
		dadosComplementaresIsValid,
		setDadosComplementaresIsValid
	] = useState(false);

	const [
		listTermosAceiteEmpresa,
		setListTermosAceiteEmpresa
	] = useState([]);

	const [
		erroTermoAceite,
		setErroTermoAceite
	] = useState('');

	const [
		statusCadastro,
		setStatusCadastro
	] = useState(ENUM_STATUS_ANALISE.find(x => x.internalName === 'Criado').value);

	const [
		user,
		setUser
	] = useState(null);

	const [
		acao,
		setAcao
	] = useState(null);

	const [
		acaoCadastroComplementar,
		setAcaoCadastroComplementar
	] = useState(null);

	const [
		acaoCadastroSocios,
		setAcaoCadastroSocios
	] = useState(null);

	const [
		acaoCadastroFinanceiro,
		setAcaoCadastroFinanceiro
	] = useState(null);


	const [
		openSalvarDados,
		setOpenSalvarDados
	] = useState(false);

	const [
		tabChanged,
		setTabChanged
	] = useState(0);

	const [
		changed,
		setChanged
	] = useState(false);

	const [
		modalLembreteAtualizacaoCadastro,
		setModalLembreteAtualizacaoCadastro
	] = useState(false);

	const [
		modalInformeDadosBasicos,
		setModalInformeDadosBasicos
	] = useState(false);

	const [
		countLembrete,
		setCountLembrete
	] = useState(0);

	// Efeito Inicial
	useEffect(() => {

		if(idParam && idParam != null){
			setEmpresaId(idParam);
			empresaFindById();
			setAbasCadastro();
		}
		setEmpresa(null);
		setItensAnalise([]);
			setComentarios([]);
			setListTermosAceiteEmpresa([]);
			setDadosBasicosIsValid(false);
			setDadosFinanceirosIsValid(false);
			setDadosComplementaresIsValid(false);
			setSocioIsValid(false);
			setStatusCadastro(null);

		//empresaFindById();
		return () => {
					};
	}, []);

	// Buscar Dados
	const empresaFindById = async () => {
		dispatch(LoaderCreators.setLoading());		
		var UsuarioEmp = {
			Nome: 'Luana Rodrigues Santos'
		}

		var UsuarioEmp2 = {
			Nome: 'Luana Rodrigues Santos'
		}


		var calcRiscoLista = [
		{
			ClassificacaoFase1: 1
		}

		];

		try {
			const response = await EmpresaService.findById(idParam);
			if (response.data && response.data.Empresa_list.length > 0) {
				response.data.Empresa_list[0].Historico = historicoEmpresa;
				setEmpresa(response.data.Empresa_list[0]);
				setKey(key + 1);
				if(response.data.Empresa_list[0].AnaliseCadastro && response.data.Empresa_list[0].AnaliseCadastro.StatusAnalise == ENUM_STATUS_ANALISE[2].value){
					setDadosBasicosIsValid(true);
					setDadosFinanceirosIsValid(true);
					setSocioIsValid(true);
					setQualificacaoRiscoFinanceiroIsValid(true);
					setDadosComplementaresIsValid(true);
				}
				response.data.Empresa_list[0] = montarAnalise(response.data.Empresa_list[0]);
				// const t = response.data.Empresa_list[0].AnaliseCadastro.ItensAnalise;
				// t.forEach(x => (x.ArquivoId = x.ArquivoId === '' ? null : x.ArquivoId));
				setItensAnalise(response.data.Empresa_list[0].AnaliseCadastro.ItensAnalise);
				setStatusCadastro(
					response.data.Empresa_list[0].AnaliseCadastro.StatusAnalise === ''
						? null
						: response.data.Empresa_list[0].AnaliseCadastro.StatusAnalise
				);
				setListTermosAceiteEmpresa(response.data.Empresa_list[0].TermoAceiteEmpresa);
				setKey(key + 1);

				// if (
				// 	!usuario.perfilAnalista &&
				// 	countLembrete === 0 &&
				// 	response.data.Empresa_list[0].AnaliseCadastro.StatusAnalise === CADASTRO_CRIADO
				// ) {
				// 	setModalLembreteAtualizacaoCadastro(true);
				// 	setCountLembrete(1);
				// }


				dispatch(LoaderCreators.disableLoading());
			} else {
				dispatch(LoaderCreators.disableLoading());
				callbackError(translate('erroCarregamentoDadosEmpresa'));
			}
			dispatch(LoaderCreators.disableLoading());
		} catch (error) {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	function setAbasCadastro(){
		if(empresa && empresa.AnaliseCadastro && empresa.AnaliseCadastro.StatusAnalise == ENUM_STATUS_ANALISE[2].value){
			setDadosBasicosIsValid(true);
			setDadosFinanceirosIsValid(true);
			setBalancoPatrimonialIsValid(true);
			setDadosComplementaresIsValid(true);
		}
	}

	const goHome = () => {
		dispatch(LoaderCreators.disableLoading());
		history.push(paths.getPathByCodigo('home'));
	};

	const goAnalise = () => {
		dispatch(LoaderCreators.disableLoading());
		history.push(paths.getPathByCodigo('analise-cadastro'));
	};

	function getItensAnalise() {
		const itensAnaliseTemp = ObjectHelper.clone(itensAnalise);
		itensAnaliseTemp.forEach(x => {
			x.TipoItem = ENUM_ITEMS_ANALISE.find(t => t.value === x.TipoItem).internalName;
			x.Status = ENUM_STATUS_ANALISE.find(t => t.value === x.Status).internalName;
			x.AutorId = x.AutorId === '' ? null : x.AutorId;
		});
		return itensAnaliseTemp;
	}

	function getAnaliseCadastro() {
		const obj = {
			ItensAnalise: getItensAnalise()
		};

		if (empresa && empresa != null && empresa.AnaliseCadastro.hasOwnProperty('Id') && empresa.AnaliseCadastro.Id !== null) {
			obj.Id = empresa.AnaliseCadastro.Id;
		}
		if (
			empresa && empresa != null && empresa.AnaliseCadastro.hasOwnProperty('AtribuidoId') &&
			empresa.AnaliseCadastro.AtribuidoId !== null
		) {
			obj.AtribuidoId =
				empresa.AnaliseCadastro.AtribuidoId === '' ? null : empresa.AnaliseCadastro.AtribuidoId;
		}
		if (acao) {
			if (acao !== COMANDO_CADASTRO_FORNECEDOR.salvar) {
				obj.StatusAnalise = ENUM_STATUS_ANALISE.find(x => x.acao === acao).internalName;
			} else {
				obj.StatusAnalise = ENUM_STATUS_ANALISE.find(
					x => x.value === empresa.AnaliseCadastro.StatusAnalise
				).internalName;
			}
		}
		return obj;
	}

	function getComentarios() {
		let comentariosTemp = ObjectHelper.clone(comentarios);
		comentariosTemp.forEach(x => {
			x.Local = ENUM_ITEMS_ANALISE.find(y => y.value === x.Local).internalName;
			delete x.DataCriacao;
			//x.Usuario ? delete x.Usuario : null;
		});
		return comentariosTemp;
	}

	const getTermoNaoAceitos = () => {
		return _.filter(listTermosAceiteEmpresa, termoAceite => termoAceite.Aceite === false);
	};

	function enviarCadastro() {
			if (
				!(
					dadosBasicosIsValid &&
					dadosComplementaresIsValid &&
					((dadosFinanceirosIsValid && socioIsValid))
				)
			) {

				if(tab == 1){
					setAcaoCadastroComplementar(COMANDO_CADASTRO_FORNECEDOR.validar);
				}
				if(tab == 2){
					setAcaoCadastroFinanceiro(COMANDO_CADASTRO_FORNECEDOR.validar);
				}
				if(tab == 3){
					setAcaoCadastroSocios(COMANDO_CADASTRO_FORNECEDOR.validar);
				}
				if(tab == 0){
					setAcao(COMANDO_CADASTRO_FORNECEDOR.validar);
				}		
				
				callbackWarning(translate('possuemCamposPreenchidosIncorretamente'));
			} else {
				setAcao(COMANDO_CADASTRO_FORNECEDOR.enviarCadastro);
			}
		
	}

	function finalizarAnalise() {
		if (
			!(
				validarAnalise() &&
				dadosBasicosIsValid &&
				dadosComplementaresIsValid &&
				((dadosFinanceirosIsValid && socioIsValid) ||
					empresa.TipoCadastro === CADASTRO_DESCENTRALIZADO.codigo)
			)
		) {
			setAcao(COMANDO_CADASTRO_FORNECEDOR.validar);
			callbackWarning(translate('possuemCamposPreenchidosIncorretamenteNaoAprovados'));
		} else {
			setAcao(COMANDO_CADASTRO_FORNECEDOR[getResultadoAnalise()]);
		}
	}

	function validarAnalise() {
		if (
			itensAnalise.find(
				x =>
					x.Status === ENUM_STATUS_ANALISE.find(y => y.internalName === 'Criado').value ||
					x.Status === null
			)
		) {
			return false;
		}
		return true;
	}

	function salvarAba(aba) {		
		if (empresa && empresa != null && empresa.AnaliseCadastro && empresa.AnaliseCadastro != null) {
			if(empresa.AnaliseCadastro.StatusAnalise != ENUM_STATUS_ANALISE[2].value){
				setAcaoCadastro(aba);
			}
		}
		else{
			setAcaoCadastro(aba);
		}
		
	
	}


	function setAcaoCadastro(aba){

		if(aba == 1){
			setAcaoCadastroComplementar(COMANDO_CADASTRO_FORNECEDOR.criarCadastro);
		}
		if(aba == 2){
			setAcaoCadastroFinanceiro(COMANDO_CADASTRO_FORNECEDOR.criarCadastro);
		}
		if(aba == 3){
			setAcaoCadastroSocios(COMANDO_CADASTRO_FORNECEDOR.criarCadastro);
		}
		if(aba == 0){
			setAcao(COMANDO_CADASTRO_FORNECEDOR.criarCadastro);
		}		
	}

	//Aprovacao
	const montarAnalise = dado => {
		// if (dado.AnaliseCadastro.ItensAnalise === null) {
		// 	dado.AnaliseCadastro.ItensAnalise = [];
		// } else {
		// 	dado.AnaliseCadastro.ItensAnalise.forEach(
		// 		x => (x.ArquivoId = x.ArquivoId === '' ? null : x.ArquivoId)
		// 	);
		// }
		//dado.AnaliseCadastro.AtribuidoId === '' ? null : dado.AnaliseCadastro.AtribuidoId;
		//return dado;
	};

	// Ações de retorno
	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};
	const callbackWarning = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};
	const alterTab = () => {
		salvarAba(tab);
		setTimeout(() => closeModalSave(), 50);
		setTab(tabAdd);
	};

	const closeModalSave = () => {
		setOpenSalvarDados(false);
	};

	const closeModal = () => {
		setChanged(false);
		setOpenSalvarDados(false);
		setTab(tabChanged);
	};

	const getIconIsValid = isValid => {
		return isValid ? <Valid /> : <Invalid />;
	};

	const getIconIsValidSocio = isValid => {

		if (empresa && empresa != null && empresa.AnaliseCadastro && empresa.AnaliseCadastro != null) {
			if(empresa.AnaliseCadastro.StatusAnalise == ENUM_STATUS_ANALISE[2].value){
				return <Valid />;
			}
		}
		return isValid ? <Valid /> : <Invalid />;
	};

	function getResultadoAnalise() {
		if (
			itensAnalise.find(
				x => x.Status === ENUM_STATUS_ANALISE.find(y => y.internalName === 'Reprovado').value
			)
		)
			return ENUM_STATUS_ANALISE.find(y => y.internalName === 'Reprovado').acao;

		if (
			itensAnalise.find(
				x =>
					x.Status === ENUM_STATUS_ANALISE.find(y => y.internalName === 'Aprovado_Ressalvas').value
			)
		)
			return ENUM_STATUS_ANALISE.find(y => y.internalName === 'Aprovado_Ressalvas').acao;

		return ENUM_STATUS_ANALISE.find(y => y.internalName === 'Aprovado').acao;
	}

	const setTabWithChangesCheck = newTab => {
		setTabAdd(newTab);
		if (changed) {
			setTabChanged(newTab);
			setOpenSalvarDados(true);
		} else if(tab == 0 || tab == '0'){
			if (empresa && empresa != null && empresa.AnaliseCadastro && empresa.AnaliseCadastro != null) {
				if(empresa.AnaliseCadastro.StatusAnalise != ENUM_STATUS_ANALISE[2].value){
					setModalInformeDadosBasicos(true);
				}
				else{
					setTab(newTab);
				}
			}else{
				setModalInformeDadosBasicos(true);
			}
			
		} 
		else
		{
			setTab(newTab);
		}
	};

	return (
		<LayoutContent noCard>
			<Title text={paths.getTitle(paths.getCurrentPath(history))} />

			{comentarios.count > 0 && <p>{comentarios[0].Coment}</p>}
			<Modal
				open={modalLembreteAtualizacaoCadastro}
				handleClose={() => setModalLembreteAtualizacaoCadastro(false)}
				onClickButton={() => setModalLembreteAtualizacaoCadastro(false)}
				title={
					<h3 align='center'>
						{translate('Olá ')} {user !== null ? user.nome : ''}
					</h3>
				}
				textButton={translate('ok')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			>
				<Typography variant='h5' align='center'>
					{translate('msgAlertaAtualizacaoCadastro')}
				</Typography>
			</Modal>

			<Modal
				open={modalInformeDadosBasicos}
				handleClose={() => setModalInformeDadosBasicos(false)}
				onClickButton={() => setModalInformeDadosBasicos(false)}
				title={
					<h5 align='center'>
						{'Dados obrigatórios'}
					</h5>
				}
				textButton={translate('ok')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			>
				<Typography variant='h5' align='center'>
					{'É obrigatório o preenchimento dos dados básicos para dar prosseguimento ao cadatro.'}
				</Typography>
			</Modal>

			<Confirm
				open={openSalvarDados}
				handleClose={() => closeModal()}
				handleSuccess={() => alterTab()}
				title={translate('salvarDados')}
				text={translate('desejaSalvarDados')}
				textButtonSuccess={translate('salvar')}
				textButtonCancel={translate('descartarAlteracoes')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>
				<Box justifyContent='space-between' display='flex'>
					<Box>
						<Tabs
							value={tab}
							onChange={(event, newValue) => setTabWithChangesCheck(newValue)}
							indicatorColor='primary'
							textcolor='primary'
						>
								<Tab
									value={TAB_DADOS_BASICOS}
									label={translate('dadosBasicos')}
									icon={getIconIsValid(dadosBasicosIsValid)}
								/>
								<Tab
									value={TAB_DADOS_COMPLEMENTAR}
									label={translate('dadosComplementares')}
									icon={getIconIsValid(dadosComplementaresIsValid)}
								/>
								<Tab
									value={TAB_DADOS_FINANCEIROS}
									label={translate('dadosFinanceiros')}
									icon={getIconIsValid(dadosFinanceirosIsValid)}
								/>
								<Tab
									value={TAB_DADOS_SOCIOS}
									label={translate('dadosSocios')}
									icon={getIconIsValidSocio(socioIsValid)}
								/>
								{idParam &&
							idParam != null && 
								<Tab
									value={TAB_QUALIFICACAO}
									label={translate('qualificacaoRiscoFinanceiro')}
									icon={getIconIsValid(qualificacaoRiscoFinanceiroIsValid)}
								/>
							
							}
						</Tabs>
					</Box>
					{/* <StatusEmpresa statusEmpresa={empresa.AnaliseCadastro.StatusAnalise} /> */}
				</Box>
				<Fragment>
					<DisplayDiv visible={tab === TAB_DADOS_BASICOS}>
					<DadosBasicos
							preCadastro
					acao={acao}
					empresa={empresa}
					empresaId={empresaId}
					setEmpresaId={setEmpresaId}
					setEmpresa={setEmpresa}
					setAcao={setAcao}
					setDadosBasicosIsValid={setDadosBasicosIsValid}
					setChanged={setChanged}
					getAnaliseCadastro={getAnaliseCadastro}
						/>
						<BotoesCadastro
							setAcao={setAcao}
							enviarCadastro={enviarCadastro}
							empresaFindById={empresaFindById}
							finalizarAnalise={finalizarAnalise}
							statusEmpresa={"Pendente Envio"}
						/>
					</DisplayDiv>
					<DisplayDiv visible={tab === TAB_DADOS_COMPLEMENTAR}>
						<DadosComplementar
							key={key + 1}
							empresaId={empresaId}
					        setEmpresaId={setEmpresaId}
							empresa={empresa}
							preCadastro={!empresa}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							getComentarios={getComentarios}
							setDadosComplementaresIsValid={setDadosComplementaresIsValid}
							getAnaliseCadastro={getAnaliseCadastro}
							user={user}
							acao={acao}
							tab={tab}
							setAcao={setAcao}
							setAcaoCadastroComplementar={setAcaoCadastroComplementar}
							acaoCadastroComplementar={acaoCadastroComplementar}
							listTermosAceiteEmpresa={listTermosAceiteEmpresa}
							setListTermosAceiteEmpresa={setListTermosAceiteEmpresa}
							erroTermoAceite={erroTermoAceite}
							setErroTermoAceite={setErroTermoAceite}
							getTermoNaoAceitos={getTermoNaoAceitos}
							setChanged={setChanged}
						/>
						<BotoesDadosComplementares
							setAcaoCadastroComplementar={setAcaoCadastroComplementar}
							enviarCadastro={enviarCadastro}
							empresaFindById={empresaFindById}
							finalizarAnalise={finalizarAnalise}
							statusEmpresa={"Pendente Envio"}
						/>
					</DisplayDiv>
					<DisplayDiv visible={tab === TAB_DADOS_FINANCEIROS}>
						<DadosFinanceiros
							key={key + 2}
							empresa={empresa}
							preCadastro={!empresa}
							empresaId={empresaId}
							setEmpresaId={setEmpresaId}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							getComentarios={getComentarios}
							setDadosFinanceirosIsValid={setDadosFinanceirosIsValid}
							getAnaliseCadastro={getAnaliseCadastro}
							setBalancoPatrimonialIsValid={setBalancoPatrimonialIsValid}
							setBalancoDREIsValid={setBalancoDREIsValid}
							user={user}
							acao={acao}
							tab={tab}
							setAcao={setAcao}
							setAcaoCadastroFinanceiro={setAcaoCadastroFinanceiro}
							acaoCadastroFinanceiro={acaoCadastroFinanceiro}
							listTermosAceiteEmpresa={listTermosAceiteEmpresa}
							setListTermosAceiteEmpresa={setListTermosAceiteEmpresa}
							erroTermoAceite={erroTermoAceite}
							setErroTermoAceite={setErroTermoAceite}
							getTermoNaoAceitos={getTermoNaoAceitos}
							setChanged={setChanged}
						/>
						<BotoesDadosFinanceiros
							setAcaoCadastroFinanceiro={setAcaoCadastroFinanceiro}
							enviarCadastro={enviarCadastro}
							empresaFindById={empresaFindById}
							//disableEdit={getDisableEdit(user, empresa.AnaliseCadastro, null)}
							finalizarAnalise={finalizarAnalise}
						/>
					</DisplayDiv>
					<DisplayDiv visible={tab === TAB_DADOS_SOCIOS}>
						<DadosSocios
							key={key + 4}
							setKey={setKey}
							empresaId={empresaId}
							setEmpresaId={setEmpresaId}
							empresa={empresa}
							preCadastro={!empresa}
							empresaFindById={empresaFindById}
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							getComentarios={getComentarios}
							setSocioIsValid={setSocioIsValid}
							getAnaliseCadastro={getAnaliseCadastro}
							user={user}
							acao={acao}
							tab={tab}
							setAcao={setAcao}
							setAcaoCadastroSocios={setAcaoCadastroSocios}
							acaoCadastroSocios={acaoCadastroSocios}
							listTermosAceiteEmpresa={listTermosAceiteEmpresa}
							setListTermosAceiteEmpresa={setListTermosAceiteEmpresa}
							erroTermoAceite={erroTermoAceite}
							setErroTermoAceite={setErroTermoAceite}
							getTermoNaoAceitos={getTermoNaoAceitos}
							setChanged={setChanged}
						/>
						<BotoesDadosSocios
							setAcaoCadastroSocios={setAcaoCadastroSocios}
							enviarCadastro={enviarCadastro}
							empresaFindById={empresaFindById}
							//disableEdit={getDisableEdit(user, empresa.AnaliseCadastro, null)}
							finalizarAnalise={finalizarAnalise}
						/>
					</DisplayDiv>

					{idParam &&
							idParam != null && 
					<DisplayDiv visible={tab === TAB_QUALIFICACAO}>
							<QualificacaoaRiscoFinanceiro key={key + 3} empresa={empresa} tab={tab} />
					</DisplayDiv>
							}
				
				 </Fragment> 
		</LayoutContent>
	);
}
