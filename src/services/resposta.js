import http from '@/utils/http';

export default {
	create(respostaList) {
		return http.request('/gql', {
			query: `mutation(..respostaList:[RespostaCreateInput!]!) {
				Resposta_insertMany(input:..respostaList){
						Id
						CategoriaId
						Nota
						NaoAplicavel
					}
				}
			`,
			variables: { respostaList }
		});
	},

	update(ids, respostaList) {
		return http.request('/gql', {
			query: `mutation(..ids:[ID!]!, ..respostaList:[RespostaUpdateInput!]!) {
				Resposta_updateMany(ids:..ids, input:..respostaList){
						Id
						CategoriaId
						Nota
						NaoAplicavel
					}
				}
			`,
			variables: { ids, respostaList }
		});
	},

	findByPergunta(perguntaId, usuarioId) {
		return http.request('/gql', {
			query: `query{
			Resposta_list(where:"PerguntaId=..{perguntaId} and UsuarioId=..{usuarioId} and !VersaoMec.Encerrado"){
				Id
				CategoriaId
				Nota
				NaoAplicavel
			}
		}`
		});
	},

	countByUsuario(usuarioId) {
		return http.request('/gql', {
			query: `query{
				Resposta_count(where:"Nota > 0 and UsuarioId=..{usuarioId} and !VersaoMec.Encerrado" groupBy:"PerguntaId"){
				Group
				Count
			}
		}`
		});
	},

	countByFilter(where) {
		return http.request('/gql', {
			query: `query{
				Resposta_count(where:"..{where}" groupBy:"PerguntaId"){
				Group
				Count
			}
		}`
		});
	},

	gerar(perguntaId, usuarioId) {
		return http.request('/gql', {
			query: `mutation{
			Resposta_gerar(input:{PerguntaId:..{perguntaId},UsuarioId:..{usuarioId}}){
				Id
				Categoria{
					Id
					Codigo
					Descricao
					Tipo
				}
				Nota
				NaoAplicavel
			}
		}`
		});
	}
};
