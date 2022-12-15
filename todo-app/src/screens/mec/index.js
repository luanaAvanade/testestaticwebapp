import { lazy } from 'react';
const CadastrarGrupoUsuario = lazy(() => import('./grupoUsuario/cadastrar'));
const ListagemGrupoUsuario = lazy(() => import('./grupoUsuario/listar'));
const Importacao = lazy(() => import('./importacao'));
const Matriz = lazy(() => import('./matriz'));
const Acompanhamento = lazy(() => import('./acompanhamento'));
const ListagemPergunta = lazy(() => import('./pergunta/listar'));
const CadastrarPergunta = lazy(() => import('./pergunta/cadastrar'));
const Resposta = lazy(() => import('./resposta'));
const Resultado = lazy(() => import('./resultado'));
const ListagemVersao = lazy(() => import('./versao/listar'));
const CadastrarVersao = lazy(() => import('./versao/cadastrar'));

export {
	CadastrarGrupoUsuario,
	ListagemGrupoUsuario,
	Importacao,
	Matriz,
	Acompanhamento,
	ListagemPergunta,
	CadastrarPergunta,
	Resposta,
	Resultado,
	ListagemVersao,
	CadastrarVersao
};
