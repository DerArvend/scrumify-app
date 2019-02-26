import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../common/PageWrapper';
import { PageTitle } from '../../common/PageTitle';

const ErrorCode = styled.div`
    padding: 50px 0 10px;
    font-size: 72px;
    font-weight: 300;
`;

const ErrorName = styled.div`
    font-size: 20px;
    margin-bottom: 60px;
`
const BackLink = styled(Link)`
    font-size: 16px;
`;

interface ErrorPageProps {
    errorCode?: string;
    text?: string;
}

export class ErrorPage extends React.Component<ErrorPageProps> {
    render() {
        return <PageWrapper maxWidth="1200px" centerContent>
            <PageTitle>Scrumify</PageTitle>
            {this.props.errorCode &&
                <ErrorCode>
                    {this.props.errorCode}
                </ErrorCode>}
            {this.props.text && <ErrorName>{this.props.text}</ErrorName>}
            <BackLink to='/' >Вернуться к списку задач</BackLink>
        </PageWrapper>
    }
}