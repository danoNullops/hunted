import React from 'react';
import { Link } from 'react-router';
import { isAuth } from '../../helpers';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

export default (props) => (
  <div className="App">
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/" className="navbar-brand title">HUNTED</Link>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/scores">Scores</Link>
            </li>
            <li>
              { isAuth() ? <a href="/logout">Logout</a> : '' }
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {props.children}

  </div>
);
