import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import { registerIntercepors } from './registerIntercepors';

const history = createBrowserHistory();
registerIntercepors(history);

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root'));

serviceWorker.unregister();
