import { translate } from '@/locales';

export const COLUMNS_PERGUNTA_SISTEMA = [
	{
		id: 'CodigoCategoria',
		label: translate('codigoCategoria'),
		width: 150,
		align: 'center'
	},
	{ id: 'NomeCategoria', label: translate('nomeCategoria'), width: 620 },
	{
		id: 'TipoCategoria',
		label: translate('tipoCategoria'),
		width: 130,
		align: 'center'
	},
	{
		id: 'NotaFinal',
		label: translate('notaFinal'),
		width: 70,
		align: 'center'
	}
];

export const COLUMNS_PERGUNTA_FORMULARIO = [
	{
		id: 'CodigoCategoria',
		label: translate('codigoCategoria'),
		width: 150,
		align: 'center'
	},
	{ id: 'NomeCategoria', label: translate('nomeCategoria'), width: 620 },
	{
		id: 'TipoCategoria',
		label: translate('tipoCategoria'),
		width: 130,
		align: 'center'
	},
	{ id: 'Moda', label: translate('moda'), width: 70, align: 'center' },
	{ id: 'Media', label: translate('media'), width: 70, align: 'center' },
	{ id: 'Mediana', label: translate('mediana'), width: 70, align: 'center' },
	{
		id: 'NotaFinal',
		label: translate('notaFinal'),
		width: 70,
		align: 'center'
	}
];

export const COLUMNS_AVALIACAO = [
	{
		id: 'CodigoCategoria',
		label: translate('codigoCategoria'),
		width: 150,
		align: 'center'
	},
	{ id: 'NomeCategoria', label: translate('nomeCategoria'), width: 520 },
	{
		id: 'TipoCategoria',
		label: translate('tipoCategoria'),
		width: 130,
		align: 'center'
	},
	{
		id: 'EixoX',
		label: translate('eixox'),
		width: 70,
		align: 'center'
	},
	{
		id: 'EixoY',
		label: translate('eixoy'),
		width: 70,
		align: 'center'
	},
	{
		id: 'Quadrante',
		label: translate('quadrante'),
		width: 70,
		align: 'center'
	},
	{
		id: 'EstimativaGastoMensal',
		label: translate('estimativaGastoMensal'),
		width: 70,
		align: 'center'
	}
];
