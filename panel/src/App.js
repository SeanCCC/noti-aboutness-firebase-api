import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.scss'
import Recruit from './pages/Recruit'
import Participant from './pages/Participant'
import Auth from './Auth'
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
        <Auth>
          <Switch>
            <Route path="/recruit" component={Recruit}/>
            <Route path="/participant" component={Participant}/>
            <Route path="/">
              <Redirect to='/recruit' />
            </Route>
          </Switch>
        </Auth>
      </div>
    </Router>
  )
}

export default App
