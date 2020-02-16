import React from 'react'
import Introduction from './Introduction'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'

export default function Recruit () {
  const match = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/introduction`}>
          <Introduction/>
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  )
}
