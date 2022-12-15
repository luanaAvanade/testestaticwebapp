import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query{
				GrupoCategoria_list(where:"Categoria.VersaoMec.DataEncerramento = null"){
				 Id
				 Codigo
				 label: Nome
					 }
			 }
			`
		});
	},

	findByCategoria(categoriaId) {
		return Http.request('/gql', {
			query: `query{
				GrupoCategoria_list(where:"CategoriaId=..{categoriaId}"){
					Id
					Codigo
					Nome
					}
				}
			`
		});
	},

	findByFilterTipo(filter, tipo) {
		return Http.request('/gql', {
			query: `query{
				GrupoCategoria_list(where:"(Nome like \\"%${filter}%\\" or Codigo like \\"%${filter}%\\") and Categoria.Tipo=\\"${tipo}\\""){
					Id
					Codigo
      		Nome
					Categoria{
							Codigo
							Descricao
					}
				}
			}
			`
		});
	},

	findByFilterTipoSKU(filter, tipo) {
		return Http.request('/gql', {
			query: `query{
				GrupoCategoria_list(where:"Skus.Any(Codigo like \\"%..{filter}%\\" or Descricao like \\"%..{filter}%\\") and Categoria.Tipo=\\"..{tipo}\\" and !Categoria.VersaoMec.Encerrado "){
					Id
					Codigo
      		Nome
					Categoria{
							Codigo
							Descricao
					}
				}
			}
			`
		});
	}
};
