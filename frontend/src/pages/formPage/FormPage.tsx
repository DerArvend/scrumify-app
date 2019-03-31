import * as React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { TaskData } from './../../entities/TaskData';
import { CardField } from './../../common/CardField';
import { FormTaskCard } from './FormTaskCard';
import { Button, Icon, message, Select } from 'antd';
import { CommentInput } from './CommentInput';
import { PageTitle } from './../../common/PageTitle';
import { Link } from 'react-router-dom';
import { PageWrapper } from './../../common/PageWrapper';
import { RouteChildrenProps } from 'react-router';
import { formatDate } from '../../common/formatDate';

interface FromPageProps extends RouteChildrenProps {

}

interface FormPageState {
    reportIsoDate: string;
    comment?: string;
    tasks: { [taskId: string]: TaskData };
    submitLoading?: boolean;
}

const defaultTaskData: TaskData = {
    theme: '',
    url: '',
    currentState: '',
};

const DateSelectWrapper = styled.div`
    margin: 20px auto 10px;
`;

const SubmitButton = styled<any>(Button)`
    margin: 15px;
`;

const sessionStorageKey = 'reportState';
const dateRange = 5;

export class FormPage extends React.Component<FromPageProps, FormPageState> {
    private idCounter: number;
    private shouldSaveState: boolean = true;

    constructor(props: FromPageProps) {
        super(props);
        this.idCounter = 0;
        const savedStateJson = sessionStorage.getItem(sessionStorageKey);
        const parsedState = savedStateJson && JSON.parse(savedStateJson);
        this.state = parsedState || {
            reportIsoDate: new Date().toISOString(),
            tasks: {
                [this.nextId]: { ...defaultTaskData }
            },
        };
    }

    render() {
        return (
            <PageWrapper centerContent maxWidth='1260px'>
                <PageTitle>Scrumify</PageTitle>
                <Link to="/">К списку отчетов</Link>
                <CardField>
                    {Object.keys(this.state.tasks).map(this.renderTaskCard)}
                </CardField>
                <Button onClick={this.addTask}>
                    <Icon type="plus" /> Добавить задачу
                 </Button>
                <CommentInput value={this.state.comment} onChange={this.handleCommentChange} />
                <DateSelectWrapper>
                    <div>Дата отчета:</div>
                    <Select
                        style={{ width: 150 }}
                        placeholder="Дата отчета"
                        value={formatDate(this.state.reportIsoDate)}
                        onChange={this.handleDateChange}
                    >
                        {this.renderSelectOptions()}
                    </Select>
                </DateSelectWrapper>
                <SubmitButton type="primary" size="large" onClick={this.handleSubmit} loading={this.state.submitLoading}>Отправить отчет</SubmitButton>
            </PageWrapper>
        );
    }

    componentWillUnmount() {
        if (!this.shouldSaveState) return;
        const stateSliceToSave: Partial<FormPageState> = {
            reportIsoDate: this.state.reportIsoDate,
            tasks: this.state.tasks,
            comment: this.state.comment,
        };
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(stateSliceToSave));
    }

    private renderTaskCard = (taskId: string) => {
        return (
            <FormTaskCard
                taskData={this.state.tasks[taskId]}
                onChange={taskData => this.handleTaskChange(taskId, taskData)}
                onClose={() => this.handleClose(taskId)}
                key={taskId}
            />
        );
    }

    private renderSelectOptions = () => {
        const dates: Date[] = [];
        for (let days = 0; days <= dateRange; days++) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            dates.push(date);
        }
        return dates.map(date => {
            const isoDate = date.toISOString();
            return <Select.Option key={isoDate} value={isoDate}>{formatDate(isoDate)}</Select.Option>
        })
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

    private handleDateChange = (isoDate: string) => this.setState({ reportIsoDate: isoDate });

    private handleCommentChange = (value?: string) => this.setState({ comment: value });

    private addTask = () => {
        this.setState(state =>
            ({ tasks: { ...state.tasks, [this.nextId]: { ...defaultTaskData } } })
        )
    }

    private isEmptyTaskThemes = () => {
        const themes = Object.values(this.state.tasks).map(task => task.theme);
        return themes.some(theme => !theme);
    }

    private handleSubmit = async () => {
        if (this.isEmptyTaskThemes()) {
            message.warn('Перед отправкой отчета нужно заполнить тему для каждой задачи');
            return;
        }
        try {
            this.setState({ submitLoading: true });
            const response = await axios.post('/api/writeReport', {
                comment: this.state.comment,
                reportIsoDate: this.state.reportIsoDate,
                tasks: Object.values(this.state.tasks)
            }, { withCredentials: true });
            if (response && response.status && response.status === 200) {
                sessionStorage.removeItem(sessionStorageKey);
                this.shouldSaveState = false;
                message.success('Отчет отправлен');
                this.props.history.push('/list');
            }
        }
        catch (error) {
            // TODO: Validations for input values
            const status = error.response && error.response.status;
            if (status === 400) {
                message.error('Неверный формат введенных данных')
            }
            if (status === 409) {
                message.error(`Отчет за ${formatDate(this.state.reportIsoDate)} уже отправлен`);
            }
        }
        finally {
            this.setState({ submitLoading: false });
        }
    }
}