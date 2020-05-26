import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import 'semantic-ui-css/semantic.min.css'
import './App.scss'
import Recruit from './pages/Recruit'
import Participant from './pages/Participant'
import SidebarComp from './SidebarComp'
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
          <Provider store={store}>
            <SidebarComp>
              <Switch>
                <Route path="/recruit">
                  <Recruit test={1}/>
                </Route>
                <Route path="/participant" component={Participant}/>
                <Route path="/">
                  <Redirect to='/recruit' />
                </Route>
              </Switch>
            </SidebarComp>
          </Provider>
        </Auth>
      </div>
    </Router>
  )
}

export default App
