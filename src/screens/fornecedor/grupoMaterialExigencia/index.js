import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Box } from '@material-ui/core';
import useReactRouter from 'use-react-router';
import { Button, Confirm, FormInput } from '@/components';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';

import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import theme from '@/theme';
import TipoContatoService from '@/services/tipoContato';
import { checkError } from '@/utils/validation';

export default function AssociarExigenciaGrupoCategoria() {
	const { history } = useReactRouter();
	// eslint-disable-next-line no-restricted-globals
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		exigencias,
		setExigencias
	] = useState([]);
	const [
		grupoCategoria,
		setGrupoCategoria
	] = useState([]);
	// Efeito Inicial

	useEffect(() => {
		getExigencias();
	}, []);

	// Busca de Dados

	const getExigencias = async () => {
		// dispatch(LoaderCreators.setLoading());
		// const response = await TipoContatoService.findById(id);
		// if (response.data) {
		// 	setFieldValue('nome', response.data.TipoContato.Nome, false);
		// 	setFieldValue('descricao', response.data.TipoContato.Descricao, false);
		// 	setStatus(response.data.TipoContato.Status);
		// 	dispatch(LoaderCreators.disableLoading());
		// } else {
		// 	dispatch(LoaderCreators.disableLoading());
		// }
	};
	// Ações da Tela

	const getGrupoCategoriaExigencia = () => {
		return {};
	};
	const save = () => {
		create();
	};
	const create = async () => {
		// TipoContatoService.verificarExistente(nome.value).then(response => {
		// 	if (response.data.TipoContato_list.length > 0) {
		// 		callbackWarning(translate('itemExistente'));
		// 	} else {
		// 		TipoContatoService.create(getTipoContato())
		// 			.then(() => callback(translate('novoTipoContatoCadatradoSucesso')))
		// 			.catch(() => callbackError(translate('erroCadastrarNovoTipoContato')));
		// 	}
		// });
	};
	// Ações de Retorno

	const callback = mensagem => {
		voltar();
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
			<h1>teste</h1>
		</LayoutContent>
	);
}
