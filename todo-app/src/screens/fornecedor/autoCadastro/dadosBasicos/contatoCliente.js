import React from 'react';
import { FormInput, Card } from '@/components';
import { Box, CardContent, CardHeader } from '@material-ui/core';
import { translate } from '@/locales';
import { checkError } from '@/utils/validation';
import theme from '@/theme';
import { ENUM_ITEMS_ANALISE } from '@/utils/constants';
import Aprovacao from '@/screens/fornecedor/autoCadastro/aprovacao';

export default function ContatoCliente({
	formulario,
	itensAnalise,
	setItensAnalise,
	comentarios,
	setComentarios,
	preCadastro,
	historicoEmpresa,
	user,
	disableEdit,
	setChanged,
	statusEmpresa
}) {
	const { submitCount, getFieldProps, setFieldValue } = formulario;

	const [
		nomeContato,
		metadataNomeContato
	] = getFieldProps('nomeContato', 'text');

	const [
		emailContato,
		metadataEmailContato
	] = getFieldProps('emailContato', 'text');

	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			<Card>
				<CardHeader
					title={translate('contatoCliente')}
					action={
						!preCadastro && (
							<Aprovacao
								itensAnalise={itensAnalise}
								setItensAnalise={setItensAnalise}
								comentarios={comentarios}
								setComentarios={setComentarios}
								tipoItem={ENUM_ITEMS_ANALISE.find(x => x.internalName === 'Contato_Cliente').value}
								historicoEmpresa={historicoEmpresa}
								user={user}
								disableEdit={disableEdit}
								statusEmpresa={statusEmpresa}
							/>
						)
					}
				/>
				<CardContent>
					<Box display='flex' flexDirection='row'>
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
							<FormInput
								label={`${translate('nomeContato')}:`}
								name={nomeContato}
								error={checkError(submitCount, metadataNomeContato)}
								disabled={disableEdit}
								required
							/>
						</Box>
						<Box width='50%' paddingRight={`${theme.spacing(1)}px`}>
							<FormInput
								label={`${translate('emailContato')}:`}
								name={emailContato}
								error={checkError(submitCount, metadataEmailContato)}
								disabled={disableEdit}
								required
							/>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
