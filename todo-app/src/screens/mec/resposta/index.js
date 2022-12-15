import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, Box, Checkbox, IconButton } from '@material-ui/core';
import _ from 'lodash';
import useReactRouter from 'use-react-router';
import {
	Button,
	Table,
	TableHead,
	TableRow,
	TableCell,
	FormSelect,
	Modal,
	Steppers,
	Carrocel
} from '@/components';
import { useSnackbar } from 'notistack';
import { Search } from '@material-ui/icons';
import LayoutContent from '@/layout/layoutContent';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { SELECT_NOTAS, MATERIAL, SERVICO } from '@/utils/constants';
import { getArrayWithMultipleAttributes, stableSort, getSorting } from '@/utils/list';
import theme from '@/theme';
import { snackSuccess, snackError } from '@/utils/snack';
import { getUser } from '@/utils/auth';
import { COLUMNS_RESPOSTA, COLUMNS_GRUPO_CATEGORIA } from './tableHead';
import RespostaService from '@/services/resposta';
import PerguntaService from '@/services/pergunta';
import GrupoCategoriaService from '@/services/grupoCategoria';
import ObjectHelper from '@/utils/objectHelper';
import { Mensagem } from './style';

export default function Resposta() {
	const usuario = getUser();
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		activeStep,
		setActiveStep
	] = useState(0);

	const [
		inicioCarrocel,
		setInicioCarrocel
	] = useState(0);

	const [
		fimCarrocel,
		setFimCarrocel
	] = useState(6);

	const [
		perguntaIdStep,
		setPerguntaIdStep
	] = useState(undefined);

	const [
		steppers,
		setSteppers
	] = useState([]);

	const [
		perguntaList,
		setPerguntaList
	] = useState([]);

	const [
		respostaList,
		setRespostaList
	] = useState([]);

	const initialOrderBy = 'CodigoCategoria';

	const [
		orderBy,
		setOrderBy
	] = useState(initialOrderBy);

	const [
		openModalGrupos,
		setOpenModalGrupos
	] = useState(false);

	const [
		grupos,
		setGrupos
	] = useState([]);

	const initialOrder = 'asc';

	const [
		order,
		setOrder
	] = useState(initialOrder);

	// Efeito Inicial

	useEffect(() => {
		perguntaFindByGrupoUsuario(usuario.grupoUsuarioId);
		return () => {
			setPerguntaList([]);
			setRespostaList([]);
		};
	}, []);

	// Buscar Dados

	const perguntaFindByGrupoUsuario = grupoUsuarioId => {
		dispatch(LoaderCreators.setLoading());
		PerguntaService.findByGrupoUsuario(grupoUsuarioId)
			.then(response => {
				if (response.data) {
					setPerguntaList(response.data.Pergunta_list);
					setPerguntaIdStep(response.data.Pergunta_list[0].value);
					dispatch(LoaderCreators.disableLoading());
					gerarRespostas(response.data.Pergunta_list[0].value, response.data.Pergunta_list);
				} else {
					dispatch(LoaderCreators.disableLoading());
				}
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	const grupoCategoriaFindByCategoria = categoriaId => {
		dispatch(LoaderCreators.setLoading());
		GrupoCategoriaService.findByCategoria(categoriaId)
			.then(response => {
				if (response.data) {
					setGrupos(response.data.GrupoCategoria_list);
					setOpenModalGrupos(true);
					dispatch(LoaderCreators.disableLoading());
				} else {
					dispatch(LoaderCreators.disableLoading());
				}
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	// NECESSARIO REMOVER TRECHO DE CODIGO DE FILTRO ESPECIFICO DE USUARIO
	const USUARIO = getUser();

	const gerarRespostas = (perguntaId, perguntas) => {
		dispatch(LoaderCreators.setLoading());
		RespostaService.gerar(perguntaId, usuario.id)
			.then(response => {
				const newList = [];
				response.data.Resposta_gerar.forEach(resposta => {
					if (resposta.Categoria.Tipo === MATERIAL.id && USUARIO.email === 'joao@cemig.com.br') {
						newList.push({
							CategoriaId: resposta.Categoria.Id,
							CodigoCategoria: resposta.Categoria.Codigo,
							NomeCategoria: resposta.Categoria.Descricao,
							TipoCategoria: SERVICO.nome,
							Grupos: resposta.Categoria.Grupos ? resposta.Categoria.Grupos : [],
							Nota: resposta.Nota,
							NaoAplicavel: resposta.NaoAplicavel,
							Id: resposta.Id
						});
					}
					if (resposta.Categoria.Tipo != MATERIAL.id && USUARIO.email === 'mateus@cemig.com.br') {
						newList.push({
							CategoriaId: resposta.Categoria.Id,
							CodigoCategoria: resposta.Categoria.Codigo,
							NomeCategoria: resposta.Categoria.Descricao,
							TipoCategoria: SERVICO.nome,
							Grupos: resposta.Categoria.Grupos ? resposta.Categoria.Grupos : [],
							Nota: resposta.Nota,
							NaoAplicavel: resposta.NaoAplicavel,
							Id: resposta.Id
						});
					}
					if (USUARIO.email != 'mateus@cemig.com.br' && USUARIO.email != 'joao@cemig.com.br') {
						newList.push({
							CategoriaId: resposta.Categoria.Id,
							CodigoCategoria: resposta.Categoria.Codigo,
							NomeCategoria: resposta.Categoria.Descricao,
							TipoCategoria: resposta.Categoria.Tipo === MATERIAL.id ? MATERIAL.nome : SERVICO.nome,
							Grupos: resposta.Categoria.Grupos ? resposta.Categoria.Grupos : [],
							Nota: resposta.Nota,
							NaoAplicavel: resposta.NaoAplicavel,
							Id: resposta.Id
						});
					}
				});

				setRespostaList(newList);
				dispatch(LoaderCreators.disableLoading());
				respostaCountPreenchidos(perguntas, response.data.Resposta_gerar);
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	const respostaCountPreenchidos = (perguntas, respostas) => {
		dispatch(LoaderCreators.setLoading());
		RespostaService.countByUsuario(usuario.id)
			.then(response => {
				const newSteppers = [];

				perguntas.forEach(pergunta => {
					if (response.data.Resposta_count.length > 0) {
						if (
							response.data.Resposta_count.some(
								resposta =>
									resposta.Count.toString() === respostas.length.toString() &&
									resposta.Group.toString() === pergunta.value.toString()
							)
						) {
							pergunta.completed = true;
						}
					}
					newSteppers.push(pergunta);
				});

				setSteppers(newSteppers);
				dispatch(LoaderCreators.disableLoading());
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	// Ações da Tela

	const handleChangeStep = (id, index) => {
		gerarRespostas(id, perguntaList);
		setPerguntaIdStep(id);
		setActiveStep(index);
	};

	const getList = () => {
		return stableSort(respostaList, getSorting(order, orderBy));
	};

	const handleChangeSelect = (value, index) => {
		const item = _.find(respostaList, r => r.CodigoCategoria === getList()[index].CodigoCategoria);
		const indexOriginal = respostaList.indexOf(item);
		const list = ObjectHelper.clone(respostaList);
		list[indexOriginal].Nota = value;
		list[indexOriginal].NaoAplicavel = value === 0;
		setRespostaList(list);
	};

	const handleChangeCheck = (value, index) => {
		const item = _.find(respostaList, r => r.CodigoCategoria === getList()[index].CodigoCategoria);
		const indexOriginal = respostaList.indexOf(item);
		const list = ObjectHelper.clone(respostaList);
		list[indexOriginal].Nota = value === true ? 0 : list[index].Nota;
		list[indexOriginal].NaoAplicavel = value;
		setRespostaList(list);
	};

	const salvar = () => {
		const respostaListInsert = [];
		const respostaListUpdate = [];
		const idsListUpdate = [];

		respostaList.forEach(resposta => {
			const newResposta = {
				NaoAplicavel: resposta.NaoAplicavel,
				Nota: resposta.Nota,
				CategoriaId: resposta.CategoriaId,
				PerguntaId: perguntaIdStep,
				UsuarioId: usuario.id
			};
			if (resposta.Id) {
				idsListUpdate.push(resposta.Id);
				respostaListUpdate.push(newResposta);
			} else {
				respostaListInsert.push(newResposta);
			}
		});

		if (respostaListInsert.length > 0) {
			create(respostaListInsert);
		} else if (respostaListUpdate.length > 0) {
			update(idsListUpdate, respostaListUpdate);
		}
	};

	const create = list => {
		dispatch(LoaderCreators.setLoading());
		RespostaService.create(list).then(() => callback()).catch(message => callbackError(message));
	};

	const update = (ids, list) => {
		dispatch(LoaderCreators.setLoading());
		RespostaService.update(
			ids,
			getArrayWithMultipleAttributes(list, [
				'Nota',
				'NaoAplicavel'
			])
		)
			.then(() => callback())
			.catch(message => callbackError(message));
	};

	// Ações de Retorno

	const callback = () => {
		respostaCountPreenchidos(perguntaList);
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(translate('FormularioSalvaComSucesso'), closeSnackbar));
	};

	const callbackError = message => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(message, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	// Interações com o Carrocel

	const anterior = () => {
		if (inicioCarrocel > 0) {
			setInicioCarrocel(inicioCarrocel - 1);
			setFimCarrocel(fimCarrocel - 1);
		}
	};

	const proximo = () => {
		if (fimCarrocel < steppers.length) {
			setInicioCarrocel(inicioCarrocel + 1);
			setFimCarrocel(fimCarrocel + 1);
		}
	};

	// Interações com a Tabela

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			{respostaList.length > 0 &&
			steppers.length > 0 && (
				<Fragment>
					<Modal
						open={openModalGrupos}
						handleClose={() => setOpenModalGrupos(false)}
						onClickButton={() => setOpenModalGrupos(false)}
						title={translate('gruposCategoria')}
						textButton={translate('fechar')}
					>
						<Table small>
							<TableHead
								columns={COLUMNS_GRUPO_CATEGORIA}
								rowCount={COLUMNS_GRUPO_CATEGORIA.length}
							/>
							<TableBody>
								{grupos.map((grupo, index) => {
									variantTableRow = variantTableRow === 'primary' ? 'secondary' : 'primary';
									return (
										<TableRow key={index} variant={variantTableRow}>
											<TableCell label={grupo.Codigo} />
											<TableCell label={grupo.Nome} />
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Modal>
					<Carrocel
						anterior={anterior}
						proximo={proximo}
						visibleAnterior={inicioCarrocel > 0}
						visibleProximo={steppers.length > fimCarrocel}
					>
						<Steppers
							steps={steppers.slice(inicioCarrocel, fimCarrocel)}
							activeStep={activeStep}
							onClick={(value, index) => handleChangeStep(value, index)}
							stepComplete={false}
						/>
					</Carrocel>
					<Mensagem>
						<div dangerouslySetInnerHTML={{ __html: steppers[activeStep].Descricao }} />
					</Mensagem>
					<Table small>
						<TableHead
							columns={COLUMNS_RESPOSTA}
							order={order}
							orderBy={orderBy}
							onRequestSort={(event, property) => handleRequestSort(property)}
							rowCount={COLUMNS_RESPOSTA.length}
						/>
						<TableBody>
							{getList().map((resposta, index) => {
								variantTableRow = variantTableRow === 'primary' ? 'secondary' : 'primary';
								return (
									<TableRow key={index} variant={variantTableRow}>
										<TableCell label={resposta.CodigoCategoria} />
										<TableCell label={resposta.NomeCategoria} />
										<TableCell
											title={translate('grupoCategoria')}
											label={
												<IconButton
													onClick={() => grupoCategoriaFindByCategoria(resposta.CategoriaId)}
												>
													<Search />
												</IconButton>
											}
										/>
										<TableCell label={resposta.TipoCategoria} />
										<TableCell
											title='Nota'
											label={
												<FormSelect
													labelInitialItem={translate('selecioneOpcao')}
													items={SELECT_NOTAS}
													value={resposta.Nota}
													onChange={event => handleChangeSelect(event.target.value, index)}
													width='200px'
												/>
											}
										/>
										<TableCell
											title='Não aplicável'
											label={
												<Checkbox
													key={index}
													onChange={event => handleChangeCheck(!resposta.NaoAplicavel, index)}
													checked={resposta.NaoAplicavel}
												/>
											}
										/>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
					<Box display='flex' justifyContent='flex-end'>
						<Button text='Voltar' backgroundColor={theme.palette.secondary.main} onClick={voltar} />
						<Button text='Salvar' onClick={salvar} margin={`0px 0px 0px @/..{theme.spacing(1)}px`} />
					</Box>
				</Fragment>
			)}
		</LayoutContent>
	);
}
