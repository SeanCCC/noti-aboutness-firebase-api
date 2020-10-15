import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'
import check from 'check-types'
import moment from 'moment-timezone'
import axios from 'axios'

const bigFiveDoneTemplate = (name, email) => ({
  age: '22',
  androidVersion: '10',
  cellularAccess: 'none',
  city: 'keelung',
  email,
  gender: 'female',
  mailMethod: 'selfDeliver',
  name,
  needToClose: true,
  occupation: 'student',
  onlineFrequency: 'serveralTimesADay',
  personOfInterest: false,
  phoneBrand: 'vivo',
  phoneNumber: '0900000000',
  phoneSystem: 'android',
  status: 'bigFiveDone',
  timestamp: moment().tz('Asia/Taipei').format(),
  travelPlan: false,
  wearableDevice: false
})

class ToolPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      nameValid: false,
      email: '',
      emailValid: false,
      uploading: false,
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkVal = this.checkVal.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.addParticipant = this.addParticipant.bind(this)
    this.submit = this.submit.bind(this)
  }

  onInputBlur (name) {
    const value = this.state[name]
    if (value === undefined) return
    this.setState({ [name]: value.trim() })
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
    const v = this.state[name]
    const valid = check.nonEmptyString(v)
    this.setState({ [`${name}Valid`]: valid })
  }

  async addParticipant (result) {
    try {
      await axios.post('/apis/participant/research/add', result)
    } catch (err) {
      console.error(err)
    }
  }

  async submit () {
    const { name, nameValid, email, emailValid } = this.state
    this.setState({ submitted: true })
    if (!nameValid || !emailValid) return
    const result = bigFiveDoneTemplate(name, email)
    this.setState({ uploading: true })
    await this.addParticipant(result)
    this.setState({ uploading: false })
  }

  render () {
    const { name, uploading, nameValid, submitted, email, emailValid } = this.state
    return <div className="page">
      <Header as="h1">快速新增參與者</Header>
      <Form.Input
        key='name'
        fluid
        value={name}
        label='姓名'
        disabled={uploading}
        name='name'
        error={!nameValid && submitted ? {
          content: '尚未填入或內容錯誤',
          pointing: 'below'
        } : null}
        onChange={this.handleChange}
        onBlur={() => { this.onInputBlur('name') }}
      />
      <Form.Input
        key='email'
        fluid
        value={email}
        label='Email'
        disabled={uploading}
        name='email'
        error={!emailValid && submitted ? {
          content: '尚未填入或內容錯誤',
          pointing: 'below'
        } : null}
        onChange={this.handleChange}
        onBlur={() => { this.onInputBlur('email') }}
      />
      <Form.Button fluid
        primary
        loading={uploading}
        disabled={uploading}
        onClick={this.submit} >提交</Form.Button>
    </div>
  }
}

export default ToolPage
