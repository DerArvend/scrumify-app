import * as React from 'react';
import styled from 'styled-components';
import { ReportData } from './../../entities/ReportData';
import { BackTop, Spin } from 'antd';
import { PageTitle } from './../../common/PageTitle';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';
import { PageWrapper } from './../../common/PageWrapper';
import { RouteChildrenProps } from 'react-router';
import { throttle } from 'lodash';
import { Reports } from './Reports';
import { Filters } from './Filters';
import { FilterState } from './FiltersState';

interface ListPageProps extends RouteChildrenProps {
}

interface ListPageState {
    reports: ReportData[];
    loading?: boolean;
    filter: FilterState;
    filterModalVisible?: boolean;
    userNames: string[];
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
    private allReportsFetched: boolean = false;
    private tasksFetched: number = 0;

    constructor(props: ListPageProps) {
        super(props);
        this.state = {
            reports: [],
            filter: {
                dateRange: [],
            },
            userNames: [],
        };
    }

    render() {
        return (
            <PageWrapper centerContent maxWidth="1200px">
                <PageTitle>Scrumify</PageTitle>
                <NewReportButtonWrapper>
                    <Link to="/report">
                        <Button icon="plus">Заполнить отчет</Button>
                    </Link>
                </NewReportButtonWrapper>
                <Filters
                    allUserNames={this.state.userNames}
                    onFilterChange={this.handleFilterChange}
                    filter={this.state.filter}
                />
               <Reports reportDatas={this.state.reports} />
                <SpinWrapper>
                    <Spin size="large" spinning={this.state.loading} />
                </SpinWrapper>
                <BackTop />
            </PageWrapper>
        );
    }

    async componentDidMount() {
        this.fetchAndUpdateReports()
            .then(() => window.onscroll = this.scrollListener);
        const userNames = await axios.get('/api/getAllUsers');
        this.setState({ userNames: userNames.data });
    }

    // tslint:disable-next-line:member-ordering
    private scrollListener = throttle(() => {
        if (this.scrollIsOnBottom())
            this.fetchAndUpdateReports();
    }, fetchThrottleDelay);

    private handleFilterChange = (filter: FilterState) => {
        this.setState(state => (
            {
                filter: { ...state.filter, ...filter },
                reports: [],
            }),
            () => {
                this.tasksFetched = 0;
                this.allReportsFetched = false;
                this.fetchAndUpdateReports();
            });
    }

    private fetchAndUpdateReports = async () => {
        if (this.fetching || this.allReportsFetched)
            return;

        this.fetching = true;
        this.setState({ loading: true });
        const skip = this.tasksFetched;
        const take = taskBatchSize;
        try {
            let url = `/api/fetchTasks`;
            const { filter } = this.state;
            const body = {
                skip,
                take,
                startDate: filter.dateRange && filter.dateRange[0] && filter.dateRange[0].toISOString(),
                endDate: filter.dateRange && filter.dateRange[1] && filter.dateRange[1].toISOString(),
                userNames: filter.userNames,
            };
            // if (this.state.filter.dateRange && this.state.filter.dateRange[0])
            //     url += `&startDate=${this.state.filter.dateRange[0].toISOString()}`;
            // if (this.state.filter.dateRange && this.state.filter.dateRange[1])
            //     url += `&endDate=${this.state.filter.dateRange[1].toISOString()}`;
            const reports = await axios.post(url, body);
            if (reports.data.length === 0) {
                this.allReportsFetched = true;
                this.setState({ loading: false });
                this.fetching = false;
                return;
            }
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