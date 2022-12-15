import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
				TermosAceite_list(orderBy:"DataCriacao desc"){
						Id
						Titulo 
						SubTitulo 
						Status
						TipoFornecedor
						TipoCadastro 
						Descricao
						
					}
				}
			`
		});
	},
	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
				TermosAceite(id: ..id){
					Id
          Titulo 
          SubTitulo 
          Status
          TipoFornecedor
          TipoCadastro 
					Descricao
					}
				}
			`,
			variables: { id }
		});
	},
	create(termoAceite) {
		return Http.request('/gql', {
			query: `mutation(..termoAceite: TermosAceiteCreateInput!) {
				TermosAceite_insert (input:..termoAceite)
					{
						Id
						Titulo 
						SubTitulo 
						Status
						TipoFornecedor
						TipoCadastro 
						Descricao
					}
				}
			`,
			variables: { termoAceite }
		});
	},
	update(id, termoAceite) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..termoAceite: TermosAceiteUpdateInput!) {
				TermosAceite_update (id:..id, input:..termoAceite)
					{
						Id
						Titulo 
						SubTitulo 
						Status
						TipoFornecedor
						TipoCadastro 
						Descricao
					}
				}
			`,
			variables: { id, termoAceite }
		});
	},

	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
				TermosAceite_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	},

	verificarExistente(titulo, tipoFornecedorVal, tipoCadastro) {
		return Http.request('/gql', {
			query: `query{
		TermosAceite_list(where:"Titulo = \\"..{titulo}\\" and TipoFornecedor= \\"..{tipoFornecedorVal}\\" and TipoCadastro= \\"..{tipoCadastro}\\" "){
				Id
				}

		}`
		});
	},

	listTermosAceite(tipoFornecedor, tipoCadastro) {
		return Http.request('/gql', {
			query: `query{
		TermosAceite_list(where:"TipoFornecedor= \\"..{tipoFornecedor}\\" and TipoCadastro= \\"..{tipoCadastro}\\""){
				Id
				Titulo
				Status
				SubTitulo
        Descricao
				}
		}`
		});
	}
};
