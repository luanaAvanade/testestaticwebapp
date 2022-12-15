/* eslint-disable import/no-unresolved */
import Http from '@/utils/http';

export default {
	removeMany(ids) {
		return Http.request('/gql', {
			query: `mutation(..ids:[ID!]!) {
				TipoDocumentoFuncionalidade_deleteMany (ids:..ids){ Id }
			}
			`,
			variables: { ids }
		});
	},

	findByFuncionalidade(idEnum) {
		return Http.request('/gql', {
			query: `query{
				TipoDocumentoFuncionalidade_list(where: "Funcionalidade=..{idEnum}"){
					Funcionalidade
					Obrigatorio
					TipoDocumentoId	
				}
				}
			`
		});
	}
};
