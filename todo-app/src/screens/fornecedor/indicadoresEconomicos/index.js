import React, { Fragment, useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell } from '@/components';
import { Box, TableBody, IconButton, Icon } from '@material-ui/core';
import theme from '@/theme';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import {
	ArrowDropDown,
	ArrowLeft,
	ArrowRight,
	ArrowDropUp,
	FiberManualRecord
} from '@material-ui/icons';
import { CabecalhoHorizontal } from './style';
import { HORIZONTAL_COLUMNS_QUALIFICACAO } from '@/utils/constants';
import NumberFormat from 'react-number-format';

export default function IndicadoresEconomicos({
	empresa,
	qualificacaoLista,
	maxMin,
	montarCabecalho,
	inserirIcone
}) {
	const [
		qualificacaoEmpresa,
		setQualificacaoEmpresa
	] = useState([]);

	const [
		listaMaxMin,
		setListaMaxMin
	] = useState([]);

	useEffect(
		() => {
			if (qualificacaoLista.find(qlf => qlf.Id == empresa.Id)) {
				setQualificacaoEmpresa(
					qualificacaoLista.find(qlf => qlf.Id == empresa.Id).CalculoRiscoLista
				);
			}
		},
		[
			qualificacaoLista
		]
	);

	useEffect(
		() => {
			if (maxMin.length > 0) {
				setListaMaxMin(maxMin);
			}
		},
		[
			maxMin
		]
	);

	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			{qualificacaoLista && (
				<Table>
					<TableHead columns={montarCabecalho('Referência', 2)} />
					{HORIZONTAL_COLUMNS_QUALIFICACAO.map(cabecalhoColumn => {
						return (
							<TableRow>
								<TableCell
									label={
										<CabecalhoHorizontal
											paddingLeft={cabecalhoColumn.paddingLeft}
											negrito={cabecalhoColumn.negrito}
										>
											{cabecalhoColumn.label}
										</CabecalhoHorizontal>
									}
								/>
								{qualificacaoEmpresa.map((dados, index) => {
									if (dados['Risco' + cabecalhoColumn.codigo] != undefined) {
										return (
											<TableCell
												key={index}
												label={
													<Box display='flex' flexDirection='row'>
														<NumberFormat
															value={dados[cabecalhoColumn.codigo]}
															displayType='text'
															thousandSeparator='.'
															decimalSeparator=','
															decimalScale='2'
															fixedDecimalScale
														/>
														{inserirIcone(dados['Risco' + cabecalhoColumn.codigo])}
													</Box>
												}
											/>
										);
									}
								})}
								{listaMaxMin.map((dados, index) => {
									if (dados.Value['Min_' + cabecalhoColumn.codigo] != undefined) {
										return (
											<TableCell
												key={index}
												label={
													<Box display='flex' flexDirection='row' width='100px'>
														<NumberFormat
															value={dados.Value['Min_' + cabecalhoColumn.codigo]}
															displayType='text'
															thousandSeparator='.'
															decimalSeparator=','
															decimalScale='2'
															fixedDecimalScale
														/>
														{' --- '}
														<NumberFormat
															value={dados.Value['Max_' + cabecalhoColumn.codigo]}
															displayType='text'
															thousandSeparator='.'
															decimalSeparator=','
															decimalScale='2'
															fixedDecimalScale
														/>
													</Box>
												}
											/>
										);
									}
								})}
							</TableRow>
						);
					})}
				</Table>
			)}
		</Box>
	);
}
