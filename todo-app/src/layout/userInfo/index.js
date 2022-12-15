import React, { Fragment, memo } from 'react';
import { Box } from '@material-ui/core';
import { Info, PersonIcon, UserName, Profile } from './style';
import { getUser } from '@/utils/auth';

function UserInfo() {
	const usuario = getUser();
	return (
		<Info display='flex'>
			{usuario && (
				<Fragment>
					<PersonIcon />
					<Box display='flex' flexDirection='column'>
						<UserName title={usuario.usuario.nome} variant='h6'>
							{usuario.usuario.nome}
						</UserName>
						<Profile title={usuario.usuario.email} variant='caption'>
							{usuario.usuario.email}
						</Profile>
					</Box>
				</Fragment>
			)}
		</Info>
	);
}

export default memo(UserInfo);
