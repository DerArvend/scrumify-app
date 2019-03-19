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

const YouTrackLink = styled.a`
    word-break: break-all;
`;

const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

export class ListTaskCard extends React.PureComponent<ListTaskCardProps> {
    render() {
        const title = <div style={{ whiteSpace: "normal" }}>{this.props.theme}</div>;
        return <Card title={title}>
            {this.props.url && <Title>Ссылка на YouTrack</Title>}
            {this.props.url && this.renderUrl(this.props.url)}
            {this.props.currentState && <Title>Статус</Title>}
            {this.props.currentState && <Text>{this.props.currentState}</Text>}
            {this.props.problems && <Title>Проблемы</Title>}
            {this.props.problems && <Text>{this.props.problems}</Text>}
        </Card>;
    }

    private renderUrl = (url: string) => urlRegex.test(url)
        ? <YouTrackLink target="_blank" href={url}>{url}</YouTrackLink>
        : <Text>{this.props.url}</Text>
}
