import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Icon, Message, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../../Contact'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

export default class PayMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      loading: false,
      bankCode: null,
      bankAccount: null,
      jkoAccount: null,
      linePayAccount: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange (e, { name, value }) {
    const item = this.state[name]
    const { submitted } = this.state
    this.setState({ [name]: { ...item, value } }, () => {
      if (submitted) {
        this.checkVal(name)
      }
      if (name === 'phoneBrand') {
        this.checkVal('brandName')
      }
    })
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const { setStep, payMethod } = this.props
    if (payMethod === null) return
    setStep(2)
    // this.setState({ loading: true })
    // this.setState({ loading: false })
  }

  render () {
    const { submitted, loading } = this.state
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
            onChange={() => { setPayMethod('bankTransfer') }}
            checked={payMethod === 'bankTransfer'}
          />
          <Checkbox
            label='我想用LINE pay領取報酬。'
            onChange={() => { setPayMethod('linePay') }}
            checked={payMethod === 'linePay'}
          />
          <Checkbox
            label='我想用接收匯款的方式領取報酬。'
            onChange={() => { setPayMethod('jko') }}
            checked={payMethod === 'jko'}
          />
          {submitted && payMethod === null
            ? <Message negative>
              <Message.Header>請選擇領取方式</Message.Header>
            </Message>
            : null}
        </Segment>

        <Segment attached>
          <Button fluid
            primary
            onClick={this.onSubmit}
            loading={loading} >送出</Button>
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
