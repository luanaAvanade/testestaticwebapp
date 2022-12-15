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
import PerguntaQualificacaoService from '@/services/perguntaQualificacao';
import { snackSuccess, snackError } from '@/utils/snack';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { useSnackbar } from 'notistack';
import { SUBDIRETORIO_LINK, ROWSPERPAGE } from '@/utils/constants';
import { Status } from '@/screens/fornecedor/style';
import paths from '@/utils/paths';

export default function ListarPerguntaQualificacao() {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	// Estado Local
	const [
		perguntaList,
		setPerguntaList
	] = useState([]);

	const [
		idPerguntaQualificacaoExcluir,
		setIdPerguntaQualificacaoExcluir
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
		PerguntaQualificacaoFindAll();
		return () => {
			setPerguntaList([]);
		};
	}, []);

	// Buscar Dados

	const PerguntaQualificacaoFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaQualificacaoService.findAll();
		if (response.data) {
			setPerguntaList(response.data.PerguntaQualificacao_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const novo = () => {
		history.push(paths.getPathByCodigo('nova-pergunta-qualificacao'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/pergunta-qualificacao/editar-pergunta-qualificacao/@/..{id}`);
	};

	const excluir = () => {
		setIdPerguntaQualificacaoExcluir(null);
		dispatch(LoaderCreators.setLoading());
		PerguntaQualificacaoService.remove(idPerguntaQualificacaoExcluir)
			.then(() => callback(translate('perguntaQualificacaoExcluidaSucesso')))
			.catch(() => callbackError(translate('erroExcluirPerguntaQualificacao')));
	};

	// Ações de Retorno

	const callback = mensagem => {
		PerguntaQualificacaoFindAll();
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
			label: translate('pergunta'),
			width: '55%'
		},
		{
			id: 'GrupoPerguntaQualificacao',
			label: translate('grupoPerguntaQualificacao'),
			width: '30%'
		},
		{ id: 'Status', label: translate('Status'), width: '10%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={idPerguntaQualificacaoExcluir !== null}
				handleClose={() => setIdPerguntaQualificacaoExcluir(null)}
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
					{stableSort(perguntaList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((perguntaQualificacao, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={perguntaQualificacao.Texto} />
									<TableCell label={perguntaQualificacao.GrupoPerguntaQualificacao.Nome} />
									<Status
										label={perguntaQualificacao.Status ? 'Ativo' : 'Inativo'}
										ativo={perguntaQualificacao.Status}
										backgroundColor={perguntaQualificacao.Status ? '#1e90ff' : '#808080'}
									/>

									<TableCell
										title={translate('editar')}
										label={
											<IconButton size='small' onClick={() => editar(perguntaQualificacao.Id)}>
												<Edit />
											</IconButton>
										}
									/>
									<TableCell
										title={translate('excluir')}
										label={
											<IconButton
												size='small'
												onClick={() => setIdPerguntaQualificacaoExcluir(perguntaQualificacao.Id)}
											>
												<Delete />
											</IconButton>
										}
									/>
								</TableRow>
							);
						})}
					{perguntaList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{perguntaList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={perguntaList.length}
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
