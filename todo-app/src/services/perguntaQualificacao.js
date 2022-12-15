import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					PerguntaQualificacao_list{
            Id
						Texto
						GrupoPerguntaQualificacao{
							Nome
						}
						Status
					}
				}
			`
		});
	},
	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
        PerguntaQualificacao(id: ..id){
						Id
						Texto
						Dica
						TipoResposta
						ParametroResposta
						Validade
						GrupoPerguntaQualificacaoId
						QuemResponde
						QuemVisualiza
						Obrigatorio
						PossuiAnexo
						TamanhoMaximoArquivo
						Status
					}
				}
			`,
			variables: { id }
		});
	},

	create(PerguntaQualificacao) {
		return Http.request('/gql', {
			query: `mutation(..PerguntaQualificacao: PerguntaQualificacaoCreateInput!) {
				PerguntaQualificacao_insert (input:..PerguntaQualificacao)
					{
						Id
						Texto
						Status
					}
				}
			`,
			variables: { PerguntaQualificacao }
		});
	},

	update(id, PerguntaQualificacao) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..PerguntaQualificacao: PerguntaQualificacaoUpdateInput!) {
				PerguntaQualificacao_update (id:..id, input:..PerguntaQualificacao)
					{
            Id
						Texto
						Status
					}
				}
			`,
			variables: { id, PerguntaQualificacao }
		});
	},
	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
        PerguntaQualificacao_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
