import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					GrupoUsuario_list{
            Id
            Nome
						Descricao
					}
				}
			`
		});
	},

	findByFilter(where) {
		return Http.request('/gql', {
			query: `query {
					GrupoUsuario_list(where:"..{where}"){
            Id
						Nome
					}
				}
			`
		});
	},

	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
				GrupoUsuario(id: ..id){
					Id
					Nome
					Descricao
					}
				}
			`,
			variables: { id }
		});
	},

	create(input) {
		return Http.request('/gql', {
			query: `mutation(..input: GrupoUsuarioCreateInput!) {
				GrupoUsuario_insert (input:..input)
					{
						Id
						Nome
						Descricao
					}
				}
			`,
			variables: { input }
		});
	},
	update(id, input) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..input: GrupoUsuarioUpdateInput!) {
				GrupoUsuario_update (id:..id, input:..input)
					{
						Id
						Nome
						Descricao
					}
				}
			`,
			variables: { id, input }
		});
	},
	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
				GrupoUsuario_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
