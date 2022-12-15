import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useFormik, Form } from 'formik';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import useReactRouter from 'use-react-router';
import { useDispatch } from 'react-redux';
import { Confirm, Button, FormInput, TransferList } from 'react-axxiom';
import { LayoutContent } from '@/layout';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import UsuarioService from '@/services/usuario';
import GrupoUsuarioService from '@/services/grupoUsuario';
import { translate } from '@/locales';
import theme from '@/theme';
import { getArrayWithAttribute, getSimpleArrayWithAttribute } from '@/utils/list';
import { snackSuccess, snackError } from '@/utils/snack';
import { checkError } from '@/utils/validation';

export default function CadastrarGrupoUsuario() {
	const { history, match } = useReactRouter();
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	// Estados locais

	const [
		openConfirmAlterar,
		setOpenConfirmAlterar
	] = useState(false);

	const [
		grupos,
		setGrupos
	] = useState([]);

	const [
		pertencentes,
		setPertencentes
	] = useState([]);

	const [
		naoPertencentes,
		setNaoPertencentes
	] = useState([]);

	const [
		escolhidos,
		setEscolhidos
	] = useState([]);

	// Efeito Inicial

	useEffect(() => {
		if (id) {
			grupoUsuarioFindById();
		} else {
			usuarioFindByFilter();
		}

		return () => {
			setPertencentes([]);
			setNaoPertencentes([]);
		};
	}, []);

	// Busca de Dados

	const grupoUsuarioFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoUsuarioService.findById(id);
		if (response.data) {
			setFieldValue('nome', response.data.GrupoUsuario.Nome, false);
			setFieldValue('descricao', response.data.GrupoUsuario.Descricao, false);
			usuarioFindByFilter();
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const usuarioFindByFilter = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await UsuarioService.findByFilter(`GrupoUsuarioId in (@/..{id}, null)`);
		if (response.data) {
			if (id) {
				setPertencentes(filter(response.data.Usuario_list, id));
				setGrupos(filter(response.data.Usuario_list, id));
			}
			setNaoPertencentes(filter(response.data.Usuario_list, null));
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const filter = (array, grupoUsuarioId) => {
		return _.filter(array, usuario => usuario.GrupoUsuario.Id === grupoUsuarioId);
	};

	// Ações da Tela

	const save = async () => {
		if (isValid) {
			if (id) {
				setOpenConfirmAlterar(true);
			} else {
				create();
			}
		}
	};

	const grupoUsuario = () => {
		return {
			Nome: nome.value,
			Descricao: descricao.value
		};
	};

	const create = () => {
		dispatch(LoaderCreators.setLoading());
		GrupoUsuarioService.create(grupoUsuario())
			.then(response => {
				if (response.data) {
					usuarioUpdateMany(
						translate('grupoRespondenteCadastradoSucesso'),
						response.data.GrupoUsuario_insert.Id
					);
				}
			})
			.catch(() => {
				dispatch(LoaderCreators.disableLoading());
				callbackError(translate('erroInserirGrupoRespondente'));
			});
	};

	const update = () => {
		dispatch(LoaderCreators.setLoading());
		setOpenConfirmAlterar(false);
		GrupoUsuarioService.update(id, grupoUsuario())
			.then(response => {
				if (response.data) {
					usuarioUpdateMany(translate('grupoRespondenteAlteradoSucesso'));
				}
			})
			.catch(() => {
				dispatch(LoaderCreators.disableLoading());
				callbackError(translate('erroInserirGrupoRespondente'));
			});
	};

	const usuarioUpdateMany = (mensagem, grupoUsuarioId) => {
		pertencentes.forEach(pertencente => {
			pertencente.GrupoUsuarioId = id || grupoUsuarioId;
		});

		grupos.forEach(grupo => {
			if (!_.find(pertencentes, newGrupo => newGrupo.Id === grupo.Id)) {
				grupo.GrupoUsuarioId = null;
				pertencentes.push(grupo);
			}
		});

		const ids = getSimpleArrayWithAttribute(pertencentes, 'Id');
		const usuarios = getArrayWithAttribute(pertencentes, 'GrupoUsuarioId');

		UsuarioService.updateMany(ids, usuarios)
			.then(() => {
				callback(mensagem);
				dispatch(LoaderCreators.disableLoading());
			})
			.catch(() => {
				callbackError(translate('erroInserirGrupoRespondente'));
				dispatch(LoaderCreators.disableLoading());
			});
	};

	// Ações de Retorno

	const callback = mensagem => {
		voltar();
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	// Formulários

	const initialValues = {
		nome: '',
		descricao: ''
	};

	const validationSchema = Yup.object().shape({
		nome: Yup.string().required(translate('campoObrigatorio'))
	});

	const { getFieldProps, handleSubmit, isValid, setFieldValue, submitCount } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: save
	});

	const [
		nome,
		metadataNome
	] = getFieldProps('nome', 'text');

	const [
		descricao
	] = getFieldProps('descricao', 'text');

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarGrupoRespondente')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>

			<Form onSubmit={handleSubmit}>
				<FormInput
					label={`@/..{translate('nome')}:`}
					name={nome}
					error={checkError(submitCount, metadataNome)}
				/>

				<FormInput label={`@/..{translate('descricao')}:`} name={descricao} />

				<Typography title='Usuários:' variant='h6' style={{ paddingBottom: theme.spacing(1) }}>
					Usuários:
				</Typography>

				<TransferList
					escolhidos={escolhidos}
					setEscolhidos={newEscolhidos => setEscolhidos(newEscolhidos)}
					naoPertencentes={naoPertencentes}
					setNaoPertencentes={newNaoPertencentes => setNaoPertencentes(newNaoPertencentes)}
					pertencentes={pertencentes}
					setPertencentes={newPertencentes => setPertencentes(newPertencentes)}
				/>

				<Box display='flex' justifyContent='flex-end'>
					<Button text='Voltar' backgroundColor={theme.palette.secondary.main} onClick={voltar} />
					<Button
						text={translate('salvar')}
						type='submit'
						margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
					/>
				</Box>
			</Form>
		</LayoutContent>
	);
}
