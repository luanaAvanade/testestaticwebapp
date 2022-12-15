import React, { useState, useEffect } from 'react';
import {
	Box,
	Table,
	TableBody,
	IconButton,
	Checkbox,
	InputAdornment,
	ExpansionPanel,
	ExpansionPanelSummary,
	Typography,
	ExpansionPanelDetails,
	FormControlLabel,
	Radio,
	RadioGroup
} from '@material-ui/core';
import _ from 'lodash';
import { Search, ExpandMore } from '@material-ui/icons';
import { TableHead, TableRow, TableCell, FormSelect, FormInput } from '@/components';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { translate } from '@/locales';
import theme from '@/theme';
import { stableSort, getSorting } from '@/utils/list';
import ObjectHelper from '@/utils/objectHelper';
import { COLUMNS_GRUPO_FORNECIMENTO, COLUMNS_SKU } from './tableHead';
import {
	SELECT_TIPO,
	MATERIAL,
	SERVICO,
	SELECT_GRUPOS,
	GRUPO_CATEGORIA,
	CATEGORIA,
	SKU,
	FABRICANTE,
	DISTRIBUIDOR
} from '@/utils/constants';
import CategoriaService from '@/services/categoria';
import GrupoCategoriaService from '@/services/grupoCategoria';
import SkuService from '@/services/sku';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { Modal } from '@/screens/fornecedor/style';

