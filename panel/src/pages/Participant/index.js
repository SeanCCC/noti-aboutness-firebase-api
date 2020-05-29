import React from 'react'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import PrepareParticipants from './PrepareParticipants'
import DoneParticipants from './DoneParticipants'

export default function Participant () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/prepare`} component={PrepareParticipants}/>
      <Route path={`${match.path}/done`} component={DoneParticipants}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/prepare`} />
      </Route>
    </Switch>
  )
}
