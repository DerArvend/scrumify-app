import * as React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { TaskData } from './../../entities/TaskData';
import { CardField } from './../../common/CardField';
import { FormTaskCard } from './FormTaskCard';
import { Button, Icon, message } from 'antd';
import { CommentInput } from './CommentInput';
import { PageTitle } from './../../common/PageTitle';
import { Link } from 'react-router-dom';
import { PageWrapper } from './../../common/PageWrapper';
import { RouteChildrenProps } from 'react-router';

interface FromPageProps extends RouteChildrenProps {

}

interface FormPageState {
    userName: string;
    reportDate: Date;
    comment?: string;
    tasks: { [taskId: string]: TaskData };
    submitLoading?: boolean;
}

const defaultTaskData: TaskData = {
    theme: '',
    url: '',
    currentState: '',
};

const ButtonRow = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    & > * {
        margin: 0px 15px;
    }
`;

export class FormPage extends React.Component<FromPageProps, FormPageState> {
    private idCounter: number;

    constructor(props: FromPageProps) {
        super(props);
        this.idCounter = 0;
        this.state = {
            reportDate: new Date(),
            userName: "user",
            tasks: {
                [this.nextId]: { ...defaultTaskData }
            },
        };
    }

    render() {
        return (
            <PageWrapper centerContent maxWidth="1260px">
                <PageTitle>Scrumify</PageTitle>
                <CardField>
                    {Object.keys(this.state.tasks).map(this.renderTaskCard)}
                </CardField>
                <Button onClick={this.addTask}>
                    <Icon type="plus" /> Добавить задачу
                 </Button>
                <CommentInput value={this.state.comment} onChange={this.handleCommentChange} />
                <ButtonRow>
                    <Link to='/'><Button size='large'>Отменить</Button></Link>
                    <Button type='primary' size='large' onClick={this.handleSubmit} loading={this.state.submitLoading}>Отправить отчет</Button>
                </ButtonRow>
            </PageWrapper>
        );
    }

    private renderTaskCard = (taskId: string) => {
        return <FormTaskCard
            taskData={this.state.tasks[taskId]}
            onChange={taskData => this.handleTaskChange(taskId, taskData)}
            onClose={() => this.handleClose(taskId)}
            key={taskId} />;
    }

    private get nextId() {
        return (this.idCounter++).toString();
    }

    // TODO: Cache handlers for each taskId
    private handleClose = (taskId: string) => {
        this.setState(state => {
            const nextTaskDatas = { ...state.tasks };
            delete nextTaskDatas[taskId];
            this.setState({ tasks: nextTaskDatas });
        });
    }

    private handleTaskChange = (taskId: string, newTaskData: TaskData) => this.setState(state =>
        ({ tasks: { ...state.tasks, [taskId]: newTaskData } })
    );

    private handleCommentChange = (value?: string) => this.setState({ comment: value });

    private addTask = () => {
        this.setState(state =>
            ({ tasks: { ...state.tasks, [this.nextId]: { ...defaultTaskData } } })
        )
    }

    private handleSubmit = async () => {
        try {
            this.setState({ submitLoading: true });
            const response = await axios.post('/api/writeReport', {
                userName: this.state.userName,
                comment: this.state.comment,
                reportDate: this.state.reportDate,
                tasks: Object.values(this.state.tasks)
            }, { withCredentials: true });
            if (response && response.status && response.status === 200) {
                message.success('Отчет отправлен');
                this.props.history.push('/list');
            }
        }
        catch (error) {
            const status = error.response.status;
            if (status >= 400 || status <= 403)
                this.props.history.push('/auth');
        }
    }
}