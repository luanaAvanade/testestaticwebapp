import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Tabs, Tab, TableBody } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	Button,
	Confirm,
	FormSelect,
	ExportXLSL
} from '@/components';
import useReactRouter from 'use-react-router';
import { LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import {
	getSorting,
	stableSort,
	getArrayWithAttribute,
	getSimpleArrayWithAttribute
} from '@/utils/list';
import { BoxContentTab } from './style';
import { translate } from '@/locales';
import theme from '@/theme';
import { SELECT_NOTAS, FORMULARIO, SISTEMA, MATERIAL, SERVICO } from '@/utils/constants';
import { snackSuccess, snackError } from '@/utils/snack';
import {
	COLUMNS_PERGUNTA_SISTEMA,
	COLUMNS_PERGUNTA_FORMULARIO,
	COLUMNS_AVALIACAO
} from './tableHead';
import PerguntaService from '@/services/pergunta';
import AvaliacaoService from '@/services/avaliacao';
import ResultadoService from '@/services/resultado';

export default function ResultadoImportacao({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		tab,
		setTab
	] = useState(0);

	const [
		perguntaSelected,
		setPerguntaSelected
	] = useState({ value: 0 });

	const [
		open,
		setOpen
	] = useState(false);

	const [
		perguntaList,
		setPerguntaList
	] = useState([]);

	const [
		resultadoList,
		setResultadoList
	] = useState([]);

	const [
		avaliacaoList,
		setAvaliacaoList
	] = useState([]);

	const [
		perguntaOrderBy,
		setPerguntaOrderBy
	] = useState('CodigoCategoria');

	const [
		avaliacaoOrderBy,
		setAvaliacaoOrderBy
	] = useState('CodigoCategoria');

	const [
		perguntaOrder,
		setPerguntaOrder
	] = useState('asc');

	const [
		avaliacaoOrder,
		setAvaliacaoOrder
	] = useState('asc');

	// Efeito Inicial

	useEffect(() => {
		perguntaFindByOrigemDados(SISTEMA.id);
		avaliacaoFindAll();
		return () => {
			setPerguntaList([]);
			setResultadoList([]);
			setAvaliacaoList([]);
		};
	}, []);

	// Buscar Dados

	const perguntaFindByOrigemDados = async origem => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaService.findByOrigemDados(origem);
		if (response.data) {
			setPerguntaList(response.data.Pergunta_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const avaliacaoFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await AvaliacaoService.findAll();
		if (response.data) {
			response.data.AvaliacaoCategoria_list.forEach(avaliacao => {
				avaliacao.CodigoCategoria = avaliacao.Categoria.Codigo;
				avaliacao.NomeCategoria = avaliacao.Categoria.Descricao;
				avaliacao.TipoCategoria =
					avaliacao.Categoria.Tipo === MATERIAL.id ? MATERIAL.nome : SERVICO.nome;
				avaliacao.Quadrante = avaliacao.Quadrante.Descricao;
			});
			setAvaliacaoList(response.data.AvaliacaoCategoria_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const resultadoFindByPergunta = async perguntaId => {
		dispatch(LoaderCreators.setLoading());
		const response = await ResultadoService.findByPergunta(perguntaId);
		if (response.data) {
			response.data.Resultado_list.forEach(resultado => {
				resultado.IdCategoria = resultado.Categoria.Id;
				resultado.CodigoCategoria = resultado.Categoria.Codigo;
				resultado.NomeCategoria = resultado.Categoria.Descricao;
				resultado.TipoCategoria =
					resultado.Categoria.Tipo === MATERIAL.id ? MATERIAL.nome : SERVICO.nome;
			});
			setResultadoList(response.data.Resultado_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const alterTab = t => {
		setPerguntaSelected({ value: 0 });
		setTab(t);
		perguntaFindByOrigemDados(t === 0 ? SISTEMA.id : FORMULARIO.id);
		setResultadoList([]);
	};

	const handleChangeSelect = value => {
		if (value !== 0) {
			const pergunta = _.find(perguntaList, p => {
				return p.value === value;
			});
			setPerguntaSelected(pergunta);
		} else {
			setPerguntaSelected({ value: 0 });
		}
		resultadoFindByPergunta(value);
	};

	const handleChangeSelectNota = (index, value) => {
		stableSort(resultadoList, getSorting(perguntaOrder, perguntaOrderBy))[index].Nota = value;
		setResultadoList(stableSort(resultadoList, getSorting(perguntaOrder, perguntaOrderBy)));
	};

	const updateMany = () => {
		const ids = getSimpleArrayWithAttribute(resultadoList, 'Id');
		const valores = getArrayWithAttribute(resultadoList, 'Nota');

		dispatch(LoaderCreators.setLoading());
		ResultadoService.updateMany(ids, valores)
			.then(() => callback(translate('resultadosAlteradosComSucesso')))
			.catch(() => callbackError(translate('erroAlterarOsResultados')));
	};

	const gerarNovoCalculo = () => {
		setOpen(false);
		dispatch(LoaderCreators.setLoading());
		ResultadoService.gerarNovoCalculo(perguntaSelected.value)
			.then(() => callback(translate('geracaoNovoCalculoComSucesso')))
			.catch(() => callbackError(translate('erroGeracaoNovoCalculo')));
	};

	const gerarNovoCalculoAvaliacao = () => {
		setOpen(false);
		dispatch(LoaderCreators.setLoading());
		AvaliacaoService.gerarNovoCalculo(perguntaSelected.value)
			.then(() => callback(translate('geracaoNovoCalculoComSucesso')))
			.catch(() => callbackError(translate('erroGeracaoNovoCalculo')));
	};

	// Ações de retorno

	const callback = mensagem => {
		if (tab === 2) {
			avaliacaoFindAll();
		} else {
			resultadoFindByPergunta(perguntaSelected.value);
		}
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	// Interações com a Tabela

	const handleRequestSort = (orderBy, order, setOrder, setOrderBy, event, property) => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const getDataSet = (columns, list) => {
		columns.map(column => {
			column.title = column.label;
			column.width =
				column.width && column.width.wpx
					? { wpx: column.width.wpx }
					: { wpx: column.width ? column.width : 200 };
			return column;
		});

		const data = [];

		list.map(item => {
			const dadosFormulario = [
				{ value: item.CodigoCategoria },
				{ value: item.NomeCategoria },
				{ value: item.TipoCategoria },
				{ value: item.Moda },
				{ value: item.Media },
				{ value: item.Mediana },
				{ value: item.Nota }
			];

			const dadosSistema = [
				{ value: item.CodigoCategoria },
				{ value: item.NomeCategoria },
				{ value: item.TipoCategoria },
				{ value: item.Nota }
			];

			const dadosAvaliacao = [
				{ value: item.CodigoCategoria },
				{ value: item.NomeCategoria },
				{ value: item.TipoCategoria },
				{ value: item.EixoX },
				{ value: item.EixoY },
				{ value: item.Quadrante },
				{ value: item.EstimativaGastoMensal }
			];

			let dados = [];

			switch (tab) {
				case 0:
					dados = dadosSistema;
					break;
				case 1:
					dados = dadosFormulario;
					break;
				default:
					dados = dadosAvaliacao;
			}
			return data.push(dados);
		});

		return [
			{ columns, data }
		];
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={open}
				handleClose={() => setOpen(false)}
				handleSuccess={tab === 2 ? gerarNovoCalculoAvaliacao : gerarNovoCalculo}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteGerarNovoCalculo')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Tabs
				value={tab}
				onChange={(event, newValue) => alterTab(newValue)}
				indicatorColor='primary'
				textcolor='primary'
			>
				<Tab label={translate('resultadoImportacoes')} />
				<Tab label={translate('resultadoRespostas')} />
				<Tab label={translate('resultadoFinal')} />
			</Tabs>

			{tab === 0 && (
				<BoxContentTab>
					<Box display='flex' justifyContent='space-between'>
						{perguntaSelected && (
							<FormSelect
								labelInitialItem={translate('selecioneOpcao')}
								labelWithValue
								label={`@/..{translate('selecioneTipoResposta')}:`}
								labelHelper={translate('escolhaTipoParaVisualizarResultado')}
								value={perguntaSelected.value}
								onChange={event => handleChangeSelect(event.target.value)}
								items={perguntaList}
							/>
						)}

						<Box display='flex' paddingTop='15px'>
							{resultadoList.length > 0 && (
								<ExportXLSL
									dataSet={getDataSet(
										COLUMNS_PERGUNTA_SISTEMA,
										stableSort(resultadoList, getSorting(perguntaOrder, perguntaOrderBy))
									)}
								/>
							)}
						</Box>
					</Box>

					{resultadoList.length > 0 && (
						<Table small>
							<TableHead
								columns={COLUMNS_PERGUNTA_SISTEMA}
								order={perguntaOrder}
								orderBy={perguntaOrderBy}
								onRequestSort={(event, property) =>
									handleRequestSort(
										perguntaOrderBy,
										perguntaOrder,
										newValue => setPerguntaOrder(newValue),
										() => setPerguntaOrderBy(property),
										event,
										property
									)}
								rowCount={COLUMNS_PERGUNTA_SISTEMA.length}
							/>
							<TableBody>
								{stableSort(
									resultadoList,
									getSorting(perguntaOrder, perguntaOrderBy)
								).map((resultado, index) => {
									variantTableRow =
										variantTableRow === theme.palette.table.tableRowPrimary
											? theme.palette.table.tableRowSecondary
											: theme.palette.table.tableRowPrimary;

									return (
										<TableRow key={index} backgroundColor={variantTableRow}>
											<TableCell label={resultado.CodigoCategoria} align='center' />
											<TableCell label={resultado.NomeCategoria} />
											<TableCell label={resultado.TipoCategoria} aling='center' />
											<TableCell title={resultado.Nota} label={resultado.Nota} align='center' />
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</BoxContentTab>
			)}

			{tab === 1 && (
				<BoxContentTab>
					<Box display='flex' justifyContent='space-between'>
						{perguntaSelected && (
							<FormSelect
								labelInitialItem={translate('selecioneOpcao')}
								labelWithValue
								label={`@/..{translate('selecioneTipoResposta')}:`}
								labelHelper={translate('escolhaTipoParaVisualizarResultado')}
								value={perguntaSelected.value}
								onChange={event => handleChangeSelect(event.target.value)}
								items={perguntaList}
							/>
						)}

						<Box display='flex' paddingTop='15px'>
							{resultadoList.length > 0 && (
								<ExportXLSL
									dataSet={getDataSet(
										COLUMNS_PERGUNTA_FORMULARIO,
										stableSort(resultadoList, getSorting(perguntaOrder, perguntaOrderBy))
									)}
								/>
							)}
						</Box>
					</Box>

					{perguntaSelected.value > 0 && (
						<Box style={{ marginBottom: 8 }}>
							{getPermissao() && (
								<Button text={translate('gerarNovoCalculo')} onClick={() => setOpen(true)} />
							)}
						</Box>
					)}

					{resultadoList.length > 0 && (
						<Fragment>
							<Table small>
								<TableHead
									columns={COLUMNS_PERGUNTA_FORMULARIO}
									order={perguntaOrder}
									orderBy={perguntaOrderBy}
									onRequestSort={(event, property) =>
										handleRequestSort(
											perguntaOrderBy,
											perguntaOrder,
											newValue => setPerguntaOrder(newValue),
											() => setPerguntaOrderBy(property),
											event,
											property
										)}
									rowCount={COLUMNS_PERGUNTA_FORMULARIO.length}
								/>
								<TableBody>
									{stableSort(
										resultadoList,
										getSorting(perguntaOrder, perguntaOrderBy)
									).map((resultado, index) => {
										variantTableRow =
											variantTableRow === theme.palette.table.tableRowPrimary
												? theme.palette.table.tableRowSecondary
												: theme.palette.table.tableRowPrimary;

										variantTableRow = resultado.Moda !== resultado.Nota ? '#b5cece' : '';

										return (
											<TableRow key={index} backgroundColor={variantTableRow}>
												<TableCell label={resultado.CodigoCategoria} align='center' />
												<TableCell label={resultado.NomeCategoria} />
												<TableCell label={resultado.TipoCategoria} aling='center' />
												<TableCell label={resultado.Moda} align='center' />
												<TableCell label={resultado.Media} align='center' />
												<TableCell label={resultado.Mediana} align='center' />
												<TableCell
													title={resultado.Nota}
													label={
														<FormSelect
															width='200px'
															labelInitialItem={translate('selecioneOpcao')}
															value={resultado.Nota}
															onChange={event => handleChangeSelectNota(index, event.target.value)}
															items={SELECT_NOTAS}
														/>
													}
													align='center'
												/>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</Fragment>
					)}
				</BoxContentTab>
			)}

			{tab === 2 && (
				<BoxContentTab>
					<Box display='flex' justifyContent='space-between' paddingTop='15px'>
						{getPermissao() && (
							<Button text={translate('gerarNovoCalculo')} onClick={() => setOpen(true)} />
						)}
						{avaliacaoList.length > 0 && (
							<ExportXLSL
								dataSet={getDataSet(
									COLUMNS_AVALIACAO,
									stableSort(avaliacaoList, getSorting(avaliacaoOrder, avaliacaoOrderBy))
								)}
							/>
						)}
					</Box>

					<Table small>
						<TableHead
							columns={COLUMNS_AVALIACAO}
							order={avaliacaoOrder}
							orderBy={avaliacaoOrderBy}
							onRequestSort={(event, property) =>
								handleRequestSort(
									avaliacaoOrderBy,
									avaliacaoOrder,
									newValue => setAvaliacaoOrder(newValue),
									() => setAvaliacaoOrderBy(property),
									event,
									property
								)}
							rowCount={COLUMNS_AVALIACAO.length}
						/>
						<TableBody style={{ overflow: 'scroll' }}>
							{stableSort(
								avaliacaoList,
								getSorting(avaliacaoOrder, avaliacaoOrderBy)
							).map((avaliacao, index) => {
								variantTableRow =
									variantTableRow === theme.palette.tableRowPrimary
										? theme.palette.tableRowSecondary
										: theme.palette.tableRowPrimary;

								return (
									<TableRow key={index} backgroundColor={variantTableRow}>
										<TableCell label={avaliacao.CodigoCategoria} />
										<TableCell
											label={
												<div
													style={{
														width: 240,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis'
													}}
												>
													{avaliacao.NomeCategoria}
												</div>
											}
										/>
										<TableCell label={avaliacao.TipoCategoria} />
										<TableCell label={avaliacao.EixoX} align='right' />
										<TableCell label={avaliacao.EixoY} align='right' />
										<TableCell label={avaliacao.Quadrante} align='right' />
										<TableCell
											label={
												<NumberFormat
													value={avaliacao.EstimativaGastoMensal}
													displayType='text'
													thousandSeparator='.'
													decimalSeparator=','
													decimalScale='2'
													fixedDecimalScale
												/>
											}
											align='right'
										/>
									</TableRow>
								);
							})}
							{avaliacaoList.length === 0 && (
								<TableRow backgroundColor={variantTableRow}>
									<TableCell align='center' colSpan={7} label={translate('semResultadosAExibir')} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</BoxContentTab>
			)}
			<Box
				display='flex'
				justifyContent={resultadoList.length > 0 && tab === 1 ? 'space-between' : 'flex-end'}
			>
				<Button text='Voltar' backgroundColor={theme.palette.secondary.main} onClick={voltar} />
				{resultadoList.length > 0 &&
				tab === 1 && <Button text={translate('salvar')} onClick={updateMany} />}
			</Box>
		</LayoutContent>
	);
}
