import Http from '@/utils/http';

export default {
	create(dadosGrupoCategoriaEmpresa) {
		return Http.request('/gql', {
			query: `mutation(..dadosGrupoCategoriaEmpresa:[GrupoCategoriaEmpresaCreateInput!]!) {
      GrupoCategoriaEmpresa_insertMany(input:..dadosGrupoCategoriaEmpresa){
          Id
          EmpresaID
          GrupoCategoriaId
        }
      }
    `,
			variables: { dadosGrupoCategoriaEmpresa }
		});
	}
};
