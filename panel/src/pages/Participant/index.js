import React from 'react'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import PrepareParticipant from './PrepareParticipant'

export default function Participant () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/prepare`} component={PrepareParticipant}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/prepare`} />
      </Route>
    </Switch>
  )
}
