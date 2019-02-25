import styled from "styled-components";

interface PageWrapperProps {
    maxWidth: string;
    centerContent?: boolean;
}

export const PageWrapper = styled.div`
    max-width: ${(props: PageWrapperProps) => props.maxWidth};
    margin: auto;

    ${(props: PageWrapperProps) => props.centerContent ? `display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;` : ''};
   
`;