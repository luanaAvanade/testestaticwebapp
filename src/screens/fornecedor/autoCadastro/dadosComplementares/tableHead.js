import { translate } from '@/locales';

export const COLUMNS_GRUPO_FORNECIMENTO = [
	{ id: 'grupo', label: 'Grupo', width: '40%' },
	{
		id: 'categoria',
		label: translate('Categoria'),
		title: translate('Categoria'),
		width: '35%'
	},
	{
		id: 'tipo',
		label: translate('Tipo'),
		width: '10%'
	},
	{
		id: 'tipofornecimento',
		label: translate('tipoFornecimento'),
		width: '25%'
	},
	{
		id: 'acao',
		label: translate('acao'),
		width: '5%',
		align: 'center'
	}
];

export const COLUMNS_GRUPO = [
	{ id: 'grupo', label: 'Grupo', width: '40%' },
	{
		id: 'categoria',
		label: translate('Categoria'),
		title: translate('Categoria'),
		width: '40%'
	}
];

export const COLUMNS_FABRICANTE_GRUPO_FORNECIMENTO = [
	{ id: 'cnpj', label: 'Cpnj', width: '40%' },
	{
		id: 'fornecedor',
		label: translate('Fornecedor'),
		title: translate('Fornecedor'),
		width: '40%'
	}
];

export const COLUMNS_SKU = [
	{
		id: 'codigo',
		label: translate('codigo'),
		width: '10%'
	},
	{ id: 'sku', label: translate('descricao'), width: '90%' }
];

export const COLUMNS_DOCUMENTO = [
	{
		id: 'documento',
		label: translate('Documento'),
		width: 320
	},
	{ id: 'arquivo', label: translate('Arquivo'), width: 450 },
	{
		id: 'acao',
		label: translate('Ação'),
		width: 70,
		align: 'center'
	}
];
