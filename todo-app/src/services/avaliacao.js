import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query {
					AvaliacaoCategoria_list{
						Categoria {
							Codigo
							Descricao
							Tipo
						}
						EixoX
						EixoY
						EstimativaGastoMensal
						Quadrante{
							Descricao
						}
					}
				}
			`
		});
	},
	gerarNovoCalculo() {
		return http.request('/gql', {
			query: `mutation {
				AvaliacaoCategoria_processarMec
			}`
		});
	}
};
