import * as React from 'react';
import { ReportData } from '../../entities/ReportData';
import { groupBy } from 'lodash';
import styled from 'styled-components';
import { Report } from './Report';
import { Divider } from 'antd';
import { formatDate } from '../../common/formatDate';

const DateWrapper = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.35);
`;

export function Reports(props: { reportDatas: ReportData[] }) {
    const reportsByDate = groupBy(props.reportDatas, r => r.reportIsoDate.slice(0, 10)); // reports are sorted by date on backend
    return (
        <div>
            {Object.keys(reportsByDate).map(date => <>
                <Divider>
                    <DateWrapper key={date}>{formatDate(date)}</DateWrapper>
                </Divider>
                {reportsByDate[date].map(report => <Report {...report} />)}
            </>)}
        </div>);
}
