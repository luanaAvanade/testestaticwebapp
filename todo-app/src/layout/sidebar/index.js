import React, { useEffect, memo } from 'react';
import { List, ListItemText, Collapse, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import _ from 'lodash';
import { Creators as SidebarCreators } from '@/store/ducks/sidebar';
import  Logo  from '../logo';
import  ItemSidebar  from '../itemSidebar';
import paths from '@/utils/paths';
import { translate } from '@/locales';
import { NavBar, ListModulo } from './style';
import { modulosPermitidos } from '@/utils/modulos';
import {
	MEC_VERSAO,
	VISUALIZAR,
	MEC_RESPOSTA,
	EDITAR,
	FORNECEDOR_CADASTRO,
	FORNECEDOR_ANALISE_CADASTRO,
	CRIAR,
	AUTENTICADOR,
	AUTENTICADOR_ACESSO
} from '@/utils/constants';

function SideBar() {
	const { history } = useReactRouter();

	const getModulos = () => {
		const modulesMap = modulosPermitidos();
		let modulos = [];

		// HOME
		const home = {
			codigo: 'home',
			text: translate('home'),
			linkTo: paths.getPathByCodigo('home')
		};

		// FORNECEDOR
		let subModulosFornecedor = [];
		const fornecedor = {
			codigo: 'fornecedor',
			text: 'Fornecedor',
			open: false,
			subModulos: subModulosFornecedor
		};

		// SUBMODULO FORNECEDOR
		const cadastroComplementar = {
			codigo: 'cadastro-complementar',
			text: translate('cadastroComplementar'),
			linkTo: paths.getPathByCodigo('cadastro-complementar')
		};
		// const tipoContato = {
		// 	codigo: 'tipo-contato',
		// 	text: translate('tipoContato'),
		// 	linkTo: paths.getPathByCodigo('tipo-contato')
		// };
		// const tipoDocumento = {
		// 	codigo: 'tipo-documento',
		// 	text: translate('tipoDocumento'),
		// 	linkTo: paths.getPathByCodigo('tipo-documento')
		// };
		// const termosAceite = {
		// 	codigo: 'termos-aceite',
		// 	text: translate('termosAceite'),
		// 	linkTo: paths.getPathByCodigo('termos-aceite'),
		// 	linkTo: paths.getPathByCodigo('termos-aceite')
		// };
		// const grupoPerguntaQualificacao = {
		// 	codigo: 'grupo-pergunta-qualificacao',
		// 	text: translate('grupoPerguntaQualificacao'),
		// 	linkTo: paths.getPathByCodigo('grupo-pergunta-qualificacao')
		// };
		// const perguntaQualificacao = {
		// 	codigo: 'pergunta-qualificacao',
		// 	text: translate('perguntaQualificacao'),
		// 	linkTo: paths.getPathByCodigo('pergunta-qualificacao')
		// };
		// const tipoExigencia = {
		// 	codigo: 'tipo-exigencia',
		// 	text: translate('tipoExigencia'),
		// 	linkTo: paths.getPathByCodigo('tipo-exigencia')
		// };
		const analistaCadastro = {
			codigo: 'analise-cadastro',
			text: 'Analise de Cadastros',
			linkTo: paths.getPathByCodigo('analise-cadastro')
		};

		// MEC
		let subModulosMec = [];
		// const mec = {
		// 	codigo: 'mec',
		// 	text: translate('matrizEstrategicaCategorias'),
		// 	open: true,
		// 	subModulos: subModulosMec
		// };

		// SUBMODULO MEC
		// const acompanhamento = {
		// 	codigo: 'acompanhamento',
		// 	text: translate('acompanhamento'),
		// 	linkTo: paths.getPathByCodigo('acompanhamento')
		// };
		// const versoes = {
		// 	codigo: 'versoes',
		// 	text: translate('versoes'),
		// 	linkTo: paths.getPathByCodigo('versoes')
		// };
		// const importacao = {
		// 	codigo: 'importacao',
		// 	text: translate('importacaoDeArquivos'),
		// 	linkTo: paths.getPathByCodigo('importacao')
		// };
		// const grupoRespondente = {
		// 	codigo: 'grupo-respondente',
		// 	text: translate('grupoRespondente'),
		// 	linkTo: paths.getPathByCodigo('grupo-respondente')
		// };
		// const pergunta = {
		// 	codigo: 'pergunta',
		// 	text: translate('perguntas'),
		// 	linkTo: paths.getPathByCodigo('pergunta')
		// };
		// const resposta = {
		// 	codigo: 'resposta',
		// 	text: translate('resposta'),
		// 	linkTo: paths.getPathByCodigo('resposta')
		// };
		const resultado = {
			codigo: 'resultado',
			text: translate('resultados'),
			linkTo: paths.getPathByCodigo('resultado')
		};
		// const matriz = {
		// 	codigo: 'matriz',
		// 	text: translate('matriz'),
		// 	linkTo: paths.getPathByCodigo('matriz')
		// };

		// VALIDACOES PARA ADICIONAR OS SUBMODULOS

		// SUBMODULO MEC
		//if (modulesMap.has('MEC_ACOMPANHAMENTO')) {
		//	subModulosMec.push(acompanhamento);
		//}
		//if (modulesMap.has('MEC_GRAFICO')) {
		//	subModulosMec.push(matriz);
		//}
		// //if (modulesMap.has('MEC_GRUPO_USUARIO')) {
		// 	subModulosMec.push(grupoRespondente);
		// //}
		// //if (modulesMap.has('MEC_IMPORTACAO')) {
		// 	subModulosMec.push(importacao);
		// //}
		// //if (modulesMap.has('MEC_PERGUNTAS')) {
		// 	subModulosMec.push(pergunta);
		// //}
		// //if (modulesMap.has('MEC_RESPOSTA')) {
		// 	subModulosMec.push(resposta);
		// //}
		//if (modulesMap.has('MEC_RESULTADO')) {
		//	subModulosMec.push(resultado);
		//}
		// //if (modulesMap.has('MEC_VERSAO')) {
		// 	subModulosMec.push(versoes);
		// //}

		// SUBMODULO FORNECEDOR
		//if (modulesMap.has('FORNECEDOR_ANALISE_CADASTRO')) {
			subModulosFornecedor.push(analistaCadastro);
		//}
		//if (modulesMap.has('FORNECEDOR_CADASTRO')) {
			subModulosFornecedor.push(cadastroComplementar);
		//}
		//if (modulesMap.has('FORNECEDOR_TIPO_CONTATO')) {
		// 	subModulosFornecedor.push(tipoContato);
		// //}
		// //if (modulesMap.has('FORNECEDOR_TIPO_DOCUMENTO')) {
		// 	subModulosFornecedor.push(tipoDocumento);
		// //}
		// //if (modulesMap.has('FORNECEDOR_TERMOS_ACEITE')) {
		// 	subModulosFornecedor.push(termosAceite);
		// //}
		// //if (modulesMap.has('FORNECEDOR_TIPO_GRUPO')) {
		// 	subModulosFornecedor.push(grupoPerguntaQualificacao);
		// //}
		// //if (modulesMap.has('FORNECEDOR_TIPO_GRUPO')) {
		// 	subModulosFornecedor.push(perguntaQualificacao);
		// //}
		// //if (modulesMap.has('FORNECEDOR_TIPO_EXIGENCIA')) {
		// 	subModulosFornecedor.push(tipoExigencia);
		// //}

		// SUBMODULO AUTENTICADOR
		if (modulesMap.has('AUTENTICADOR_ACESSO')) {
		}

		// Modulo Home sempre ser?? adicionado
		modulos.push(home);
		// // Caso exista submodulo o modulo ?? adicionado
		// if (subModulosMec.length > 0) {
		// 	modulos.push(mec);
		// }
		if (subModulosFornecedor.length > 0) {
			modulos.push(fornecedor);
		}

		return modulos;
	};

	const dispatch = useDispatch();
	const sidebarModuloRedux = useSelector(stateRedux => stateRedux.sidebar.modulo);

	useEffect(() => {
		const firstLevel = _.find(getModulos(), { codigo: paths.getCurrentPath(history) });

		if (firstLevel && !checkModulo(firstLevel)) {
			setModulo(firstLevel);
		} else {
			getModulos().forEach(modulo => {
				if (modulo.subModulos) {
					const secondLevel = _.find(modulo.subModulos, {
						codigo: paths.getCurrentPath(history)
					});
					if (secondLevel && !checkModulo(modulo)) {
						setModulo(modulo);
					}
				}
			});
		}
	}, []);

	const handleClick = modulo => {
		if (modulo.linkTo) {
			history.push(modulo.linkTo);
		}
		if (!checkModulo(modulo)) {
			setModulo(modulo);
		} else {
			setModulo('');
		}
	};

	const setModulo = modulo => {
		dispatch(SidebarCreators.setModulo(checkModulo(modulo) ? '' : modulo.codigo));
	};

	const checkModulo = modulo => {
		return modulo.codigo === sidebarModuloRedux;
	};

	return (
		<NavBar>
			<Logo />
			<List component='div' disablePadding>
				{getModulos().map(modulo => {
					return (
						<Box display='flex' key={modulo.codigo} flexDirection='column'>
							<ListModulo
								active={checkModulo(modulo)}
								dense
								button
								onClick={() => handleClick(modulo)}
							>
								<ListItemText
									style={{ paddingLeft: 0 }}
									inset
									primary={
										<Box display='flex' justifyContent='space-between'>
											{modulo.text}
											{!modulo.linkTo &&
												(checkModulo(modulo) ? <KeyboardArrowUp /> : <KeyboardArrowDown />)}
										</Box>
									}
								/>
							</ListModulo>
							<Collapse in={checkModulo(modulo)} timeout='auto' unmountOnExit>
								{modulo.subModulos &&
									modulo.subModulos.length > 0 &&
									modulo.subModulos.map(subModulo => {
										return (
											<ItemSidebar
												key={subModulo.codigo}
												text={subModulo.text}
												linkTo={subModulo.linkTo}
											/>
										);
									})}
							</Collapse>
						</Box>
					);
				})}
			</List>
		</NavBar>
	);
}

export default memo(SideBar);
