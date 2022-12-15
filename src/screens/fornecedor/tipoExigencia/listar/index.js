import React, { useState, useEffect } from 'react';
import { TableBody, Box, IconButton, TablePagination } from '@material-ui/core';
import _ from 'lodash';
import { Edit, Delete } from '@material-ui/icons';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from '@/components';
import useReactRouter from 'use-react-router';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { snackSuccess, snackError } from '@/utils/snack';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import theme from '@/theme';
import paths from '@/utils/paths';
import TipoExigenciaService from '@/services/tipoExigencia';
import { SUBDIRETORIO_LINK, ROWSPERPAGE } from '@/utils/constants';
import { Status } from '../../style';

export default function ListagemTipoExigencia({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local
	const [
		tipoExigenciaList,
		setTipoExigenciaList
	] = useState([]);

	const [
		idTipoExigenciaExcluir,
		setIdExigenciaExcluir
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

	// Ações da Tela
	const novo = () => {
		history.push(paths.getPathByCodigo('novo-tipo-exigencia'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/tipo-exigencia/editar-tipo-exigencia/@/..{id}`);
	};
	const excluir = () => {
		setIdExigenciaExcluir(null);
		dispatch(LoaderCreators.setLoading());
		TipoExigenciaService.remove(idTipoExigenciaExcluir)
			.then(() => callback(translate('tipoExigenciaExcluidaSucesso')))
			.catch(() => callbackError(translate('erroExcluirTipoExigencia')));
	};

	const callback = mensagem => {
		tipoExigenciaFindAll();
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	// Efeito Inicial

	useEffect(() => {
		tipoExigenciaFindAll();
		return () => {
			setTipoExigenciaList([]);
		};
	}, []);

	// Buscar Dados

	const tipoExigenciaFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await TipoExigenciaService.findAll();
		if (response.data) {
			setTipoExigenciaList(response.data.TipoExigencia_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const columns = [
		{ id: 'Nome', label: translate('tipoExigencia'), width: '25%' },
		{ id: 'Descricao', label: translate('descricao'), width: '50%' },
		{ id: 'NivelExigencia', label: translate('nivel'), width: '15%' },
		{ id: 'Status', label: translate('status'), width: '15%' },
		{ id: 'acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	const nivel = {
		'1': translate('baixo'),
		'2': translate('medio'),
		'3': translate('alto')
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={idTipoExigenciaExcluir !== null}
				handleClose={() => setIdExigenciaExcluir(null)}
				handleSuccess={excluir}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirTipoExigencia')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>
			<Box display='flex' justifyContent='flex-end'>
				{getPermissao() && (
					<Button
						text={translate('adicionar')}
						onClick={novo}
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				)}
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
					{stableSort(tipoExigenciaList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((exigencia, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={exigencia.Nome} />
									<TableCell label={exigencia.Descricao} />
									<TableCell label={nivel[exigencia.NivelExigencia]} />
									<Status
										label={exigencia.Status ? 'Ativo' : 'Inativo'}
										ativo={exigencia.Status}
										backgroundColor={exigencia.Status ? '#1e90ff' : '#808080'}
									/>
									{
										<TableCell
											title={translate('editar')}
											label={
												<IconButton
													disabled={!getPermissao()}
													size='small'
													onClick={() => editar(exigencia.Id)}
												>
													<Edit />
												</IconButton>
											}
										/>
									}
									{
										<TableCell
											title={translate('excluir')}
											label={
												<IconButton
													size='small'
													disabled={!getPermissao()}
													onClick={() => setIdExigenciaExcluir(exigencia.Id)}
												>
													<Delete />
												</IconButton>
											}
										/>
									}
								</TableRow>
							);
						})}
					{tipoExigenciaList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{tipoExigenciaList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={tipoExigenciaList.length}
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
