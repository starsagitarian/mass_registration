import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'


function Header() {


    return (
        <header>
            <div className="logo">
                <div>
                    <h1><Link to="/">Holy Mass Registration</Link></h1>
                    <p><Link to="/">St. Mark Mission, London</Link></p>
                </div>
            </div>
            <ul>
                <li><a href="http://www.stmarkmission.com" target="_blank" rel="noopener noreferrer"><i className="fas fa-church"></i> Home</a></li>
                <li><Link to="/login"><i className="fas fa-users-cog"></i> Sign in</Link></li>
            </ul>
        </header>
    )
}

export default Header
