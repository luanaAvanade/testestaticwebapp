import React, { Fragment, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Loader } from '@/components';
import { useSelector } from 'react-redux';
import paths from '@/utils/paths';
import { translate } from '@/locales';
import { PrivateRoute } from '@/layout';
import {
	Login,
	RedefinicaoSenha,
	SolicitacaoRedefinicaoSenha,
	ConfirmacaoCadastroFornecedor,
	EsqueciMeuEmailVerifica,
	EsqueciMeuEmailEnvia
} from './screens/autenticacao';
import {
	Importacao,
	Matriz,
	Acompanhamento,
	Resultado,
	ListagemVersao,
	CadastrarVersao,
	ListagemPergunta,
	CadastrarPergunta,
	Resposta,
	CadastrarGrupoUsuario,
	ListagemGrupoUsuario
} from './screens/mec';

import {
	ListagemTipoContato,
	CadastrarTipoContato,
	ListagemTipoDocumento,
	CadastrarTipoDocumento,
	ListagemTipoExigencia,
	CadastrarTipoExigencia,
	CadastroComplementar,
	PreCadastro,
	CadastrarTemosAceite,
	ListarTermosAceite,
	ListagemAnalise,
	CadastrarExigenciaGrupoPerguntaQualificacao,
	CadastrarGrupoPerguntaQualificacao,
	GrupoPerguntaQualificacao,
	PerguntaQualificacao,
	CadastrarPerguntaQualificacao
} from './screens/fornecedor';
import {
	EDITAR,
	CRIAR,
	VISUALIZAR,
	MEC_VERSAO,
	MEC_RESULTADO,
	MEC_GRAFICO,
	MEC_GRUPO_USUARIO,
	MEC_PERGUNTAS,
	MEC_IMPORTACAO,
	MEC_ACOMPANHAMENTO,
	MEC_RESPOSTA,
	FORNECEDOR_CADASTRO,
	FORNECEDOR_ANALISE_CADASTRO,
	FORNECEDOR_TIPO_CONTATO,
	FORNECEDOR_TIPO_DOCUMENTO,
	FORNECEDOR_TERMOS_ACEITE,
	FORNECEDOR_TIPO_GRUPO,
	FORNECEDOR_TIPO_EXIGENCIA,
	FORNECEDOR_EXIGENCIA
} from './utils/constants';

const Home = lazy(() => import('./screens/home'));
const SemPermissao = lazy(() => import('./screens/error'));


