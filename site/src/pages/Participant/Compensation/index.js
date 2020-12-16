import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Switch, Route } from 'react-router-dom'
import MailMethod from './MailMethod'
import PayMethod from './PayMethod'
import MailInfo from './MailInfo'
import { WaitForPayPage, ReserveWaitMessage } from '../ResultPage'

const Compensation = (props) => {
  const { match } = props
  const { id } = queryString.parse(props.location.search)
  return (
    <Switch>
      <Route path={`${match.path}/choosemail`}
      > <MailMethod {...props}
          id={id}
        /></Route>
      <Route path={`${match.path}/choosepay`}
      ><PayMethod {...props}
          id={id}
        /></Route>
      <Route path={`${match.path}/mailinfo`}
      ><MailInfo {...props}
          id={id}
        /></Route>
      <Route path={`${match.path}/waitreversed`}
        component={ReserveWaitMessage}/>
      <Route path={`${match.path}/success`}
        component={WaitForPayPage}/>
    </Switch>
  )
}

Compensation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default Compensation
