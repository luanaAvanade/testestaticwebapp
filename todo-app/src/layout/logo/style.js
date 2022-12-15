import styled from 'styled-components';
import { Link as LinkDOM } from 'react-router-dom';
import { Toolbar as ToolbarMUI } from '@material-ui/core';
import theme from '@/theme';

const Link = styled(LinkDOM)`
  display: flex
	justify-content: center
	align-items: center
	height: 48px
	flex-shrink: 0
	background-color: ${theme.palette.primary.main}
	font-size: 0
	margin-bottom: ${theme.spacing(2)}px !important
	box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)
`;

const Image = styled.img`
	cursor: pointer
	width: 100px
`;

const Content = styled.div`
	border-bottom: 1px solid ${theme.palette.border}
	background-color: ${theme.palette.common.white}
	display: flex
	align-items: center
	z-index: ${theme.zIndex.appBar}
`;

const Toolbar = styled(ToolbarMUI)`
	z-index: ${theme.zIndex.toolBar}
	min-height: auto
	margin-left: ${props => (props.sidebar === 'true' ? '270px' : '0px')} !important
	transition:none
`;


export { Link, Image, Content, Toolbar };


