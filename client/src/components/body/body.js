import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './auth/login';

function body() {
    return (
        <section>
            <Switch>
                <Route path="/login" component={Login} exact/>
            </Switch>
        </section>
    )
}

export default body
