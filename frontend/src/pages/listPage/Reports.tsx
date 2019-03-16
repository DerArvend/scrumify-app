import * as React from 'react';
import { ReportData } from '../../entities/ReportData';
import { groupBy } from 'lodash';
import styled from 'styled-components';
import { Report } from './Report';
import { Divider } from 'antd';

const DateWrapper = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.35);
`;

export function Reports(props: { reportDatas: ReportData[] }) {
    const reportsByDate = groupBy(props.reportDatas, r => r.reportDate); // reports are sorted by date on backend
    return <div>
        {Object.keys(reportsByDate).map(date => <>
            <Divider>
                <DateWrapper key={date}>{formatDate(date)}</DateWrapper>
            </Divider>
            {reportsByDate[date].map(report => <Report {...report} />)}
        </>)}
    </div>
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}