import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import _ from 'lodash';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Box, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { Confirm, FormInput, Button, FormSelect } from 'react-axxiom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LayoutContent } from '@/layout';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackError, snackSuccess, snackWarning } from '@/utils/snack';
import theme from '@/theme';
import TermosAceiteService from '@/services/termosAceite';
import { checkError } from '@/utils/validation';
import { TIPO_EMPRESA, TIPO_CADASTRO } from '@/utils/constants';
import { ButtonError } from './style';
//import { Switch } from '../style';

// import { AntSwitch } from '@/style';

export default function CadastrarTemosAceite() {
	const { history, match } = useReactRouter();
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estado Local
	const [
		dataDescricaoTermoAceite,
		setDataDescricaoTermoAceite
	] = useState('');

	const [
		openConfirmAlterar,
		setOpenConfirmAlterar
	] = useState(false);

	const [
		idRegistro,
		setIdRegistro
	] = useState(0);

	const [
		openConfirmCancelar,
		setOpenConfirmCancelar
	] = useState(false);

	const [
		status,
		setStatus
	] = useState(false);

	const testSelectRequired = value => {
		return value !== '0';
	};

	// Efeito Inicial

	useEffect(() => {
		if (id) {
			termoAceiteFindById();
		}

		return () => {
			setFieldValue('idRegistro', 0);
			setFieldValue('titulo', '');
			setFieldValue('subTitulo', '');
			setFieldValue('status', status);
			setFieldValue('tipoFornecedorVal', '');
			setFieldValue('tipoCadastro', '');
			setFieldValue('descricaoTermo', '');
		};
	}, []);

	//Busca de Dados

	const termoAceiteFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await TermosAceiteService.findById(id);
		if (response.data) {
			setIdRegistro(response.data.TermosAceite.Id);
			setDataDescricaoTermoAceite(response.data.TermosAceite.Descricao);
			setFieldValue('titulo', response.data.TermosAceite.Titulo);
			setFieldValue('subTitulo', response.data.TermosAceite.SubTitulo);
			setFieldValue('tipoCadastro', response.data.TermosAceite.TipoCadastro);
			setFieldValue('tipoFornecedorVal', response.data.TermosAceite.TipoFornecedor);
			setStatus(response.data.TermosAceite.Status);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	//Ações da Tela

	const save = () => {
		if (dataDescricaoTermoAceite === '') {
			return false;
		} else if (isValid) {
			if (id) {
				setOpenConfirmAlterar(true);
			} else {
				create();
			}
		}
	};

	const create = async () => {
		TermosAceiteService.verificarExistente(
			titulo.value,
			tipoFornecedorVal.value,
			tipoCadastro.value
		).then(response => {
			if (response.data.TermosAceite_list.length > 0) {
				callbackWarning(translate('itemExistente'));
			} else {
				TermosAceiteService.create(getTermosAceite())
					.then(() => callback(translate('novoTermoAceiteCadatradoSucesso')))
					.catch(() => callbackError(translate('erroCadastrarNovoTermoAceite')));
			}
		});
	};

	const update = () => {
		setOpenConfirmAlterar(false);
		//	dispatch(LoaderCreators.setLoading());
		TermosAceiteService.verificarExistente(
			titulo.value,
			tipoFornecedorVal.value,
			tipoCadastro.value
		).then(response => {
			if (
				response.data.TermosAceite_list.length > 0 &&
				response.data.TermosAceite_list.some(t => t.Id !== id)
			) {
				callbackWarning(translate('itemExistente'));
			} else {
				TermosAceiteService.update(id, {
					Titulo: titulo.value,
					SubTitulo: subTitulo.value,
					Status: status,
					TipoFornecedor: tipoFornecedorVal.value,
					TipoCadastro: tipoCadastro.value,
					Descricao: dataDescricaoTermoAceite
				})
					.then(() => callback(translate('termoAceiteAlteradoComSucesso')))
					.catch(() => callbackError(translate('erroAlterarTermoAceite')));
			}
		});
		dispatch(LoaderCreators.disableLoading());
	};

	// Ações de Retorno

	const cancelarCeU = () => {
		setOpenConfirmCancelar(true);
	};

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

	const initialValues = {
		titulo: '',
		subTitulo: '',
		status: false,
		tipoFornecedorVal: 0,
		tipoCadastro: 0,
		descricaoTermo: ''
	};

	const validationSchema = Yup.object().shape({
		tipoFornecedorVal: Yup.string().test(
			'tipoFornecedorVal',
			translate('campoObrigatorio'),
			value => testSelectRequired(value)
		),

		tipoCadastro: Yup.string().test('tipoCadastro', translate('campoObrigatorio'), value =>
			testSelectRequired(value)
		),
		titulo: Yup.string().required(translate('campoObrigatorio')),
		subTitulo: Yup.string().required(translate('campoObrigatorio'))
	});

	const {
		getFieldProps,
		isValid,

		handleSubmit,
		submitCount,
		setFieldValue
	} = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		titulo,
		metadataTitulo
	] = getFieldProps('titulo', 'text');

	const [
		subTitulo,
		metadataSubtitulo
	] = getFieldProps('subTitulo', 'text');

	const [
		tipoFornecedorVal,
		metadataTipoFornecedor
	] = getFieldProps('tipoFornecedorVal', 'text');

	const [
		tipoCadastro,
		metadataTipoCadastro
	] = getFieldProps('tipoCadastro', 'text');

	const [
		descricaoTermo,
		metadataDescricaoTermo
	] = getFieldProps('descricaoTermo', 'text');

	const getTermosAceite = () => {
		return {
			Titulo: titulo.value,
			SubTitulo: subTitulo.value,
			Status: status,
			TipoFornecedor: tipoFornecedorVal.value,
			TipoCadastro: tipoCadastro.value,
			Descricao: dataDescricaoTermoAceite
		};
	};

	const changeCK = () => {
		if (dataDescricaoTermoAceite != '') {
			document.getElementById('ckEdit').style.border = 'solid 0px black';
			document.getElementById('botaoError').style.display = 'none';
		}
	};

	const funcaoClick = () => {
		if (dataDescricaoTermoAceite === '') {
			document.getElementById('ckEdit').style.border = 'solid 1px red';
			document.getElementById('botaoError').style.display = 'block';
		}
	};
	const useStyles = makeStyles(theme => ({
		utton: {
			display: 'block',
			marginTop: theme.spacing(2)
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120
		}
	}));
	const classes = useStyles();
	const [
		age,
		setAge
	] = React.useState('');
	const [
		open,
		setOpen
	] = React.useState(false);

	const handleChange = event => {
		setAge(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarTermoAceite')}
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
			<Form onSubmit={handleSubmit} id='formSubmit'>
				<Box>
					<Box display='flex' flexDirection='row'>
						<Box width='50%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormInput
								label={`@/..{translate('titulo')}:`}
								name={titulo}
								error={checkError(submitCount, metadataTitulo)}
								required
							/>
						</Box>
						<Box width='50%'>
							<FormInput
								label={`@/..{translate('subtitulo')}:`}
								name={subTitulo}
								error={checkError(submitCount, metadataSubtitulo)}
								margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
								required
							/>
						</Box>
					</Box>
					<Box display='flex' flexDirection='row'>
						<Box width='35%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormSelect
								label={`@/..{translate('tipoFornecedor')}:`}
								labelInitialItem={translate('selecioneOpcao')}
								items={TIPO_EMPRESA}
								name={tipoFornecedorVal}
								value={tipoFornecedorVal}
								error={checkError(submitCount, metadataTipoFornecedor)}
								required
							/>
						</Box>
						<Box width='35%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormSelect
								label={`@/..{translate('tipoCadastro')}:`}
								labelInitialItem={translate('selecioneOpcao')}
								items={TIPO_CADASTRO}
								name={tipoCadastro}
								value={tipoCadastro}
								error={checkError(submitCount, metadataTipoCadastro)}
								required
							/>
						</Box>
						<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormControl className={classes.formControl}>
								<Typography component='div'>
									{/* <Switch
										label='Status:'
										onChange={() => {
											setStatus(!status);
										}}
										checked={status}
										checkedName={status ? 'Ativo' : 'Inativo'}
									/> */}
								</Typography>
							</FormControl>
						</Box>
					</Box>
					<Box display='flex' flexDirection='row'>
						<Box width='100%' height='40%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<Typography display='block' variant='h6'>
								{`@/..{translate('descricaoTermo')}`}{' '}
								<Box color='red' display='inline'>
									*
								</Box>
							</Typography>
							<div id='ckEdit'>
								<CKEditor
									label={`@/..{translate('tipoCadastro')}:`}
									editor={ClassicEditor}
									//	name={dataDescricaoTermoAceite}
									data={dataDescricaoTermoAceite}
									config={{
										toolbar: [
											'heading',
											'|',
											'bold',
											'italic',
											'link',
											'bulletedList',
											'numberedList',
											'blockQuote',
											'insertTable'
										],
										heading: {
											options: [
												{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
												{
													model: 'heading1',
													view: 'h1',
													title: 'Heading 1',
													class: 'ck-heading_heading1'
												},
												{
													model: 'heading2',
													view: 'h2',
													title: 'Heading 2',
													class: 'ck-heading_heading2'
												}
											]
										}
									}}
									onInit={editor => {
										editor.setData(dataDescricaoTermoAceite);
										editor.setData('');
									}}
									onChange={(event, editor) => {
										const data = editor.getData();
										setDataDescricaoTermoAceite(data);
										changeCK();
									}}
								/>
							</div>
							<ButtonError id='botaoError'>Campo Obrigatório</ButtonError>
						</Box>
					</Box>
					<Box display='flex' justifyContent='flex-end' marginTop='4px'>
						<Button
							text='Cancelar'
							backgroundColor={theme.palette.secondary.main}
							onClick={cancelarCeU}
						/>
						<Button
							text={id ? translate('atualizar') : translate('salvar')}
							type='submit'
							margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
							onClick={funcaoClick}
						/>
					</Box>
				</Box>
			</Form>
		</LayoutContent>
	);
}
