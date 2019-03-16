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
import { throttle } from 'lodash';
import { Reports } from './Reports';

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

const onScrollFetchOffsetThreshold = 500;
const taskBatchSize = 20;
const fetchThrottleDelay = 100;

export class ListPage extends React.Component<ListPageProps, ListPageState> {
    private fetching: boolean = false;
    private tasksFetched: number = 0;

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
                <Reports reportDatas={this.state.reports} />
                <SpinWrapper>
                    <Spin size='large' spinning={this.state.loading} />
                </SpinWrapper>
                <BackTop />
            </PageWrapper>
        );
    }
    async componentDidMount() {
        await this.fetchAndUpdateReports();
        window.addEventListener('scroll', this.scrollListener);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener);
    }

    private scrollListener = throttle(() => {
        if (this.scrollIsOnBottom())
            this.fetchAndUpdateReports();
    }, fetchThrottleDelay)

    private fetchAndUpdateReports = async () => {
        if (this.fetching)
            return;

        this.fetching = true;
        this.setState({ loading: true });
        const skip = this.tasksFetched;
        const take = taskBatchSize;
        console.log(`skip ${skip}`);
        try {
            const reports = await axios.get(`/api/fetchTasks?skip=${skip}&take=${take}`);
            this.tasksFetched += take;
            this.setState(state => ({
                reports: [...state.reports, ...reports.data],
                loading: false,
            }));
        }
        catch (error) {
            console.log(error);
        }
        this.fetching = false;
    }

    // TODO: Move to some common place
    private getTotalHeight() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }

    private scrollIsOnBottom() {
        return this.getTotalHeight() - window.pageYOffset - document.documentElement.clientHeight < onScrollFetchOffsetThreshold;
    }
}