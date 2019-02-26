import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ListPage } from './pages/listPage/ListPage';
import { FormPage } from './pages/formPage/FormPage';
import { AuthPage } from './pages/AuthPage';
import { ServerErrorPage } from './pages/errors/ServerErrorPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';


class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/list' component={ListPage} />
                <Route path='/report' component={FormPage} />
                <Route path='/auth' component={AuthPage} />
                <Route path='/serverError' component={ServerErrorPage} />
                <Route exact path='/' render={() => <Redirect to='/auth' />} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }
}

export default App;
