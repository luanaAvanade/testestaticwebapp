import React, { useState, useEffect, Fragment } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import {
	Card,
	Button,
	Modal,
	FormInput,
	Table,
	TableHead,
	TableRow,
	TableCell,
	FormSelect,
	Confirm
} from '@/components';
import {
	Box,
	CardContent,
	CardHeader,
	TableBody,
	IconButton,
	FormControlLabel,
	Checkbox,
	Typography,
	Select,
	ListItemText,
	MenuItem,
	OutlinedInput
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { translate } from '@/locales';
import { checkError } from '@/utils/validation';
import theme from '@/theme';
import { COLUMNS_DADOS_SOCIOS } from './tableHead';
import { cpfCnpjMask, moedaMask, soNumero, moeda, percent } from '@/utils/mascaras';
import ObjectHelper from '@/utils/objectHelper';
import { cpfIsValid } from '@/utils/cpf';
import { snackSuccess, snackError } from '@/utils/snack';
import { cnpjIsValid } from '@/utils/cnpj';
import { COLUMNS_DADOS_ASSINATURA_SOCIOS } from './tableHead';
import { SELECT_TIPO_ASSINATURAS } from '@/utils/constants';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';

export default function ContratoSocios({
	formulario,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	historicoEmpresa,
	user,
	disableEdit,
	statusEmpresa
}) {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { getFieldProps, setFieldValue, values, submitCount } = formulario;

	const [
		flagAddAssinaturasSocioModal,
		setFlagAddAssinaturasSocioModal
	] = useState(false);

	const [
		indexEditAssSocio,
		setIndexEditAssSocio
	] = useState('');

	const [
		indexExcluirAssSocio,
		setIndexExcluirAssSocio
	] = useState(null);

	const [
		tipoAssinatura,
		setTipoAssinatura
	] = useState(0);

	const [
		sociosAssObrigatorioList,
		setSociosAssObrigatorioList
	] = useState([]);

	const [
		sociosAssOpcionalList,
		setSociosAssOpcionalList
	] = useState([]);

	const [
		valorLimite,
		setValorLimite
	] = useState('0.00');

	const [
		assinaturasSociosList,
		metadataAssinaturasSociosList
	] = getFieldProps('assinaturasSociosList', 'text');

	const [
		sociosList
	] = getFieldProps('sociosList', 'text');

	function closeModal() {
		setFlagAddAssinaturasSocioModal(false);
		resetModalCadastroAssinaturasSocio();
	}

	function handleSelectSocioObrList(event) {
		if (tipoAssinatura === 0) {
			setSociosAssObrigatorioList([
				event.target.value
			]);
		} else {
			setSociosAssObrigatorioList(event.target.value);
		}
	}

	function handleSelectSocioOpcionalList(event) {
		setSociosAssOpcionalList(event.target.value);
	}

	function addAssSocioList() {
		const sociosAssListTemp = ObjectHelper.clone(assinaturasSociosList.value);

		if (sociosAssObrigatorioList.length > 0 || sociosAssOpcionalList.length > 0) {
			const objetoAtual = montaObjetoAtual();

			if (indexEditAssSocio !== '') {
				if (
					sociosAssListTemp.filter(
						(item, index) =>
							ObjectHelper.compareObjects(item.Assinaturas, objetoAtual.Assinaturas) &&
							index !== indexEditAssSocio
					).length <= 0
				) {
					if (sociosAssListTemp[indexEditAssSocio].hasOwnProperty('Id')) {
						objetoAtual.Id = sociosAssListTemp[indexEditAssSocio].Id;
					}
					sociosAssListTemp[indexEditAssSocio] = objetoAtual;
					setFieldValue('assinaturasSociosList', sociosAssListTemp);
					closeModal();
				} else {
					callbackError(translate('configuracaoAssinaturasJaCadastrada'));
				}
			} else {
				if (
					sociosAssListTemp.length === 0 ||
					sociosAssListTemp.filter(item =>
						ObjectHelper.compareObjects(item.Assinaturas, objetoAtual.Assinaturas)
					).length <= 0
				) {
					sociosAssListTemp.push(objetoAtual);
					setFieldValue('assinaturasSociosList', sociosAssListTemp);
					closeModal();
				} else {
					callbackError(translate('configuracaoAssinaturasJaCadastrada'));
				}
			}
		} else {
			callbackError(translate('sociosDevemSerSelecionados'));
		}
	}

	function montaObjetoAtual() {
		let assSociosObrArray = ObjectHelper.clone(sociosAssObrigatorioList);
		let assSociosOptArray = ObjectHelper.clone(sociosAssOpcionalList);
		assSociosObrArray = assSociosObrArray.map(item => ({ Codigo: item, Obrigatoriedade: true }));
		assSociosOptArray = assSociosOptArray.map(item => ({ Codigo: item, Obrigatoriedade: false }));

		const assSociosArrray = [
			...assSociosObrArray,
			...assSociosOptArray
		];

		const objetoAtual = {
			TipoAssinatura: tipoAssinatura,
			ValorLimite: valorLimite,
			Assinaturas: assSociosArrray
		};
		return objetoAtual;
	}

	function setEditAssSocioListScreen(index) {
		const sociosAssListTemp = ObjectHelper.clone(assinaturasSociosList.value);
		setModalCadastroAssinaturasSocio(sociosAssListTemp[index]);
		setIndexEditAssSocio(index);
		setFlagAddAssinaturasSocioModal(true);
	}

	const deleteAssSocio = index => {
		const sociosAssListTemp = ObjectHelper.clone(assinaturasSociosList.value);
		sociosAssListTemp.splice(indexExcluirAssSocio, 1);
		setFieldValue('assinaturasSociosList', sociosAssListTemp);
		setIndexExcluirAssSocio(null);
	};

	function resetModalCadastroAssinaturasSocio() {
		setSociosAssObrigatorioList([]);
		setSociosAssOpcionalList([]);
		setTipoAssinatura(0);
		setIndexEditAssSocio('');
		setValorLimite('0.00');
	}

	function setModalCadastroAssinaturasSocio(assinaturaSocio) {
		setTipoAssinatura(assinaturaSocio.TipoAssinatura);
		setValorLimite(assinaturaSocio.ValorLimite);
		setSociosAssObrigatorioList(
			assinaturaSocio.Assinaturas.filter(item => item.Obrigatoriedade).map(item => item.Codigo)
		);
		setSociosAssOpcionalList(
			assinaturaSocio.Assinaturas.filter(item => !item.Obrigatoriedade).map(item => item.Codigo)
		);
	}
	// Ações de retorno

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = '1px';
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: '30%'
			}
		}
	};

	// Interações com a Tabela

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Confirm
				open={indexExcluirAssSocio !== null}
				handleSuccess={deleteAssSocio}
				handleClose={() => setIndexExcluirAssSocio(null)}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirRegistro')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>
			<Card
				borderColor={theme.palette.danger.main}
				error={checkError(submitCount, metadataAssinaturasSociosList)}
			>
				<CardHeader
					title={translate('sociosAssinamEmpresa')}
					action={
						<Aprovacao
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							tipoItem={
								ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Cadastro_Signatario').value
							}
							historicoEmpresa={historicoEmpresa}
							user={user}
							disableEdit={disableEdit}
							statusEmpresa={statusEmpresa}
						/>
					}
				/>
				<CardContent>
					<Modal
						open={flagAddAssinaturasSocioModal}
						handleClose={() => closeModal()}
						title={translate('cadastroAssinaturaSocio')}
						textButton={translate('adicionar')}
						onClickButton={() => addAssSocioList()}
						maxWidth='md'
						fullWidth
					>
						<Box display='flex' flexDirection='row'>
							<Box width='50%' paddingRight={`${theme.spacing(3)}px`}>
								<FormSelect
									labelInitialItem={translate('selecioneOpcao')}
									labelWithValue
									label={`${translate('selecioneTipoAssinatura')}:`}
									value={tipoAssinatura}
									onChange={event => setTipoAssinatura(event.target.value)}
									items={SELECT_TIPO_ASSINATURAS}
									disabled={disableEdit}
								/>
							</Box>
							<Box width='50%' paddingRight={`${theme.spacing(3)}px`}>
								<FormInput
									label={`${translate('valorLimite')}:`}
									value={moedaMask(valorLimite)}
									onChange={event => setValorLimite(moeda(event.target.value))}
									required
									disabled={disableEdit}
								/>
							</Box>
						</Box>
						<Box display='flex' flexDirection='row'>
							{tipoAssinatura === 0 && (
								<Box width='100%' paddingRight={`${theme.spacing(3)}px`}>
									<FormSelect
										items={sociosList.value.map(s => {
											return { value: s.Codigo, label: `${s.Nome} - ${cpfCnpjMask(s.Codigo)}` };
										})}
										label={`${translate('selecioneSocio')}:`}
										value={sociosAssObrigatorioList}
										onChange={event => handleSelectSocioObrList(event)}
										required
										disabled={disableEdit}
									/>
								</Box>
							)}

							{tipoAssinatura === 1 && (
								<Fragment>
									<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
										<Typography display='block' variant='h6'>
											{`${translate('sociosAssinamObrigatoriamente')}:`}
										</Typography>
										<Select
											style={{ width: '100%' }}
											multiple
											value={sociosAssObrigatorioList}
											onChange={handleSelectSocioObrList}
											input={<OutlinedInput id='select-multiple-checkbox' margin='dense' />}
											renderValue={selected => {
												return selected
													.map(item => sociosList.value.find(x => x.Codigo === item).Nome)
													.join(',');
											}}
											MenuProps={MenuProps}
											disabled={disableEdit}
										>
											{sociosList.value
												.filter(item => sociosAssOpcionalList.findIndex(t => t === item.Codigo) < 0)
												.map(item => (
													<MenuItem key={item.Codigo} value={item.Codigo}>
														<Checkbox
															checked={
																sociosAssObrigatorioList.findIndex(t => t === item.Codigo) > -1
															}
														/>
														<ListItemText primary={`${item.Nome} - ${cpfCnpjMask(item.Codigo)}`} />
													</MenuItem>
												))}
										</Select>
									</Box>
									<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
										<Typography display='block' variant='h6'>
											{`${translate('sociosOpcionais')}:`}
										</Typography>
										<Select
											style={{ width: '100%' }}
											multiple
											value={sociosAssOpcionalList}
											onChange={handleSelectSocioOpcionalList}
											input={<OutlinedInput id='select-multiple-checkbox' margin='dense' />}
											renderValue={selected => {
												return selected
													.map(item => sociosList.value.find(x => x.Codigo === item).Nome)
													.join(',');
											}}
											MenuProps={MenuProps}
											disabled={disableEdit}
										>
											{sociosList.value
												.filter(
													item => sociosAssObrigatorioList.findIndex(t => t === item.Codigo) < 0
												)
												.map(item => (
													<MenuItem key={item.Codigo} value={item.Codigo}>
														<Checkbox
															checked={sociosAssOpcionalList.findIndex(t => t === item.Codigo) > -1}
														/>
														<ListItemText primary={`${item.Nome} - ${cpfCnpjMask(item.Codigo)}`} />
													</MenuItem>
												))}
										</Select>
									</Box>
								</Fragment>
							)}
						</Box>
					</Modal>
					<Box display='flex' flexDirection='row' justifyContent='flex-end'>
						{!disableEdit && (
							<Button
								text={translate('adicionar')}
								backgroundColor={theme.palette.primary.main}
								onClick={() => setFlagAddAssinaturasSocioModal(true)}
							/>
						)}
					</Box>
					<Box display='flex' flexDirection='row' width='100%'>
						<Table small>
							<TableHead columns={COLUMNS_DADOS_ASSINATURA_SOCIOS} />
							<TableBody>
								{assinaturasSociosList.value &&
									assinaturasSociosList.value.length > 0 &&
									assinaturasSociosList.value.map((assinatura, index) => {
										variantTableRow =
											variantTableRow === theme.palette.table.tableRowPrimary
												? theme.palette.table.tableRowSecondary
												: theme.palette.table.tableRowPrimary;

										return (
											<TableRow key={index} backgroundColor={variantTableRow}>
												<TableCell
													label={
														SELECT_TIPO_ASSINATURAS.find(
															item => item.value === assinatura.TipoAssinatura
														).label
													}
												/>
												<TableCell
													label={assinatura.Assinaturas
														.filter(s => s.Obrigatoriedade)
														.map(s => {
															const socio = sociosList.value.find(x => x.Codigo === s.Codigo);
															return socio != undefined ? socio.Nome : '';
														})
														.join(', ')}
												/>
												<TableCell
													label={assinatura.Assinaturas
														.filter(s => !s.Obrigatoriedade)
														.map(s => sociosList.value.find(x => x.Codigo === s.Codigo).Nome)
														.join(', ')}
												/>
												<TableCell label={moedaMask(assinatura.ValorLimite)} />
												<TableCell
													title={translate('editar')}
													label={
														<IconButton
															size='small'
															onClick={() => setEditAssSocioListScreen(index)}
															disabled={disableEdit}
														>
															<Edit />
														</IconButton>
													}
												/>
												<TableCell
													title={translate('excluir')}
													label={
														<IconButton
															size='small'
															onClick={() => setIndexExcluirAssSocio(index)}
															disabled={disableEdit}
														>
															<Delete />
														</IconButton>
													}
												/>
											</TableRow>
										);
									})}
								{assinaturasSociosList.value &&
								assinaturasSociosList.value.length === 0 && (
									<TableRow backgroundColor={variantTableRow}>
										<TableCell
											align='center'
											colSpan={6}
											label={translate('semResultadosAExibir')}
										/>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
