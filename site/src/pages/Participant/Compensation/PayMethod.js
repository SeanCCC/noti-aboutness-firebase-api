import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Icon, Message, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../../Contact'
import LabMap from '../LabMap'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

export default class PayMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      loading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
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
        <Header as='h2' textAlign="center">領取報酬</Header>
        <Segment attached>
          <Header as='h3' textAlign="center">說明</Header>
        請選擇收款，然後點擊最底下『送出』
        </Segment>
        <Segment attached>
          <Header as='h3' textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='我想用街口支付領取報酬。'
            onChange={() => { setPayMethod('selfDeliver') }}
            checked={payMethod === 'selfDeliver'}
          />
          <Checkbox
            label='我想用LINE pay領取報酬。'
            onChange={() => { setPayMethod('registeredMail') }}
            checked={payMethod === 'registeredMail'}
          />
          <Checkbox
            label='我想用接收匯款的方式領取報酬。'
            onChange={() => { setPayMethod('ordinaryMail') }}
            checked={payMethod === 'ordinaryMail'}
          />
          {submitted && payMethod === null
            ? <Message negative>
              <Message.Header>請選擇交件方式</Message.Header>
            </Message>
            : null}
        </Segment>

        <Segment attached>
          <Button fluid primary onClick={this.onSubmit} loading={loading} >送出</Button>
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
