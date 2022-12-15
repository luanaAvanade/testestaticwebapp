import { useFormik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { FormInput, Button, Confirm } from '@/components';
import { useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import useReactRouter from 'use-react-router';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import theme from '@/theme';
import Typography from '@material-ui/core/Typography';
import { checkError } from '@/utils/validation';
import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import GrupoPerguntaQualificacaoService from '@/services/grupoPerguntaQualificacao';
import { Switch } from '@/screens/fornecedor/style';

export default function CadastroGrupo() {
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
		openConfirmCancelar,
		setOpenConfirmCancelar
	] = useState(false);

	// Efeito Inicial
	useEffect(() => {
		if (id) {
			GrupoPerguntaQualificacaoFindById();
		}

		return () => {
			setFieldValue('nome', '');
			setFieldValue('status', status);
		};
	}, []);

	//Busca de Dados

	const GrupoPerguntaQualificacaoFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoPerguntaQualificacaoService.findById(id);
		if (response.data) {
			setFieldValue('nome', response.data.GrupoPerguntaQualificacao.Nome, false);
			setFieldValue('status', response.data.GrupoPerguntaQualificacao.Status);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const cancelarCeU = () => {
		setOpenConfirmCancelar(true);
	};

	const getGrupoPerguntaQualificacao = () => {
		return {
			Nome: nome.value,
			Status: status.value
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
		const response = await GrupoPerguntaQualificacaoService.findByNome(nome.value);

		if (response.data.GrupoPerguntaQualificacao_list.length > 0) {
			callbackWarning(translate('identificadorDuplicado'));
		} else {
			GrupoPerguntaQualificacaoService.create(getGrupoPerguntaQualificacao())
				.then(() => {
					callback(translate('cadastroEfetuadoComSucesso'));
				})
				.catch(() => {
					callbackError(translate('ErroCadastrarNovoGrupoPerguntaQualificacao'));
				});
		}
	};

	const update = async () => {
		setOpenConfirmAlterar(false);
		const response = await GrupoPerguntaQualificacaoService.findByNomeId(nome.value, id);

		if (response.data.GrupoPerguntaQualificacao_list[0]) {
			callbackWarning(translate('identificadorDuplicado'));
		} else {
			GrupoPerguntaQualificacaoService.update(id, getGrupoPerguntaQualificacao())
				.then(() => callback(translate('grupoPerguntaQualificacaoAlteradoComSucesso')))
				.catch(() => callbackError(translate('erroAlterarTipoContato')));
		}
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
	// Formulário

	const initialValues = {
		nome: '',
		status: true
	};
	const validationSchema = Yup.object().shape({
		nome: Yup.string().required(translate('campoObrigatorio'))
	});

	const { getFieldProps, handleSubmit, submitCount, isValid, setFieldValue } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		nome,
		metadataNome
	] = getFieldProps('nome', 'texto');

	const [
		status
	] = getFieldProps('status', 'boolean');

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarGrupoPerguntaQualificacao')}
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
					<Box width='83%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormInput
							label={`@/..{translate('nome')}:`}
							name={nome}
							error={checkError(submitCount, metadataNome)}
							fullWidth
							required
						/>
					</Box>

					<Box width='15%'>
						<Typography component='div'>
							<Switch
								label={`@/..{translate('status')}:`}
								onChange={() => {
									setFieldValue('status', !status.value);
								}}
								checked={status.value}
								checkedName={status.value ? 'Ativo' : 'Inativo'}
							/>
						</Typography>
					</Box>
				</Box>
				<br />
				<Box display='flex' justifyContent='flex-end'>
					<Button
						text='Cancelar'
						backgroundColor={theme.palette.secondary.main}
						onClick={cancelarCeU}
					/>
					<Button
						text={id ? translate('Atualizar') : translate('Salvar')}
						type='submit'
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				</Box>
			</Form>
		</LayoutContent>
	);
}
