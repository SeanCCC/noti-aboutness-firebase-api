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
      jkoValid: true,
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

  checkVal (name) {
    const value = this.state[name]
    const valid = check.nonEmptyString(value)
    if (name === 'jkoAccount') {
      this.setState({ jkoValid: valid })
    } else if (name === 'linePayAccount') {
      this.setState({ linePayValid: valid })
    } else if (name === 'bankAccount') {
      this.setState({ bankAccountValid: valid })
    } else if (name === 'bankCode') {
      this.setState({ bankCodeValid: valid })
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
    const { setStep, payMethod } = this.props
    if (payMethod === null) return
    ['jkoAccount', 'linePayAccount', 'bankAccount', 'bankCode'].forEach(name => {
      this.checkVal(name)
    })
    const { jkoValid, linePayValid, bankAccountValid, bankCodeValid } = this.state
    if (payMethod === 'bankAccount' && (!bankAccountValid || !bankCodeValid)) return
    else if (payMethod === 'linePay' && !linePayValid) return
    else if (payMethod === 'jko' && !jkoValid) return
    setStep(2)
    // this.setState({ uploading: true })
    // this.setState({ uploading: false })
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
  setStep: PropTypes.func,
  payMethod: PropTypes.oneOfType([null, PropTypes.string])
}
