import React, { Fragment, useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell } from '@/components';
import {
	Box,
	TableBody,
	IconButton,
	Icon,
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField,
	InputBase,
	Typography
} from '@material-ui/core';
import theme from '@/theme';
import { translate } from '@/locales';
import { stableSort, getSorting } from '@/utils/list';
import {
	ArrowDropDown,
	ArrowLeft,
	ArrowRight,
	ArrowDropUp,
	FiberManualRecord,
	CheckBoxOutlineBlank,
	OfflinePin,
	Check
} from '@material-ui/icons';
import { APROVAR, APROVAR_COM_RESSALVAS, REPROVAR } from '@/utils/constants';
import CalculoRiscoService from '@/services/CalculoRisco';
import {
	LabelFinalAprovar,
	LabelFinalAprovarComRessalvas,
	LabelFinalSemDados,
	LabelFinalReprovar
} from './style';
import ObjectHelper from '@/utils/objectHelper';

export default function ResultadoFinal({
	empresa,
	listaGrupoFornecimento,
	indicadoresForaRefMercado,
	tabFilha
}) {
	const [
		qualificacaoEmpresa,
		setQualificacaoEmpresa
	] = useState([]);

	const [
		classificacao,
		setClassificacao
	] = useState();

	const [
		sugestao,
		setSugestao
	] = useState();

	const [
		listIdGrupos,
		setListIdGrupos
	] = useState([]);

	const [
		grupos,
		setGrupos
	] = useState([]);

	const [
		indicadoresForaRefMercadoRefCemig,
		setIndicadoresForaRefMercadoRefCemig
	] = useState([]);

	useEffect(
		() => {
			if (tabFilha === 3 && indicadoresForaRefMercado.length > 0) {
				setListIdGrupos([]);
				setGrupos([]);

				listaGrupoFornecimento.forEach(g => {
					var obj = { id: g.GrupoCategoria.Id, nome: g.GrupoCategoria.Nome, array: [] };

					g.GrupoCategoria.GruposFornecimento.forEach(gf => {
						obj.array.push(gf.Empresa.Id);
					});

					listIdGrupos.push(obj);
				});
				gerarMaxMin(listIdGrupos);
			}
		},
		[
			tabFilha,
			indicadoresForaRefMercado
		]
	);

	const gerarMaxMin = async list => {
		const gruposLista = ObjectHelper.clone(list);

		for (let index = 0; index < gruposLista.length; index++) {
			if (gruposLista[index].array && gruposLista[index].array.length > 0) {
				const listMaxMinResponse = await CalculoRiscoService.findMaxMinByListId(
					gruposLista[index].array
				);
				gruposLista[index].maxMin = listMaxMinResponse.data.CalculoRisco_aggregate;
				montarIndicadoresForaRefEMundoCemig(listMaxMinResponse.data.CalculoRisco_aggregate);
				gruposLista[index].sugestao = avaliaSugestao(empresa.CalculoRiscoLista);
			}
		}
		setGrupos(gruposLista);
	};

	const montarIndicadoresForaRefEMundoCemig = listMaxMinResponse => {
		const maxMinLastYear = listMaxMinResponse[0].Value;

		const listaFiltradaMundoCEMIG = indicadoresForaRefMercado.filter(a => {
			if (maxMinLastYear['Min_' + a.campo]) {
				if (
					a.valor >= maxMinLastYear['Min_' + a.campo] &&
					a.valor <= maxMinLastYear['Max_' + a.campo]
				) {
					return a;
				}
			}
		});

		setIndicadoresForaRefMercadoRefCemig(listaFiltradaMundoCEMIG);
	};

	const avaliaSugestao = qualificacaoEmpresa => {
		if (qualificacaoEmpresa[0].ClassificacaoFase1 <= 1) {
			if (
				qualificacaoEmpresa[1].ClassificacaoFase1 <= 1 &&
				qualificacaoEmpresa[2].ClassificacaoFase1 <= 1
			) {
				return APROVAR;
			}
			if (
				qualificacaoEmpresa[1].ClassificacaoFase1 > 1 ||
				qualificacaoEmpresa[2].ClassificacaoFase1 > 1
			) {
				if (algumIndForaRef()) {
					if (algumIndForaFaixaBaseAtual()) {
						return REPROVAR;
					} else {
						return APROVAR_COM_RESSALVAS;
					}
				} else {
					return APROVAR_COM_RESSALVAS;
				}
			}
		}
		if (qualificacaoEmpresa[0].ClassificacaoFase1 == 2) {
			if (algumIndForaRef()) {
				if (algumIndForaFaixaBaseAtual()) {
					return REPROVAR;
				} else {
					return APROVAR_COM_RESSALVAS;
				}
			} else {
				return APROVAR_COM_RESSALVAS;
			}
		}
		if (qualificacaoEmpresa[0].ClassificacaoFase1 == 3) {
			if (algumIndForaRef()) {
				if (algumIndForaFaixaBaseAtual()) {
					return REPROVAR;
				} else {
					return APROVAR_COM_RESSALVAS;
				}
			} else {
				return APROVAR_COM_RESSALVAS;
			}
		}
	};

	const algumIndForaRef = () => {
		if (indicadoresForaRefMercado.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	const algumIndForaFaixaBaseAtual = () => {
		if (indicadoresForaRefMercadoRefCemig.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	const addLabelSugestao = value => {
		if (value === APROVAR) {
			return <LabelFinalAprovar> Aprovar </LabelFinalAprovar>;
		} else if (value === APROVAR_COM_RESSALVAS) {
			return <LabelFinalAprovarComRessalvas> Aprovar Com Ressalvas </LabelFinalAprovarComRessalvas>;
		} else if (value === REPROVAR) {
			return <LabelFinalReprovar> Reprovar </LabelFinalReprovar>;
		} else {
			return <LabelFinalSemDados> Sem dados </LabelFinalSemDados>;
		}
	};

	const COLUMNS_QUALIFICACAO_GRUPO = [
		{ id: 'Grupo', label: 'Grupo', width: '80%' },
		{ id: 'Resultado', label: 'Resultado', width: '20%' }
	];

	return (
		<Box paddingTop={`${theme.spacing(1)}px`}>
			<Card style={{ marginTop: 8 }}>
				<CardContent>
					<Box display='flex' flexDirection='row'>
						<Box width='100%' paddingRight={`${theme.spacing(1)}px`}>
							<Card>
								<CardContent>
									<Table>
										<TableHead columns={COLUMNS_QUALIFICACAO_GRUPO} />
										{grupos.length > 0 && (
											<TableBody>
												{grupos.map((gp, index) => {
													return (
														<TableRow key={index}>
															<TableCell label={gp.nome} />
															<TableCell
																label={addLabelSugestao(gp.sugestao)}
																style={{ display: 'contents' }}
															/>
														</TableRow>
													);
												})}
											</TableBody>
										)}
									</Table>
								</CardContent>
							</Card>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
