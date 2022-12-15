import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, Box, IconButton, TablePagination } from '@material-ui/core';
import moment from 'moment';
import useReactRouter from 'use-react-router';
import { Edit, Lock, Delete } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from '@/components';
import { LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import VersaoMecService from '@/services/versaoMec';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import paths from '@/utils/paths';
import { snackSuccess, snackError, snackWarning } from '@/utils/snack';
import theme from '@/theme';
import {
	MEC_VERSAO,
	EDITAR,
	DELETAR,
	CRIAR,
	SUBDIRETORIO_LINK,
	ROWSPERPAGE
} from '@/utils/constants';
import { checkFuncionalidade } from '@/utils/modulos';

export default function ListagemVersao({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		versaoMecList,
		setVersaoMecList
	] = useState([]);

	const [
		versaoMec,
		setVersaoMec
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
	] = useState(10);

	const [
		order,
		setOrder
	] = useState('desc');

	// Efeito Inicial

	useEffect(() => {
		versaoMecFindAll();
		return () => {
			setVersaoMecList([]);
		};
	}, []);

	// Busca de Dados

	const versaoMecFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await VersaoMecService.findAll();
		if (response.data) {
			setVersaoMecList(response.data.VersaoMec_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const nova = () => {
		history.push(paths.getPathByCodigo('nova-versao'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/versoes/editar-versao/@/..{id}`);
	};

	const encerrar = async () => {
		setVersaoMec(null);
		const newVersaoMec = {
			Nome: versaoMec.Nome,
			FormulaEixoX: versaoMec.FormulaEixoX,
			FormulaEixoY: versaoMec.FormulaEixoY,
			DataEncerramento: new Date()
		};

		VersaoMecService.update(versaoMec.value, newVersaoMec)
			.then(response => {
				if (response.data) {
					callback(translate('versaoEncerradaSucesso'));
				} else {
					callbackError(translate('erroEncerrarNovaVersao'));
				}
			})
			.catch(() => {
				callbackError(translate('erroEncerrarNovaVersao'));
			});
	};

	// Ações de retorno

	const callback = mensagem => {
		versaoMecFindAll();
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
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
		{ id: 'Nome', label: translate('nome'), width: '15%' },
		{ id: 'FormulaEixoX', label: translate('formulaEixoX'), width: '35%' },
		{ id: 'FormulaEixoY', label: translate('formulaEixoY'), width: '35%' },
		{ id: 'DataCriacao', label: translate('criacao'), width: '5%' },
		{ id: 'DataEncerramento', label: translate('encerramento'), width: '5%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={versaoMec !== null}
				handleClose={() => setVersaoMec(null)}
				handleSuccess={encerrar}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteEncerrarVersao')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Table small>
				<TableHead
					columns={columns}
					order={order}
					orderBy={orderBy}
					onRequestSort={(event, property) => handleRequestSort(property)}
					rowCount={columns.length}
				/>
				<TableBody>
					{stableSort(versaoMecList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((versao, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={versao.label} />
									<TableCell label={versao.FormulaEixoX} />
									<TableCell label={versao.FormulaEixoY} />
									<TableCell label={moment(versao.DataCriacao).format('DD/MM/YYYY')} />
									<TableCell
										label={
											versao.DataEncerramento ? (
												moment(versao.DataEncerramento).format('DD/MM/YYYY')
											) : (
												''
											)
										}
									/>
									<Fragment>
										<TableCell
											title={
												versao.DataEncerramento ? (
													translate('estaVersaoEstaEncerrada')
												) : (
													translate('editar')
												)
											}
											label={
												<IconButton
													disabled={!!versao.DataEncerramento || !getPermissao()}
													size='small'
													onClick={() => editar(versao.value)}
												>
													<Edit />
												</IconButton>
											}
										/>
										<TableCell
											title={
												versao.DataEncerramento ? (
													translate('estaVersaoEstaEncerrada')
												) : (
													translate('encerrar')
												)
											}
											label={
												<IconButton
													disabled={!!versao.DataEncerramento || !getPermissao()}
													size='small'
													onClick={() => setVersaoMec(versao)}
												>
													<Lock />
												</IconButton>
											}
										/>
									</Fragment>
								</TableRow>
							);
						})}
					{versaoMecList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={6} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{versaoMecList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={versaoMecList.length}
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

			<Box display='flex' justifyContent='flex-end'>
				<Button
					text={translate('voltar')}
					backgroundColor={theme.palette.secondary.main}
					onClick={voltar}
				/>
				{getPermissao() && (
					<Button
						text={translate('adicionar')}
						onClick={nova}
						disabled={!getPermissao()}
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				)}
			</Box>
		</LayoutContent>
	);
}
