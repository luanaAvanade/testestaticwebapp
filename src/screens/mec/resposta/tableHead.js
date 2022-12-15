import { translate } from '@/locales';

export const COLUMNS_RESPOSTA = [
	{
		id: 'CodigoCategoria',
		label: translate('shortCodigoCategoria'),
		title: translate('codigoCategoria'),
		width: 150,
		align: 'center'
	},
	{ id: 'NomeCategoria', label: translate('nomeCategoria'), width: 620 },
	{
		id: 'GruposCategoria',
		label: translate('gruposCategoria'),
		width: 70,
		align: 'center'
	},
	{
		id: 'TipoCategoria',
		title: translate('tipoCategoria'),
		label: translate('shortTipoCategoria'),
		width: 130,
		align: 'center'
	},
	{
		id: 'Nota',
		label: translate('nota'),
		width: 70,
		align: 'center'
	},
	{
		id: 'NaoAplicavel',
		label: translate('naoAplicavel'),
		width: 70,
		align: 'center'
	}
];

export const COLUMNS_GRUPO_CATEGORIA = [
	{
		id: 'Codigo',
		label: translate('codigoGrupoCategoria'),
		align: 'center'
	},
	{ id: 'Nome', label: translate('nomeGrupoCategoria'), align: 'center' }
];
