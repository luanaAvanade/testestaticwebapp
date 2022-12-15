import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IframeContent } from 'react-axxiom';
import { Creators as LoaderCreators } from '@/store/ducks/loader';
import { LayoutContent } from '@/layout';
import VersaoMecService from '@/services/versaoMec';
import { URL_MATRIZ } from '@/utils/constants';

export default function Matriz() {
	const dispatch = useDispatch();

	// Estados Locais

	const [
		versaoMec,
		setVersaoMec
	] = useState('');

	// Efeito Inicial

	useEffect(() => {
		versaoMecAtual();
		return () => {
			setVersaoMec({});
		};
	}, []);

	// Buscar Dados

	const versaoMecAtual = () => {
		dispatch(LoaderCreators.setLoading());
		VersaoMecService.findAtual()
			.then(response => {
				setVersaoMec(response.data.VersaoMec_list[0]);
				dispatch(LoaderCreators.disableLoading());
			})
			.catch(() => dispatch(LoaderCreators.disableLoading()));
	};

	return (
		<LayoutContent widthCard='100%' heightCard='100%'>
			<IframeContent url={versaoMec ? versaoMec.LinkMatriz : URL_MATRIZ} />
		</LayoutContent>
	);
}
