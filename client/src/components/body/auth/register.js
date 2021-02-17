import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notification';

const initialState = {
    name: '',
    number: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
};

function Register () {

    const [user, setUser] = useState(initialState);

    const {name, number, email, password, cf_password, err, success} = user;

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value, err: '', success: ''})
    };

    const handleSubmit = async e => {
        e.preventDefault()
        try {


        } catch (err) {
            err.response.data.msg && 
            setUser({...user, err: err.response.data.msg, success: ''});
        }
    };

    return (
        <div className="login_page">
            <h2><i className="far fa-user-circle"></i><span> </span>Register</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Please enter your full name" id="name" value={name} name="name" onChange={handleChangeInput}></input>
                </div>
                <div>
                    <label htmlFor="number">Number</label>
                    <input type="number" placeholder="Please enter your phone number" id="number" value={number} name="number" onChange={handleChangeInput}></input>
                </div>  
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Please enter your email address" id="email" value={email} name="email" onChange={handleChangeInput}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Please enter your password" id="password" value={password} name="password" onChange={handleChangeInput}></input>
                </div>
                <div>
                    <label htmlFor="cf_password">Confirm Password</label>
                    <input type="cf_password" placeholder="Please re-enter your password" id="cf_password" value={cf_password} name="cf_password" onChange={handleChangeInput}></input>
                </div>
                <div className="row">
                    <button type="submit">Register</button>
                </div>
            </form>
            <br></br>
            <p><Link to="/login">Already registered?? Login</Link></p>
            <br></br>
            <span></span>
        </div>
    )
}

export default Register
