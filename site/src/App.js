import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Recruit from './pages/Recruit'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

function App () {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/recruit">
            <Recruit/>
          </Route>
          <Route path="/">
            <div>else</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
