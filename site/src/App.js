import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.scss'
import Recruit from './pages/Recruit'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

function App () {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/recruit" component={Recruit}/>
          <Route path="/">
            <Redirect to='/recruit/introduction' />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
