import React, { useState, useEffect, Fragment } from 'react';
import { Box, TableBody } from '@material-ui/core';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
	Button,
	Table,
	TableHead,
	TableCell,
	TableRow,
	FormInputFile,
	ExportXLSL,
	FormSelect
} from 'react-axxiom';
import useReactRouter from 'use-react-router';
import { LayoutContent } from '@/layout';
import { translate, translateWithHtml } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { snackSuccess, snackError, snackWarning } from '@/utils/snack';
import { getSorting, stableSort } from '@/utils/list';
import theme from '@/theme';
import { SISTEMA, MATERIAL, SERVICO, ARQUIVO_PROCESSADO } from '@/utils/constants';
import { COLUMNS_PERGUNTA_SISTEMA } from '../resultado/tableHead';
import { Typography } from '@/layout/title/style';
import PerguntaService from '@/services/pergunta';
import ResultadoService from '@/services/resultado';
import { checkError } from '@/utils/validation';

export default function ImportacaoArquivos({ getPermissao }) {
	const { history } = useReactRouter();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const dispatch = useDispatch();

	// Estado Local

	const [
		perguntaList,
		setPerguntaList
	] = useState([]);

	const [
		resultadoList,
		setResultadoList
	] = useState([]);

	const [
		orderBy,
		setOrderBy
	] = useState('CodigoCategoria');

	const [
		order,
		setOrder
	] = useState('asc');

	// Efeito Inicial

	useEffect(() => {
		perguntaFindByOrigemDados(SISTEMA.id);
		return () => {
			setPerguntaList([]);
		};
	}, []);

	// Buscar Dados

	const perguntaFindByOrigemDados = async origem => {
		dispatch(LoaderCreators.setLoading());
		const response = await PerguntaService.findByOrigemDados(origem);
		if (response.data) {
			setPerguntaList(response.data.Pergunta_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const resultadoFindByPergunta = async perguntaId => {
		dispatch(LoaderCreators.setLoading());
		const response = await ResultadoService.findByPergunta(perguntaId);
		if (response.data) {
			response.data.Resultado_list.forEach(resultado => {
				resultado.IdCategoria = resultado.Categoria.Id;
				resultado.CodigoCategoria = resultado.Categoria.Codigo;
				resultado.NomeCategoria = resultado.Categoria.Descricao;
				resultado.TipoCategoria =
					resultado.Categoria.Tipo === MATERIAL.id ? MATERIAL.nome : SERVICO.nome;
			});
			setResultadoList(response.data.Resultado_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	// Ações da Tela

	const importar = async () => {
		if (isValid) {
			dispatch(LoaderCreators.setLoading());
			setResultadoList([]);
			ResultadoService.importFile(
				inputFile.value,
				inputFile2.value,
				inputFile3.value,
				selectPergunta.value
			)
				.then(response => {
					if (
						response.data &&
						response.data.ArquivoProcessamentoPergunta_insert.Status === ARQUIVO_PROCESSADO
					) {
						callback();
					} else {
						callbackError(translateWithHtml('erroAoImportarOArquivo'));
					}
				})
				.catch(() => callbackError(translateWithHtml('erroAoImportarOArquivo')));
		}
	};

	// Ações de Retorno

	const callback = async () => {
		await resultadoFindByPergunta(selectPergunta.value);
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackSuccess(translate('impotarcaoRealizadaComSucesso'), closeSnackbar));
		setFieldValue('input', '');
		setFieldValue('input2', '');
		setFieldValue('input3', '');
	};

	const callbackError = mensagem => {
		dispatch(LoaderCreators.disableLoading());
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};

	const voltar = () => {
		history.goBack();
	};

	// Formulários

	const initialValues = { selectPergunta: 0, inputFile: '', inputFile2: '', inputFile3: '' };

	const validInput = value => {
		if (selectPergunta.value === 4) {
			if (!value) {
				return false;
			}
			return true;
		}
		return true;
	};

	const schema = {
		selectPergunta: Yup.mixed().test(
			'selectPergunta',
			translate('campoObrigatorio'),
			value => value !== 0
		),
		inputFile: Yup.string().required(translate('campoObrigatorio')),
		inputFile2: Yup.mixed().test('input2', translate('campoObrigatorio'), value =>
			validInput(value)
		),
		inputFile3: Yup.mixed().test('input3', translate('campoObrigatorio'), value =>
			validInput(value)
		)
	};

	const validationSchema = Yup.object().shape(schema);

	const {
		getFieldProps,
		handleSubmit,
		setFieldValue,
		submitCount,
		isValid,
		resetForm
	} = useFormik({
		initialValues,
		validationSchema,
		onSubmit: importar
	});

	const [
		selectPergunta,
		metadataSelectPergunta
	] = getFieldProps('selectPergunta', 'text');

	const [
		inputFile,
		metadataInputFile
	] = getFieldProps('inputFile', 'number');

	const [
		inputFile2,
		metadataInputFile2
	] = getFieldProps('inputFile2', 'number');

	const [
		inputFile3,
		metadataInputFile3
	] = getFieldProps('inputFile3', 'number');

	// Interações com a Tebela

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const getDataSet = (columns, list) => {
		columns.map(column => {
			column.title = column.label;
			column.width =
				column.width && column.width.wpx
					? { wpx: column.width.wpx }
					: { wpx: column.width ? column.width : 200 };
			return column;
		});

		const data = [];

		list.map(item => {
			const dadosSistema = [
				{ value: item.CodigoCategoria },
				{ value: item.NomeCategoria },
				{ value: item.TipoCategoria },
				{ value: item.Nota }
			];

			return data.push(dadosSistema);
		});

		return [
			{ columns, data }
		];
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<LayoutContent>
			<Form onSubmit={handleSubmit}>
				<Box display='flex' justifyContent='space-between'>
					<FormSelect
						labelInitialItem={translate('selecioneOpcao')}
						labelWithValue
						label={`@/..{translate('selecioneTipoResposta')}:`}
						items={perguntaList}
						value={selectPergunta.value}
						onChange={event => {
							resetForm();
							setFieldValue('selectPergunta', event.target.value);
							setResultadoList([]);
						}}
						error={checkError(submitCount, metadataSelectPergunta)}
					/>
					<Box display='flex' paddingTop='15px'>
						{resultadoList.length > 0 && (
							<ExportXLSL
								dataSet={getDataSet(
									COLUMNS_PERGUNTA_SISTEMA,
									stableSort(resultadoList, getSorting(order, orderBy))
								)}
							/>
						)}
					</Box>
				</Box>

				{selectPergunta.value > 0 && (
					<Fragment>
						{selectPergunta.value === 4 && <Typography>Lead Time</Typography>}
						<FormInputFile
							labelFile={translate('escolhaArquivo')}
							onChange={event => setFieldValue('inputFile', event.target.files[0])}
							value={inputFile.value && inputFile.value.name ? inputFile.value.name : ''}
							error={checkError(submitCount, metadataInputFile)}
						/>

						{selectPergunta.value === 4 && (
							<Fragment>
								<Typography>Contratos e Pedidos</Typography>
								<FormInputFile
									labelFile={translate('escolhaArquivo')}
									onChange={event => setFieldValue('inputFile2', event.target.files[0])}
									value={inputFile2.value && inputFile2.value.name ? inputFile2.value.name : ''}
									error={checkError(submitCount, metadataInputFile2)}
								/>

								<Typography>Peso do Fornecedor</Typography>
								<FormInputFile
									labelFile={translate('escolhaArquivo')}
									onChange={event => setFieldValue('inputFile3', event.target.files[0])}
									value={inputFile3.value && inputFile3.value.name ? inputFile3.value.name : ''}
									error={checkError(submitCount, metadataInputFile3)}
								/>
							</Fragment>
						)}

						{resultadoList.length > 0 && (
							<Table small>
								<TableHead
									columns={COLUMNS_PERGUNTA_SISTEMA}
									order={order}
									orderBy={orderBy}
									onRequestSort={(event, property) => handleRequestSort(property)}
									rowCount={COLUMNS_PERGUNTA_SISTEMA.length}
								/>
								<TableBody>
									{stableSort(resultadoList, getSorting(order, orderBy)).map((resultado, index) => {
										variantTableRow =
											variantTableRow === theme.palette.table.tableRowPrimary
												? theme.palette.table.tableRowSecondary
												: theme.palette.table.tableRowPrimary;

										return (
											<TableRow key={index} backgroundColor={variantTableRow}>
												<TableCell label={resultado.CodigoCategoria} align='center' />
												<TableCell label={resultado.NomeCategoria} />
												<TableCell label={resultado.TipoCategoria} aling='center' />
												<TableCell title={resultado.Nota} label={resultado.Nota} align='center' />
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}

						<Box display='flex' justifyContent='flex-end'>
							<Button
								text={translate('voltar')}
								backgroundColor={theme.palette.secondary.main}
								onClick={voltar}
							/>

							{getPermissao() && (
								<Button
									text={translate('importar')}
									type='submit'
									margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
								/>
							)}
						</Box>
					</Fragment>
				)}
			</Form>
		</LayoutContent>
	);
}
