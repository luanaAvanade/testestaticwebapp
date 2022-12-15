import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
					Categoria_list(where:"!VersaoMec.Encerrado"){
						Id
						Codigo
						Descricao
						Tipo
						Grupos{
							Id,
							Codigo,
							Nome
						}
					}
				}
			`
		});
	},

	findByFilterTipo(filter, tipo) {
		return http.request('/gql', {
			query: `query {
					Categoria_list(where:"(Descricao like \\"%..{filter}%\\"  or Codigo like \\"%..{filter}%\\")  and Tipo=\\"..{tipo}\\" and !VersaoMec.Encerrado"){
						Id
						Codigo
						Descricao
						Tipo
						Grupos {
							Id
							Codigo
							Nome
						}
					}
				}
			`
		});
	},
	findByGrup(grupoId) {
		return http.request('/gql', {
			query: `query {
				Categoria_list(where:"Grupos.Any(id=\\"..{grupoId}\\" ) and !VersaoMec.Encerrado"){
					Id
					Codigo
					Descricao
					Tipo
					Grupos {
						Id
						Codigo
						Nome
					}
				}
			}
			`
		});
	}
};
