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
       &:not(:first-child) {
        margin-top: 5px;
    }
`;

const UserName = styled.div`
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    color: rgba(0, 0, 0, 0.85); 
`;

const Comment = styled.div`
    margin: auto;
    width: fit-content;
    max-width: 700px;
    text-align: start;
    white-space: pre-wrap;
    color: #333;
`;


export class Report extends React.Component<ReportProps> {
    render() {
        return <ReportWrapper>
            <UserName>{this.props.userName}</UserName>
            {this.props.tasks.length > 0 &&
                <CardField>
                    {this.props.tasks.map(taskData => <ListTaskCard {...taskData} />)}
                </CardField>}
            <Comment>{this.props.comment}</Comment>
        </ReportWrapper>;
    }
}
