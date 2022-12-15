import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					ValidadeDocumentoEstado_list{
						Id
						DataCriacao
						DataModificacao
						Nome
						Help
						Obrigatorio
						ValidadeMeses
						EspecificidadePorEstado
						QuantidadeMaxima
						TamanhoMaximo
					}
				}
			`
		});
	},
	findById(id) {
		return Http.request('/gql', {
			query: `query{
					TipoDocumento_list(where: "id= ..{id}"){
						Id
						DataCriacao
						DataModificacao
						Nome
						Help
						Obrigatorio
						ValidadeMeses
						EspecificidadePorEstado
						QuantidadeMaxima
						TamanhoMaximo
						ValidadeDocumentoEstado{
							Estado: EstadoId
							ValidadeMeses
						}
					}
				}
			`
		});
	},
	create(tipoDocumento) {
		return Http.request('/gql', {
			query: `mutation(..tipoDocumento: TipoDocumentoCreateInput!){
				TipoDocumento_insert (input:..tipoDocumento)
					{
						Id
						Nome
						Help
					}
				}
			`,
			variables: { tipoDocumento }
		});
	},

	update(id, tipoDocumento, idsValidadeDocRemove) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..tipoDocumento: TipoDocumentoUpdateInput!) {
				ValidadeDocumentoEstado_deleteMany (ids:..idsValidadeDocRemove){ Id }
				TipoDocumento_update (id:..id, input:..tipoDocumento)
					{
						Id
						Nome
						Help
					}
				}				
			`,
			variables: { id, tipoDocumento, idsValidadeDocRemove }
		});
	},

	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
				TipoDocumento_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	},

	removeMany(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				ValidadeDocumentoEstado_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	},

	listEstados() {
		return Http.request('/gql', {
			query: `query {
					Estado_list(orderBy: "Nome"){
						value: Id 
        				label: Nome
					}
				}
			`
		});
	}
};
