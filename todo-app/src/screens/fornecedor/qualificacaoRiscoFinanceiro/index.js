import React, { useState, Fragment, useEffect } from 'react';
import {
	Card,
	CardContent,
	Box,
	CardHeader,
	Table,
	Tabs,
	Tab,
	Typography
} from '@material-ui/core';
import { snackSuccess, snackError } from '@/utils/snack';
import _ from 'lodash';
import { Form } from 'formik';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { translate } from '@/locales';
import theme from '@/theme';
import EmpresaService from '@/services/empresa';
import CalculoRiscoService from '@/services/CalculoRisco';
import ObjectHelper from '@/utils/objectHelper';
import { FormSelect } from '@/components';
import { DisplayDiv } from '../autoCadastro/cadastroComplementar/style';
import RiscoEstruturaFinanceira from '@/screens/fornecedor/riscoEstruturaFinanceira';
import IndicadoresEconomicosFinanceiros from '@/screens/fornecedor/indicadoresEconomicos';
import ResultadoAnalise from '@/screens/fornecedor/resultadoAnalise';
import ResultadoFinal from '@/screens/fornecedor/resultadoFinal';
import {
	RiscoBaixo,
	RiscoMedioEsquerda,
	RiscoMedioDireita,
	RiscoAlto,
	SemDados,
	LabelRiscoBaixo,
	LabelRiscoMedio,
	LabelRiscoAlto,
	LabelSemDados
} from '../style';

