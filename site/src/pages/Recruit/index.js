import React from 'react'
import Introduction from './Introduction'
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from 'react-router-dom'
import FormPage from './FormPage'
import { AcceptPage, ReturnPage } from './ResultPage'

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
      <Route path={`${match.path}/return`}>
        <ReturnPage />
      </Route>
      <Route path={match.path}>
        <Redirect to={`${match.path}/introduction`} />
      </Route>
    </Switch>
  )
}
