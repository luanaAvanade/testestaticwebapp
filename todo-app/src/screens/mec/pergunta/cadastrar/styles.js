import styled from 'styled-components';
import { Box, FormHelperText } from '@material-ui/core';
import theme from '@/theme';

const BoxValidation = styled(Box)`
  padding: 1px
  border-radius:5px
  border: ${props => (props.bordercolor ? `1px solid ${props.bordercolor}` : '')} !important
`;

const Helper = styled(FormHelperText)`
  margin-left:${theme.spacing(1)}px !important
  margin-bottom:${theme.spacing(1)}px !important
  color: ${props => props.helpercolor} !important
`;

export { BoxValidation, Helper };
