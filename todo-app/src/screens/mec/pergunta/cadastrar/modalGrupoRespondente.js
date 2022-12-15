import React, { useEffect, Fragment, useState } from 'react';
import { Table, TableBody, Checkbox } from '@material-ui/core';
import _ from 'lodash';
import { TableHead, TableRow, TableCell, Modal, FormSelect } from 'react-axxiom';
import { translate } from '@/locales';
import theme from '@/theme';
import ObjectHelper from '@/utils/objectHelper';
import { SELECT_TIPO_CATEGORIA } from '@/utils/constants';
import { BoxValidation, Helper } from './styles';

export default function ModalGrupoRespondente({
	naoPertencentes,
	setNaoPertencentes,
	pertencentes,
	setPertencentes,
	openModal,
	setOpenModal
}) {
	const [
		submitCount,
		setSubmitCount
	] = useState(0);

	useEffect(() => {
		return () => {
			setSubmitCount(0);
		};
	}, []);

	// Ações da Tela

	const handleChangeSelect = (index, value) => {
		const list = ObjectHelper.clone(naoPertencentes);
		list.forEach((grupoRespondente, indexGrupoRespondente) => {
			if (index === indexGrupoRespondente) {
				grupoRespondente.Tipo = value;
			}
		});
		setNaoPertencentes(list);
	};

	const handleChangeCheck = e => {
		e.stopPropagation();
		const { value } = e.target;
		const list = ObjectHelper.clone(naoPertencentes);
		list.forEach(grupoRespondente => {
			if (grupoRespondente.Id.toString() === value) {
				grupoRespondente.isChecked = !grupoRespondente.isChecked;
			}
		});
		setNaoPertencentes(list);
	};

	const isValidList = () => {
		return (
			naoPertencentes.length > 0 &&
			_.filter(naoPertencentes, grupoRespondente => grupoRespondente.isChecked).length > 0
		);
	};

	const isValid = () => {
		return (
			naoPertencentes.length > 0 &&
			_.filter(
				naoPertencentes,
				grupoRespondente => grupoRespondente.isChecked && grupoRespondente.Tipo !== 0
			).length > 0
		);
	};

	const isValidItem = index => {
		if (naoPertencentes.length > 0 && naoPertencentes[index].isChecked) {
			return naoPertencentes[index].Tipo !== 0;
		}
		return true;
	};

	const getErrorList = () => {
		return submitCount > 0 && !isValidList()
			? 'Você deve escolher algum grupo de respondente'
			: false;
	};

	const getErrorItem = index => {
		return submitCount > 0 && !isValidItem(index) ? 'Escolha o Tipo de Categoria' : false;
	};

	const adicionarGrupo = () => {
		if (naoPertencentes.length === 0) {
			setOpenModal(false);
		} else {
			setSubmitCount(submitCount + 1);
			if (isValid()) {
				setPertencentes(
					pertencentes.concat(
						_.filter(naoPertencentes, grupoRespondente => grupoRespondente.isChecked)
					)
				);
				setOpenModal(false);
			}
		}
	};

	const closeModal = () => {
		setOpenModal(false);
	};

	// Interação com a Collapse

	let variantTableRow = theme.palette.table.tableRowPrimary;

	const COLUMNS_GRUPO = [
		{ id: 'checkBox', label: '', width: '10%' },
		{ id: 'nome', label: 'Nome', width: '40%' },
		{
			id: 'tipo',
			label: 'Tipo de Categoria',
			width: '40%'
		}
	];

	return (
		<Modal
			open={openModal}
			handleClose={closeModal}
			title='Adicionar Grupos de Respondentes'
			onClickButton={adicionarGrupo}
			textButton='Adicionar'
			fullWidth
			componentSubtitle={
				<Fragment>
					<BoxValidation bordercolor={getErrorList() ? 'red' : null}>
						<Table>
							<TableHead columns={COLUMNS_GRUPO} rowCount={COLUMNS_GRUPO.length} />
							<TableBody>
								{naoPertencentes.map((grupoRespondente, index) => {
									variantTableRow =
										variantTableRow === theme.palette.table.tableRowPrimary
											? theme.palette.table.tableRowSecondary
											: theme.palette.table.tableRowPrimary;
									return (
										<TableRow key={index}>
											<TableCell
												label={
													<Checkbox
														style={{ padding: 0 }}
														key={index}
														onClick={event => handleChangeCheck(event)}
														checked={grupoRespondente.isChecked}
														value={grupoRespondente.Id}
													/>
												}
											/>
											<TableCell label={grupoRespondente.Nome} />
											<TableCell
												label={
													<FormSelect
														labelInitialItem={translate('selecioneOpcao')}
														items={SELECT_TIPO_CATEGORIA}
														value={grupoRespondente.Tipo}
														onChange={event => handleChangeSelect(index, event.target.value)}
														error={getErrorItem(index)}
													/>
												}
											/>
										</TableRow>
									);
								})}
								{naoPertencentes.length === 0 && (
									<TableRow backgroundColor={variantTableRow}>
										<TableCell
											align='center'
											colSpan={3}
											label={translate('semResultadosAExibir')}
										/>
									</TableRow>
								)}
							</TableBody>
						</Table>
						{getErrorList() && <Helper helpercolor='red'>{getErrorList()}</Helper>}
					</BoxValidation>
				</Fragment>
			}
		/>
	);
}
