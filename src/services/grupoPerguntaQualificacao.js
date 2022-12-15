import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query {
					GrupoPerguntaQualificacao_list{
            Id
						Nome 
						Status
					}
				}
			`
		});
	},
	findAllSelect() {
		return Http.request('/gql', {
			query: `query {
					GrupoPerguntaQualificacao_list{
            value:Id
						label:Nome 
						Status
					}
				}
			`
		});
	},
	findById(id) {
		return Http.request('/gql', {
			query: `query (..id: ID!){
        GrupoPerguntaQualificacao(id: ..id){
						Id
						Nome
						Status
					}
				}
			`,
			variables: { id }
		});
	},

	findByNome(nome) {
		return Http.request('/gql', {
			query: `query{
				GrupoPerguntaQualificacao_list(where: "Nome=\\"..{nome}\\""){
					Id
					Nome 
					Status
				}
			}
		`
		});
	},

	findByNomeId(nome, id) {
		return Http.request('/gql', {
			query: `query{
				GrupoPerguntaQualificacao_list(where:"Nome=\\"..{nome}\\" and Id!=\\"..{id}\\""){
					Id
					Nome
					Status
				}
			}
		`
		});
	},
	create(GrupoPerguntaQualificacao) {
		return Http.request('/gql', {
			query: `mutation(..GrupoPerguntaQualificacao: GrupoPerguntaQualificacaoCreateInput!) {
				GrupoPerguntaQualificacao_insert (input:..GrupoPerguntaQualificacao)
					{
						Id
						Nome
						Status
					}
				}
			`,
			variables: { GrupoPerguntaQualificacao }
		});
	},

	update(id, GrupoPerguntaQualificacao) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!, ..GrupoPerguntaQualificacao: GrupoPerguntaQualificacaoUpdateInput!) {
				GrupoPerguntaQualificacao_update (id:..id, input:..GrupoPerguntaQualificacao)
					{
            Id
						Nome
						Status
					}
				}
			`,
			variables: { id, GrupoPerguntaQualificacao }
		});
	},
	remove(id) {
		return Http.request('/gql', {
			query: `mutation(..id:ID!) {
        GrupoPerguntaQualificacao_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
