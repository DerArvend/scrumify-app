import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ListPage } from './pages/listPage/ListPage';
import { FormPage } from './pages/formPage/FormPage';
import { AuthPage } from './pages/AuthPage';


class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/list' component={ListPage} />
                <Route path='/report' component={FormPage} />
                <Route path='/auth' component={AuthPage} />
                <Route exact path='/' render={() => <Redirect to='/auth' />} />
            </Switch>
        );
    }
}

export default App;
