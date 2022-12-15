/* eslint-disable import/no-unresolved */
import Http from '@/utils/http';

export default {
	removeMany(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				Socio_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	},
	removeManyGrupos(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				GrupoDeAssinatura_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	},
	removeManyAssinaturasSocios(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				AssinaturaSocio_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	}
};
