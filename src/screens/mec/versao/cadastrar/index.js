import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Box } from '@material-ui/core';
import useReactRouter from 'use-react-router';
import _ from 'lodash';
import { Button, Confirm, FormInput } from '@/components';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackSuccess, snackError } from '@/utils/snack';
import theme from '@/theme';
import VersaoMecService from '@/services/versaoMec';
import { checkError } from '@/utils/validation';
import { URL_MATRIZ } from '@/utils/constants';

export default function CadastrarVersao() {
	const { history, match } = useReactRouter();
	// eslint-disable-next-line no-restricted-globals
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local

	const [
		versaoMecList,
		setVersaoMecList
	] = useState([]);

	const [
		openConfirmEncerrar,
		setOpenConfirmEncerrar
	] = useState(false);

	const [
		openConfirmAlterar,
		setOpenConfirmAlterar
	] = useState(false);

	// Efeito Inicial

	useEffect(() => {
		versaoMecFindAll();
		if (id) {
			versaoMecFindById();
		}

		return () => {
			setVersaoMecList([]);
		};
	}, []);

	// Busca de Dados

	const versaoMecFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await VersaoMecService.findById(id);
		if (response.data) {
			setValues({
				nome: response.data.VersaoMec.Nome,
				formulaEixoX: response.data.VersaoMec.FormulaEixoX,
				formulaEixoY: response.data.VersaoMec.FormulaEixoY,
				linkMatriz: response.data.VersaoMec.LinkMatriz
			});

			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const versaoMecFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await VersaoMecService.findAll();
		if (response.data) {
			setVersaoMecList(response.data.VersaoMec_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const checkVersaoEmAberto = () => {
		return _.find(versaoMecList, versao => {
			return !versao.DataEncerramento;
		});
	};

	const getVersaoMec = (encerramento = false) => {
		const versao = {
			Nome: nome.value,
			FormulaEixoX: formulaEixoX.value,
			FormulaEixoY: formulaEixoY.value,
			LinkMatriz: linkMatriz.value
		};

		return !encerramento ? versao : { DataEncerramento: new Date() };
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
		if (checkVersaoEmAberto()) {
			setOpenConfirmEncerrar(true);
		} else {
			VersaoMecService.create(getVersaoMec())
				.then(() => callback(translate('novaVersaoCadatradoSucesso')))
				.catch(() => callbackError(translate('erroCadastrarNovaVersao')));
		}
	};

	const update = () => {
		dispatch(LoaderCreators.setLoading());
		setOpenConfirmAlterar(false);
		VersaoMecService.update(id, getVersaoMec())
			.then(() => callback(translate('versaoAlteradaComSucesso')))
			.catch(() => callbackError(translate('erroAlterarVersao')));
	};

	const encerrar = async () => {
		const versao = checkVersaoEmAberto();
		if (versao) {
			const encerramento = true;

			VersaoMecService.update(versao.value, getVersaoMec(encerramento))
				.then(() => {
					VersaoMecService.create(getVersaoMec())
						.then(() => callback(translate('novaVersaoCadatradoSucesso')))
						.catch(() => callbackError(translate('erroCadastrarNovaVersao')));
				})
				.catch(() => callbackError(translate('erroEncerrarNovaVersao')));
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

	const voltar = () => {
		history.goBack();
	};

	// Formulário

	const validationSchema = Yup.object().shape({
		nome: Yup.string().required(translate('campoObrigatorio')),
		formulaEixoX: Yup.string().required(translate('campoObrigatorio')),
		formulaEixoY: Yup.string().required(translate('campoObrigatorio')),
		linkMatriz: Yup.string().required(translate('campoObrigatorio'))
	});

	const initialValues = {
		nome: '',
		formulaEixoX: '',
		formulaEixoY: '',
		linkMatriz: ''
	};

	const { getFieldProps, handleSubmit, submitCount, isValid, setValues } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		nome,
		metadataNome
	] = getFieldProps('nome', 'text');

	const [
		formulaEixoX,
		metadataFormulaEixoX
	] = getFieldProps('formulaEixoX', 'text');

	const [
		formulaEixoY,
		metadataFormulaEixoY
	] = getFieldProps('formulaEixoY', 'text');

	const [
		linkMatriz,
		metadataLinkMatriz
	] = getFieldProps('linkMatriz', 'text');

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmEncerrar}
				handleClose={() => setOpenConfirmEncerrar(false)}
				handleSuccess={encerrar}
				title={translate('confirmacao')}
				text={translate('aCriacaoNovaVersaoImplicaEncerramentoDaUltima')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarVersao')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Form onSubmit={handleSubmit}>
				<FormInput
					label={`@/..{translate('nomeVersao')}:`}
					labelHelper={translate('digiteNomeReferenciaFormula')}
					name={nome}
					error={checkError(submitCount, metadataNome)}
					required
				/>

				<FormInput
					label={`@/..{translate('formulaEixoX')}:`}
					labelHelper={translate('utilizeCodigosPergunta')}
					fullWidth
					name={formulaEixoX}
					error={checkError(submitCount, metadataFormulaEixoX)}
					required
				/>

				<FormInput
					label={`@/..{translate('formulaEixoY')}:`}
					labelHelper={translate('utilizeCodigosPergunta')}
					fullWidth
					name={formulaEixoY}
					error={checkError(submitCount, metadataFormulaEixoY)}
					required
				/>

				<FormInput
					label={`@/..{translate('linkMatriz')}:`}
					labelHelper={translate('urlAcessoMatriz')}
					fullWidth
					name={linkMatriz}
					error={checkError(submitCount, metadataLinkMatriz)}
					required
				/>

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
