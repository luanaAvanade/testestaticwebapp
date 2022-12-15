import Http from '@/utils/http';

export default {
	findByTermoAceite(termoAceite) {
		return Http.request('/gql', {
			query: `query{
				TermoAceiteEmpresa_list(where:"TermosAceiteId=..{termoAceite}"){
					Id
					Aceite
				}
			}
			`
		});
	}
};