export default function QualificacaoaRiscoFinanceiro({key, empresa, tab }) {
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const montarCabecalho = (label, quantidade = 1) => {
		let columns = [
			{ id: 'ref', label, width: '200%' }
		];

		const anoAtual = new Date().getFullYear();
		const anoUltimo = anoAtual - 1;
		const anoPenultimo = anoAtual - 2;
		const anoAntepenultimo = anoAtual - 3;

		columns.push({ id: anoUltimo, label: anoUltimo, width: '100%', align: 'center' });
		columns.push({ id: anoPenultimo, label: anoPenultimo, width: '100%', align: 'center' });
		columns.push({ id: anoAntepenultimo, label: anoAntepenultimo, width: '100%', align: 'center' });
		if (quantidade === 2) {
			columns.push({
				id: anoUltimo,
				label: anoUltimo,
				width: '100%',
				align: 'center'
			});
			columns.push({ id: anoPenultimo, label: anoPenultimo, width: '100%', align: 'center' });
			columns.push({
				id: anoAntepenultimo,
				label: anoAntepenultimo,
				width: '100%',
				align: 'center'
			});
		}
		return columns;
	};

	const inserirIcone = (value, comRisco, justifyContent = 'center') => {
		if (value == 3) {
			return (
				<Box display='flex' flexDirection='row' width='100%' justifyContent={justifyContent}>
					<RiscoBaixo />
					{comRisco ? <LabelRiscoBaixo> Risco Baixo </LabelRiscoBaixo> : ''}
				</Box>
			);
		}
		if (value == 2) {
			return (
				<Box display='flex' flexDirection='row' width='100%' justifyContent={justifyContent}>
					<RiscoMedioEsquerda viewBox='0 0 10 24' />
					<RiscoMedioDireita viewBox='15 0 10 24' />
					{comRisco ? <LabelRiscoMedio> Risco Medio </LabelRiscoMedio> : ''}
				</Box>
			);
		}
		if (value == 1) {
			return (
				<Box display='flex' flexDirection='row' width='100%' justifyContent={justifyContent}>
					<RiscoAlto />
					{comRisco ? <LabelRiscoAlto> Risco Alto </LabelRiscoAlto> : ''}
				</Box>
			);
		}

		return (
			<Box display='flex' flexDirection='row' width='100%' justifyContent={justifyContent}>
				<SemDados />
			</Box>
		);
	};

	// Estado Local

	const [
		listaGrupoFornecimento,
		setListaGrupoFornecimento
	] = useState([]);

	const [
		inputIdsGrupoFornecimento,
		setInputIdsGrupoFornecimento
	] = useState([]);

	const [
		grupoSelected,
		setGrupoSelected
	] = useState({ value: 0 });

	const [
		qualificacaoLista,
		setQualificacaoLista
	] = useState([]);

	const [
		indicadoresForaRefMercado,
		setIndicadoresForaRefMercado
	] = useState([]);

	const [
		indicadoresForaRefMercadoRefCemig,
		setIndicadoresForaRefMercadoRefCemig
	] = useState([]);

	const [
		maxMin,
		setMaxMin
	] = useState([]);

	const [
		tabFilha,
		setTabFilha
	] = useState(0);

	// Efeitos
	useEffect(() => {
		if (empresa) {
			setListaGrupoFornecimento(empresa.GruposFornecimento);
			getIndicadoresForaRefMercado(empresa);
		}
	}, []);

	// Ações de retorno

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = (mensagem, response) => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const buscaQualificacao = async GrupoCategoriaId => {
		setGrupoSelected({ value: GrupoCategoriaId });

		const CalcRiscoResponse = await EmpresaService.findCalculoRiscoByGrupoCategoriaId(
			GrupoCategoriaId
		);

		const listId = CalcRiscoResponse.data.Empresa_list.map(a => a.Id);

		const listMaxMinResponse = await CalculoRiscoService.findMaxMinByListId(listId);

		setMaxMin(listMaxMinResponse.data.CalculoRisco_aggregate);

		const maxMinLastYear = listMaxMinResponse.data.CalculoRisco_aggregate[0].Value;

		const listaFiltradaMundoCEMIG = indicadoresForaRefMercado.filter(a => {
			if (maxMinLastYear['Min_' + a.campo]) {
				if (
					a.valor >= maxMinLastYear['Min_' + a.campo] &&
					a.valor <= maxMinLastYear['Max_' + a.campo]
				) {
					return a;
				}
			}
		});

		setIndicadoresForaRefMercadoRefCemig(listaFiltradaMundoCEMIG);

		const list = ObjectHelper.clone(CalcRiscoResponse.data.Empresa_list);
		list.forEach(fornecedor => {
			if (fornecedor.CalculoRiscoLista.length === 0) {
				fornecedor.CalculoRiscoLista.push({ ClassificacaoFase1: 0 });
				fornecedor.CalculoRiscoLista.push({ ClassificacaoFase1: 0 });
				fornecedor.CalculoRiscoLista.push({ ClassificacaoFase1: 0 });
			}
		});

		return setQualificacaoLista(list);
	};

	const getIndicadoresForaRefMercado = value => {
		var teste = "";
		const objetoAtual = value.CalculoRiscoLista[0];

		
		 const listaAtual = Object.keys(objetoAtual).map(function(key) {
		 	return { parametro: String(key), parametroValor: objetoAtual[key] };
		 });

		 const listaRisco = _.filter(listaAtual, q => q.parametro.startsWith('Risco'));

		 listaRisco.forEach(qRisco => {
		 	qRisco.campo = qRisco.parametro.substring(5, qRisco.parametro.length);
		 	qRisco.valor = _.find(listaAtual, q => q.parametro === qRisco.campo).parametroValor;
		 });

		 const listaFiltrada = listaRisco.filter(qFiltrada => qFiltrada.parametroValor == 3);

		 setIndicadoresForaRefMercado(listaFiltrada);
	};

	return (
		<DisplayDiv visible={tab === 3}>
			<Form id='QualificacaoRiscosFinanceiros'>
				<Fragment>
					<Box paddingTop={`${theme.spacing(1)}px`}>
						<Card>
							<CardHeader title={translate('qualificacaoRiscoFinanceiro')} />
							<CardContent>
								<Box display='flex' flexDirection='row' paddingTop={`${theme.spacing(1)}px`}>
									<Box width='100%' paddingRight={`${theme.spacing(1)}px`}>
										<FormSelect
											labelInitialItem={translate('selecioneOpcao')}
											label={`${translate('selecioneGrupoFornecimento')}:`}
											value={grupoSelected.value}
											onChange={event => buscaQualificacao(event.target.value)}
											items={listaGrupoFornecimento.map(s => {
												return {
													value: s.GrupoCategoria.Id,
													label: `${s.GrupoCategoria.Codigo} - ${s.GrupoCategoria.Nome}`
												};
											})}
										/>
									</Box>
								</Box>

								<Tabs
									value={tabFilha}
									onChange={(event, newValue) => setTabFilha(newValue)}
									indicatorColor='primary'
									textcolor='primary'
								>
									<Tab label='Risco de Estrutura Financeira' />
									<Tab label='Indicadores Econômicos Financeiros' />
									<Tab label='Resultado Análise' />
									<Tab label='Resultado Final' />
								</Tabs>
								<Fragment>
									<DisplayDiv visible={tab === 3 && tabFilha === 0 && qualificacaoLista.length > 0}>
										<RiscoEstruturaFinanceira
											montarCabecalho={montarCabecalho}
											qualificacaoLista={qualificacaoLista}
											inserirIcone={inserirIcone}
										/>
									</DisplayDiv>
									<DisplayDiv visible={tab === 3 && tabFilha === 1 && qualificacaoLista.length > 0}>
										<IndicadoresEconomicosFinanceiros
											empresa={empresa}
											montarCabecalho={montarCabecalho}
											inserirIcone={inserirIcone}
											qualificacaoLista={qualificacaoLista}
											maxMin={maxMin}
										/>
									</DisplayDiv>
									<DisplayDiv visible={tab === 3 && tabFilha === 2 && qualificacaoLista.length > 0}>
										<ResultadoAnalise
											empresa={empresa}
											montarCabecalho={montarCabecalho}
											qualificacaoLista={qualificacaoLista}
											indicadoresForaRefMercado={indicadoresForaRefMercado}
											indicadoresForaRefMercadoRefCemig={indicadoresForaRefMercadoRefCemig}
											maxMin={maxMin}
											inserirIcone={inserirIcone}
										/>
									</DisplayDiv>
									<DisplayDiv visible={tab === 3 && tabFilha === 3}>
										<ResultadoFinal
											empresa={empresa}
											qualificacaoLista={qualificacaoLista}
											listaGrupoFornecimento={listaGrupoFornecimento}
											indicadoresForaRefMercado={indicadoresForaRefMercado}
											tabFilha={tabFilha}
										/>
									</DisplayDiv>
								</Fragment>
							</CardContent>
						</Card>
					</Box>
				</Fragment>
			</Form>
		</DisplayDiv>
	);
}
