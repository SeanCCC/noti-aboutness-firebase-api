import React from 'react'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import ConsentPendingList from './ConsentPendingList'

export default function Participant () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/consent`} component={ConsentPendingList}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/consent`} />
      </Route>
    </Switch>
  )
}
