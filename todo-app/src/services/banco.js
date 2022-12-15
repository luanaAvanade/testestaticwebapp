import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
					Banco_list {
						value:Id
						label:descricao
						codigo
					}
				}
			`
		});
	}
};
