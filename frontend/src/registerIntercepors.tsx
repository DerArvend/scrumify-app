import { History } from 'history';
import axios from 'axios';

export function registerIntercepors(history: History<any>) {
    axios.interceptors.response.use(res => res, error => {
        if (error.response && error.response.status === 500)
            history.push('/serverError');
        return Promise.reject(error);
    });

    axios.interceptors.response.use(res => res, error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (history.location.pathname !== '/auth')
                history.push('/auth');
        }
        return Promise.reject(error);
    });
}
