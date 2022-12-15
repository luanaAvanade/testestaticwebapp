import React, { useEffect, useState, Fragment } from 'react';
import {
	Card,
	FormInput,
	FormSelect,
	FormInputFile,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Confirm
} from '@/components';
import {
	CardHeader,
	CardContent,
	Box,
	Button,
	TableBody,
	ExpansionPanelActions
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import EnderecoService from '@/services/endereco';
import { cepMask, soNumero } from '@/utils/mascaras';
import { checkError } from '@/utils/validation';
import theme from '@/theme';
import MunicipioService from '@/services/municipio';

// Expansion Panel Import's
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PublishIcon from '@material-ui/icons/Publish';
import Fab from '@material-ui/core/Fab';
import BackupIcon from '@material-ui/icons/Backup';
import DescriptionIcon from '@material-ui/icons/Description';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ObjectHelper from '@/utils/objectHelper';
import TipoDocumentoService from '@/services/tipoDocumento';
import { FUNCIONALIDADE } from '@/utils/constants';

const useStyles = makeStyles(theme1 => ({
	root: {
		width: '100%'
	},
	heading: {
		fontSize: theme1.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0
	},
	secondaryHeading: {
		fontSize: theme1.typography.pxToRem(15),
		color: theme1.palette.text.secondary
	}
}));

export default function DadosDocumentacao({ documentos_db, formulario }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	// Estado Local

	const [
		expanded,
		setExpanded
	] = React.useState(false);

	const [
		docSelected,
		setDocSelected
	] = useState(null);

	const [
		fileSelected,
		setFileSelected
	] = useState(null);

	// Buscar Dados

	// Efeito Inicial

	useEffect(() => {
		buscaPorFuncionalidade();
		return () => {
			setFieldValue('documentacao', []);
			setFieldValue('documentacaoRemover', []);
		};
	}, []);

	// Ações da Tela

	const buscaPorFuncionalidade = () => {
		dispatch(LoaderCreators.setLoading());
		TipoDocumentoService.findByFuncionalidade(FUNCIONALIDADE.CADASTRO_PESSOA_JURIDICA)
			.then(response => {
				preencheListaDocumentacao(response.data.TipoDocumento_list);
				dispatch(LoaderCreators.disableLoading());
			})
			.catch(erro => console.log(JSON.stringify(erro)));
	};

	const preencheListaDocumentacao = tipoDocumentacaoList => {
		tipoDocumentacaoList.forEach(tipoDocumento => {
			const newDocumento = {
				tipoId: tipoDocumento.Id,
				tipo: tipoDocumento.Nome,
				files: []
			};

			const doc_db = _.find(documentos_db, doc => doc.tipoId === tipoDocumento.Id);

			if (doc_db) {
				newDocumento.files = doc_db.files;
			}

			documentacao.value.push(newDocumento);
		});

		setFieldValue('documentacao', documentacao.value);
	};

	const getExpanded = indexDoc => {
		return expanded === indexDoc;
	};

	const setExpandedValue = indexDoc => {
		let newValue = null;
		if (!getExpanded(indexDoc)) {
			newValue = indexDoc;
		}
		setExpanded(newValue);
	};

	const setListFiles = (indexDoc, inputFiles) => {
		const array = [];
		for (let i = 0; i < inputFiles.files.length; i++) {
			array.push({ file: inputFiles.files[i], dataEmissao: '' });
		}
		inputFiles.value = '';
		documentacao.value[indexDoc].files = documentacao.value[indexDoc].files.concat(array);
		setFieldValue('documentacao', documentacao.value);
		setExpandedValue(indexDoc);
	};

	const setListFilesDate = (indexDoc, indexFiles, date) => {
		const list = [];

		documentacao.value.forEach(doc => {
			const newDoc = { files: [] };
			newDoc.tipo = doc.tipo;
			newDoc.tipoId = doc.tipoId;
			doc.files.forEach(file => {
				const newFile = {};
				newFile.dataEmissao = file.dataEmissao;
				newFile.file = file.file;
				newDoc.files.push(newFile);
			});
			list.push(newDoc);
		});

		list[indexDoc].files[indexFiles].dataEmissao = date;
		setFieldValue('documentacao', list);
	};

	const addFile = (event, indexDoc) => {
		event.stopPropagation();
		document.getElementById(`fileinput@/..{indexDoc}`).click();
	};

	const removeFile = () => {
		const removeList = [];
		removeList.push(documentacao.value[docSelected].files[0].arquivoId);
		setFieldValue('documentacaoRemover', documentacaoRemover.value.concat(removeList));
		documentacao.value[docSelected].files.splice(fileSelected, 1);
		if (documentacao.value[docSelected].files.length === 0) {
			setExpandedValue(null);
		}
		setFieldValue('documentacao', documentacao.value);
		setDocSelected(null);
		setFileSelected(null);
	};

	// Formulário

	const { submitCount, getFieldProps, setFieldValue, values } = formulario;

	const [
		documentacao,
		metadataDocumentacao
	] = getFieldProps('documentacao', 'text');

	const [
		documentacaoRemover,
		metadataDocumentacaoRemover
	] = getFieldProps('documentacaoRemover', 'text');

	// Tabela

	const columns = [
		{ id: 'Arquivo', label: 'Arquivo', width: '50%' },
		{ id: 'DataDeEmissao', label: 'Data de Emissão', width: '45%' },
		{ id: 'Acoes', label: 'Ações', width: '5%', colSpan: 3, align: 'center' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Card>
				<Confirm
					open={docSelected !== null && fileSelected !== null}
					handleClose={() => {
						setDocSelected(null);
						setFileSelected(null);
					}}
					handleSuccess={() => removeFile()}
					title={translate('confirmacao')}
					text='deseja remover'
					textButtonSuccess={translate('sim')}
					textButtonCancel={translate('nao')}
					backgroundColorButtonCancel={theme.palette.secondary.main}
				/>
				<CardHeader title={translate('documentacao')} />
				<CardContent>
					<div className={classes.root}>
						{documentacao.value &&
							documentacao.value.length > 0 &&
							documentacao.value.map((doc, indexDoc) => {
								return (
									<ExpansionPanel
										expanded={getExpanded(indexDoc)}
										onChange={() => setExpandedValue(indexDoc)}
									>
										<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls={`panel@/..{indexDoc}bh-content`} // 'panel1bh-content'
											id={indexDoc}
										>
											<Box style={{ paddingRight: '10px' }}>
												<Fab
													color='secondary'
													style={{ background: '#808080', width: '35px', height: '35px' }}
												>
													<DescriptionIcon />
												</Fab>
											</Box>
											<span style={{ width: '70%' }}>
												<Typography className={classes.heading}>{doc.tipo}</Typography>
											</span>
											<span>
												<Typography className={classes.secondaryHeading}>
													{doc.files.length} Arquivo
												</Typography>
											</span>
											<Box style={{ paddingLeft: '5%' }}>
												<Button onClick={event => addFile(event, indexDoc)}>
													<BackupIcon />
												</Button>
											</Box>
										</ExpansionPanelSummary>
										<ExpansionPanelActions>
											<Box style={{ width: '100%' }}>
												<Table>
													<TableHead columns={columns} rowCount={columns.length} />
													<TableBody>
														{doc.files &&
															doc.files.length > 0 &&
															doc.files.map((f, indexFile) => {
																variantTableRow =
																	variantTableRow === theme.palette.table.tableRowPrimary
																		? theme.palette.table.tableRowSecondary
																		: theme.palette.table.tableRowPrimary;
																return (
																	<TableRow key={indexFile}>
																		<TableCell label={f.file.name} />
																		<TableCell
																			title='Data de Emissão'
																			label={
																				<Box width='60%'>
																					<FormInput
																						type='date'
																						value={f.dataEmissao}
																						onChange={event =>
																							setListFilesDate(
																								indexDoc,
																								indexFile,
																								event.target.value
																							)}
																					/>
																				</Box>
																			}
																		/>
																		<TableCell
																			title='Ações'
																			label={
																				<Button
																					onClick={() => {
																						setDocSelected(indexDoc);
																						setFileSelected(indexFile);
																					}}
																				>
																					<HighlightOffIcon />
																				</Button>
																			}
																		/>
																	</TableRow>
																);
															})}
													</TableBody>
												</Table>
												<input
													type='file'
													id={`fileinput@/..{indexDoc}`}
													style={{ visibility: 'hidden' }}
													multiple
													onChange={event => setListFiles(indexDoc, event.target)}
												/>
											</Box>
										</ExpansionPanelActions>
									</ExpansionPanel>
								);
							})}
					</div>
				</CardContent>
			</Card>
		</Box>
	);
}
