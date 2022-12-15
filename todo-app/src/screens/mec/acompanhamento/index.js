import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Table, TableHead, TableRow, TableCell, Modal } from 'react-axxiom';
import { TableBody, TablePagination, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import NumberFormat from 'react-number-format';
import { LayoutContent } from '@/layout';
import PerguntaService from '@/services/pergunta';
import { FORMULARIO } from '@/utils/constants';
import { translate } from '@/locales';
import theme from '@/theme';
import { stableSort, getSorting } from '@/utils/list';
import { ROWSPERPAGE } from '@/utils/constants';

export default function Acompanhamento() {
	// Estados locais

	const [
		acompanhamento,
		setAcompanhamento
	] = useState({ PerguntaList: [] });

	const [
		usuarios,
		setUsuarios
	] = useState([]);

	const [
		page,
		setPage
	] = useState(0);

	const [
		rowsPerPage,
		setRowsPerPage
	] = useState(5);

	const [
		order,
		setOrder
	] = useState('asc');

	const [
		orderBy,
		setOrderBy
	] = useState('Codigo');

	// Efeito Inicial

	useEffect(() => {
		buscarPerguntas();
		return () => {
			setAcompanhamento({});
		};
	}, []);

	const buscarPerguntas = () => {
		PerguntaService.acompanhamento(FORMULARIO.id).then(responsePergunta => {
			if (responsePergunta.data) {
				const perg = [];
				responsePergunta.data.Pergunta_list.forEach(pergunta => {
					let users = [];
					pergunta.PerguntaGrupoUsuario.forEach(perguntaGrupoUsuario => {
						users = users.concat(perguntaGrupoUsuario.GrupoUsuario.Usuarios);
					});

					users.forEach(u => {
						u.Categorias = responsePergunta.data.Categoria_count[0].Count;
					});

					perg.push({
						Id: pergunta.Id,
						Nome: pergunta.Nome,
						Usuarios: users,
						Codigo: pergunta.Codigo
					});
				});

				const agrup = [];
				responsePergunta.data.Resposta_count.forEach(resposta => {
					const resp = resposta.Group.split('-');
					agrup.push({
						PerguntaId: resp[0],
						Usuarios: [
							{ Id: resp[1], Respostas: resposta.Count }
						]
					});
				});

				perg.forEach(p => {
					const ags = _.filter(agrup, a => a.PerguntaId === p.Id.toString());

					let us = [];
					ags.forEach(ag => {
						us = us.concat(ag.Usuarios);
					});

					p.Usuarios.forEach(u1 => {
						us.forEach(u2 => {
							if (u1.Id.toString() === u2.Id) {
								u1.Completa = responsePergunta.data.Categoria_count[0].Count === u2.Respostas;
								u1.Respostas = u2.Respostas ? u2.Respostas : 0;
							}
						});
					});
				});

				setAcompanhamento({ PerguntaList: perg });
			}
		});
	};

	const getCountRespondidos = usuarioList => {
		const list = _.filter(usuarioList, usuario => usuario.Completa);
		return list.length > 0 ? list.length : 0;
	};

	const handleRequestSort = property => {
		const isDesc = orderBy === property && order === 'desc';
		const newOrder = isDesc ? 'asc' : 'desc';
		setOrder(newOrder);
		setOrderBy(property);
	};

	const columnsAcompanhamentos = [
		{ id: 'Codigo', label: translate('codigo'), width: '5%' },
		{ id: 'Label', label: translate('descricao'), width: '85%' },
		{ id: 'Acompanhamento', label: translate('acompanhamento'), width: '5%', colSpan: '2' },
		{ id: 'Usuario', label: translate('usuarios'), width: '5%' }
	];

	const columnsUsuarios = [
		{
			id: 'Nome',
			label: translate('nome'),
			width: '30%'
		},
		{ id: 'Email', label: translate('email'), align: 'center', width: '30%' },
		{
			id: 'GrupoUsuario',
			label: translate('grupo'),
			title: translate('grupoUsuario'),
			width: '10%'
		},
		{ id: 'Acompanhamento', label: translate('acompanhamento'), width: '15%', colSpan: '2' }
	];

	let variantTableRow = theme.palette.table.tableRowPrimary;

	const getPercentualRespondidoPorCategoria = usuario => {
		const percent = (usuario.Respostas ? usuario.Respostas : 0) / usuario.Categorias * 100;
		return percent || '0';
	};

	const getPercentualRespondidoPorUsuario = pergunta => {
		const percent = getCountRespondidos(pergunta.Usuarios) / pergunta.Usuarios.length * 100;
		return percent || '0';
	};

	return (
		<LayoutContent>
			<Modal
				open={usuarios.length > 0}
				handleClose={() => setUsuarios([])}
				onClickButton={() => setUsuarios([])}
				title={translate('usuarios')}
				textButton={translate('fechar')}
			>
				<Table small>
					<TableHead columns={columnsUsuarios} rowCount={columnsUsuarios.length} />
					<TableBody>
						{usuarios.map((usuario, index) => {
							variantTableRow = variantTableRow === 'primary' ? 'secondary' : 'primary';
							return (
								<TableRow key={index} variant={variantTableRow}>
									<TableCell label={usuario.Nome} />
									<TableCell label={usuario.Email} />
									<TableCell label={usuario.GrupoUsuario.Nome} />
									<TableCell
										label={`@/..{usuario.Respostas ? usuario.Respostas : 0}/@/..{usuario.Categorias}`}
									/>
									<TableCell
										title={getPercentualRespondidoPorCategoria(usuario)}
										label={
											<NumberFormat
												value={getPercentualRespondidoPorCategoria(usuario)}
												displayType='text'
												thousandSeparator='.'
												decimalSeparator=','
												decimalScale='2'
												suffix='%'
												fixedDecimalScale
											/>
										}
									/>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Modal>
			<p>Perguntas:</p>
			<Table small>
				<TableHead
					columns={columnsAcompanhamentos}
					order={order}
					orderBy={orderBy}
					onRequestSort={(event, property) => handleRequestSort(property)}
					rowCount={columnsAcompanhamentos.length}
				/>
				<TableBody>
					{stableSort(acompanhamento.PerguntaList, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((pergunta, index) => {
							variantTableRow =
								variantTableRow === theme.palette.table.tableRowPrimary
									? theme.palette.table.tableRowSecondary
									: theme.palette.table.tableRowPrimary;
							return (
								<TableRow key={index}>
									<TableCell label={pergunta.Codigo} />
									<TableCell label={pergunta.Nome} />
									<TableCell
										label={`@/..{getCountRespondidos(pergunta.Usuarios)}/@/..{pergunta.Usuarios.length}`}
									/>
									<TableCell
										title={getPercentualRespondidoPorUsuario(pergunta)}
										label={
											<NumberFormat
												value={getPercentualRespondidoPorUsuario(pergunta)}
												displayType='text'
												thousandSeparator='.'
												decimalSeparator=','
												decimalScale='2'
												suffix='%'
												fixedDecimalScale
											/>
										}
									/>
									<TableCell
										title={translate('usuarios')}
										label={
											<IconButton onClick={() => setUsuarios(pergunta.Usuarios)}>
												<Search />
											</IconButton>
										}
									/>
								</TableRow>
							);
						})}
					{acompanhamento.PerguntaList.length === 0 && (
						<TableRow backgroundColor={variantTableRow}>
							<TableCell align='center' colSpan={5} label={translate('semResultadosAExibir')} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			{acompanhamento.PerguntaList.length > rowsPerPage && (
				<TablePagination
					rowsPerPageOptions={ROWSPERPAGE}
					labelRowsPerPage={translate('linhasPorPagina')}
					component='div'
					count={acompanhamento.PerguntaList.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={(event, newPage) => setPage(newPage)}
					onChangeRowsPerPage={event => {
						setPage(0);
						setRowsPerPage(event.target.value);
					}}
					style={{ paddingRight: '80px' }}
				/>
			)}
		</LayoutContent>
	);
}
