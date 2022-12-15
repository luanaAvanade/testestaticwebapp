/* eslint-disable import/no-unresolved */
import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					TipoDocumento_list{
						Id
						DataCriacao
						DataModificacao
						Nome
						Help
						Obrigatorio
						ValidadeMeses
						QuantidadeMaxima
						TamanhoMaximo
						Status
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
						QuantidadeMaxima
						TamanhoMaximo
						TiposArquivos
						Status
						TipoDocumentoFuncionalidade{
							Id
							Funcionalidade
							Obrigatorio
							ValidadeMeses
							ValidadeDocumentoEstado{
								EstadoId
								ValidadeMeses
								Obrigatorio
							}
						}
					}
				}
			`
		});
	},

	findByNome(nome) {
		return Http.request('/gql', {
			query: `query{
				TipoDocumento_list(where: "Nome=\\"..{nome}\\"")
					{
						Id
					}
				}
			`
		});
	},

	findByFuncionalidade(idEnum) {
		return Http.request('/gql', {
			query: `query{
											TipoDocumento_list(where: "TipoDocumentoFuncionalidade.Any(Funcionalidade=..{idEnum})"){
												Id
												DataCriacao
												DataModificacao
												Nome
												Help
												Obrigatorio
												ValidadeMeses
												QuantidadeMaxima
												TamanhoMaximo
												TiposArquivos
												TipoDocumentoFuncionalidade{
												Id
												Funcionalidade
												Obrigatorio
												ValidadeMeses
												ValidadeDocumentoEstado{
													EstadoId
													ValidadeMeses
													Obrigatorio
													}
												}
												Status
											}
										}
			`
		});
	},

	
	findByFuncionalidadeDifDREeBA(idEnum) {
		return Http.request('/gql', {
			query: `query{
											TipoDocumento_list(where: "TipoDocumentoFuncionalidade.Any(Funcionalidade=..{idEnum} and Codigo != 88 and Codigo != 172)"){
												Id
												DataCriacao
												DataModificacao
												Nome
												Help
												Obrigatorio
												ValidadeMeses
												QuantidadeMaxima
												TamanhoMaximo
												TiposArquivos
												TipoDocumentoFuncionalidade{
												Id
												Funcionalidade
												Obrigatorio
												ValidadeMeses
												ValidadeDocumentoEstado{
													EstadoId
													ValidadeMeses
													Obrigatorio
													}
												}
												Status
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

	update(id, tipoDocumento) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..tipoDocumento: TipoDocumentoUpdateInput!) {
				TipoDocumento_update (id:..id, input:..tipoDocumento)
					{
						Id
						Nome
						Help
					}
				}
			`,
			variables: { id, tipoDocumento }
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
