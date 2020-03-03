import React from 'react'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import Orientation from './Orientation'
import Bigfive from './Bigfive'
import MailInfo from './MailInfo'

export default function Recruit () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/orientation`} component={Orientation}/>
      <Route path={`${match.path}/bigfive`} component={Bigfive}/>
      <Route path={`${match.path}/mailinfo`} component={MailInfo}/>
      <Route path={`${match.path}/instruction`} component={() => <div>instruction</div>}/>
      <Route path={`${match.path}/datecheck`} component={() => <div>datecheck</div>}/>
      <Route path={`${match.path}/ready`} component={() => <div>ready</div>}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/orientation`} />
      </Route>
    </Switch>
  )
}
