import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
        AtividadeEconomicaPrincipalCNAE_list{
						Id
						Codigo
						Descricao
					}
				}
			`
		});
	},
	findCNAEByCodigo(cod) {
		return http.request('/gql', {
			query: `query{
				AtividadeEconomicaPrincipalCNAE_list(where:"Codigo=\\"..{cod}\\""){
					Id
					}
				}
			`
		});
	}
};
