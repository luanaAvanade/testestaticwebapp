import React, { useState, useEffect } from 'react';
import { TableBody, Box, IconButton, TablePagination } from '@material-ui/core';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Edit, Delete } from '@material-ui/icons';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from '@/components';
import useReactRouter from 'use-react-router';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import theme from '@/theme';
import GrupoPerguntaQualificacaoService from '@/services/grupoPerguntaQualificacao';
import { snackSuccess, snackError } from '@/utils/snack';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { useSnackbar } from 'notistack';
import { SUBDIRETORIO_LINK, ROWSPERPAGE } from '@/utils/constants';
import { Status } from '@/screens/fornecedor/style';
import paths from '@/utils/paths';

export default function ListarGrupoPerguntaQualificacao() {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	// Estado Local
	const [
		grupoPerguntaQualificacaoList,
		setGrupoPerguntaQualificacaoList
	] = useState([]);

	const [
		idGrupoPerguntaQualificacaoExcluir,
		setIdGrupoPerguntaQualificacaoExcluir
	] = useState(null);

	const [
		orderBy,
		setOrderBy
	] = useState('DataCriacao');

	const [
		page,
		setPage
	] = useState(0);

	const [
		rowsPerPage,
		setRowsPerPage
	] = useState(5);

	const [
		order,
		setOrder
	] = useState('desc');

	// Efeito Inicial

	useEffect(() => {
		GrupoPerguntaQualificacaoFindAll();
		return () => {
			setGrupoPerguntaQualificacaoList([]);
		};
	}, []);

	// Buscar Dados

	const GrupoPerguntaQualificacaoFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoPerguntaQualificacaoService.findAll();
		if (response.data) {
			setGrupoPerguntaQualificacaoList(response.data.GrupoPerguntaQualificacao_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const novo = () => {
		history.push(paths.getPathByCodigo('novo-grupo-pergunta-qualificacao'));
	};

	const editar = id => {
		history.push(
			`@/..{SUBDIRETORIO_LINK}/grupo-pergunta-qualificacao/editar-grupo-pergunta-qualificacao/@/..{id}`
		);
	};

	const excluir = () => {
		setIdGrupoPerguntaQualificacaoExcluir(null);
		dispatch(LoaderCreators.setLoading());
		GrupoPerguntaQualificacaoService.remove(idGrupoPerguntaQualificacaoExcluir)
			.then(() => callback(translate('grupoPerguntaQualificacaoExcluidoSucesso')))
			.catch(() => callbackError(translate('erroExcluirGrupoPerguntaQualificacao')));
	};

	// Ações de Retorno

	const callback = mensagem => {
		GrupoPerguntaQualificacaoFindAll();
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

	// Interação com a Tabela

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const columns = [
		{
			id: 'Nome',
			label: translate('Nome'),
			width: '85%'
		},

		{ id: 'Status', label: translate('Status'), width: '10%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={idGrupoPerguntaQualificacaoExcluir !== null}
				handleClose={() => setIdGrupoPerguntaQualificacaoExcluir(null)}
				handleSuccess={excluir}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirRegistro')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Box display='flex' justifyContent='flex-end'>
				<Button
					text={translate('adicionar')}
					onClick={novo}
					margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					align='Rigth'
				/>
			</Box>
			<Table small>
				<TableHead
					columns={columns}
					order={order}
					orderBy={orderBy}
					onRequestSort={(event, property) => handleRequestSort(property)}
					rowCount={columns.length}
					backgroundColor='red !important;'
				/>
				<TableBody>
					{stableSort(grupoPerguntaQualificacaoList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((GrupoPerguntaQualificacao, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={GrupoPerguntaQualificacao.Nome} />
									<Status
										label={GrupoPerguntaQualificacao.Status ? 'Ativo' : 'Inativo'}
										ativo={GrupoPerguntaQualificacao.Status}
										backgroundColor={GrupoPerguntaQualificacao.Status ? '#1e90ff' : '#808080'}
									/>

									<TableCell
										title={translate('editar')}
										label={
											<IconButton size='small' onClick={() => editar(GrupoPerguntaQualificacao.Id)}>
												<Edit />
											</IconButton>
										}
									/>
									<TableCell
										title={translate('excluir')}
										label={
											<IconButton
												size='small'
												onClick={() =>
													setIdGrupoPerguntaQualificacaoExcluir(GrupoPerguntaQualificacao.Id)}
											>
												<Delete />
											</IconButton>
										}
									/>
								</TableRow>
							);
						})}
					{grupoPerguntaQualificacaoList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{grupoPerguntaQualificacaoList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={grupoPerguntaQualificacaoList.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={(event, newPage) => setPage(newPage)}
					onChangeRowsPerPage={event => {
						setPage(0);
						setRowsPerPage(event.target.value);
					}}
					style={{ paddingRight: '80px' }}
				/>
			)}
		</LayoutContent>
	);
}
