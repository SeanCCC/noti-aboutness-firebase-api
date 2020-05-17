import React from 'react'
import Introduction from './Introduction'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import FormPage from './FormPage'
import MailCheckPage from './MailCheck'
import { AcceptPage, ReturnPage, EmailCheckPage, ErrorPage, RepeatPage } from './ResultPage'

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
      <Route path={`${match.path}/accept`}>
        <AcceptPage />
      </Route>
      <Route path={`${match.path}/mail`}>
        <EmailCheckPage />
      </Route>
      <Route path={`${match.path}/mailcheck`}
        component={MailCheckPage}/>
      <Route path={`${match.path}/return`}>
        <ReturnPage />
      </Route>
      <Route path={`${match.path}/repeat`}>
        <RepeatPage />
      </Route>
      <Route path={`${match.path}/error`}>
        <ErrorPage />
      </Route>
      <Route path={match.path}>
        <Redirect to={`${match.path}/introduction`} />
      </Route>
    </Switch>
  )
}
