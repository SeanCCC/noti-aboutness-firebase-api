import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import MailMethod from './MailMethod'
import PayMethod from './PayMethod'
import { WaitForPayPage } from '../ResultPage'

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
    try {
      const res = await axios.post('/apis/form', payInfo)
      if (res.status === 200) this.setState({ accept: true })
    } catch (err) {
      if (err.response && err.response.status === 400) this.setState({ repeat: true })
      else this.setState({ error: true })
    }
  }

  render () {
    const { payMethod, mailMethod, payInfo, accept, error, repeat } = this.state
    const { match } = this.props
    if (accept) return (<Redirect to={'/participant/waitforpay'} />)
    else if (error) return (<Redirect to={'/participant/error'} />)
    return (
      <Switch>
        <Route path={`${match.path}/choosemail`}
        > <MailMethod
            setMailMethod={this.setMailMethod}
            mailMethod={mailMethod} /></Route>
        <Route path={`${match.path}/choosepay`}
        >{mailMethod === null ? <Redirect to={`${match.path}/choosemail`} /> : <PayMethod payInfo={payInfo}
            payMethod={payMethod}
            setPayMethod={this.setPayMethod}
            submitPayInfo={this.submitPayInfo}
          />}</Route>
        <Route path={`${match.path}/success`}
          component={WaitForPayPage}/>
        <Route path={match.path}>
          <Redirect to={`${match.path}/choosemail`} />
        </Route>
      </Switch>
    )
  }
}

Compensation.propTypes = {
  match: PropTypes.object
}
