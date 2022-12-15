import http from '@/utils/http';

export default {
	findAll() {
		return http.request('/gql', {
			query: `query{
					VersaoMec_list{
						value:Id
						label:Nome
						FormulaEixoX
						FormulaEixoY
						DataCriacao
						DataEncerramento
						LinkMatriz
					}
				}
			`
		});
	},

	findById(id) {
		return http.request('/gql', {
			query: `query (..id: ID!){
					VersaoMec(id: ..id){
						Id
						Nome
						FormulaEixoX
						FormulaEixoY
						LinkMatriz
					}
				}
			`,
			variables: { id }
		});
	},

	findAtual() {
		return http.request('/gql', {
			query: `query{
					VersaoMec_list( where:"!Encerrado"){
						value:Id
						label:Nome
						FormulaEixoX
						FormulaEixoY
						DataCriacao
						DataEncerramento
						LinkMatriz
					}
				}
			`
		});
	},

	create(versaoMec) {
		return http.request('/gql', {
			query: `mutation(..versaoMec: VersaoMecCreateInput!) {
				VersaoMec_insert (input:..versaoMec)
					{
						Id
						Nome
						FormulaEixoX
						FormulaEixoY
						LinkMatriz
					}
				}
			`,
			variables: { versaoMec }
		});
	},

	update(id, versaoMec) {
		return http.request('/gql', {
			query: `mutation(..id:ID!, ..versaoMec: VersaoMecUpdateInput!) {
				VersaoMec_update (id:..id, input:..versaoMec)
					{
						Id
						Nome
						FormulaEixoX
						FormulaEixoY
						LinkMatriz
					}
				}
			`,
			variables: { id, versaoMec }
		});
	}
};
