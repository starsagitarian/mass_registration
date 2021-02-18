import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import ActivationEmail from './auth/activationEmail';

function body() {
    return (
        <section>
            <Switch>
                <Route path="/login" component={Login} exact/>
                <Route path="/register" component={Register} exact/>
                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
            </Switch>
        </section>
    )
} 

export default body
 