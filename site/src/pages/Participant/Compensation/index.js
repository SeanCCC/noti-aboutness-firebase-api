import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MailMethod from './MailMethod'
import PayMethod from './PayMethod'

export default class Compensation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      payMethod: null,
      step: 1,
      payInfo: null
    }
    this.setPayMethod = this.setPayMethod.bind(this)
    this.setMailMethod = this.setMailMethod.bind(this)
    this.setPayInfo = this.setPayInfo.bind(this)
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

  setPayInfo (payInfo) {
    this.setState({ payInfo })
  }

  render () {
    const { payMethod, mailMethod, step, payInfo } = this.state
    if (step === 0) {
      return <MailMethod setStep={this.setStep}
        setMailMethod={this.setMailMethod}
        mailMethod={mailMethod} />
    } else {
      return <PayMethod payInfo={payInfo}
        payMethod={payMethod}
        setStep={this.setStep}
        setPayMethod={this.setPayMethod}
      />
    }
  }
}

Compensation.propTypes = {
  nextStep: PropTypes.func
}
