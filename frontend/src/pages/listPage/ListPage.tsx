import * as React from 'react';
import styled from 'styled-components';
import { ReportData } from './../../entities/ReportData';
import { BackTop, Spin, DatePicker } from 'antd';
import { Report } from './Report';
import { PageTitle } from './../../common/PageTitle';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';
import { PageWrapper } from './../../common/PageWrapper';
import { RouteChildrenProps } from 'react-router';
import { throttle } from 'lodash';
import { Reports } from './Reports';
import ru_RU from 'antd/lib/date-picker/locale/ru_RU';
import { Moment, ISO_8601 } from 'moment';
import moment from 'moment';

const { RangePicker } = DatePicker;

import { RangePickerValue } from 'antd/lib/date-picker/interface';

interface ListPageProps extends RouteChildrenProps {
}

interface ListPageState {
    reports: ReportData[];
    loading?: boolean;
    filter: {
        dateRange: RangePickerValue;
    }
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

const FiltersWrapper = styled.div`
    margin: 30px 0 0;
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
        this.state = {
            reports: [],
            filter: {
                dateRange: [],
            },
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
                <FiltersWrapper>
                    <RangePicker
                        value={this.state.filter.dateRange}
                        onChange={this.handleDateRangeChange}
                        locale={ru_RU}
                    />
                </FiltersWrapper>
                <Reports reportDatas={this.state.reports} />
                <SpinWrapper>
                    <Spin size="large" spinning={this.state.loading} />
                </SpinWrapper>
                <BackTop />
            </PageWrapper>
        );
    }

    async componentDidMount() {
        await this.fetchAndUpdateReports();
        window.onscroll = this.scrollListener;
    }

    // tslint:disable-next-line:member-ordering
    private scrollListener = throttle(() => {
        if (this.scrollIsOnBottom())
            this.fetchAndUpdateReports();
    }, fetchThrottleDelay);

    private handleDateRangeChange = (dateRange: RangePickerValue) => {
        this.setState({ filter: { dateRange }, reports: [], loading: true });
        this.tasksFetched = 0;
        this.fetchAndUpdateReports();
    }

    private fetchAndUpdateReports = async () => {
        if (this.fetching)
            return;

        this.fetching = true;
        this.setState({ loading: true });
        const skip = this.tasksFetched;
        const take = taskBatchSize;
        try {
            let url = `/api/fetchTasks?skip=${skip}&take=${take}`;
            if (this.state.filter.dateRange[0])
                url += `&startDate=${this.state.filter.dateRange[0].toISOString()}`;
            if (this.state.filter.dateRange[1])
                url += `&endDate=${this.state.filter.dateRange[1].toISOString()}`;
            const reports = await axios.get(url);
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