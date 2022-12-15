import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, Confirm, FormInput, FormSelect } from 'react-axxiom';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import * as Yup from 'yup';
import { Form, useFormik } from 'formik';
import { Box, Typography, FormControl } from '@material-ui/core';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import theme from '@/theme';
import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import { checkError } from '@/utils/validation';
import TipoExigenciaService from '@/services/tipoExigencia';

import { Switch } from '../../style';

export default function CadastrarTipoExigencia() {
	const { history, match } = useReactRouter();
	// eslint-disable-next-line no-restricted-globals
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		openConfirmAlterar,
		setOpenConfirmAlterar
	] = useState(false);

	const [
		openConfirmCancelar,
		setOpenConfirmCancelar
	] = useState(false);
	const [
		status,
		setStatus
	] = useState(false);

	// Efeito Inicial

	useEffect(() => {
		if (id) {
			tipoExigenciaFindById();
		}
		return () => {
			setFieldValue('nome', '');
			setFieldValue('descricao', '');
			setFieldValue('nivelExigencia', '');
			setFieldValue('status', false);
		};
	}, []);

	// Busca de Dados

	const tipoExigenciaFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await TipoExigenciaService.findById(id);
		if (response.data) {
			setFieldValue('nome', response.data.TipoExigencia.Nome, false);
			setFieldValue('descricao', response.data.TipoExigencia.Descricao, false);
			setFieldValue('nivelExigencia', response.data.TipoExigencia.NivelExigencia, false);
			setStatus(response.data.TipoExigencia.Status);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const getTipoExigencia = () => {
		return {
			Nome: nome.value,
			Descricao: descricao.value,
			NivelExigencia: selectNivel[nivelExigencia.value - 1].label,
			Status: status
		};
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
		const response = await TipoExigenciaService.findDuplicate(
			nome.value,
			selectNivel[nivelExigencia.value - 1].label,
			status
		);
		if (response.data.TipoExigencia_list.length > 0) {
			callbackWarning(translate('identificadorDuplicado'));
		} else {
			TipoExigenciaService.create(getTipoExigencia())
				.then(() => {
					callback(translate('novoTipoExigenciaCadatradaSucesso'));
				})
				.catch(() => callbackError(translate('erroCadastrarNovoTipoExigencia')));
		}
	};

	const update = async () => {
		setOpenConfirmAlterar(false);
		const response = await TipoExigenciaService.findDuplicate(
			nome.value,
			selectNivel[nivelExigencia.value - 1].label,
			status
		);
		if (response.data.TipoExigencia_list.some(x => x.Id !== id)) {
			callbackWarning(translate('identificadorDuplicado'));
		} else {
			TipoExigenciaService.update(id, getTipoExigencia())
				.then(() => {
					callback(translate('tipoExigenciaAlteradaComSucesso'));
				})
				.catch(() => callbackError(translate('erroAlterarTipoExigencia')));
		}
	};

	const cancelar = () => {
		setOpenConfirmCancelar(true);
	};

	const voltar = () => {
		history.goBack();
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
	// Formulário

	const initialValues = {
		nome: '',
		descricao: '',
		nivelExigencia: ''
	};

	const selectNivel = [
		{ label: 'Baixo', value: 1 },
		{ label: 'Medio', value: 2 },
		{ label: 'Alto', value: 3 }
	];

	const validationSchema = Yup.object().shape({
		nome: Yup.string().required(translate('campoObrigatorio')),
		descricao: Yup.string().required(translate('campoObrigatorio')),
		nivelExigencia: Yup.string().required(translate('campoObrigatorio'))
	});

	const { getFieldProps, handleSubmit, submitCount, isValid, setFieldValue } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		nome,
		metadataNome
	] = getFieldProps('nome', 'text');

	const [
		descricao,
		metadataDescricao
	] = getFieldProps('descricao', 'text');

	const [
		nivelExigencia,
		metadataNivelExigencia
	] = getFieldProps('nivelExigencia', 'text');

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarTipoExigencia')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Confirm
				open={openConfirmCancelar}
				handleClose={() => setOpenConfirmCancelar(false)}
				handleSuccess={voltar}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteCancelar')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Form onSubmit={handleSubmit}>
				<Box display='flex' flexDirection='row'>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormInput
							label={`@/..{translate('tipoExigencia')}:`}
							name={nome}
							error={checkError(submitCount, metadataNome)}
							required
						/>
					</Box>
					<Box width='70%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormInput
							label={`@/..{translate('descricao')}:`}
							name={descricao}
							error={checkError(submitCount, metadataDescricao)}
							required
						/>
					</Box>
				</Box>

				<Box display='flex' flexDirection='row'>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormSelect
							style={{ width: '100%' }}
							label={`@/..{translate('nivel')}:`}
							labelInitialItem={translate('selecioneOpcao')}
							items={selectNivel}
							name={nivelExigencia}
							value={selectNivel.value}
							error={checkError(submitCount, metadataNivelExigencia)}
							required
						/>
					</Box>

					<Box width='25%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormControl>
							<Typography component='div'>
								<Switch
									label='Status:'
									onChange={() => {
										setStatus(!status);
									}}
									checked={status}
									checkedName={status ? 'Ativo' : 'Inativo'}
								/>
							</Typography>
						</FormControl>
					</Box>
				</Box>

				<Box display='flex' justifyContent='flex-end'>
					<Button
						text={translate('cancelar')}
						backgroundColor={theme.palette.secondary.main}
						onClick={cancelar}
					/>
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
