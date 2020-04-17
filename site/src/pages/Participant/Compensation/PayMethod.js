import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import check from 'check-types'
import { ContactComp } from '../../Contact'
import { JkoSegment, LinePaySegment, BankTransferSegment } from './PaySegments'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

export default class PayMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      uploading: false,
      bankCode: null,
      bankCodeValid: false,
      bankAccount: null,
      bankAccountValid: false,
      jkoAccount: null,
      jkoValid: false,
      linePayAccount: null,
      linePayValid: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.checkVal = this.checkVal.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange (e, { name, value }) {
    const { submitted } = this.state
    this.setState({ [name]: value }, () => {
      if (submitted) {
        this.checkVal(name)
      }
    })
  }

  async checkVal (name) {
    const value = this.state[name]
    const valid = check.nonEmptyString(value)
    if (name === 'jkoAccount') {
      await this.setState({ jkoValid: valid })
    } else if (name === 'linePayAccount') {
      await this.setState({ linePayValid: valid })
    } else if (name === 'bankAccount') {
      await this.setState({ bankAccountValid: valid })
    } else if (name === 'bankCode') {
      await this.setState({ bankCodeValid: valid })
    }
    return valid
  }

  onInputBlur (name) {
    const value = this.state[name]
    if (value === null) return
    this.setState({ [name]: value.trim() })
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const { setStep, payMethod, submitPayInfo } = this.props
    if (payMethod === null) return
    await this.checkVal('jkoAccount')
    await this.checkVal('linePayAccount')
    await this.checkVal('bankAccount')
    await this.checkVal('bankCode')
    const { jkoValid, linePayValid, bankAccountValid, bankCodeValid } = this.state
    if (payMethod === 'bankTransfer' && (!bankAccountValid || !bankCodeValid)) return
    else if (payMethod === 'linePay' && !linePayValid) return
    else if (payMethod === 'jko' && !jkoValid) return
    setStep(2)
    this.setState({ uploading: true })
    const { bankAccount, bankCode, linePayAccount, jkoAccount } = this.state
    if (payMethod === 'bankTransfer') {
      await submitPayInfo({ bankAccount, bankCode })
    } else if (payMethod === 'linePay') {
      await submitPayInfo({ linePayAccount })
    } else if (payMethod === 'jko') {
      await submitPayInfo({ jkoAccount })
    }
    this.setState({ uploading: false })
  }

  render () {
    const { submitted, uploading, jkoValid, jkoAccount, linePayValid, linePayAccount, bankAccountValid, bankCodeValid, bankCode, bankAccount } = this.state
    const { setPayMethod, payMethod } = this.props
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">領取報酬</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        1.請選擇收款方式，然後點擊最底下『送出』<br/>
        2.在進行街口支付與LINE pay的付款時，我們會核對本名是否與報名表單填寫的一致。
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='我想用街口支付領取報酬。'
            onChange={() => { setPayMethod('jko') }}
            checked={payMethod === 'jko'}
          />
          <Checkbox
            label='我想用LINE pay領取報酬。'
            onChange={() => { setPayMethod('linePay') }}
            checked={payMethod === 'linePay'}
          />
          <Checkbox
            label='我想用接收匯款的方式領取報酬。'
            onChange={() => { setPayMethod('bankTransfer') }}
            checked={payMethod === 'bankTransfer'}
          />
          {submitted && payMethod === null
            ? <Message negative>
              <Message.Header>請選擇領取方式</Message.Header>
            </Message>
            : null}
        </Segment>
        { payMethod === 'jko' ? <JkoSegment jkoValid={jkoValid}
          jkoAccount={jkoAccount}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
        /> : null }
        { payMethod === 'linePay' ? <LinePaySegment linePayValid={linePayValid}
          linePayAccount={linePayAccount}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
        /> : null }
        { payMethod === 'bankTransfer' ? <BankTransferSegment bankAccountValid={bankAccountValid}
          bankAccount={bankAccount}
          bankCodeValid={bankCodeValid}
          bankCode={bankCode}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
        /> : null }
        <Segment attached>
          <Button fluid
            primary
            onClick={this.onSubmit}
            uploading={uploading} >送出</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

PayMethod.propTypes = {
  setPayMethod: PropTypes.func,
  submitPayInfo: PropTypes.func,
  setStep: PropTypes.func,
  payMethod: PropTypes.oneOfType([null, PropTypes.string])
}
