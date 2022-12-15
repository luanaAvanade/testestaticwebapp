import http from '@/utils/http';
import { MATERIAL } from '@/utils/constants';

export default {
	findByArquivoProcessamentoPerguntaId(id, tipoPergunta) {
		let tipoPerguntaField = '';
		if (tipoPergunta !== 0) {
			tipoPerguntaField = `and Categoria.Tipo=..{tipoPergunta === MATERIAL.nome ? 0 : 1}`;
		}

		const query = `query {
			Resultado_list(where:"ArquivoProcessamentoPerguntaId=..{id} ..{tipoPerguntaField} and !VersaoMec.Encerrado and !Categoria.VersaoMec.Encerrado"){
				Id
				Categoria {
					Id
					Codigo
					Descricao
					Tipo
				}
				Nota
				Media
				Mediana
				Moda
			}
		}
	`;

		return http.request('/gql', { query });
	},

	findByPergunta(id) {
		return http.request('/gql', {
			query: `query {
					Resultado_list(where:"PerguntaId=..{id} and !VersaoMec.Encerrado and !Categoria.VersaoMec.Encerrado"){
						Id
						Categoria {
							Id
							Codigo
							Descricao
							Tipo
						}
						Media
						Mediana
						Moda
						Nota
					}
				}
			`
		});
	},

	updateMany(ids, input) {
		return http.request('/gql', {
			query: `mutation(..ids:[ID!]!, ..input:[ResultadoUpdateInput!]!) {
				Resultado_updateMany (ids:..ids,input:..input )
					{
						Id
					}
				}
			`,
			variables: { ids, input }
		});
	},

	gerarNovoCalculo(codigoPergunta) {
		return http.request('/gql', {
			query: `mutation(..codigoPergunta:Int) {
				Resultado_processar(codigoPergunta:..codigoPergunta)
				}
			`,
			variables: { codigoPergunta }
		});
	},

	importFile(file, file2, file3, perguntaId) {
		const arquivo = perguntaId !== 4 ? '{ Key:\\"file\\"}}' : '{ Key:\\"file;file2;file3\\"}}';

		const query = `{
				"query":"mutation {
					ArquivoProcessamentoPergunta_insert (
						input:{
							PerguntaId:..{perguntaId},
							Arquivo: ..{arquivo} )
						{
							Id,
							Status,
							Mensagem
						}
					}
				"}`;
		const formData = new FormData();
		formData.append('file', file);
		if (perguntaId === 4) {
			formData.append('file2', file2);
			formData.append('file3', file3);
		}
		formData.append('query', query);

		const config = { headers: { 'Content-Type': 'multipart/form-data' } };

		return http.request('/gql/file', formData, config);
	}
};
