import styled from 'styled-components';

const CabecalhoHorizontal = styled.p`
  font-weight: ${props => (props.negrito ? 'bold' : 'unset')} !important
  padding-left: ${props => props.paddingLeft}px !important
`;

export { CabecalhoHorizontal };
