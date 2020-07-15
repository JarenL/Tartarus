import styled from 'styled-components/macro';

const Split = styled.div`
    padding: 12px;
    // padding-right: 6px;
    border-radius: 8px;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    grid-gap: 20px;

    background-color: ${props => props.theme.foreground};

    @media (max-width: 786px) {
        grid-template-columns: 3fr 1fr;
    }
`

export default Split;

//foreground
//activeBackground
