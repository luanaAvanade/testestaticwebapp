/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, Box, IconButton, TablePagination } from '@material-ui/core';
import _ from 'lodash';
import { Edit, Delete } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { Table, TableHead, TableRow, TableCell, Button, Confirm } from 'react-axxiom';
import useReactRouter from 'use-react-router';
import { LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { translate, translateWithHtml } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import theme from '@/theme';
//import { BotaoAtivo, BotaoInativo } from './style';
import paths from '@/utils/paths';
import { snackSuccess, snackError, snackWarning } from '@/utils/snack';
import TermosAceiteService from '@/services/termosAceite';
import TermoAceiteEmpresaService from '@/services/termoAceiteEmpresa';
import { TIPO_EMPRESA, TIPO_CADASTRO, ROWSPERPAGE } from '@/utils/constants';
import { SUBDIRETORIO_LINK } from '@/utils/constants';
//import { Status } from '../style';

export default function ListarTermosAceite({ getPermissao }) {
	// Estado Local
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

	const [
		termoAceiteList,
		setTermoAceiteList
	] = useState([]);

	// Efeito Inicial
	useEffect(() => {
		termosAceiteFindAll();
		return () => {
			setTermoAceiteList([]);
		};
	}, []);

	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const [
		idTermoAceiteExcluir,
		setIdTermoAceiteExcluir
	] = useState(null);

	const excluir = async () => {
		dispatch(LoaderCreators.setLoading());

		const response = await TermoAceiteEmpresaService.findByTermoAceite(idTermoAceiteExcluir);

		let countAceite = 0;
		if (response.data && response.data.TermoAceiteEmpresa_list.length > 0) {
			response.data.TermoAceiteEmpresa_list.forEach(termoAceiteEmpresa => {
				if (termoAceiteEmpresa.Aceite) {
					countAceite++;
				}
			});
		}

		if (countAceite === 0) {
			TermosAceiteService.remove(idTermoAceiteExcluir)
				.then(() => callback(translate('termoAceiteExcluidoSucesso')))
				.catch(() => callbackError(translate('erroExcluirTermoAceite')));
		} else {
			callbackWarnig(translateWithHtml('aTentativaExclusaoNaoFoiRealizada'));
		}
		setIdTermoAceiteExcluir(null);
	};

	// Ações da Tela
	const novo = () => {
		history.push(paths.getPathByCodigo('termos-aceite-cadastro'));
	};

	const editar = id => {
		history.push(`@/..{SUBDIRETORIO_LINK}/termos-aceite/editar-termos-aceite/@/..{id}`);
	};

	const termosAceiteFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await TermosAceiteService.findAll();
		if (response.data) {
			setTermoAceiteList(response.data.TermosAceite_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações de Retorno

	const callback = mensagem => {
		termosAceiteFindAll();
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const callbackWarnig = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	// Buscar Dados

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const columns = [
		{ id: 'Titulo', label: translate('titulo'), width: '35%' },
		{ id: 'SubTitulo', label: translate('subtitulo'), width: '15%' },
		{ id: 'TipoCadastro', label: translate('tipo'), width: '35%' },
		{ id: 'Status', label: translate('status'), width: '15%' },
		{ id: 'Acoes', label: translate('acoes'), width: '5@/..', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	const getTipoFornecedor = _tipoFornecedor => {
		const tipo = _.find(TIPO_EMPRESA, tipoFornecedor => tipoFornecedor.value === _tipoFornecedor);
		if (tipo) return tipo;
		return { label: ' ', value: 'naoEncontrado' };
	};

	const getTipoCadastro = _tipoCadastro => {
		const tipo = _.find(TIPO_CADASTRO, tipoCadastro => tipoCadastro.value === _tipoCadastro);
		if (tipo) return tipo;
		return { label: ' ', value: 'naoEncontrado' };
	};

	return (
		<LayoutContent>
			<Confirm
				open={idTermoAceiteExcluir !== null}
				handleClose={() => setIdTermoAceiteExcluir(null)}
				handleSuccess={excluir}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirTermoAceite')}
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
				/>
				<TableBody>
					{stableSort(termoAceiteList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((termoAceite, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;

							return (
								<TableRow key={index} backgroundColor={variantTableRow}>
									<TableCell label={termoAceite.Titulo} />
									<TableCell label={termoAceite.SubTitulo} />
									<TableCell
										label={
											getTipoFornecedor(termoAceite.TipoFornecedor).label +
											' - ' +
											getTipoCadastro(termoAceite.TipoCadastro).label
										}
									/>
									{/* <Status
										label={termoAceite.Status ? 'Ativo' : 'Inativo'}
										ativo={termoAceite.Status}
										backgroundColor={termoAceite.Status ? '#1e90ff' : '#808080'}
									/> */}
									{
										<TableCell
											title={translate('editar')}
											label={
												<IconButton
													disabled={!getPermissao()}
													size='small'
													onClick={() => editar(termoAceite.Id)}
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
													onClick={() => setIdTermoAceiteExcluir(termoAceite.Id)}
												>
													<Delete />
												</IconButton>
											}
										/>
									}
								</TableRow>
							);
						})}
					{termoAceiteList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>

			{termoAceiteList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={termoAceiteList.length}
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
