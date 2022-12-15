import { translate } from '@/locales';

export const COLUMNS_DADOS_SOCIOS = [
	{
		id: 'Nome',
		label: translate('nome'),
		title: translate('nome'),
		width: '20%'
	},
	{ id: 'cadastroUnico', label: translate('cpfcnpj'), width: '20%' },
	{
		id: 'valorParticipacao',
		label: translate('valorParticipacao'),
		width: '20%'
	},
	{
		id: 'percentual',
		title: translate('percentual'),
		label: translate('percentual'),
		width: '20%'
	},
	{
		id: 'administrador',
		title: translate('administrador'),
		label: translate('administrador'),
		width: '15%'
	},
	{
		id: 'acoes',
		label: translate('acoes'),
		width: '5%',
		colSpan: 2,
		align: 'center'
	}
];

export const COLUMNS_DADOS_ASSINATURA_SOCIOS = [
	{
		id: 'assina',
		label: translate('assina'),
		title: translate('assina'),
		width: '20%'
	},
	{
		id: 'socioObrigatorio',
		label: translate('sociosAssinamObrigatoriamente'),
		title: translate('sociosAssinamObrigatoriamente'),
		width: '20%'
	},
	{
		id: 'socioOpcional',
		label: translate('sociosOpcionais'),
		title: translate('sociosOpcionais'),
		width: '20%'
	},
	{
		id: 'valorLimite',
		label: translate('valorLimite'),
		width: '15%'
	},
	{
		id: 'acoes',
		label: translate('acoes'),
		width: '5%',
		colSpan: 2,
		align: 'center'
	}
];
