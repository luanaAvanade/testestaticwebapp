import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Box, CardHeader } from '@material-ui/core';
import useReactRouter from 'use-react-router';
import { FormSelectWithSearch, Button, Confirm, FormInput } from 'react-axxiom';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import theme from '@/theme';
import ExigenciaService from '@/services/exigencia';
import GrupoCategoriaService from '@/services/grupoCategoria';
import CategoriaService from '@/services/categoria';
import ExigenciaGrupoPerguntaQualificacaoService from '@/services/exigenciaGrupoPerguntaQualificacao';
import { checkError } from '@/utils/validation';

export default function CadastrarExigenciaGrupo() {
	const { history } = useReactRouter();
	// eslint-disable-next-line no-restricted-globals
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		listaExigencias,
		setListaExigencias
	] = useState([]);
	const [
		exigenciaSelecionada,
		setExigenciaSelecionada
	] = useState({});
	const [
		listaGrupoCategoria,
		setListaGrupoCategoria
	] = useState([]);
	const [
		listaGrupoCategoriaSelecionada,
		setListaGrupoCategoriaSelecionada
	] = useState([]);
	const [
		categoriaSelecionada,
		setCategoriaSelecionada
	] = useState({});
	const [
		listaCategoria,
		setListaCategoria
	] = useState([]);

	// Efeito Inicial

	useEffect(() => {
		getExigencias();
		getCategoria();
	}, []);

	// Busca de Dados

	const getExigencias = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await ExigenciaService.findAllActive();
		if (response.data) {
			setListaExigencias(response.data.Exigencia_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};
	const getGruposCategoria = async categoriaId => {
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoCategoriaService.findByCategoria(categoriaId);
		if (response.data) {
			setListaGrupoCategoria(response.data.GrupoCategoria_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};
	const getCategoria = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await CategoriaService.findAll();
		if (response.data) {
			setListaCategoria(response.data.Categoria_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};
	// Ações da Tela
	const CategoriaChange = selected => {
		setCategoriaSelecionada(selected);
		if (selected == null) {
			setListaGrupoCategoriaSelecionada([]);
		} else {
			getGruposCategoria(selected.Id);
		}
	};

	const save = async () => {
		if (
			listaGrupoCategoriaSelecionada != null &&
			listaGrupoCategoriaSelecionada.length > 0 &&
			exigenciaSelecionada != null
		) {
			await salvarLista()
				.then(() => callback(translate('novaExigenciaDeGrupoSucesso')))
				.catch(() => callbackError(translate('erroCadastrarExigenciaDeGrupo')));
		} else {
			callbackWarning(translate('itemExistente'));
		}
	};
	const salvarLista = async () => {
		listaGrupoCategoriaSelecionada.forEach(async item => {
			await ExigenciaGrupoPerguntaQualificacaoService.create({
				ExigenciaId: exigenciaSelecionada.Id,
				GrupoCategoriaId: item.Id,
				Distribuidor: false,
				Fabricante: false
			});
		});
	};
	const callback = mensagem => {
		// voltar();
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const callbackWarning = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};
	const voltar = () => {
		history.goBack();
	};

	return (
		<LayoutContent>
			<Box paddingTop={`@/..{theme.spacing(1)}px`}>
				<CardHeader title='Nova Associação de Grupos às Exigências' />
				<FormSelectWithSearch
					placeholder={translate('selecioneExigencia')}
					label={`@/..{translate('exigencia')}:`}
					options={listaExigencias}
					value={exigenciaSelecionada}
					getOptionLabel={option => option.Nome}
					onChange={(event, selected) => setExigenciaSelecionada(selected)}
					required
					disabled={false}
				/>
				<FormSelectWithSearch
					placeholder={translate('selecioneCategoria')}
					label={`@/..{translate('categoria')}:`}
					options={listaCategoria}
					value={categoriaSelecionada}
					getOptionLabel={option => option.Descricao}
					onChange={(event, selected) => CategoriaChange(selected)}
					required
					disabled={false}
				/>
				<Autocomplete
					multiple
					disabled={categoriaSelecionada == null}
					options={listaGrupoCategoria}
					getOptionLabel={option => option.Nome}
					value={listaGrupoCategoriaSelecionada}
					onChange={(event, selected) => setListaGrupoCategoriaSelecionada(selected)}
					renderInput={params => (
						<TextField
							{...params}
							variant='standard'
							label={translate('grupoCategoria')}
							placeholder={translate('selecioneGrupoCategoria')}
							fullWidth
						/>
					)}
				/>
				<Box display='flex' justifyContent='flex-end' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Button text='Voltar' backgroundColor={theme.palette.secondary.main} onClick={voltar} />
					<Button
						text={translate('salvar')}
						onClick={save}
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				</Box>
			</Box>
		</LayoutContent>
	);
}
