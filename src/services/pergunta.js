import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
					Pergunta_list{
						value:Id
						label:Nome
						Descricao
						Codigo
						OrigemDados
					}
				}
			`
		});
	},

	findByOrigemDados(origem) {
		return http.request('/gql', {
			query: `query {
					Pergunta_list(where:"OrigemDados=..{origem}"){
						Id
						label:Nome
						Descricao
						value:Codigo
						OrigemDados
						PerguntaGrupoUsuario {
							Id
							GrupoUsuario {
								Id
								Usuarios {
									Id
									Nome
									Email
								}
							}
						}
					}
				}
			`
		});
	},

	acompanhamento(origem) {
		return http.request('/gql', {
			query: `query {
			Categoria_count(where: "!VersaoMec.Encerrado"){
				Count
			}
			
			Resposta_count(where: "!VersaoMec.Encerrado  and Respondida" groupBy:"PerguntaId.ToString() + \\"-\\" + UsuarioId.ToString()") {
				Count
				Group
			}
			
			Pergunta_list(where:"OrigemDados = ..{origem}") {
				Id
				Nome
				Codigo
				PerguntaGrupoUsuario {
					Id
					GrupoUsuario {
						Id
						Usuarios {
							Id
							Nome
							Email
							GrupoUsuario{
								Nome
							}
						}
					}
				}
			}

		}`
		});
	},

	findByGrupoUsuario(grupoUsuarioId) {
		return http.request('/gql', {
			query: `query {
					Pergunta_list(where:"PerguntaGrupoUsuario.Any(GrupoUsuarioId=..{grupoUsuarioId})"){
						value:Id
						label:Nome
						Descricao
						Codigo
						OrigemDados
					}
				}
			`
		});
	},

	findById(id) {
		return http.request('/gql', {
			query: `query (..id: ID!){
				Pergunta(id: ..id){
						Id
						Codigo
						Nome
						Descricao
						OrigemDados
					}
				}
			`,
			variables: { id }
		});
	},

	findByCodigo(codigo) {
		return http.request('/gql', {
			query: `query{
				Pergunta_list(where: "Codigo = ..{codigo}"){
					Id
					Codigo
					Descricao
					Nome
					OrigemDados
				}
			}
		`
		});
	},

	create(pergunta) {
		return http.request('/gql', {
			query: `mutation(..pergunta: PerguntaCreateInput!) {
				Pergunta_insert (input:..pergunta)
					{
						Id
						Codigo
						Nome
						OrigemDados
					}
				}
			`,
			variables: { pergunta }
		});
	},

	update(id, pergunta) {
		return http.request('/gql', {
			query: `mutation(..id:ID!, ..pergunta: PerguntaUpdateInput!) {
				Pergunta_update (id:..id, input:..pergunta)
					{
						Id
						Codigo
						Nome
						OrigemDados
					}
				}
			`,
			variables: { id, pergunta }
		});
	},

	remove(id) {
		return http.request('/gql', {
			query: `mutation(..id:ID!) {
				Pergunta_delete (id:..id){ Id }
			}
			`,
			variables: { id }
		});
	}
};
