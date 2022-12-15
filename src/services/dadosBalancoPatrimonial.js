import http from '@/utils/http';

export default {
	create(dadosBalancoPatrimonialList) {
		return http.request('/gql', {
			query: `mutation(..dadosBalancoPatrimonialList: [DadosBalancoPatrimonialCreateInput!]!) {
				DadosBalancoPatrimonial_insertMany(input:..dadosBalancoPatrimonialList)
					{
						Id
					}
				}
			`,
			variables: { dadosBalancoPatrimonialList }
		});
	},

	update(ids, dadosBalancoPatrimonialList) {
		return http.request('/gql', {
			query: `mutation(..ids:[ID!]!, ..dadosBalancoPatrimonialList:[DadosBalancoPatrimonialUpdateInput!]!) {
				DadosBalancoPatrimonial_updateMany(ids:..ids, input:..dadosBalancoPatrimonialList){
						Id
					}
				}
			`,
			variables: { ids, dadosBalancoPatrimonialList }
		});
	},

	findByEmpresa(empresaId) {
		return http.request('/gql', {
			query: `query{
				DadosBalancoPatrimonial_list(where:"EmpresaId=\\"..{empresaId}\\""){
					Id
					DataReferencia 
          AtivoTotal 
          CirculanteAtivo  
          Disponibilidades 
          Estoques 
          OutrosAtivosCirculante 
          AtivoNaoCirculante 
          PassivoTotal 
          CirculantePassivo 
          EmprestimosFinanciamentoCirculante 
          OutrosPassivosCirculantes 
          NaoCirculantePassivo 
          EmprestimosFinanciamentoNaoCirculante 
          OutrosPassivosNaoCirculantes 
					PatrimonioLiquido
				}
			}`
		});
	}
};
