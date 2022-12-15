import React, { Fragment, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell } from '@/components';
import { Box, TableBody, IconButton, Icon } from '@material-ui/core';
import theme from '@/theme';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import { RiscoBaixo, RiscoAlto, SemDados, RiscoMedioDireita, RiscoMedioEsquerda } from '../style';
import { yellow } from '@material-ui/core/colors';

export default function RiscoEstruturaFinanceira({
	qualificacaoLista,
	montarCabecalho,
	inserirIcone
}) {
	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			{qualificacaoLista && (
				<Table>
					<TableHead columns={montarCabecalho('Fornecedor')} />
					<TableBody>
						{qualificacaoLista.map((fornecedor, index) => {
							return (
								<TableRow key={index}>
									<TableCell label={fornecedor.NomeEmpresa} />
									{fornecedor.CalculoRiscoLista.map(a => {
										return <TableCell label={inserirIcone(a.ClassificacaoFase1)} />;
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
		</Box>
	);
}
