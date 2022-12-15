import Http from '@/utils/http';

export default {
	findAll() {
		return Http.request('/gql', {
			query: `query{
				Sku_list
			 } {
					Id
          Codigo
					Descricao
					}
				}
			`
		});
	},
	findByGrupoCategoriaFilter(codigoGrupoCategoria, filter) {
		return Http.request('/gql', {
			query: `query{
				Sku_list(where:" GrupoCategoria.Codigo= \\"..{codigoGrupoCategoria}\\" and Descricao like \\"%..{filter}%\\" or Codigo like \\"%..{filter}%\\""){
					Codigo
					Descricao
				}
			}
		`
		});
	},
	findByFilterTipo(filter, tipo) {
		return Http.request('/gql', {
			query: `query{
				Sku_list(where:"(Descricao like \\"%..{filter}%\\" or Codigo like \\"%..{filter}%\\" )  and GrupoCategoria.Categoria.Tipo=\\"..{tipo}\\" and !GrupoCategoria.Categoria.VersaoMec.Encerrado "){
          GrupoCategoria{
						Id
						Codigo 
						Nome
						Categoria {
								Codigo
								Descricao
						}
					}  
				}
			}
			`
		});
	}
};
