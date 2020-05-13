import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {
  Switch,
  Route
} from 'react-router-dom'
import MailMethod from './MailMethod'
import PayMethod from './PayMethod'
import { WaitForPayPage } from '../ResultPage'
import { postFormData } from './utils'

export default class Compensation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      payMethod: null,
      repeat: false,
      error: false,
      accept: false
    }
    this.setPayMethod = this.setPayMethod.bind(this)
    this.setMailMethod = this.setMailMethod.bind(this)
    this.submitPayInfo = this.submitPayInfo.bind(this)
  }

  setPayMethod (value) {
    this.setState({ payMethod: value })
  }

  setMailMethod (value) {
    this.setState({ mailMethod: value })
  }

  async submitPayInfo (payInfo) {
    const { id } = queryString.parse(this.props.location.search)
    const { payMethod } = this.state
    try {
      const res = await postFormData('/apis/participant/done/compensation', { ...payInfo, payMethod, uid: id })
      if (res.status === 200) this.setState({ accept: true })
    } catch (err) {
      if (err.response && err.response.status === 400) this.setState({ repeat: true })
      else this.setState({ error: true })
    }
  }

  render () {
    const { payMethod, mailMethod, payInfo } = this.state
    const { match } = this.props
    const { id } = queryString.parse(this.props.location.search)
    return (
      <Switch>
        <Route path={`${match.path}/choosemail`}
        > <MailMethod
            {...this.props}
            id={id}
            setMailMethod={this.setMailMethod}
            mailMethod={mailMethod}
          /></Route>
        <Route path={`${match.path}/choosepay`}
        ><PayMethod {...this.props}
            payInfo={payInfo}
            payMethod={payMethod}
            id={id}
            setPayMethod={this.setPayMethod}
            submitPayInfo={this.submitPayInfo}
          /></Route>
        <Route path={`${match.path}/success`}
          component={WaitForPayPage}/>
      </Switch>
    )
  }
}

Compensation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}
