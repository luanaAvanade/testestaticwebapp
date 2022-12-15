import React, { useState, useEffect } from 'react';
import { LayoutContent } from '@/layout';
import theme from '@/theme';
import _ from 'lodash';
import { FormInput, FormSelect, Button, Confirm } from '@/components';
import { useDispatch } from 'react-redux';
import { Box, Chip, Typography } from '@material-ui/core';
import { translate } from '@/locales';
import { useSnackbar } from 'notistack';
import useReactRouter from 'use-react-router';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { checkError } from '@/utils/validation';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PerguntaQualificacaoService from '@/services/perguntaQualificacao';
import GrupoPerguntaQualificacaoService from '@/services/grupoPerguntaQualificacao';
import { TIPO_RESPOSTA, PERFIS } from '@/utils/constants';
import { snackError, snackSuccess } from '@/utils/snack';
import moment from 'moment';
import ObjectHelper from '@/utils/objectHelper';
import { Done, Cancel } from '@material-ui/icons';

export default function PerguntaQualificacao() {
	const { history, match } = useReactRouter();
	const id = isNaN(parseInt(match.params.id, 10)) ? null : parseInt(match.params.id, 10);
	const dispatch = useDispatch();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	// Estado Local
	const [
		grupoPerguntaQualificacaoList,
		setGrupoPerguntaQualificacaoList
	] = useState([]);

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
		grupoPerguntaQualificacaoFindAll();
		if (id) {
			perguntaQualificacaoFindById();
		}
		return () => {
			setGrupoPerguntaQualificacaoList([]);
		};
	}, []);

	// Busca de Dados
	const grupoPerguntaQualificacaoFindAll = async () => {
		const response = await GrupoPerguntaQualificacaoService.findAllSelect();
		if (response.data && response.data.GrupoPerguntaQualificacao_list) {
			setGrupoPerguntaQualificacaoList(response.data.GrupoPerguntaQualificacao_list);
		}
	};

	const perguntaQualificacaoFindById = async () => {
		dispatch(LoaderCreators.setLoading());
		try {
			const response = await PerguntaQualificacaoService.findById(id);
			if (response.data && response.data.PerguntaQualificacao) {
				setPerguntaQualificacao(response.data.PerguntaQualificacao);
				dispatch(LoaderCreators.disableLoading());
			} else {
				dispatch(LoaderCreators.disableLoading());
			}
		} catch (error) {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const setPerguntaQualificacao = pergunta => {
		const {
			GrupoPerguntaQualificacaoId,
			Texto,
			TipoResposta,
			ParametroResposta,
			Dica,
			Validade,
			QuemResponde,
			QuemVisualiza,
			Obrigatorio,
			PossuiAnexo,
			TamanhoMaximoArquivo,
			Status
		} = pergunta;
		setFieldValue(
			'grupoPerguntaQualificacao',
			GrupoPerguntaQualificacaoId ? GrupoPerguntaQualificacaoId : 0
		);
		setFieldValue('texto', Texto ? Texto : null);
		setFieldValue('dica', Dica ? Dica : null);
		setFieldValue(
			'tipoResposta',
			TipoResposta ? _.find(TIPO_RESPOSTA, tr => tr.codigo === TipoResposta).value : 0
		);
		if (TipoResposta === 1 || TipoResposta === 2) {
			setFieldValue('valorMin', ParametroResposta ? ParametroResposta.split(',')[0] : null);
			setFieldValue('valorMax', ParametroResposta ? ParametroResposta.split(',')[1] : null);
		}

		if (TipoResposta === 5) {
			setFieldValue('itensLista', ParametroResposta ? ParametroResposta.split(',') : null);
		}
		setFieldValue('validade', Validade ? moment(new Date(Validade)).format('YYYY-MM-DD') : null);
		setFieldValue(
			'quemResponde',
			QuemResponde ? _.find(PERFIS, perfil => perfil.codigo === QuemResponde).value : 0
		);
		setFieldValue(
			'quemVisualiza',
			QuemVisualiza ? _.find(PERFIS, perfil => perfil.codigo === QuemVisualiza).value : 0
		);
		setFieldValue('campoObrigatorio', Obrigatorio);
		setFieldValue('possuiAnexoDocumento', PossuiAnexo);
		setFieldValue('tamanhoMaximoArquivo', TamanhoMaximoArquivo ? TamanhoMaximoArquivo : null);
	};

	// Ações da Tela

	const cadastrar = () => {
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
		try {
			const response = await PerguntaQualificacaoService.create(getPerguntaQualificacao());
			if (response.data && response.data.PerguntaQualificacao_insert) {
				callback(translate('cadastroEfetuadoComSucesso'));
			} else {
				callbackError(translate('ErroCadastrarNovaPerguntaQualificacao'));
			}
		} catch (error) {
			callbackError(translate('ErroCadastrarNovaPerguntaQualificacao'));
		}
	};

	const update = async () => {
		setOpenConfirmAlterar(false);
		dispatch(LoaderCreators.setLoading());
		try {
			const response = await PerguntaQualificacaoService.update(id, getPerguntaQualificacao());
			if (response.data && response.data.PerguntaQualificacao_update) {
				callback(translate('perguntaQualificacaoAlteradoComSucesso'));
			} else {
				callbackError(translate('ErroAtualizarPerguntaQualificacao'));
			}
		} catch (error) {
			callbackError(translate('ErroAtualizarPerguntaQualificacao'));
		}
	};

	const cancelar = () => {
		setOpenConfirmCancelar(true);
	};

	const callback = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		voltar();
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};
	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	const getPerguntaQualificacao = () => {
		return {
			GrupoPerguntaQualificacaoId: grupoPerguntaQualificacao.value,
			Texto: texto.value,
			TipoResposta: tipoResposta.value,
			ParametroResposta: getParametroResposta(),
			Dica: dica.value,
			Validade: validade.value,
			QuemResponde: quemResponde.value,
			QuemVisualiza: quemVisualiza.value !== 0 ? quemVisualiza.value : null,
			Obrigatorio: campoObrigatorio.value,
			PossuiAnexo: possuiAnexoDocumento.value,
			TamanhoMaximoArquivo: tamanhoMaximoArquivo.value,
			Status: true
		};
	};

	const getParametroResposta = () => {
		if (tipoResposta.value === 'Numero_Inteiro' || tipoResposta.value === 'Numero_Decimal') {
			return `@/..{valorMin.value},@/..{valorMax.value}`;
		}
		if (tipoResposta.value === 'Lista') {
			let parametros;
			itensLista.value.forEach(item => {
				parametros = parametros ? `@/..{parametros},@/..{item}` : item;
			});
			return parametros;
		}
		return null;
	};

	const handleRemoveItens = index => {
		const list = ObjectHelper.clone(itensLista.value);
		list.splice(index, 1);
		setFieldValue('itensLista', list);
	};

	// Formulário

	const initialValues = {
		grupoPerguntaQualificacao: 0,
		texto: '',
		tipoResposta: 0,
		valorMin: null,
		valorMax: null,
		itensLista: [],
		inputLista: '',
		dica: '',
		dataValidade: null,
		quemVisualiza: 0,
		quemResponde: 0,
		tamanhoMaximoArquivo: null,
		campoObrigatorio: false,
		possuiAnexoDocumento: false
	};

	const testSelectRequired = value => {
		return value !== '0';
	};

	const testValorMinMax = value => {
		if (tipoResposta.value === 'Numero_Inteiro' || tipoResposta.value === 'Numero_Decimal') {
			if (!value) {
				return false;
			}
			return true;
		}
		return true;
	};

	const testItensLista = value => {
		if (tipoResposta.value === 'Lista') {
			if (!value) {
				return false;
			}
			return true;
		}
		return true;
	};

	const testTamanhoMaximoArquivo = value => {
		if (possuiAnexoDocumento.value) {
			if (!value) {
				return false;
			}
			return true;
		}
		return true;
	};

	const testValidade = value => {
		if (value) {
			if (moment(new Date()).isAfter(new Date(value))) {
				return false;
			}
		}
		return true;
	};

	const validationSchema = Yup.object().shape({
		grupoPerguntaQualificacao: Yup.string().test(
			'grupoPerguntaQualificacao',
			translate('campoObrigatorio'),
			value => testSelectRequired(value)
		),
		texto: Yup.string().required(translate('campoObrigatorio')),
		tipoResposta: Yup.string().test('tipoResposta', translate('campoObrigatorio'), value =>
			testSelectRequired(value)
		),
		quemResponde: Yup.string().test('quemResponde', translate('campoObrigatorio'), value =>
			testSelectRequired(value)
		),
		valorMin: Yup.string()
			.nullable()
			.test('valorMin', translate('campoObrigatorio'), value => testValorMinMax(value)),
		valorMax: Yup.string()
			.nullable()
			.test('valorMax', translate('campoObrigatorio'), value => testValorMinMax(value)),
		validade: Yup.string()
			.nullable()
			.test('validade', translate('dataDeveSerMaiorDataAtual'), value => testValidade(value)),
		itensLista: Yup.string()
			.nullable()
			.test('itensLista', translate('campoObrigatorio'), value => testItensLista(value)),
		tamanhoMaximoArquivo: Yup.string()
			.nullable()
			.test('tamanhoMaximoArquivo', translate('campoObrigatorio'), value =>
				testTamanhoMaximoArquivo(value)
			)
	});

	const { getFieldProps, handleSubmit, setFieldValue, submitCount, isValid, errors } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: cadastrar
	});

	const [
		grupoPerguntaQualificacao,
		metadataGrupoPerguntaQualificacao
	] = getFieldProps('grupoPerguntaQualificacao', 'text');

	const [
		texto,
		metadataTexto
	] = getFieldProps('texto', 'text');

	const [
		tipoResposta,
		metadataTipoResposta
	] = getFieldProps('tipoResposta', 'text');

	const [
		valorMin,
		metadataValorMin
	] = getFieldProps('valorMin', 'text');

	const [
		valorMax,
		metadataValorMax
	] = getFieldProps('valorMax', 'text');

	const [
		inputLista,
		metadataInputLista
	] = getFieldProps('inputLista', 'text');

	const [
		itensLista,
		metadataItensLista
	] = getFieldProps('itensLista', 'text');

	const [
		dica,
		metadataDica
	] = getFieldProps('dica', 'text');

	const [
		validade,
		metadataValidade
	] = getFieldProps('validade', 'text');

	const [
		quemResponde,
		metadataQuemResponde
	] = getFieldProps('quemResponde', 'text');

	const [
		quemVisualiza,
		metadataQuemVisualiza
	] = getFieldProps('quemVisualiza', 'array');

	const [
		tamanhoMaximoArquivo,
		metadataTamanhoMaximoArquivo
	] = getFieldProps('tamanhoMaximoArquivo', 'number');

	const [
		campoObrigatorio,
		metadataCampoObrigatorio
	] = getFieldProps('campoObrigatorio', 'boolean');

	const [
		possuiAnexoDocumento,
		metadataPossuiAnexoDocumento
	] = getFieldProps('possuiAnexoDocumento', 'boolean');

	return (
		<LayoutContent>
			<Confirm
				open={openConfirmAlterar}
				handleClose={() => setOpenConfirmAlterar(false)}
				handleSuccess={update}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteAlterarPerguntaQualificacao')}
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
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormSelect
							labelInitialItem={translate('selecioneOpcao')}
							label={`@/..{translate('grupoPerguntaQualificacao')}:`}
							items={grupoPerguntaQualificacaoList}
							name={grupoPerguntaQualificacao}
							error={checkError(submitCount, metadataGrupoPerguntaQualificacao)}
							required
						/>
					</Box>
				</Box>
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='100%'>
						<FormInput
							label={`@/..{translate('pergunta')}:`}
							name={texto}
							error={checkError(submitCount, metadataTexto)}
							required
						/>
					</Box>
				</Box>
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='100%'>
						<FormInput
							label={`@/..{translate('dicaPreenchimento')}:`}
							name={dica}
							error={checkError(submitCount, metadataDica)}
						/>
					</Box>
				</Box>
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormSelect
							labelInitialItem={translate('selecioneOpcao')}
							label={`@/..{translate('tipoResposta')}:`}
							items={TIPO_RESPOSTA}
							value={tipoResposta.value}
							onChange={event => {
								setFieldValue('tipoResposta', event.target.value);
								setFieldValue('valorMin', '');
								setFieldValue('valorMax', '');
								setFieldValue('inputLista', '');
								setFieldValue('intensLista', []);
							}}
							error={checkError(submitCount, metadataTipoResposta)}
							required
						/>
					</Box>
					{(tipoResposta.value === 'Numero_Inteiro' || tipoResposta.value === 'Numero_Decimal') && (
						<Box display='flex'>
							<Box width='35%' paddingRight={`@/..{theme.spacing(1)}px`}>
								<FormInput
									type='number'
									label={`@/..{translate('valorMinimo')}:`}
									name={valorMin}
									error={checkError(submitCount, metadataValorMin)}
									required
								/>
							</Box>
							<Box width='35%' paddingRight={`@/..{theme.spacing(1)}px`}>
								<FormInput
									type='number'
									label={`@/..{translate('valorMaximo')}:`}
									name={valorMax}
									error={checkError(submitCount, metadataValorMax)}
									required
								/>
							</Box>
						</Box>
					)}
					{tipoResposta.value === 'Lista' && (
						<Box width='70%'>
							<FormInput
								label={`@/..{translate('crieOsItensDaLista')}:`}
								labelHelper={translate('utilizeVirgulaParaSepararOsItens')}
								value={inputLista.value}
								onChange={event => {
									if (
										event.target.value.substring(
											event.target.value.length - 1,
											event.target.value.length
										) === ','
									) {
										const list = ObjectHelper.clone(itensLista.value);
										list.push(event.target.value.substring(0, event.target.value.length - 1));
										setFieldValue('itensLista', list);
										setFieldValue('inputLista', '');
									} else {
										setFieldValue('inputLista', event.target.value);
									}
								}}
								error={checkError(submitCount, metadataItensLista)}
								required
							/>
						</Box>
					)}
				</Box>
				{itensLista.value &&
				itensLista.value.length > 0 && (
					<Box
						display='flex'
						flexDirection='row'
						border={`1px solid @/..{theme.palette.border}`}
						borderRadius='5px'
						padding={`@/..{theme.spacing(1)}px`}
					>
						<Box width='100%' display='flex' flexDirection='column'>
							<Typography variant='h6'>{`@/..{translate('itensLista')}:`}</Typography>
							<Box paddingTop={`@/..{theme.spacing(1)}px`} width='100%'>
								{itensLista.value.map((item, index) => {
									return (
										<Chip
											label={item}
											clickable
											color='primary'
											onDelete={() => handleRemoveItens(index)}
											deleteIcon={<Cancel />}
											style={{ margin: 3 }}
											variant='outlined'
										/>
									);
								})}
							</Box>
						</Box>
					</Box>
				)}
				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(1)}px`}>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormInput
							type='date'
							label={`@/..{translate('validade')}:`}
							name={validade}
							error={checkError(submitCount, metadataValidade)}
						/>
					</Box>
					<Box width='30%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormSelect
							label={`@/..{translate('quemResponde')}:`}
							labelInitialItem={translate('selecioneOpcao')}
							items={PERFIS}
							name={quemResponde}
							error={checkError(submitCount, metadataQuemResponde)}
							required
						/>
					</Box>
					<Box width='40%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormSelect
							label={`@/..{translate('quemVisualiza')}:`}
							labelInitialItem={translate('selecioneOpcao')}
							items={PERFIS}
							name={quemVisualiza}
							error={checkError(submitCount, metadataQuemVisualiza)}
						/>
					</Box>
				</Box>

				<Box display='flex' flexDirection='row' paddingTop={`@/..{theme.spacing(2)}px`}>
					<Box width='25%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormControlLabel
							control={
								<Switch
									onChange={() => setFieldValue('campoObrigatorio', !campoObrigatorio.value)}
									checked={campoObrigatorio.value}
									color='primary'
								/>
							}
							label={translate('campoObrigatorio')}
						/>
					</Box>
					<Box width='25%' paddingRight={`@/..{theme.spacing(1)}px`}>
						<FormControlLabel
							control={
								<Switch
									onChange={() => {
										setFieldValue('possuiAnexoDocumento', !possuiAnexoDocumento.value);
										setFieldValue('tamanhoMaximoArquivo', null);
									}}
									checked={possuiAnexoDocumento.value}
									color='primary'
								/>
							}
							label={translate('possuiAnexoDocumento')}
						/>
					</Box>
					{possuiAnexoDocumento.value && (
						<Box width='50%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormInput
								type='number'
								label={`@/..{translate('tamanhoMaximoArquivo')}:`}
								name={tamanhoMaximoArquivo}
								error={checkError(submitCount, metadataTamanhoMaximoArquivo)}
								required
							/>
						</Box>
					)}
				</Box>

				<Box
					flexDirection='row'
					display='flex'
					justifyContent='flex-end'
					style={{ paddingTop: '32px' }}
				>
					<Button
						text='Cancelar'
						backgroundColor={theme.palette.secondary.main}
						onClick={() => cancelar()}
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
