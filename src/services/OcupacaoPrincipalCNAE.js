import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
        OcupacaoPrincipalCNAE_list{
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
				OcupacaoPrincipalCNAE_list(where:"Codigo=\\"..{cod}\\""){
					Id
					}
				}
			`
		});
	}
};
