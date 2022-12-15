import Http from '@/utils/http';

export default {
	findByPergunta(perguntaId) {
		return Http.request('/gql', {
			query: `query {
					PerguntaGrupoUsuario_list(where:"PerguntaId=..{perguntaId}"){
						Id
						GrupoUsuario{
							Id
							Nome
							Descricao
						}
						Tipo
					}
				}
			`
		});
	},

	createMany(input) {
		return Http.request('/gql', {
			query: `mutation(..input: [PerguntaGrupoUsuarioCreateInput!]!) {
				PerguntaGrupoUsuario_insertMany (input:..input){	Id }
				}
			`,
			variables: { input }
		});
	},

	removeMany(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				PerguntaGrupoUsuario_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	}
};
