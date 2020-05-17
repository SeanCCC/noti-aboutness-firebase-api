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
import { InterviewSchedulePage, InterviewAcceptPage, WaitPage, ReadyPage, WaitForPayPage, ErrorPage, RunningPage, CompletePage } from './ResultPage'
import Instruction from './Instruction'
import { checkId } from './checkId'
import Interview from './Interview'

export default function Participant () {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/orientation`}
        component={checkId(Orientation)}/>
      <Route path={`${match.path}/mailinfo`}
        component={checkId(MailInfo)}/>
      <Route path={`${match.path}/waiting`}
        component={checkId(WaitPage)}/>
      <Route path={`${match.path}/bigfive`}
        component={checkId(Bigfive)}/>
      <Route path={`${match.path}/instruction`}
        component={checkId(Instruction)}/>
      <Route path={`${match.path}/ready`}
        component={checkId(ReadyPage)}/>
      <Route path={`${match.path}/running`}
        component={checkId(RunningPage)}/>
      <Route path={`${match.path}/complete`}
        component={checkId(CompletePage)}/>
      <Route path={`${match.path}/interview/invitation`}
        component={checkId(Interview)}/>
      <Route path={`${match.path}/interview/accept`}
        component={checkId(InterviewAcceptPage)}/>
      <Route path={`${match.path}/interview/schedule`}
        component={checkId(InterviewSchedulePage)}/>
      <Route path={`${match.path}/compensation`}
        component={checkId(Compensation)}/>
      <Route path={`${match.path}/waitforpay`}
        component={checkId(WaitForPayPage)}/>
      <Route path={`${match.path}/error`}
        component={ErrorPage}/>
      <Route path={match.path}>
        <Redirect to={`${match.path}/orientation`} />
      </Route>
    </Switch>
  )
}
