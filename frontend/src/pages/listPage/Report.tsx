import * as React from 'react';
import styled from 'styled-components';
import { ReportData } from './../../entities/ReportData';
import { ListTaskCard } from './ListTaskCard';
import { Divider } from 'antd';
import { CardField } from './../../common/CardField';

export interface ReportProps extends ReportData {
}

const ReportWrapper = styled.div`
    padding: 10px 0px;
`;

const UserName = styled.div`
    color: #1890ff;
`;

const Comment = styled.div`
    margin: auto;
    max-width: 800px;
    text-align: center;
    white-space: pre-wrap;
    color: #333;
`;


export class Report extends React.Component<ReportProps> {
    render() {
        return <ReportWrapper>
            <Divider>
                <UserName>{this.props.userName}</UserName>
            </Divider>
            {this.props.tasks.length > 0 &&
                <CardField>
                    {this.props.tasks.map(taskData => <ListTaskCard {...taskData} />)}
                </CardField>}
            <Comment>{this.props.comment}</Comment>
        </ReportWrapper>;
    }
}
