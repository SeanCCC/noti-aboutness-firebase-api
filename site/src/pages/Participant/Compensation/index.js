import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import MailMethod from './MailMethod'
import PayMethod from './PayMethod'

export default class Compensation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      payMethod: null,
      step: 1,
      repeat: false,
      error: false,
      accept: false
    }
    this.setPayMethod = this.setPayMethod.bind(this)
    this.setMailMethod = this.setMailMethod.bind(this)
    this.submitPayInfo = this.submitPayInfo.bind(this)
    this.setStep = this.setStep.bind(this)
  }

  setPayMethod (value) {
    this.setState({ payMethod: value })
  }

  setMailMethod (value) {
    this.setState({ mailMethod: value })
  }

  setStep (value) {
    this.setState({ step: value })
  }

  async submitPayInfo (payInfo) {
    try {
      const res = await axios.post('/apis/form', payInfo)
      if (res.status === 200) this.setState({ accept: true })
    } catch (err) {
      if (err.response && err.response.status === 400) this.setState({ repeat: true })
      else this.setState({ error: true })
    }
    // 轉址還沒完成
  }

  render () {
    const { payMethod, mailMethod, step, payInfo, accept, error, repeat } = this.state
    // if (accept) {
    //   return <Redirect to={'/recruit/mail'} />
    // } else if (error) {
    //   return <Redirect to='/recruit/error' />
    // } else if (repeat) {
    //   return <Redirect to='/recruit/repeat' />
    // }
    if (step === 0) {
      return <MailMethod setStep={this.setStep}
        setMailMethod={this.setMailMethod}
        mailMethod={mailMethod} />
    } else {
      return <PayMethod payInfo={payInfo}
        payMethod={payMethod}
        setStep={this.setStep}
        setPayMethod={this.setPayMethod}
        submitPayInfo={this.submitPayInfo}
      />
    }
  }
}

Compensation.propTypes = {
  nextStep: PropTypes.func
}
