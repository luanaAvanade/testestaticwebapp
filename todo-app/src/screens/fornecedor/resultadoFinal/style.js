import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const LabelFinalAprovar = styled(Typography)`
	background-color: green !important
	color: #fafafa;
	border: none;
`;
const LabelFinalAprovarComRessalvas = styled(Typography)`
	background-color: orange !important
	color: #fafafa;
	border: none;
`;
const LabelFinalReprovar = styled(Typography)`
	background-color: red !important
	color: #fafafa;
	border: none;
`;
const LabelFinalSemDados = styled(Typography)`
	background-color: gray !important
	color: #fafafa;
	border: none;
`;
export { LabelFinalAprovar, LabelFinalReprovar, LabelFinalAprovarComRessalvas, LabelFinalSemDados };
