import React, { useState, Fragment } from 'react';
import {
	CardHeader,
	CardContent,
	Box,
	Table,
	TableBody,
	IconButton,
	TablePagination
} from '@material-ui/core';
import _ from 'lodash';
import { Delete } from '@material-ui/icons';
import { Card, TableHead, TableRow, TableCell, Confirm, Button } from '@/components';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { translate } from '@/locales';
import theme from '@/theme';
import { stableSort, getSorting } from '@/utils/list';
import ObjectHelper from '@/utils/objectHelper';
import { COLUMNS_GRUPO_FORNECIMENTO } from './tableHead';
import ModalGrupoFornecimento from './modalGrupoFornecimento';
import { checkError } from '@/utils/validation';
import {
	MATERIAL,
	SERVICO,
	FABRICANTE,
	DISTRIBUIDOR,
	ROWSPERPAGE,
	SUBCATEGORIAS
} from '@/utils/constants';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function DadosGrupoFornecimento({
	formulario,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	historicoEmpresa,
	user,
	disableEdit,
	statusEmpresa
}) {
	const { submitCount, getFieldProps, setFieldValue, setFieldTouched } = formulario;

	// Formulario
	const [
		grupoFornecimentoList,
		metadataDataGrupoFornecimentoList
	] = getFieldProps('grupoFornecimentoList', 'text');

	// Estados locais
	const [
		indexGrupoExcluir,
		setIndexGrupoExcluir
	] = useState(null);

	const [
		openModalGrupoFornecimento,
		setOpenModalGrupoFornecimento
	] = useState(false);

	const [
		orderGrupoFornecimento,
		setOrderGrupoFornecimento
	] = useState('asc');

	const [
		orderByGrupoFornecimento,
		setOrderByGrupoFornecimento
	] = useState('grupoAdicional');

	const [
		page,
		setPage
	] = useState(0);

	const [
		rowsPerPage,
		setRowsPerPage
	] = useState(5);

	// Ações da Tela
	const getList = (list, order, orderBy) => {
		return stableSort(list, getSorting(order, orderBy));
	};

	const remove = () => {
		const list = ObjectHelper.clone(grupoFornecimentoList.value);
		list.splice(indexGrupoExcluir, 1);
		setFieldValue('grupoFornecimentoList', list);
		setFieldTouched('grupoFornecimentoList', true);
		setIndexGrupoExcluir(null);
	};

	const getTipo = (value, field) => {
		return value === MATERIAL[field] ? MATERIAL : SERVICO;
	};

	const getTipoFornecimento = (value, field) => {
		return value === FABRICANTE[field] ? FABRICANTE.nome : DISTRIBUIDOR.nome;
	};

	// Interação com a Tabela
	const handleRequestSort = (property, order, setOrder, orderBy, setOrderBy) => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Fragment>
			<ModalGrupoFornecimento
				openModal={openModalGrupoFornecimento}
				setOpenModal={setOpenModalGrupoFornecimento}
				formulario={formulario}
			/>

			<Confirm
				open={indexGrupoExcluir !== null}
				handleSuccess={remove}
				handleClose={() => setIndexGrupoExcluir(null)}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirGrupo')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Box paddingTop={`${theme.spacing(1)}px`}>
				<Card
					borderColor={theme.palette.danger.main}
					error={checkError(submitCount, metadataDataGrupoFornecimentoList)}
				>
					<CardHeader
						title='Grupos de Fornecimento'
						action={
							<Fragment>
								<Box>
									<Aprovacao
										itensAnalise={itensAnalise}
										setItensAnalise={setItensAnalise}
										comentarios={comentarios}
										setComentarios={setComentarios}
										tipoItem={
											ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Grupos_Fornecimento').value
										}
										historicoEmpresa={historicoEmpresa}
										user={user}
										disableEdit={disableEdit}
										statusEmpresa={statusEmpresa}
									/>
								</Box>
								<Box paddingTop={`${theme.spacing(1)}px`}>
									{!disableEdit && (
										<Button
											text='Adicionar Grupo'
											onClick={() => setOpenModalGrupoFornecimento(true)}
										/>
									)}
								</Box>
							</Fragment>
						}
					/>
					<CardContent>
						<Table small>
							<TableHead
								columns={COLUMNS_GRUPO_FORNECIMENTO}
								order={orderGrupoFornecimento}
								orderBy={orderByGrupoFornecimento}
								onRequestSort={(event, property) =>
									handleRequestSort(
										property,
										orderGrupoFornecimento,
										setOrderGrupoFornecimento,
										orderByGrupoFornecimento,
										setOrderByGrupoFornecimento
									)}
								rowCount={COLUMNS_GRUPO_FORNECIMENTO.length}
							/>
							<TableBody>
								{grupoFornecimentoList.value &&
									grupoFornecimentoList.value.length > 0 &&
									getList(
										grupoFornecimentoList.value,
										orderGrupoFornecimento,
										orderByGrupoFornecimento
									)
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((grupoFornecimento, index) => {
											variantTableRow =
												variantTableRow === theme.palette.table.tableRowPrimary
													? theme.palette.table.tableRowSecondary
													: theme.palette.table.tableRowPrimary;

											return (
												<TableRow key={index} backgroundColor={variantTableRow}>
													<TableCell
														title={
															grupoFornecimento.GrupoCategoria.Codigo +
															'-' +
															grupoFornecimento.GrupoCategoria.Nome
														}
														label={
															<div
																style={{
																	width: 350,
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis'
																}}
															>
																{grupoFornecimento.GrupoCategoria.Codigo} -{' '}
																{grupoFornecimento.GrupoCategoria.Nome}
															</div>
														}
													/>
													<TableCell
														title={
															grupoFornecimento.GrupoCategoria.Categoria.Codigo +
															'-' +
															grupoFornecimento.GrupoCategoria.Categoria.Descricao
														}
														label={
															<div
																style={{
																	width: 350,
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis'
																}}
															>
																{grupoFornecimento.GrupoCategoria.Categoria.Codigo} -{' '}
																{grupoFornecimento.GrupoCategoria.Categoria.Descricao}
															</div>
														}
													/>
													<TableCell
														label={
															getTipo(grupoFornecimento.GrupoCategoria.Categoria.Tipo, 'id').nome
														}
													/>
													<TableCell
														label={getTipoFornecimento(grupoFornecimento.TipoFornecimento, 'id')}
													/>
													<TableCell
														title='Excluir'
														label={
															<IconButton
																size='small'
																onClick={() => setIndexGrupoExcluir(index)}
																disabled={disableEdit}
															>
																<Delete />
															</IconButton>
														}
													/>
												</TableRow>
											);
										})}
								{grupoFornecimentoList.value.length === 0 && (
									<TableRow backgroundColor={variantTableRow}>
										<TableCell
											align='center'
											colSpan={6}
											label={translate('semResultadosAExibir')}
										/>
									</TableRow>
								)}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={ROWSPERPAGE}
							labelRowsPerPage={translate('linhasPorPagina')}
							component='div'
							count={grupoFornecimentoList.value.length}
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
					</CardContent>
				</Card>
			</Box>
		</Fragment>
	);
}
