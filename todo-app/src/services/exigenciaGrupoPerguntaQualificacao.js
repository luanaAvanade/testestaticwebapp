/* eslint-disable import/no-unresolved */
import Http from '@/utils/http';

export default {
	create(ExigenciaGrupoPerguntaQualificacao) {
		return Http.request('/gql', {
			query: `mutation(..ExigenciaGrupoPerguntaQualificacao: ExigenciaGrupoPerguntaQualificacaoCreateInput!){
				ExigenciaGrupoPerguntaQualificacao_insert (input:..ExigenciaGrupoPerguntaQualificacao)
					{
						Id
					}
				}
			`,
			variables: { ExigenciaGrupoPerguntaQualificacao }
		});
	}
};
