import { lazy } from 'react';
const ListagemTipoContato = lazy(() => import('./tipoContato/listar'));
const CadastrarTipoContato = lazy(() => import('./tipoContato/cadastrar'));
const ListagemTipoDocumento = lazy(() => import('./tipoDocumento/listar'));
const CadastrarTipoDocumento = lazy(() => import('./tipoDocumento/cadastrar'));
const ListagemTipoExigencia = lazy(() => import('./tipoExigencia/listar'));
const CadastrarTipoExigencia = lazy(() => import('./tipoExigencia/cadastrar'));
const CadastroComplementar = lazy(() => import('./autoCadastro/cadastroComplementar'));
const PreCadastro = lazy(() => import('./autoCadastro/preCadastro'));
const ListarTermosAceite = lazy(() => import('./termosAceite/listar'));
const CadastrarTemosAceite = lazy(() => import('./termosAceite/cadastrar'));
const GrupoPerguntaQualificacao = lazy(() => import('./grupoPerguntaQualificacao/listar'));
const CadastrarGrupoPerguntaQualificacao = lazy(() =>
	import('./grupoPerguntaQualificacao/cadastrar')
);
const PerguntaQualificacao = lazy(() => import('./perguntaQualificacao/listar'));
const CadastrarPerguntaQualificacao = lazy(() => import('./perguntaQualificacao/cadastrar'));
const ListagemAnalise = lazy(() => import('./analiseCadastro/listar'));
const CadastrarExigenciaGrupoPerguntaQualificacao = lazy(() =>
	import('./exigenciaGrupoPerguntaQualificacao/cadastrar')
);
const IndicadoresEconomicosFinanceiros = lazy(() => import('./indicadoresEconomicos'));
const ResultadoAnalise = lazy(() => import('./resultadoAnalise'));

export {
	ListagemTipoContato,
	CadastrarTipoContato,
	CadastroComplementar,
	PreCadastro,
	ListagemTipoDocumento,
	CadastrarTipoDocumento,
	ListarTermosAceite,
	CadastrarTemosAceite,
	ListagemTipoExigencia,
	CadastrarTipoExigencia,
	IndicadoresEconomicosFinanceiros,
	ResultadoAnalise,
	ListagemAnalise,
	GrupoPerguntaQualificacao,
	CadastrarGrupoPerguntaQualificacao,
	PerguntaQualificacao,
	CadastrarPerguntaQualificacao,
	CadastrarExigenciaGrupoPerguntaQualificacao
};
