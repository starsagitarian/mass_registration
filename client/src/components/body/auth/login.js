import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
};

function Login() {

    const [user, setUser] = useState(initialState); 

    const {email, password, err, success} = user;

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value, err: '', success: ''})
    };

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('/user/login', {email, password})
            setUser({...user, err: '', success: res.data.msg})

        } catch (err) {
            err.response.data.msg && 
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    };

    return (
        <div className="login_page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Please enter your email address" id="email" value={email} name="email" onChange={handleChangeInput}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Please enter your password" id="password" value={password} name="password" onChange={handleChangeInput}></input>
                </div>
                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot Password</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
