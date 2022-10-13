import React, { memo } from 'react';
import { Link, Image } from './style';
import paths from '@/utils/paths';
import { translate } from '@/locales';
import { AppBar, Box } from '@material-ui/core';
import { Content, Toolbar } from './style';


function Logo() {
	return (
		<Content>
		<AppBar position='static'>
			<Toolbar variant='dense'>
				<Box alignSelf='center' style={{ fontSize: 20 }}>
					SOMA Fornecedores
				</Box>
			</Toolbar>
		</AppBar>
	</Content>
	);
}

export default memo(Logo);
