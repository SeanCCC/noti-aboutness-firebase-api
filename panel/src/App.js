import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.scss'
import Recruit from './pages/Recruit'
import Participant from './pages/Participant'
import SignInScreen from './Auth'
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
        <SignInScreen>
          <Switch>
            <Route path="/recruit" component={Recruit}/>
            <Route path="/participant" component={Participant}/>
            <Route path="/">
              <Redirect to='/recruit' />
            </Route>
          </Switch>
        </SignInScreen>
      </div>
    </Router>
  )
}

export default App
