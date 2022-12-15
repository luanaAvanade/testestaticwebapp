import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, Box, IconButton, TablePagination } from '@material-ui/core';
import moment from 'moment';
import _ from 'lodash';
import useReactRouter from 'use-react-router';
import { Edit, Delete } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from 'react-axxiom';
import { LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import paths from '@/utils/paths';
import { snackSuccess, snackError } from '@/utils/snack';
import theme from '@/theme';
import {
	FORMULARIO,
	SISTEMA,
	MEC_PERGUNTAS,
	CRIAR,
	EDITAR,
	DELETAR,
	SUBDIRETORIO_LINK,
	ROWSPERPAGE
} from '@/utils/constants';
import PerguntaService from '@/services/pergunta';
import { checkFuncionalidade } from '@/utils/modulos';

export default function ListagemPergunta({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		perguntaList,
		setPerguntaList
	] = useState([]);

	const [
		idPerguntaExcluir,
		setIdPerguntaExcluir
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
		perguntaFindAll();
		return () => {
			setPerguntaList([]);
		};
	}, []);

	// Buscar Dados

	const perguntaFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaService.findAll();
		if (response.data) {
			setPerguntaList(response.data.Pergunta_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const nova = () => {
		history.push(paths.getPathByCodigo('nova-pergunta'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/pergunta/editar-pergunta/@/..{id}`);
	};

	const excluir = () => {
		setIdPerguntaExcluir(null);
		dispatch(LoaderCreators.setLoading());
		PerguntaService.remove(idPerguntaExcluir)
			.then(() => callback(translate('sucessoExclusaoRegistro')))
			.catch(() => callbackError(translate('erroExclusaoRegistro')));
	};

	// Ações de Retorno

	const callback = mensagem => {
		perguntaFindAll();
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
		{ id: 'Codigo', label: translate('codigo'), width: '5%' },
		{ id: 'label', label: translate('descricao'), width: '65%' },
		{ id: 'OrigemDados', label: translate('origemDados'), width: '15%' },
		{ id: 'DataCriacao', label: translate('criacao'), width: '5%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Confirm
				open={idPerguntaExcluir !== null}
				handleClose={() => setIdPerguntaExcluir(null)}
				handleSuccess={excluir}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirPergunta')}
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
					{stableSort(perguntaList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((pergunta, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={pergunta.Codigo} />
									<TableCell label={pergunta.label} />
									<TableCell
										label={pergunta.OrigemDados === FORMULARIO.id ? FORMULARIO.nome : SISTEMA.nome}
									/>
									<TableCell label={moment(pergunta.DataCriacao).format('DD/MM/YYYY')} />
									<TableCell
										title={translate('editar')}
										label={
											<IconButton
												disabled={!getPermissao()}
												size='small'
												onClick={() => editar(pergunta.value)}
											>
												<Edit />
											</IconButton>
										}
									/>
									<TableCell
										title={translate('excluir')}
										label={
											<IconButton
												disabled={
													_.includes(
														[
															1,
															2,
															3,
															4,
															5,
															6,
															7,
															8
														],
														pergunta.Codigo
													) || !getPermissao()
												}
												size='small'
												onClick={() => setIdPerguntaExcluir(pergunta.value)}
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
