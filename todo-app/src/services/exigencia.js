import Http from '@/utils/http';

export default {
	findAllActive() {
		return Http.request('/gql', {
			query: `query{
				Exigencia_list(where: "Status = true"){
					Id
					Nome
				}
			}
			`
		});
	}
};
