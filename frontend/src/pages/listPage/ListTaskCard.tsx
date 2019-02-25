import * as React from 'react';
import { Card as AntCard } from 'antd';
import "antd/dist/antd.css";
import { TaskData } from './../../entities/TaskData';
import styled from 'styled-components';

export interface ListTaskCardProps extends TaskData {
}

const Title = styled.div`
    font-size: 14px;
`;

const Text = styled.div`
    color: #181818;
    &:not(:last-child) {
        margin-bottom: 7px;
    }
`;

const Card = styled<any>(AntCard)`
    &&& {
        margin: 5px 20px;
        width: 350px;
        border-radius: 6px;
    }
`;

export class ListTaskCard extends React.PureComponent<ListTaskCardProps> {
    render() {
        const title = <div style={{ whiteSpace: "normal" }}>{this.props.theme}</div>;
        return <Card title={title}>
            <Title>Ссылка на YouTrack</Title>
            <Text><a target="_blank" href={this.props.url}>{this.props.url}</a></Text>
            <Title>Статус</Title>
            <Text>{this.props.currentState}</Text>
            <Title>Проблемы</Title>
            <Text>{this.props.problems}</Text>
        </Card>;
    }
}
