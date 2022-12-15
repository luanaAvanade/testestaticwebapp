import http from '@/utils/http';

export default {
	create(dadosDREList) {
		return http.request('/gql', {
			query: `mutation(..dadosDREList: [DadosDRECreateInput!]!) {
				DadosDRE_insertMany(input:..dadosDREList)
					{
						Id
					}
				}
			`,
			variables: { dadosDREList }
		});
	},

	update(ids, dadosDREList) {
		return http.request('/gql', {
			query: `mutation(..ids:[ID!]!, ..dadosDREList:[DadosDREUpdateInput!]!) {
				DadosDRE_updateMany(ids:..ids, input:..dadosDREList){
						Id
					}
				}
			`,
			variables: { ids, dadosDREList }
		});
	},

	findByEmpresa(empresaId) {
		return http.request('/gql', {
			query: `query{
				DadosDRE_list(where:"EmpresaId=\\"..{empresaId}\\""){
					Id
					ReceitaOperacionalLiquida
					CustoProdutosVendidosMercadoriasVendidasServicosPrestados
					ResultadoOperacionalBruto
					DespesasVendasAdministrativasGeraisOutras
					DespesasFinanceiras
					ReceitasFinanceiras
					ResultadoOperacionalAntesIrCssl
					ResultadoLiquidoPeriodo
				}
			}`
		});
	}
};
