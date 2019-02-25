import * as React from 'react';
import styled from 'styled-components';
import { Card, Input } from 'antd';
import "antd/dist/antd.css";
import { TaskData } from './../../entities/TaskData';
import TextArea from 'antd/lib/input/TextArea';
import { FormTaskCardTitle } from './cardTitle/Title';

export interface FormTaskCardProps {
    taskData: TaskData,
    onChange?: (data: TaskData) => void;
    onClose?: () => void;
}

const Title = styled.div`
    margin-top: 7px;
`;

const cardStyle = {
    width: 400,
    borderRadius: '6px',
    margin: '10px'
}


export class FormTaskCard extends React.PureComponent<FormTaskCardProps> {
    constructor(props: FormTaskCardProps) {
        super(props);
    }

    render() {
        const { theme, url, currentState, problems } = this.props.taskData;
        const cardTitle = <FormTaskCardTitle value={theme}
            onChange={this.handleThemeChange}
            onClose={this.props.onClose}
            placeholder="Тема задачи" />;

        return <Card style={cardStyle} title={cardTitle}>
            <Title>Ссылка на YouTrack</Title>
            <Input value={url} onChange={this.handleUrlChange} />
            <Title>Текущее состояние</Title>
            <TextArea value={currentState} onChange={this.handleTaskStateChange} />
            <Title>Проблемы</Title>
            <TextArea value={problems} onChange={this.handleProblemChange} />
        </Card>;
    }

    handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.props.onChange && this.props.onChange({ ...this.props.taskData, theme: e.target.value || '' });

    handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.props.onChange && this.props.onChange({ ...this.props.taskData, url: e.target.value || '' });

    handleTaskStateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        this.props.onChange && this.props.onChange({ ...this.props.taskData, currentState: e.target.value || '' });

    handleProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        this.props.onChange && this.props.onChange({ ...this.props.taskData, problems: e.target.value });
}
