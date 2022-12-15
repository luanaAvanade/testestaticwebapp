import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
					ClassificacaoCNAE_list{
						Id
						Codigo
						Descricao
						Ocupacao
						PossuiOcupacao
					}
				}
			`
		});
	},
	findCNAEByCodigo(cod) {
		return http.request('/gql', {
			query: `query{
				ClassificacaoCNAE_list(where:"Codigo=\\"..{cod}\\""){
					Id
					}
				}
			`
		});
	}
};
