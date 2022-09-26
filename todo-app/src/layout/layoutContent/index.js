import React, { useState, Fragment, memo } from 'react';
import { Box } from '@material-ui/core';
import useReactRouter from 'use-react-router';
//import { Col, Container, Row } from 'react-bootstrap'
import { Topbar, Drawer, Content } from './style';
import  Sidebar  from '../sidebar';
import  Breadcrumbs  from '../breadCrumbs';
import  Title  from '../title';
import  Footer  from '../footer';
import paths from '@/utils/paths';
import theme from '@/theme';

function LayoutContent({ children, widthCard, heightCard, noCard }) {
	const { history } = useReactRouter();
	const [
		isOpen,
		setIsOpen
	] = useState(true);

	const handleToggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Fragment>
			<Topbar sidebar={isOpen} onToggleSidebar={handleToggleOpen} />
			<Drawer anchor='left' onClose={handleClose} open={isOpen} variant='persistent'>
				<Sidebar />
			</Drawer>
			<Box display='flex'>
				<Content topbar sidebar={isOpen}>
					{/* {children &&
					!noCard && (
						<Fragment>
							<Title text={paths.getTitle(paths.getCurrentPath(history))} />
							<Breadcrumbs />
							<Col className="px-0 colMainContent">
                                <div className="mainContent">
                                    {children}
                                    {/* <Footer/> */}
                              {/*  </div>
                            </Col>
						</Fragment>
					)}
				{/*	{children && noCard && children} */}
				</Content>
			</Box>
			<Footer />
		</Fragment>
	);
}

export default memo(LayoutContent);