export default function Routes() {
	const { open, message } = useSelector(stateRedux => stateRedux.loader);

	return (
		<Fragment>
			<Loader open={open} message={message} />
			<Suspense fallback={<Loader open message={`${translate('carregando')}`} />}>
				<Switch>
				<Redirect exact from='/' to={paths.getPathByCodigo('login')} />
					<Redirect exact from='/semPermissao' to={paths.getPathByCodigo('semPermissao')} />
					<Route path={paths.getPathByCodigo('login')} component={Login} />
					<Route path={paths.getPathByCodigo('redefinicao-senha')} component={RedefinicaoSenha} />
					<Route
						path={paths.getPathByCodigo('confirmacao-cadastro-fornecedor')}
						component={ConfirmacaoCadastroFornecedor}
					/>
					<Route
						path={paths.getPathByCodigo('esqueci-meu-email-verifica')}
						component={EsqueciMeuEmailVerifica}
					/>
					<Route
						path={paths.getPathByCodigo('esqueci-meu-email-envia')}
						component={EsqueciMeuEmailEnvia}
					/>
					<Route
						path={paths.getPathByCodigo('solicitacao-redefinicao-senha')}
						component={SolicitacaoRedefinicaoSenha}
					/>
					<PrivateRoute path={paths.getPathByCodigo('home')} component={Home} />
					<PrivateRoute path={paths.getPathByCodigo('semPermissao')} component={SemPermissao} />

					<Route
						path={paths.getPathByCodigo('esqueci-meu-email-verifica')}
						component={EsqueciMeuEmailVerifica}
					/>
					<PrivateRoute
						funcionalidade={MEC_VERSAO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('editar-versao')}
						component={CadastrarVersao}
					/>
					<PrivateRoute
						funcionalidade={MEC_VERSAO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('nova-versao')}
						component={CadastrarVersao}
					/>
					<PrivateRoute
						funcionalidade={MEC_VERSAO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('versoes')}
						component={ListagemVersao}
					/>
					<PrivateRoute
						funcionalidade={MEC_PERGUNTAS}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('editar-pergunta')}
						component={CadastrarPergunta}
					/>
					<PrivateRoute
						funcionalidade={MEC_PERGUNTAS}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('nova-pergunta')}
						component={CadastrarPergunta}
					/>
					<PrivateRoute
						funcionalidade={MEC_PERGUNTAS}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('pergunta')}
						component={ListagemPergunta}
					/>
					<PrivateRoute
						funcionalidade={MEC_IMPORTACAO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('importacao')}
						component={Importacao}
					/>
					<PrivateRoute
						funcionalidade={MEC_RESULTADO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('resultado')}
						component={Resultado}
					/>
					<PrivateRoute
						funcionalidade={MEC_GRAFICO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('matriz')}
						component={Matriz}
					/>
					<PrivateRoute
						funcionalidade={MEC_ACOMPANHAMENTO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('acompanhamento')}
						component={Acompanhamento}
					/>
					<PrivateRoute
						funcionalidade={MEC_RESPOSTA}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('resposta')}
						component={Resposta}
					/>
					<PrivateRoute
						funcionalidade={MEC_GRUPO_USUARIO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('editar-grupo-respondente')}
						component={CadastrarGrupoUsuario}
					/>
					<PrivateRoute
						funcionalidade={MEC_GRUPO_USUARIO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('novo-grupo-respondente')}
						component={CadastrarGrupoUsuario}
					/>
					<PrivateRoute
						funcionalidade={MEC_GRUPO_USUARIO}
						acao={VISUALIZAR}
						path={paths.getPathByCodigo('grupo-respondente')}
						component={ListagemGrupoUsuario}
					/>
					<Route path={paths.getPathByCodigo('fornecedor')} component={PreCadastro} />
					<Route
						path={paths.getPathByCodigo('cadastro-complementar')}
						component={CadastroComplementar}
					/>
					<Route path={paths.getPathByCodigo('pre-cadastro')} component={PreCadastro} />
					<PrivateRoute
						path={paths.getPathByCodigo('novo-tipo-contato')}
						component={CadastrarTipoContato}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_CONTATO}
						path={paths.getPathByCodigo('editar-tipo-contato')}
						component={CadastrarTipoContato}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_CONTATO}
						path={paths.getPathByCodigo('tipo-contato')}
						component={ListagemTipoContato}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_DOCUMENTO}
						path={paths.getPathByCodigo('novo-tipo-documento')}
						component={CadastrarTipoDocumento}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_DOCUMENTO}
						path={paths.getPathByCodigo('editar-tipo-documento')}
						component={CadastrarTipoDocumento}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TERMOS_ACEITE}
						path={paths.getPathByCodigo('termos-aceite-cadastro')}
						component={CadastrarTemosAceite}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TERMOS_ACEITE}
						path={paths.getPathByCodigo('editar-termos-aceite')}
						component={CadastrarTemosAceite}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TERMOS_ACEITE}
						path={paths.getPathByCodigo('termos-aceite')}
						component={ListarTermosAceite}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_DOCUMENTO}
						path={paths.getPathByCodigo('tipo-documento')}
						component={ListagemTipoDocumento}
					/>

					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_EXIGENCIA}
						path={paths.getPathByCodigo('novo-tipo-exigencia')}
						component={CadastrarTipoExigencia}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_EXIGENCIA}
						path={paths.getPathByCodigo('editar-tipo-exigencia')}
						component={CadastrarTipoExigencia}
					/>
					<PrivateRoute
						funcionalidade={FORNECEDOR_TIPO_EXIGENCIA}
						path={paths.getPathByCodigo('tipo-exigencia')}
						component={ListagemTipoExigencia}
					/>

					<Route
						path={paths.getPathByCodigo('novo-grupo-pergunta-qualificacao')}
						component={CadastrarGrupoPerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('editar-grupo-pergunta-qualificacao')}
						component={CadastrarGrupoPerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('grupo-pergunta-qualificacao')}
						component={GrupoPerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('nova-pergunta-qualificacao')}
						component={CadastrarPerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('editar-pergunta-qualificacao')}
						component={CadastrarPerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('pergunta-qualificacao')}
						component={PerguntaQualificacao}
					/>
					<Route
						path={paths.getPathByCodigo('exigencia-grupo-cadastro')}
						component={CadastrarExigenciaGrupoPerguntaQualificacao}
					/>
					<PrivateRoute
						path={paths.getPathByCodigo('analise-cadastro')}
						component={ListagemAnalise}
					/>
					{/* <Redirect to={paths.getPathByCodigo('login')} /> */}
				</Switch>
			</Suspense>
		</Fragment>
	);
}
