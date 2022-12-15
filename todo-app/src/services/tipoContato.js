import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					TipoContato_list{
            value:Id
						Nome
						Descricao
						Status
					}
				}
			`
		});
	},
	findAllSelect() {
		return Http.request('/gql', {
			query: `query {
					TipoContato_list{
            value:Id
						label:Nome
						Descricao
						Status
					}
				}
			`
		});
	},
	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
					TipoContato(id: ..id){
						Id
						Nome
						Descricao
						Status
					}
				}
			`,
			variables: { id }
		});
	},
	verificarExistente(nome) {
		return Http.request('/gql', {
			query: `query{
				TipoContato_list(where:"Nome = \\"..{nome}\\" "){
				Id
				}

		}`
		});
	},
	create(tipoContato) {
		return Http.request('/gql', {
			query: `mutation(..tipoContato: TipoContatoCreateInput!) {
				TipoContato_insert (input:..tipoContato)
					{
						Id
						Nome
						Descricao
						Status
					}
				}
			`,
			variables: { tipoContato }
		});
	},

	update(id, tipoContato) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..tipoContato: TipoContatoUpdateInput!) {
				TipoContato_update (id:..id, input:..tipoContato)
					{
						Id
						Nome
						Descricao
						Status
					}
				}
			`,
			variables: { id, tipoContato }
		});
	},
	verificarChaveEstrangeira(id) {
		//todo[iuri] Verificar sintaxe para buscar apenas 1;
		return Http.request('/gql', {
			query: `query{ 
				Contato_list(where:"TipoContatoId = \\"..{id}\\" "){
				Id
				}

		}`
		});
	},
	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
				TipoContato_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
