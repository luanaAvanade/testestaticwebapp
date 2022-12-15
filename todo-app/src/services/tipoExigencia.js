import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					TipoExigencia_list{
						Id
						DataCriacao
						Nome
						Descricao
						NivelExigencia
						Status
					}
				}
			`
		});
	},

	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
					TipoExigencia(id: ..id){
						Id
						Nome
						Descricao
						NivelExigencia
						Status
					}
				}
			`,
			variables: { id }
		});
	},

	findDuplicate(nome, nivel, status) {
		return Http.request('/gql', {
			query: `query{
				TipoExigencia_list(where:"Nome = \\"..{nome}\\" and NivelExigencia=\\"..{nivel}\\" and Status=\\"..{status}\\""){
					Id
				}
			}
			`,
			variables: { nome, nivel, status }
		});
	},

	create(tipoExigencia) {
		return Http.request('/gql', {
			query: `mutation(..tipoExigencia: TipoExigenciaCreateInput!) {
				TipoExigencia_insert (input:..tipoExigencia)
					{
						Id
						Nome
						Descricao
						NivelExigencia
						Status
					}
				}
			`,
			variables: { tipoExigencia }
		});
	},

	update(id, tipoExigencia) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..tipoExigencia: TipoExigenciaUpdateInput!) {
				TipoExigencia_update (id:..id, input:..tipoExigencia)
					{
						Id
						Nome
						Descricao
						NivelExigencia
						Status
					}
				}
			`,
			variables: { id, tipoExigencia }
		});
	},

	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
				TipoExigencia_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
