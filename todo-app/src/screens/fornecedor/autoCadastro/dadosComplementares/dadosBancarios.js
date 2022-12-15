import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Box } from '@material-ui/core';
import { FormInput, FormSelectWithSearch } from '@/components';
import { translate } from '@/locales';
import theme from '@/theme';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { useDispatch } from 'react-redux';
import BancoService from '@/services/banco';
import _ from 'lodash';
import { checkError } from '@/utils/validation';
import { soNumero } from '@/utils/mascaras';
import { ENUM_ITEMS_ANALISE, TAB_DADOS_COMPLEMENTAR } from '@/utils/constants';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function DadosBancarios({
	formulario,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	historicoEmpresa,
	user,
	disableEdit,
	statusEmpresa,
	tab
}) {
	const dispatch = useDispatch();

	// Formulario

	const { submitCount, getFieldProps, setFieldValue, setFieldTouched } = formulario;

	const [
		banco,
		metaDataBanco
	] = getFieldProps('banco', 'text');

	const [
		agencia,
		metaDataAgencia
	] = getFieldProps('agencia', 'text');

	const [
		digitoAgencia,
		metaDataDigitoAgencia
	] = getFieldProps('digitoAgencia', 'text');

	const [
		conta,
		metaDataConta
	] = getFieldProps('conta', 'text');

	const [
		digitoConta,
		metaDataDigitoConta
	] = getFieldProps('digitoConta', 'text');

	const [
		bancoList,
		setBancoList
	] = useState([]);

	// Efeito Inicial

	useEffect(
		() => {
			if (tab === TAB_DADOS_COMPLEMENTAR) {
				//bancoFindAll();
			} else {
				setBancoList([]);
			}
		},
		[
			tab
		]
	);

	// Buscar Dados

	const bancoFindAll = async () => {
		dispatch(LoaderCreators.setLoading());
		const response = await BancoService.findAll();
		if (response.data) {
			setBancoList(response.data.Banco_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};
	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			<Card style={{ marginTop: 8 }}>
				<CardHeader
					title='Dados Bancários'
					action={
						<Aprovacao
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							tipoItem={ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Dados_Bancarios').value}
							historicoEmpresa={historicoEmpresa}
							user={user}
							disableEdit={disableEdit}
							statusEmpresa={statusEmpresa}
						/>
					}
				/>
				<CardContent>
					<p>
						O CNPJ da conta indicada deverá ser o mesmo indicado nos Dados Gerais do cadastro. Caso
						a conta da Matriz seja também da Filial, a empresa deverá anexar a este cadastro o
						documento Carta de Direcionamento de Pagamento conforme modelo disponibilizado neste
						link.{' '}
					</p>

					<Box display='flex' flexDirection='row'>
						<Box width='30%' paddingRight='8px'>
							{bancoList.length > 0 && (
								<FormSelectWithSearch
									placeholder={translate('selecioneBanco')}
									label={`${translate('banco')}:`}
									options={bancoList}
									getOptionLabel={option => option.codigo + ' - ' + option.label}
									value={_.find(bancoList, b => b.value === banco.value)}
									onChange={(event, bancoSelected) =>
										setFieldValue('banco', bancoSelected ? bancoSelected.value : null)}
									onFocus={() => setFieldTouched('banco', true)}
									error={checkError(submitCount, metaDataBanco)}
									required
									disabled={disableEdit}
								/>
							)}
						</Box>
						<Box width='20%' paddingRight='8px'>
							<FormInput
								label='Agência:'
								value={agencia.value}
								onChange={event => setFieldValue('agencia', soNumero(event.target.value))}
								onFocus={() => setFieldTouched('agencia', true)}
								error={checkError(submitCount, metaDataAgencia)}
								required
								disabled={disableEdit}
							/>
						</Box>
						<Box width='15%' paddingRight='8px'>
							<FormInput
								label='Digito Agência:'
								value={digitoAgencia.value}
								onChange={event => setFieldValue('digitoAgencia', soNumero(event.target.value))}
								onFocus={() => setFieldTouched('digitoAgencia', true)}
								error={checkError(submitCount, metaDataDigitoAgencia)}
								disabled={disableEdit}
							/>
						</Box>
						<Box width='20%' paddingRight='8px'>
							<FormInput
								label='Conta:'
								value={conta.value}
								onChange={event => setFieldValue('conta', soNumero(event.target.value))}
								onFocus={() => setFieldTouched('conta', true)}
								error={checkError(submitCount, metaDataConta)}
								required
								disabled={disableEdit}
							/>
						</Box>

						<Box width='15%'>
							<FormInput
								label='Digito Conta:'
								value={digitoConta.value}
								onChange={event => setFieldValue('digitoConta', soNumero(event.target.value))}
								onFocus={() => setFieldTouched('digitoConta', true)}
								error={checkError(submitCount, metaDataDigitoConta)}
								required
								disabled={disableEdit}
							/>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
