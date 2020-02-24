import React from 'react'
import Introduction from './Introduction'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import FormPage from './FormPage'

export default function Recruit () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/introduction`}>
        <Introduction/>
      </Route>
      <Route path={`${match.path}/form`}>
        <FormPage />
      </Route>
      <Route path={match.path}>
        <div>else</div>
      </Route>
    </Switch>
  )
}
