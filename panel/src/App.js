import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import 'semantic-ui-css/semantic.min.css'
import './App.scss'
import Recruit from './pages/Recruit'
import Participant from './pages/Participant'
import SidebarComp from './SidebarComp'
import Auth from './Auth'
import Home from './pages/Home'
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
        <Provider store={store}>
          <Auth>
            <SidebarComp>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/recruit" component={Recruit}/>
                <Route path="/participant" component={Participant}/>
                <Route path="/">
                  <Redirect to='/recruit' />
                </Route>
              </Switch>
            </SidebarComp>
          </Auth>
        </Provider>
      </div>
    </Router>
  )
}

export default App
