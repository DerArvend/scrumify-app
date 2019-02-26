import { History } from 'history';
import axios from 'axios';

export function registerIntercepors(history: History<any>) {
    axios.interceptors.response.use(res => res, error => {
        if (error.response && error.response.status === 500)
            history.push('/serverError');
    });
}