export default function ModalGrupoFornecimento({ openModal, setOpenModal, formulario }) {
	const dispatch = useDispatch();
	const { setFieldValue, getFieldProps, values, setFieldTouched } = formulario;

	// Estados locais

	const [
		grupoCategoriaList,
		setGrupoCategoriaList
	] = useState([]);

	const [
		textoBusca,
		setTextoBusca
	] = useState('');

	const [
		tipoMaterial,
		setTipoMaterial
	] = useState(0);

	const [
		tipoBusca,
		setTipoBusca
	] = useState(0);

	const [
		tipoFornecimento,
		setTipoFornecimento
	] = useState('Fabricante');

	const [
		expanded,
		setExpanded
	] = useState(0);

	const [
		skuList,
		setSkuList
	] = useState([]);

	// Efeito Inicial

	useEffect(() => {
		limpar();
		return () => {
			limpar();
		};
	}, []);

	// Efeitos

	useEffect(
		() => {
			if (grupoCategoriaList.length > 0) {
				buscaPorFiltro();
			}
		},
		[
			tipoFornecimento
		]
	);

	// Ações da Tela

	const handleChangeSelect = value => {
		setTipoMaterial(value || 0);
		setTipoBusca(0);
		setTextoBusca('');
		setGrupoCategoriaList([]);
	};

	const handleChangeCheck = e => {
		e.stopPropagation();
		const { value } = e.target;
		const list = ObjectHelper.clone(grupoCategoriaList);
		list.forEach(gc => {
			if (gc.GrupoCategoria.Id.toString() === value) {
				gc.GrupoCategoria.isChecked = !gc.GrupoCategoria.isChecked;
			}
		});
		setGrupoCategoriaList(list);
	};

	const adicionarGrupo = () => {
		setFieldValue(
			'grupoFornecimentoList',
			values.grupoFornecimentoList.concat(
				_.filter(grupoCategoriaList, gc => gc.GrupoCategoria.isChecked)
			)
		);
		setFieldTouched('grupoFornecimentoList', true);
		setOpenModal(false);
		limpar();
	};

	const buscaSkuPorGrupoCategoria = async grupoCategoriaId => {
		dispatch(LoaderCreators.setLoading());
		const response = await SkuService.findByGrupoCategoriaFilter(grupoCategoriaId, textoBusca);
		if (response.data) {
			setSkuList(response.data.Sku_list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const getTipo = (value, field) => {
		return value === MATERIAL[field] ? MATERIAL : SERVICO;
	};

	const getTipoFornecimento = (value, field) => {
		return value === FABRICANTE[field] ? FABRICANTE.id : DISTRIBUIDOR.id;
	};

	const buscaPorFiltro = () => {
		limparListas();
		if (tipoBusca === GRUPO_CATEGORIA.codigo) {
			buscaGrupoCategoriaPorFiltro();
		}
		if (tipoBusca === CATEGORIA.codigo) {
			buscaCategoriaPorFiltro();
		}
		if (tipoBusca === SKU.codigo) {
			buscaGrupoCategoriaPorFiltroSKU();
		}
	};

	const getGrupoCategoriaFormatado = (
		Id,
		Codigo,
		Nome,
		CodigoCategoria,
		DescricaoCategoria,
		Tipo,
		TipoFornecimento
	) => {
		return {
			Id,
			Codigo,
			Nome,
			Categoria: { Codigo: CodigoCategoria, Descricao: DescricaoCategoria, Tipo: Tipo },
			TipoFornecimento
		};
	};

	const removeExistente = list => {
		values.grupoFornecimentoList.forEach(grupoFornecimento => {
			const index = list.findIndex(
				item =>
					item.GrupoCategoria.Id === grupoFornecimento.GrupoCategoria.Id &&
					grupoFornecimento.TipoFornecimento === getTipoFornecimento(tipoFornecimento, 'nome')
			);
			if (index !== -1) {
				list.splice(index, 1);
			}
		});
		setGrupoCategoriaList(list);
	};

	const buscaCategoriaPorFiltro = async () => {
		const tipoId = getTipo(tipoMaterial, 'codigo').id;
		dispatch(LoaderCreators.setLoading());
		const response = await CategoriaService.findByFilterTipo(textoBusca, tipoId);
		if (response.data) {
			const list = [];
			response.data.Categoria_list.forEach(categoria => {
				categoria.Grupos.forEach(grupo => {
					list.push({
						GrupoCategoria: getGrupoCategoriaFormatado(
							grupo.Id,
							grupo.Codigo,
							grupo.Nome,
							categoria.Codigo,
							categoria.Descricao,
							tipoId
						),
						isChecked: false,
						TipoFornecimento: getTipoFornecimento(tipoFornecimento, 'nome')
					});
				});
			});
			removeExistente(list);
			setGrupoCategoriaList(list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const buscaGrupoCategoriaPorFiltro = async () => {
		const tipoId = getTipo(tipoMaterial, 'codigo').id;
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoCategoriaService.findByFilterTipo(textoBusca, tipoId);
		console.log('BUSCA buscaGrupoCategoriaPorFiltro');
		if (response.data) {
			const list = [];
			response.data.GrupoCategoria_list.forEach(grupo => {
				list.push({
					GrupoCategoria: getGrupoCategoriaFormatado(
						grupo.Id,
						grupo.Codigo,
						grupo.Nome,
						grupo.Categoria.Codigo,
						grupo.Categoria.Descricao,
						tipoId
					),
					TipoFornecimento: getTipoFornecimento(tipoFornecimento, 'nome')
				});
			});
			removeExistente(list);

			setGrupoCategoriaList(list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const buscaGrupoCategoriaPorFiltroSKU = async () => {
		const tipoId = getTipo(tipoMaterial, 'codigo').id;
		dispatch(LoaderCreators.setLoading());
		const response = await GrupoCategoriaService.findByFilterTipoSKU(textoBusca, tipoId);
		if (response.data) {
			const list = [];
			response.data.GrupoCategoria_list.forEach(grupo => {
				list.push({
					GrupoCategoria: getGrupoCategoriaFormatado(
						grupo.Id,
						grupo.Codigo,
						grupo.Nome,
						grupo.Categoria.Codigo,
						grupo.Categoria.Descricao,
						tipoId
					),
					TipoFornecimento: getTipoFornecimento(tipoFornecimento, 'nome')
				});
			});
			removeExistente(list);

			setGrupoCategoriaList(list);
			dispatch(LoaderCreators.disableLoading());
		} else {
			dispatch(LoaderCreators.disableLoading());
		}
	};

	const closeModal = () => {
		limpar();
		setOpenModal(false);
	};

	// Ação de Retorno

	const limpar = () => {
		setTextoBusca('');
		setTipoBusca(0);
		setTipoMaterial(0);
		limparListas();
	};

	const limparListas = () => {
		setGrupoCategoriaList([]);
		setSkuList([]);
		setExpanded(0);
	};

	// Interação com a Collapse
	const getExpaned = Codigo => {
		return expanded === Codigo;
	};

	const setExpandedValue = async Codigo => {
		let newValue = 0;
		if (!getExpaned(Codigo)) {
			newValue = Codigo;
			await buscaSkuPorGrupoCategoria(Codigo);
		}
		setExpanded(newValue);
	};

	let variantTableRow = theme.palette.table.tableRowPrimary;

	return (
		<Modal
			open={openModal}
			handleClose={closeModal}
			exibirBotao={_.filter(grupoCategoriaList, gc => gc.GrupoCategoria.isChecked).length > 0}
			title='Adicionar Grupos de Fornecimento'
			onClickButton={adicionarGrupo}
			textButton='Adicionar'
			maxWidth='md'
			fullWidth
			componentSubtitle={
				<Box>
					<Box display='flex' flexDirection='row'>
						<Box width='15%' paddingRight={`${theme.spacing(1)}px`}>
							<FormSelect
								label='Tipo:'
								labelInitialItem={translate('selecioneOpcao')}
								items={SELECT_TIPO}
								value={tipoMaterial}
								onChange={event => handleChangeSelect(event.target.value)}
							/>
						</Box>

						<Box width='20%' paddingRight={`${theme.spacing(1)}px`}>
							<FormSelect
								disabled={!tipoMaterial}
								label='Pesquisar por:'
								labelInitialItem={translate('selecioneOpcao')}
								items={SELECT_GRUPOS}
								value={tipoBusca}
								onChange={event => setTipoBusca(event.target.value)}
							/>
						</Box>
						<Box width='70%'>
							<FormInput
								disabled={!tipoBusca || !tipoMaterial}
								label='Digite parte do código ou descrição:'
								value={textoBusca}
								onChange={event => setTextoBusca(event.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={() => buscaPorFiltro()}>
												<Search />
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Box>
					</Box>

					{tipoMaterial === MATERIAL.codigo && (
						<Box display='flex' flexDirection='row'>
							<RadioGroup
								value={tipoFornecimento}
								onChange={event => setTipoFornecimento(event.target.value)}
								row
							>
								<FormControlLabel
									value='Fabricante'
									control={<Radio color='primary' />}
									label={`${translate('fabricante')}`}
									labelPlacement='end'
								/>
								<FormControlLabel
									value='Distribuidor'
									control={<Radio color='primary' />}
									label={`${translate('distribuidor')}`}
									labelPlacement='end'
								/>
							</RadioGroup>
						</Box>
					)}
				</Box>
			}
		>
			{grupoCategoriaList.length > 0 && (
				<Box
					display='flex'
					flexDirection='row'
					padding='12px'
					style={{
						display: 'flex',
						minHeight: 48,
						backgroundColor: theme.palette.table.tableHead,
						border: `1px solid ${theme.palette.border}`,
						boxShadow:
							'0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
						transition:
							'min-height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
					}}
				>
					<Box width='7%' />
					<Box width='41%'>
						<Typography variant='h6'>Grupo de categoria</Typography>
					</Box>
					<Box width='42%'>
						<Typography variant='h6'>Categoria</Typography>
					</Box>
				</Box>
			)}
			{grupoCategoriaList.map((gc, index) => {
				return (
					<ExpansionPanel
						key={index}
						expanded={getExpaned(gc.GrupoCategoria.Codigo)}
						onChange={() => setExpandedValue(gc.GrupoCategoria.Codigo)}
					>
						<ExpansionPanelSummary expandIcon={<ExpandMore />}>
							<Box width='5%'>
								<Checkbox
									style={{ padding: 0 }}
									key={index}
									onClick={event => handleChangeCheck(event)}
									checked={gc.GrupoCategoria.isChecked}
									value={gc.GrupoCategoria.Id}
								/>
							</Box>
							<Box width='45%'>
								<Typography variant='h6'>
									<div
										title={`${gc.GrupoCategoria.Codigo}-${gc.GrupoCategoria.Nome}`}
										style={{
											width: 350,
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}
									>
										{gc.GrupoCategoria.Codigo} - {gc.GrupoCategoria.Nome}
									</div>
								</Typography>
							</Box>
							<Box width='40%'>
								<Typography variant='h6'>
									<div
										title={
											gc.GrupoCategoria.Categoria.Codigo +
											'-' +
											gc.GrupoCategoria.Categoria.Descricao
										}
										style={{
											width: 350,
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}
									>
										{gc.GrupoCategoria.Categoria.Codigo} - {gc.GrupoCategoria.Categoria.Descricao}
									</div>
								</Typography>
							</Box>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Box style={{ width: '100%' }}>
								<Typography variant='h6'>Sku's:</Typography>
								<Table>
									<TableHead columns={COLUMNS_SKU} rowCount={COLUMNS_SKU.length} />
									<TableBody>
										{skuList &&
											skuList.length > 0 &&
											skuList.map((sku, indexSku) => {
												variantTableRow =
													variantTableRow === theme.palette.table.tableRowPrimary
														? theme.palette.table.tableRowSecondary
														: theme.palette.table.tableRowPrimary;
												return (
													<TableRow key={indexSku}>
														<TableCell title={sku.Codigo} label={sku.Codigo} />
														<TableCell title={sku.Descricao} label={sku.Descricao} />
													</TableRow>
												);
											})}
										{skuList.length === 0 && (
											<TableRow backgroundColor={variantTableRow}>
												<TableCell
													align='center'
													colSpan={2}
													label={translate('semResultadosAExibir')}
												/>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</Box>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				);
			})}
		</Modal>
	);
}
