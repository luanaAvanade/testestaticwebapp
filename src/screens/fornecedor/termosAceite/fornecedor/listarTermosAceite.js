import React, { useState, useEffect } from 'react';
import { Button, Card } from '@/components';
import { CardHeader, Box, CardContent, Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import theme from '@/theme';
import { translate } from '@/locales';
import { snackSuccess, snackError } from '@/utils/snack';
import TermosAceiteService from '@/services/termosAceite';
import { checkError } from '@/utils/validation';
import { ThumbUp, RadioButtonUnchecked, CheckCircle } from '@material-ui/icons';
import { htmlParser } from '@/utils/string';
import termoAceiteEmpresa from '@/services/termoAceiteEmpresa';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(0.5)
		}
	}
}));

export default function TermosAceite({
	listTermosAceiteEmpresa,
	setListTermosAceiteEmpresa,
	erroTermoAceite,
	setErroTermoAceite,
	getTermoNaoAceitos,
	setChanged
}) {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const [
		titulo,
		setTitulo
	] = useState('');

	const [
		subTitulo,
		setSubTitulo
	] = useState('');

	const [
		descricao,
		setDescricao
	] = useState('');

	const [
		indexItem,
		setIndexItem
	] = useState(0);

	const [
		idElement,
		setIdElement
	] = useState(0);

	const [
		openModalTermoAceite,
		setOpenModalTermoAceite
	] = useState(false);

	const funcOpenModal = index => () => {
		setIndexItem(index);
		setTitulo(
			'<h3 style="text-align: center">' +
				listTermosAceiteEmpresa[indexItem].TermosAceite.Titulo +
				'<h3>'
		);
		setSubTitulo('<h4>' + listTermosAceiteEmpresa[indexItem].TermosAceite.SubTitulo + '<h4>');
		setDescricao(listTermosAceiteEmpresa[indexItem].TermosAceite.Descricao);
		setOpenModalTermoAceite(true);
	};

	const callback = mensagem => {
		enqueueSnackbar('', snackSuccess(mensagem, closeSnackbar));
	};

	const callbackError = mensagem => {
		enqueueSnackbar('', snackError(mensagem, closeSnackbar));
	};

	const closeModal = () => {
		setOpenModalTermoAceite(false);
	};

	const AceitarTermo = () => {
		listTermosAceiteEmpresa[indexItem].Aceite = true;
		setIdElement(listTermosAceiteEmpresa[indexItem].Id);
		setChanged(true);
		setListTermosAceiteEmpresa(listTermosAceiteEmpresa);
		setOpenModalTermoAceite(false);
		if (getTermoNaoAceitos().length === 0) {
			setErroTermoAceite('');
		}
	};

	return (
		<Box paddingTop={`@/..{theme.spacing(1)}px`}>
			<Card borderColor={theme.palette.danger.main} error={erroTermoAceite}>
				<Box paddingTop={`@/..{theme.spacing(1)}px`}>
					<div>
						<Dialog
							open={openModalTermoAceite}
							onClose={closeModal}
							aria-labelledby='alert-dialog-title'
							aria-describedby='alert-dialog-description'
						>
							<DialogTitle id='alert-dialog-title'>{htmlParser(titulo)}</DialogTitle>
							<DialogContent>
								<div>{htmlParser(subTitulo)}</div>
								<DialogContentText id='alert-dialog-description' />
								<div>{htmlParser(descricao)}</div>
							</DialogContent>
							<DialogActions>
								<Button
									text='Cancelar'
									backgroundColor={theme.palette.secondary.main}
									onClick={closeModal}
								/>
								<Button
									text='Aceite'
									type='submit'
									margin={`0px 0px 0px @/..{theme.spacing(1)}px`}
									onClick={AceitarTermo}
								/>
							</DialogActions>
						</Dialog>
					</div>

					<Box display='flex' flexDirection='row' justifyContent='space-between'>
						<CardHeader title={translate('termosAceiteFornecedor')} />
					</Box>
					<CardContent id='testeChips'>
						<div className={classes.root}>
							{listTermosAceiteEmpresa &&
								listTermosAceiteEmpresa.length > 0 &&
								listTermosAceiteEmpresa.map(function(item, index) {
									let icon = item.Aceite ? <CheckCircle /> : <RadioButtonUnchecked />;
									let titulo = item.TermosAceite.Titulo;
									let status = item.TermosAceite.Status;
									if (item.TermosAceite.Titulo.length > 30) {
										titulo = item.TermosAceite.Titulo.substring(0, 29) + '...';
									}
									if (status === true) {
										return (
											<Chip
												label={titulo}
												clickable
												color='primary'
												onDelete={funcOpenModal(index)}
												deleteIcon={icon}
												variant='outlined'
											/>
										);
									}
								})}
						</div>
					</CardContent>
				</Box>
			</Card>
		</Box>
	);
}
