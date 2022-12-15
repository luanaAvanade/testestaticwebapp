import React, { useState, useEffect } from 'react';
import { TableBody, Box, TablePagination, IconButton } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from '@/components';
import useReactRouter from 'use-react-router';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import GrupoUsuarioService from '@/services/grupoUsuario';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import paths from '@/utils/paths';
import theme from '@/theme';
import { snackSuccess, snackError, snackWarning } from '@/utils/snack';
import { checkFuncionalidade } from '@/utils/modulos';
import {
	MEC_GRUPO_USUARIO,
	DELETAR,
	EDITAR,
	CRIAR,
	SUBDIRETORIO_LINK,
	ROWSPERPAGE
} from '@/utils/constants';

export default function ListagemGrupoUsuario({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estados locais

	const [
		grupoUsuarioList,
		setGrupoUsuarioList
	] = useState([]);

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

	const [
		orderBy,
		setOrderBy
	] = useState('Codigo');

	const [
		idGrupoUsuarioExcluir,
		setIdGrupoUsuarioExcluir
	] = useState(null);

	// Efeito Inicial

	useEffect(() => {
		grupoUsuarioFindAll();
		return () => {
			setGrupoUsuarioList([]);
		};
	}, []);

	// Busca de Dados

	const grupoUsuarioFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoUsuarioService.findAll();
		if (response.data) {
			setGrupoUsuarioList(response.data.GrupoUsuario_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const nova = () => {
		history.push(paths.getPathByCodigo('novo-grupo-respondente'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/grupo-respondente/editar-grupo-respondente/@/..{id}`);
	};

	const excluir = async () => {
		setIdGrupoUsuarioExcluir(null);
		dispatch(LoaderCreators.setLoading());
		GrupoUsuarioService.remove(idGrupoUsuarioExcluir)
			.then(response => {
				if (response.data) {
					callback(translate('grupoRespondenteExcluidoSucesso'));
				} else {
					callbackError(translate('grupoRespondenteExcluidoSucesso'));
				}
			})
			.catch(() => {
				callbackError();
			});
	};

	// Ações de Retorno

	const callback = mensagem => {
		grupoUsuarioFindAll();
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = () => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackWarning(translate('erroExcluirGrupoRespondente'), closeSnackbar));
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
		{ id: 'Nome', label: translate('nome'), width: '30%' },
		{ id: 'Descricao', label: translate('descricao'), width: '65%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={idGrupoUsuarioExcluir !== null}
				handleClose={() => setIdGrupoUsuarioExcluir(null)}
				handleSuccess={excluir}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirGrupoRespondente')}
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
					{stableSort(grupoUsuarioList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((grupoUsuario, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={grupoUsuario.Nome} />
									<TableCell label={grupoUsuario.Descricao} />
									<TableCell
										title={translate('editar')}
										label={
											<IconButton
												disabled={!getPermissao()}
												size='small'
												onClick={() => editar(grupoUsuario.Id)}
											>
												<Edit />
											</IconButton>
										}
									/>
									<TableCell
										title={translate('excluir')}
										label={
											<IconButton
												size='small'
												disabled={!getPermissao()}
												onClick={() => setIdGrupoUsuarioExcluir(grupoUsuario.Id)}
											>
												<Delete />
											</IconButton>
										}
									/>
								</TableRow>
							);
						})}
					{grupoUsuarioList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{grupoUsuarioList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={grupoUsuarioList.length}
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
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				)}
			</Box>
		</LayoutContent>
	);
}
