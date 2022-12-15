import React, { useState, useEffect } from 'react';
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
	Typography
} from '@material-ui/core';
import { Edit, Delete, ThumbUp, ThumbDown } from '@material-ui/icons';
import { translate } from '@/locales';
import { checkError } from '@/utils/validation';
import theme from '@/theme';
import { COLUMNS_DADOS_SOCIOS } from './tableHead';
import { cpfCnpjMask, moedaMask, soNumero, moeda, percent } from '@/utils/mascaras';
import ObjectHelper from '@/utils/objectHelper';
import { cpfIsValid } from '@/utils/cpf';
import { snackSuccess, snackError, snackWarning } from '@/utils/snack';
import { cnpjIsValid } from '@/utils/cnpj';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';

export default function ContratoSocios({
	capitalSocialTotalPronto,
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
	const { getFieldProps, setFieldValue, submitCount, values, setFieldTouched } = formulario;

	const { capitalSocialTotal } = formulario.values;

	const [
		flagAddSocioModal,
		setFlagAddSocioModal
	] = useState(false);

	const [
		flagValidate,
		setFlagValidate
	] = useState(false);

	const [
		indexEditSocio,
		setIndexEditSocio
	] = useState('');

	const [
		indexExcluirSocio,
		setIndexExcluirSocio
	] = useState(null);

	const [
		cpfCnpjSocio,
		setCpfCnpjSocio
	] = useState('');

	const [
		nomeSocio,
		setNomeSocio
	] = useState('');

	const [
		valorParticipacaoSocio,
		setValorParticipacaoSocio
	] = useState('0.00');

	const [
		administradorSocio,
		setAdministradorSocio
	] = useState(false);

	const [
		sociosList,
		metadataSociosList
	] = getFieldProps('sociosList', 'text');

	useEffect(
		() => {
			if (capitalSocialTotalPronto && sociosList.value.length > 0) {
				refreshSocioList();
			}
		},
		[
			capitalSocialTotalPronto
		]
	);

	function closeModal() {
		setFlagAddSocioModal(false);
		setCpfCnpjSocio('');
		setNomeSocio('');
		setValorParticipacaoSocio('');
		setAdministradorSocio(false);
		setFlagValidate(false);
	}

	function validaCpfcnpj(cpfcnpj) {
		if ((cpfcnpj && cpfIsValid(cpfcnpj)) || cnpjIsValid(cpfcnpj)) return true;
		return false;
	}

	function refreshSocioList() {
		setPercent(sociosList.value);
	}

	function addSocioList() {
		setFlagValidate(true);
		const sociosListTemp = ObjectHelper.clone(sociosList.value);
		let cpfCnpjSemMask = cpfCnpjSocio.replace(/[^\d]+/g, '');
		if (!cpfCnpjSocio) return;
		if (validaCpfcnpj(cpfCnpjSocio)) {
			if (indexEditSocio === '') {
				if (sociosListTemp.findIndex(socio => socio.Codigo === cpfCnpjSemMask) < 0) {
					if (valorParticipacaoSocio >= 0) {
						sociosListTemp.push({
							Nome: nomeSocio,
							Codigo: cpfCnpjSemMask,
							ValorParticipacao: valorParticipacaoSocio,
							Percentual: 0,
							Administrador: administradorSocio,
							TipoPessoa: cpfCnpjSemMask.length > 11 ? 1 : 0
						});
						setPercent(sociosListTemp);
						setFieldValue('sociosList', sociosListTemp);
						setFieldTouched('sociosList', true);
						setFlagAddSocioModal(false);
						resetModalCadastroSocio();
					} else {
						callbackError(translate('valorParticipacaoNegativo'));
					}
				} else {
					callbackError(translate('socioJaCadastrado'));
				}
			} else {
				if (
					sociosListTemp.findIndex(
						(socio, index) => socio.Codigo === cpfCnpjSocio && index !== indexEditSocio
					)
				) {
					if (valorParticipacaoSocio >= 0) {
						if (sociosListTemp[indexEditSocio].hasOwnProperty('Id')) {
							sociosListTemp[indexEditSocio] = {
								Id: sociosListTemp[indexEditSocio].Id,
								Nome: nomeSocio,
								Codigo: cpfCnpjSemMask,
								ValorParticipacao: valorParticipacaoSocio,
								Percentual: 0,
								Administrador: administradorSocio
							};
						} else {
							sociosListTemp[indexEditSocio] = {
								Nome: nomeSocio,
								Codigo: cpfCnpjSemMask,
								ValorParticipacao: valorParticipacaoSocio,
								Percentual: 0,
								Administrador: administradorSocio
							};
						}
						const totalParticipacao = sociosListTemp
							.map(socio => socio.ValorParticipacao)
							.reduce((total, valor) => total + parseFloat(valor));
						for (let i = 0; i < sociosListTemp.length; i += 1) {
							sociosListTemp[i].Percentual = parseFloat(
								getSocioPercent(sociosListTemp[i].ValorParticipacao)
							).toFixed(2);
							sociosListTemp[i].Percentual = isNaN(sociosListTemp[i].Percentual)
								? 0.0
								: sociosListTemp[i].Percentual;
						}
						setFieldValue('sociosList', sociosListTemp);
						setFieldTouched('sociosList', true);
						setFlagAddSocioModal(false);
						setIndexEditSocio('');
						resetModalCadastroSocio();
					} else {
						callbackError(translate('valorParticipacaoNegativo'));
					}
				} else {
					callbackError(translate('socioJaCadastrado'));
				}
			}
		} else {
			callbackError(translate('cpfCnpjInvalido'));
		}
	}

	function setPercent(sociosListTemp) {
		const totalParticipacao = sociosListTemp
			.map(socio => socio.ValorParticipacao)
			.reduce((total, valor) => total + Number(valor));
		for (let i = 0; i < sociosListTemp.length; i += 1) {
			if (totalParticipacao > 0) {
				let percentual =
					!isNaN(Number(sociosListTemp[i].ValorParticipacao)) &&
					Number(sociosListTemp[i].ValorParticipacao) > 0
						? sociosListTemp[i].ValorParticipacao
						: 0.0;
				sociosListTemp[i].Percentual = getSocioPercent(percentual);
			} else {
				sociosListTemp[i].Percentual = 0.0;
			}
		}
	}

	function getSocioPercent(value) {
		if (capitalSocialTotal > 0) {
			return value / capitalSocialTotal;
		} else {
			return 0.0;
		}
	}

	function editSocioList(index) {
		const sociosListTemp = ObjectHelper.clone(sociosList.value);
		setModalCadastroSocio(sociosListTemp[index]);
		setIndexEditSocio(index);
		setFlagAddSocioModal(true);
	}

	const deleteSocio = index => {
		// if (
		// 	values.assinaturasSociosList.filter(
		// 		item => item.Assinaturas.findIndex(x => x.Codigo === sociosList[index].Codigo) >= 0
		// 	).length > 0
		// ) {
		// 	callbackError('Possui Assinatura. Remova antes de excluir');
		// 	return;
		// }
		const sociosListTemp = ObjectHelper.clone(sociosList.value);
		sociosListTemp.splice(indexExcluirSocio, 1);
		setPercent(sociosListTemp); // recalcula o percentual
		setFieldValue('sociosList', sociosListTemp);
		setFieldTouched('sociosList', true);
		setIndexExcluirSocio(null);
		if (sociosListTemp.length === 0) setFieldValue('assinaturasSociosList', []);
	};

	function resetModalCadastroSocio() {
		setCpfCnpjSocio('');
		setNomeSocio('');
		setValorParticipacaoSocio('0.00');
		setAdministradorSocio(false);
		setFlagValidate(false);
	}

	function setModalCadastroSocio(socio) {
		setCpfCnpjSocio(socio.Codigo);
		setNomeSocio(socio.Nome);
		setValorParticipacaoSocio(socio.ValorParticipacao);
		setAdministradorSocio(socio.Administrador);
	}

	function socioPossuiGrupo(Codigo) {
		return values.assinaturasSociosList.filter(
			item => item.Assinaturas.filter(x => x.Codigo === Codigo).length > 0
		).length > 0
			? true
			: false;
	}
	// Ações de retorno

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackWarning = mensagem => {
		enqueueSnackbar('', snackWarning(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	// Interações com a Tabela

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Confirm
				open={indexExcluirSocio !== null}
				handleSuccess={deleteSocio}
				handleClose={() => setIndexExcluirSocio(null)}
				title={translate('confirmacao')}
				text={translate('desejaRealmenteExcluirRegistro')}
				textButtonSuccess={translate('sim')}
				textButtonCancel={translate('nao')}
				backgroundColorButtonCancel={theme.palette.secondary.main}
			/>
			<Card
				borderColor={theme.palette.danger.main}
				error={checkError(submitCount, metadataSociosList)}
			>
				<CardHeader
					title={translate('socios')}
					action={
						<Aprovacao
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							tipoItem={ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Cadastro_Socios').value}
							historicoEmpresa={historicoEmpresa}
							user={user}
							disableEdit={disableEdit}
							statusEmpresa={statusEmpresa}
						/>
					}
				/>
				<CardContent>
					<Modal
						open={flagAddSocioModal}
						handleClose={() => closeModal()}
						title={translate('cadastroSocio')}
						textButton={translate('adicionar')}
						onClickButton={() => addSocioList()}
						maxWidth='md'
						fullWidth
					>
						<Box display='flex' flexDirection='row'>
							<Box width='100%' paddingRight={`@/..{theme.spacing(1)}px`}>
								<FormInput
									label={`@/..{translate('nome')}:`}
									value={nomeSocio}
									onChange={event => setNomeSocio(event.target.value)}
									error={flagValidate && !nomeSocio ? translate('campoObrigatorio') : ''}
									required
									disabled={disableEdit}
								/>
							</Box>
						</Box>
						<Box display='flex' flexDirection='row'>
							<Box width='43%' paddingRight={`@/..{theme.spacing(1)}px`}>
								<FormInput
									label={`@/..{translate('cpfcnpj')}:`}
									value={cpfCnpjMask(cpfCnpjSocio.replace(/[^\d]+/g, ''))}
									onChange={event => setCpfCnpjSocio(event.target.value)}
									error={flagValidate && !cpfCnpjSocio ? translate('campoObrigatorio') : ''}
									required
									disabled={indexEditSocio !== '' || disableEdit}
								/>
							</Box>
							<Box width='43%' paddingRight={`@/..{theme.spacing(3)}px`}>
								<FormInput
									label={`@/..{translate('valorParticipacao')}:`}
									value={moedaMask(valorParticipacaoSocio)}
									onChange={event => setValorParticipacaoSocio(moeda(event.target.value))}
									required
									disabled={disableEdit}
								/>
							</Box>
							<Box width='14%' paddingRight={`@/..{theme.spacing(1)}px`}>
								<Typography display='block' variant='h6'>
									{`@/..{translate('administrador')}:`}
									<Checkbox
										display='block'
										onChange={() => setAdministradorSocio(!administradorSocio)}
										checked={administradorSocio}
										value={administradorSocio}
									/>
								</Typography>
							</Box>
						</Box>
					</Modal>
					<Box display='flex' justifyContent='flex-end'>
						{!disableEdit && (
							<Button
								text={translate('adicionar')}
								backgroundColor={theme.palette.primary.main}
								onClick={() => setFlagAddSocioModal(true)}
							/>
						)}
					</Box>
					<Box display='flex' flexDirection='row' width='100%'>
						<Table small>
							<TableHead columns={COLUMNS_DADOS_SOCIOS} />
							<TableBody>
								{sociosList.value &&
									sociosList.value.length > 0 &&
									sociosList.value.map((socio, index) => {
										variantTableRow =
											variantTableRow === theme.palette.table.tableRowPrimary
												? theme.palette.table.tableRowSecondary
												: theme.palette.table.tableRowPrimary;

										return (
											<TableRow key={index} backgroundColor={variantTableRow}>
												<TableCell label={socio.Nome} />
												<TableCell label={cpfCnpjMask(socio.Codigo.replace(/[^\d]+/g, ''))} />
												<TableCell label={moedaMask(socio.ValorParticipacao)} />
												<TableCell label={percent(socio.Percentual)} />
												<TableCell label={socio.Administrador ? 'Sim' : 'Não'} />
												<TableCell
													title={translate('editar')}
													label={
														<IconButton
															size='small'
															onClick={() => editSocioList(index)}
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
															disabled={socioPossuiGrupo(socio.Codigo) || disableEdit}
															size='small'
															onClick={() => setIndexExcluirSocio(index)}
														>
															<Delete />
														</IconButton>
													}
												/>
											</TableRow>
										);
									})}
								{sociosList.value &&
								sociosList.value.length === 0 && (
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
