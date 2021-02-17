import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';

function body() {
    return (
        <section>
            <Switch>
                <Route path="/login" component={Login} exact/>
                <Route path="/register" component={Register} exact/>
            </Switch>
        </section>
    )
}

export default body
