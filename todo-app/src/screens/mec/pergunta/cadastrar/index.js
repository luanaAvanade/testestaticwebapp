import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Box, Typography, TableBody, IconButton, TablePagination } from '@material-ui/core';
import useReactRouter from 'use-react-router';
import _ from 'lodash';
import {
	Button,
	Confirm,
	FormInput,
	TransferList,
	Table,
	TableHead,
	TableRow,
	TableCell
} from 'react-axxiom';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import theme from '@/theme';
import {
	FORMULARIO,
	SISTEMA,
	SERVICO,
	ROWSPERPAGE,
	SELECT_TIPO_CATEGORIA
} from '@/utils/constants';
import PerguntaService from '@/services/pergunta';
import GrupoUsuarioService from '@/services/grupoUsuario';
import PerguntaGrupoUsuarioService from '@/services/perguntaGrupoUsuario';
import ModalGrupoRespondente from './modalGrupoRespondente';
import { Delete } from '@material-ui/icons';
import { stableSort, getSorting } from '@/utils/list';
import ObjectHelper from '@/utils/objectHelper';
import { checkError } from '@/utils/validation';

export default function CadastrarPergunta() {
	const { history, match } = useReactRouter();
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		openConfirmAlterar,
		setOpenConfirmAlterar
	] = useState(false);

	const [
		origemDados,
		setOrigemDados
	] = useState(SISTEMA.id);

	const [
		pertencentes,
		setPertencentes
	] = useState([]);

	const [
		naoPertencentes,
		setNaoPertencentes
	] = useState([]);

	const [
		indexGrupoExcluir,
		setIndexGrupoExcluir
	] = useState(null);

	const [
		orderGrupoRespondente,
		setOrderGrupoRespondente
	] = useState('asc');

	const [
		orderByGrupoRespondente,
		setOrderByGrupoRespondente
	] = useState('Nome');

	const [
		page,
		setPage
	] = useState(0);

	const [
		rowsPerPage,
		setRowsPerPage
	] = useState(5);

	const [
		openModalGrupoRespondente,
		setOpenModalGrupoRespondente
	] = useState();

	const [
		perguntaGrupoUsuario,
		setPerguntaGrupoUsuario
	] = useState([]);

	// Efeito Incial

	useEffect(() => {
		if (id) {
			perguntaFindaById();
		} else {
			setOrigemDados(FORMULARIO.id);
			grupoUsuarioFindAll();
		}
		return () => {
			setValues({
				codigo: '',
				nome: ''
			});
		};
	}, []);

	// Buscar Dados

	const perguntaFindaById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaService.findById(id);
		if (response.data) {
			setOrigemDados(response.data.Pergunta.OrigemDados);
			setValues({
				codigo: response.data.Pergunta.Codigo,
				nome: response.data.Pergunta.Nome,
				descricao: response.data.Pergunta.Descricao
			});
			perguntaGrupoUsuarioFindByPergunta();
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const perguntaGrupoUsuarioFindByPergunta = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaGrupoUsuarioService.findByPergunta(id);
		if (response.data) {
			grupoUsuarioFindAll(response.data.PerguntaGrupoUsuario_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const grupoUsuarioFindAll = async perguntaGrupo => {
		const newPerguntaGrupoUsuario = perguntaGrupo || [];
		dispatch(LoaderCreators.setLoading());
		const newPertencentes = [];
		const newNaoPertencentes = [];

		GrupoUsuarioService.findAll()
			.then(response => {
				if (response.data) {
					response.data.GrupoUsuario_list.forEach(grupo => {
						const pertencente = _.find(
							newPerguntaGrupoUsuario,
							pg => pg.GrupoUsuario.Id === grupo.Id
						);
						if (pertencente) {
							newPertencentes.push({
								...grupo,
								Tipo: findTipo('codigo', pertencente.Tipo).value,
								isChecked: false
							});
						} else {
							newNaoPertencentes.push({ ...grupo, Tipo: 0, isChecked: false });
						}
					});

					setPerguntaGrupoUsuario(newPerguntaGrupoUsuario);
					setPertencentes(newPertencentes);
					setNaoPertencentes(newNaoPertencentes);
					dispatch(LoaderCreators.disableLoading());
				} else {
					dispatch(LoaderCreators.disableLoading());
				}
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	// Ações da Tela

	const getPergunta = () => {
		let newPergunta = {
			Nome: nome.value,
			Descricao: descricao.value,
			OrigemDados: origemDados === SISTEMA.id ? SISTEMA.codigo : FORMULARIO.codigo
		};

		if (id) {
			return newPergunta;
		}

		const inserirPerguntaGrupoUsuario = [];
		pertencentes.forEach(pertencente => {
			inserirPerguntaGrupoUsuario.push({
				GrupoUsuarioId: pertencente.Id,
				Tipo: pertencente.Tipo
			});
		});

		newPergunta = Object.assign({ Codigo: codigo.value }, newPergunta, {
			PerguntaGrupoUsuario: inserirPerguntaGrupoUsuario
		});
		return newPergunta;
	};

	const save = () => {
		if (isValid) {
			if (id) {
				setOpenConfirmAlterar(true);
			} else {
				create();
			}
		}
	};

	const create = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaService.findByCodigo(codigo.value);
		if (response.data.Pergunta_list.length > 0) {
			callbackWarning(translate('identificadorDuplicado'));
		} else {
			PerguntaService.create(getPergunta())
				.then(() => {
					callback(translate('sucessoInclusaoRegistro'));
				})
				.catch(() => callbackError(translate('erroInclusaoRegistro')));
		}
	};

	const update = () => {
		setOpenConfirmAlterar(false);
		dispatch(LoaderCreators.setLoading());
		PerguntaService.update(id, getPergunta())
			.then(response => {
				if (response.data) {
					perguntaGrupoUsuarioInsertOrDelete();
				}
			})
			.catch(() => callbackError(translate('erroAlteracaoRegistro')));
	};

	const perguntaGrupoUsuarioInsertOrDelete = async perguntaId => {
		const inserirPerguntaGrupoUsuario = [];
		const excluirPerguntaGrupoUsuario = [];

		if (perguntaGrupoUsuario.length > 0) {
			perguntaGrupoUsuario.forEach(perguntaGrupo => {
				if (
					!_.find(
						pertencentes,
						grupo =>
							grupo.Id === perguntaGrupo.GrupoUsuario.Id &&
							grupo.Tipo === findTipo('codigo', perguntaGrupo.Tipo).value
					)
				) {
					excluirPerguntaGrupoUsuario.push(perguntaGrupo.Id);
				}
			});

			pertencentes.forEach(pertencente => {
				if (
					!_.find(
						perguntaGrupoUsuario,
						perguntaGrupo =>
							perguntaGrupo.GrupoUsuario.Id === pertencente.Id &&
							perguntaGrupo.Tipo === findTipo('value', pertencente.Tipo).codigo
					)
				) {
					inserirPerguntaGrupoUsuario.push({
						PerguntaId: id || perguntaId,
						GrupoUsuarioId: pertencente.Id,
						Tipo: pertencente.Tipo
					});
				}
			});
		} else {
			pertencentes.forEach(pertencente => {
				inserirPerguntaGrupoUsuario.push({
					PerguntaId: id || perguntaId,
					GrupoUsuarioId: pertencente.Id,
					Tipo: pertencente.Tipo
				});
			});
		}

		const responseRemove = await PerguntaGrupoUsuarioService.removeMany(
			excluirPerguntaGrupoUsuario
		);
		const responseInsert = await PerguntaGrupoUsuarioService.createMany(
			inserirPerguntaGrupoUsuario
		);

		if (responseRemove.data && responseInsert.data) {
			callback(translate('sucessoAlteracaoRegistro'));
		} else {
			callbackError(translate('erroAlteracaoRegistro'));
		}
	};

	// Ações de Retorno

	const callback = mensagem => {
		voltar();
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};
	const callbackWarning = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};
	const voltar = () => {
		history.goBack();
	};

	// Formulário

	const initialValues = {
		codigo: '',
		nome: '',
		descricao: ''
	};

	const validationSchema = Yup.object().shape({
		codigo: Yup.string().required(translate('campoObrigatorio')),
		nome: Yup.string().required(translate('campoObrigatorio'))
	});

	const {
		getFieldProps,
		submitCount,
		handleSubmit,
		setFieldValue,
		setValues,
		errors,
		values,
		isValid
	} = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		codigo,
		metadataCodigo
	] = getFieldProps('codigo', 'text');

	const [
		nome,
		metadataNome
	] = getFieldProps('nome', 'text');

	const [
		descricao,
		metadataDescricao
	] = getFieldProps('descricao', 'text');

	const COLUMNS_GRUPO_RESPONDENTES = [
		{ id: 'Nome', label: 'Nome', width: '60%' },
		{
			id: 'TipoCategoria',
			label: 'Tipo de Categoria',
			width: '35%'
		},
		{
			id: 'acao',
			label: translate('acao'),
			width: '5%',
			align: 'center'
		}
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	const handleRequestSort = (property, order, setOrder, orderBy, setOrderBy) => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const remove = () => {
		const listNaoPertencente = ObjectHelper.clone(naoPertencentes);
		pertencentes[indexGrupoExcluir].Tipo = 0;
		pertencentes[indexGrupoExcluir].isChecked = false;
		listNaoPertencente.push(pertencentes[indexGrupoExcluir]);
		setNaoPertencentes(listNaoPertencente);

		const listPertencente = ObjectHelper.clone(pertencentes);
		listPertencente.splice(indexGrupoExcluir, 1);
		setPertencentes(listPertencente);
		setIndexGrupoExcluir(null);
	};

	const findTipo = (campo, valor) => {
		return _.find(SELECT_TIPO_CATEGORIA, tipo => tipo[campo] === valor);
	};

	const getTipo = tipoSelect => {
		return tipoSelect ? findTipo('value', tipoSelect).label : '';
	};

	return (
		<LayoutContent>
			<ModalGrupoRespondente
				openModal={openModalGrupoRespondente}
				setOpenModal={setOpenModalGrupoRespondente}
				naoPertencentes={naoPertencentes}
				setNaoPertencentes={newNaoPertencentes => setNaoPertencentes(newNaoPertencentes)}
				pertencentes={pertencentes}
				setPertencentes={newPertencentes => setPertencentes(newPertencentes)}
				formulario={{ submitCount, getFieldProps, setFieldValue, values }}
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

			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarPergunta')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Form onSubmit={handleSubmit}>
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='25%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormInput
							disabled={id}
							label={`@/..{translate('codigoPergunta')}:`}
							name={codigo}
							type='number'
							InputProps={{ inputProps: { min: 0 } }}
							error={checkError(submitCount, metadataCodigo)}
						/>
					</Box>
					<Box width='75%'>
						<FormInput
							label={`@/..{translate('nomePergunta')}:`}
							fullWidth
							name={nome}
							error={checkError(submitCount, metadataNome)}
						/>
					</Box>
				</Box>
				<FormInput
					label={`@/..{translate('descricaoPergunta')}:`}
					fullWidth
					name={descricao}
					error={checkError(submitCount, metadataDescricao)}
				/>
				{origemDados !== SISTEMA.id && (
					<Fragment>
						<Box display='flex' justifyContent='space-between'>
							<Typography
								title={`@/..{translate('grupoRespondente')}`}
								variant='h6'
								style={{ paddingBottom: theme.spacing(1) }}
							>
								{translate('grupoRespondente')}:
							</Typography>
							<Button text='Adicionar' onClick={() => setOpenModalGrupoRespondente(true)} />
						</Box>
						<Table small>
							<TableHead
								columns={COLUMNS_GRUPO_RESPONDENTES}
								order={orderGrupoRespondente}
								orderBy={orderByGrupoRespondente}
								onRequestSort={(event, property) =>
									handleRequestSort(
										property,
										orderGrupoRespondente,
										setOrderGrupoRespondente,
										orderByGrupoRespondente,
										setOrderByGrupoRespondente
									)}
								rowCount={COLUMNS_GRUPO_RESPONDENTES.length}
							/>
							<TableBody>
								{pertencentes &&
									pertencentes.length > 0 &&
									stableSort(
										pertencentes,
										getSorting(orderGrupoRespondente, orderByGrupoRespondente)
									)
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((grupoRespondente, index) => {
											variantTableRow =
												variantTableRow === theme.palette.table.tableRowPrimary
													? theme.palette.table.tableRowSecondary
													: theme.palette.table.tableRowPrimary;

											return (
												<TableRow key={index} backgroundColor={variantTableRow}>
													<TableCell label={grupoRespondente.Nome} />
													<TableCell label={getTipo(grupoRespondente.Tipo)} />
													<TableCell
														title='Excluir'
														label={
															<IconButton size='small' onClick={() => setIndexGrupoExcluir(index)}>
																<Delete />
															</IconButton>
														}
													/>
												</TableRow>
											);
										})}
								{pertencentes.length === 0 && (
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
							count={pertencentes.length}
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
					</Fragment>
				)}
				<Box display='flex' justifyContent='flex-end'>
					<Button text='Voltar' backgroundColor={theme.palette.secondary.main} onClick={voltar} />
					<Button
						text={id ? translate('atualizar') : translate('salvar')}
						type='submit'
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				</Box>
			</Form>
		</LayoutContent>
	);
}
