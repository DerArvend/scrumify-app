import * as React from 'react';
import styled from 'styled-components';
import { ReportData } from './../../entities/ReportData';
import { BackTop, Spin } from 'antd';
import { Report } from './Report';
import { PageTitle } from './../../common/PageTitle';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';
import { PageWrapper } from './../../common/PageWrapper';
import { RouteChildrenProps } from 'react-router';

interface ListPageProps extends RouteChildrenProps {
}

interface ListPageState {
    reports: ReportData[];
    loading?: boolean;
}

const NewReportButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 35px 0 10px;
`;

const SpinWrapper = styled.div`
    margin: 35px 0px;
    text-align: center;
`;

export class ListPage extends React.Component<ListPageProps, ListPageState> {
    constructor(props: ListPageProps) {
        super(props);
        this.state = { reports: [] };
    }
    render() {
        return (
            <PageWrapper maxWidth="1200px">
                <PageTitle>Scrumify</PageTitle>
                <div>
                    <NewReportButtonWrapper>
                        <Link to='/report'><Button icon='plus'>Заполнить отчет</Button></Link>
                    </NewReportButtonWrapper>
                </div>
                {this.state.reports.map(reportData => <Report {...reportData} />)}
                <SpinWrapper>
                    <Spin size='large' spinning={this.state.loading} />
                </SpinWrapper>
                <BackTop />
            </PageWrapper>
        );
    }
    async componentDidMount() {
        this.setState({ loading: true });
        try {
            const reports = await axios.get('/api/fetchTasks?skip=0&take=25');
            this.setState({ reports: reports.data, loading: false });
        }
        catch (error) {
            console.log(error);
            const status = error.response.status;
            if (status >= 400 || status <= 403)
                this.props.history.push('/auth');
        }
    }
}