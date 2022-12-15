import React, { useEffect, Fragment } from 'react';
import { FormInput, Card } from '@/components';
import { Box, CardContent, CardHeader } from '@material-ui/core';
import { translate } from '@/locales';
import { checkError } from '@/utils/validation';
import { moedaMask, moeda } from '@/utils/mascaras';
import theme from '@/theme';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';

export default function CadastroSocios({
	formulario,
	setCapitalSocialTotalPronto,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	historicoEmpresa,
	user,
	disableEdit,
	statusEmpresa
}) {
	const { getFieldProps, setFieldValue, submitCount, setFieldTouched } = formulario;

	const [
		capitalSocialTotal,
		metadataCapitalSocialTotal
	] = getFieldProps('capitalSocialTotal', 'number');

	const [
		dataRegistro,
		metadataDataRegistro
	] = getFieldProps('dataRegistro', 'date');

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Card>
				<CardHeader
					title={translate('dadosContratoSocial')}
					action={
						<Aprovacao
							itensAnalise={itensAnalise}
							setItensAnalise={setItensAnalise}
							comentarios={comentarios}
							setComentarios={setComentarios}
							tipoItem={
								ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Dados_Contrato_Social').value
							}
							historicoEmpresa={historicoEmpresa}
							user={user}
							disableEdit={disableEdit}
							statusEmpresa={statusEmpresa}
						/>
					}
				/>
				<CardContent>
					<Box display='flex' flexDirection='row'>
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
							<FormInput
								label={`${translate('capitalSocialTotal')}:`}
								value={moedaMask(capitalSocialTotal.value)}
								onChange={event => {
									//será o onblur
									setCapitalSocialTotalPronto(capitalSocialTotal.value);

									setFieldValue(
										'capitalSocialTotal',
										event.target.value !== '' ? moeda(event.target.value) : ''
									);
								}}
								onFocus={() => setFieldTouched('capitalSocialTotal', true)}
								error={checkError(submitCount, metadataCapitalSocialTotal)}
								required
								disabled={disableEdit}
							/>
						</Box>
						<Box width='50%' paddingRight={`@/..{theme.spacing(1)}px`}>
							<FormInput
								type='date'
								label={`${translate('dataRegistro')}:`}
								value={dataRegistro.value}
								onChange={event => setFieldValue('dataRegistro', event.target.value)}
								onFocus={() => setFieldTouched('dataRegistro', true)}
								error={checkError(submitCount, metadataDataRegistro)}
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
