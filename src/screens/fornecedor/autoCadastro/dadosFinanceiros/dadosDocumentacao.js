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
	Confirm,
	Button as ButtonAxxiom
} from '@/components';
import {
	CardHeader,
	CardContent,
	Box,
	TableBody,
	Button,
	ExpansionPanelActions
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { translate } from '@/locales';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
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
import { useSnackbar } from 'notistack';
import { snackWarning } from '@/utils/snack';
import { FUNCIONALIDADE, TAB_DADOS_FINANCEIROS, TIPO_DOCUMENTO } from '@/utils/constants';
import { ENUM_TIPO_ARQUIVO } from '@/utils/constants';

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

export default function DadosDocumentacao({
	key,
	documentosDb,
	formulario,
	setRetornoRobo,
	dataAbertura,
	tab
}) {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
		tipoDocumentoDREeBP,
		setTipoDocumentoDREeBP
	] = useState([
		{
			Nome: 'Demonstra????o do Resultado do Exerc??cio (DRE)',
            Id: 88,
            Codigo: 88
		},
		{
			Nome: 'Balan??o Patrimonial (BP)',
            Id: 172,
			Codigo: 172
		}
	]);


	const [
		validaDocumento,
		setValidaDocumento
	] = useState(false);

	const [
		fileSelected,
		setFileSelected
	] = useState(null);

	const [
		listaTipoDocumento,
		setListaTipoDocumento
	] = useState([]);
	// Buscar Dados

	// Efeito Inicial
	useEffect(
		() => {
			setFieldValue('documentacao', []);
			if (tab === TAB_DADOS_FINANCEIROS) {
				buscaPorFuncionalidade();
			}
		},
		[
			tab
		]
	);

	// A????es da Tela

	const callbackWarning = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};

	const buscaPorFuncionalidade = () => {
		dispatch(LoaderCreators.setLoading());
		TipoDocumentoService.findByFuncionalidadeDifDREeBA(FUNCIONALIDADE.Cadastro_Financeiro_Pessoa_Juridica)
			.then(response => {
				setListaTipoDocumento(response.data.TipoDocumento_list);
				preencheListaDocumentacao(response.data.TipoDocumento_list);
				dispatch(LoaderCreators.disableLoading());
			})
			.catch(erro => console.log(JSON.stringify(erro)));
	};

	const preencheListaDocumentacao = tipoDocumentacaoList => {
		const count = VerificaData(dataAbertura);		
		tipoDocumentoDREeBP.forEach(tpDocumento => {		
				let ano = new Date().getUTCFullYear();
				for (let i = 0; i < count; i++) {
					const newDocumentoDREeBP = {
						tipoId: tpDocumento.Id,
						tipo: `@/..{tpDocumento.Nome} - @/..{--ano}`,
						codigo: tpDocumento.Codigo,
						files: []
					};
					const docDb = _.find(documentosDb, doc => doc.tipoId === tpDocumento.Id);
					if (docDb) {
						newDocumentoDREeBP.files = docDb.files;
					}
					documentacao.value.push(newDocumentoDREeBP);
				}
		});		
		if(tipoDocumentacaoList && tipoDocumentacaoList != null && tipoDocumentacaoList.length > 0) {	
			tipoDocumentacaoList.forEach(tipoDocumento => {
				const newDocumento = {
					tipoId: tipoDocumento.Id,
					tipo: tipoDocumento.Nome,
					tipoArquivo: 0,
					codigo: 0,
					files: []
				};
				const docdb = _.find(documentosDb, doc => doc.tipoId === tipoDocumento.Id);
				if (docdb) {
					newDocumento.files = docdb.files;
				}
				documentacao.value.push(newDocumento);
			
		});
	}

		setFieldValue('documentacao', documentacao.value);
		documentosDb.push(documentacao.value);
	};

	const VerificaData = data => {
		const dataAtual = new Date().getUTCFullYear();
		const resultOperacao = dataAtual - data.substring(0, 4);
		if (resultOperacao > 4 || resultOperacao === 4) {
			return 3;
		}
		switch (resultOperacao) {
			case 3:
				return 3;
			case 2:
				return 2;
			case 1:
				return 1;
			case 0:
				return 0;
			default:
				return 0;
		}
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
		if (
			documentacao.value[indexDoc].files.length != undefined &&
			documentacao.value[indexDoc].files.length > 0
		) {
			documentacao.value[indexDoc].files.splice(indexDoc, 1);
			const list = ObjectHelper.clone(documentacao.value);
			list[indexDoc].files = documentacao.value[indexDoc].files.concat(
				documentacao.value[indexDoc].files
			);
			if (list[indexDoc].files.length === 0) {
				setExpandedValue(null);
			}
			setFieldValue('documentacao', list);
		}
		for (let i = 0; i < inputFiles.files.length; i++) {
			const tipoDoc = listaTipoDocumento.find(x => x.Id === documentacao.value[indexDoc].tipoId);
			const result = validarArquivo(inputFiles.files[i], tipoDoc);
			if (result) {
				array.push({ file: inputFiles.files[i], dataEmissao: '' });
			}
		}

		inputFiles.value = '';
		const list = ObjectHelper.clone(documentacao.value);
		list.forEach((doc, index) => {
			doc.files = documentacao.value[index].files;
		});
		list[indexDoc].files = documentacao.value[indexDoc].files.concat(array);
		setFieldValue('documentacao', list);
		setFieldTouched('documentacao', true);
		setExpandedValue(indexDoc);
	};

	function validoFormato(arquivo, tipo) {
		var extensoes, ext, valido;
		extensoes = new Array('.odt', '.pdf', '.doc');
		ext = arquivo.substring(arquivo.lastIndexOf('.')).toLowerCase();
		valido = false;
		for (var i = 0; i <= arquivo.length; i++) {
			if (extensoes[i] == ext) {
				valido = true;
				break;
			}
		}
		if (valido) {
			return true;
		}
		return false;
	}

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
		setFieldTouched('documentacao', true);
	};

	const addFile = (event, indexDoc) => {
		event.stopPropagation();
		document.getElementById(`fileinput@/..{indexDoc}df`).click();
	};

	const removeFile = () => {
		documentacao.value[docSelected].files.splice(fileSelected, 1);
		const list = ObjectHelper.clone(documentacao.value);
		list[docSelected].files = documentacao.value[docSelected].files.concat(
			documentacao.value[docSelected].files
		);
		if (list[docSelected].files.length === 0) {
			setExpandedValue(null);
		}
		setFieldValue('documentacao', list);
		setFieldTouched('documentacao', true);
		setDocSelected(null);
		setFileSelected(null);
	};

	function validarArquivo(arquivo, tipo) {
		return validarFormato(arquivo, tipo) && validarTamanho(arquivo, tipo) && validarQnt(tipo);
	}

	function validarQnt(tipo) {
		const arquivosTipo = documentacao.value.find(x => x.tipoId === tipo.Id);
		if (
			arquivosTipo &&
			arquivosTipo.files &&
			tipo.QuantidadeMaxima &&
			arquivosTipo.files.length >= tipo.QuantidadeMaxima
		) {
			callbackWarning(`Quantidade maxiama de arquivos ?? @/..{tipo.QuantidadeMaxima}`);
			return false;
		}
		return true;
	}
	function validarTamanho(arquivo, tipo) {
		const Tamanho = arquivo.size / 1024 / 1024; // in MB
		if (tipo.TamanhoMaximo && Tamanho > tipo.TamanhoMaximo) {
			callbackWarning(`Arquivo @/..{arquivo.name} exede tamanho maximo de @/..{tipo.TamanhoMaximo} MB`);
			return false;
		}
		return true;
	}
	//todo[iuri] mudar para lista de tipos de arquivo
	const enumFuncReverse = [
		{
			tipoArquivo: 0,
			tipos: [] //
		},
		{
			tipoArquivo: 1,
			tipos: [
				1
			] //'pdf',
		},
		{
			tipoArquivo: 2,
			tipos: [
				2
			] //'xml',
		},
		{
			tipoArquivo: 4,
			tipos: [
				4
			] //'csv',
		},
		{
			tipoArquivo: 8,
			tipos: [
				8
			] //'jpg'
		},
		{
			tipoArquivo: 3,
			tipos: [
				1,
				2
			] //'pdf,xml'
		},
		{
			tipoArquivo: 5,
			tipos: [
				1,
				4
			] //'pdf,csv'
		},
		{
			tipoArquivo: 9,
			tipos: [
				1,
				8
			] //'pdf,jpg'
		},
		{
			tipoArquivo: 6,
			tipos: [
				2,
				4
			] //'xml,csv'
		},
		{
			tipoArquivo: 10,
			tipos: [
				2,
				8
			] //'xml,jpg'
		},
		{
			tipoArquivo: 12,
			tipos: [
				4,
				8
			] //'csv,jpg'
		},
		{
			tipoArquivo: 7,
			tipos: [
				1,
				2,
				4
			] //'pdf,xml,csv'
		},
		{
			tipoArquivo: 11,
			tipos: [
				1,
				2,
				8
			] //'pdf,xml,jpg'
		},
		{
			tipoArquivo: 13,
			tipos: [
				1,
				4,
				8
			] //'pdf,csv,jpg'
		},
		{
			tipoArquivo: 14,
			tipos: [
				2,
				4,
				8
			] //'xml,csv,jpg'
		},
		{
			tipoArquivo: 15,
			tipos: [
				1,
				2,
				4,
				8
			] //'pdf,xml,csv,jpg'
		}
	];

	function validarFormato(arquivo, tipo) {
		const ext = arquivo.name.substring(arquivo.name.lastIndexOf('.') + 1).toLowerCase();
		const tipoArquivo = ENUM_TIPO_ARQUIVO.find(x => x.label == ext);
		const listaTipos = enumFuncReverse.find(x => x.tipoArquivo === tipo.TiposArquivos);
		if (
			tipoArquivo &&
			listaTipos &&
			listaTipos.tipos &&
			listaTipos.tipos.some(x => x === tipoArquivo.value)
		) {
			return true;
		}
		callbackWarning(`O formato do arquivo @/..{arquivo.name} n??o ?? valido`);
		return false;
	}

	// Formul??rio

	const { submitCount, getFieldProps, setFieldValue, setFieldTouched, values } = formulario;

	const [
		documentacao,
		metadataDocumentacao
	] = getFieldProps('documentacao', 'text');

	// Tabela

	const columns = [
		{ id: 'Arquivo', label: 'Arquivo', width: '50%' },
		{ id: 'DataDeEmissao', label: 'Data de Emiss??o', width: '45%' },
		{ id: 'Acoes', label: 'A????es', width: '5%', colSpan: 3, align: 'center' }
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
				<CardContent key={documentacao.value.length}>
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
																			title='Data de Emiss??o'
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
																			title='A????es'
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
													id={`fileinput@/..{indexDoc}df`}
													style={{ visibility: 'hidden' }}
													onChange={event => setListFiles(indexDoc, event.target)}
													accept='application/pdf'
												/>
											</Box>
										</ExpansionPanelActions>
									</ExpansionPanel>
								);
							})}
					</div>
					<Box display='flex' justifyContent='flex-end' marginTop='8px' />
				</CardContent>
			</Card>
		</Box>
	);
}
