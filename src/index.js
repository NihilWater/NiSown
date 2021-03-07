import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Index from './pages/index';
import About from './pages/about';
import Login from './pages/login';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';

class Main extends React.Component {
  constructor(){
    super();
    this.state = {
      history: createBrowserHistory(),
      num: 1
    }
  }
  render = () => {
    return(
      <Router history={this.state.history} num={this.state.num}>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path='/' component={Index} />
      </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);

reportWebVitals();
