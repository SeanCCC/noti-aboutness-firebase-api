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
import Compensation from './Compensation'
import { WaitPage, ReadyPage, WaitForPayPage, ErrorPage } from './ResultPage'
import Instruction from './Instruction'
import { checkId } from './checkId'

export default function Participant () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/orientation`}
        component={checkId(Orientation)}/>
      <Route path={`${match.path}/bigfive`}
        component={checkId(Bigfive)}/>
      <Route path={`${match.path}/mailinfo`}
        component={checkId(MailInfo)}/>
      <Route path={`${match.path}/waiting`}
        component={checkId(WaitPage)}/>
      <Route path={`${match.path}/instruction`}
        component={checkId(Instruction)}/>
      <Route path={`${match.path}/ready`}
        component={checkId(ReadyPage)}/>
      <Route path={`${match.path}/interview`}
        component={() => (<div/>)}/>
      <Route path={`${match.path}/compensation`}
        component={Compensation}/>
      <Route path={`${match.path}/waitforpay`}
        component={WaitForPayPage}/>
      <Route path={`${match.path}/error`}
        component={ErrorPage}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/orientation`} />
      </Route>
    </Switch>
  )
}
