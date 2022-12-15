import styled from 'styled-components';
import theme from '@/theme';

const Mensagem = styled.p`
  overflow-wrap: break-word
  padding: ${theme.spacing(1)}px
  background-color: ${theme.palette.message.background} !important
  color: ${theme.palette.message.color} !important
  borderRadius: 5px !important
`;

export { Mensagem };
