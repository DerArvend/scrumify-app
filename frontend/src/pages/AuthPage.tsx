import * as React from 'react';
import { PageWrapper } from '../common/PageWrapper';
import { PageTitle } from '../common/PageTitle';
import { Redirect, RouteProps } from 'react-router';
import styled from 'styled-components';
import axios from 'axios';
import { Spin, Input, Button, message } from 'antd';

interface AuthPageState {
    fetching?: boolean;
    isAuthenticaded?: boolean;
    userId?: string;
}

const AuthInputField = styled.div`
    justify-content: center;
    margin: auto;
    padding: 100px 0px 50px;
    width: 100%;
    max-width: 25em;
`;

const submitButtonStyle = { // TODO: styled
    display: 'block',
    margin: '45px auto 0',
}

const UserInfoHint = styled.p`
    font-size: 0.95em;
    color: #666;
`


export class AuthPage extends React.Component<RouteProps, AuthPageState> {
    constructor(props: RouteProps) {
        super(props);
        this.state = { fetching: false };
    }

    render() {
        if (this.state.isAuthenticaded)
            return <Redirect to='/list' />
        return <PageWrapper centerContent maxWidth="900px">
            <PageTitle>Scrumify</PageTitle>
            <Spin spinning={this.state.fetching}>
                <AuthInputField>
                    <div style={{ visibility: this.state.fetching ? 'hidden' : 'visible' }}>
                        <div>UserID</div>
                        <Input value={this.state.userId}
                            onChange={e => this.setState({ userId: e.target.value })} />
                        <Button style={submitButtonStyle} type='primary' size='large' onClick={this.handleSumbmit}>Войти</Button>
                    </div>
                </AuthInputField>
                <UserInfoHint>UserID можно получить у Telegram-бота командой /userinfo</UserInfoHint>
            </Spin>
        </PageWrapper>
    }

    componentDidMount() {
        this.fetchAuth();
    }

    handleSumbmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { userId } = this.state;
        if (!/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g.test(userId || '')) {
            message.error('Некорректный UserID. Введите корректный UUID.');
            return;
        }
        this.fetchAuth();
    }

    fetchAuth = async () => {
        this.setState({ fetching: true });
        const nextState: AuthPageState = { fetching: false };
        try {
            const response = await axios.post('/api/auth', { userId: this.state.userId }, { withCredentials: true });
            if (response && response.status === 200) {
                nextState.isAuthenticaded = true;
            }

        }
        catch {
            if (this.state.userId)
                message.error('Неверный UserID.');
        }
        finally {
            this.setState(nextState);
        }
    }
}
