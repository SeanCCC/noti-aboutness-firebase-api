import React, { Component, Fragment } from 'react'
import { Form } from 'semantic-ui-react'
import { firebaseDB } from '../../firebaseInit'
import check from 'check-types'
import _ from 'lodash'
import moment from 'moment-timezone'

class FetchQuestionnaire extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uid: '',
      uidValid: false,
      qid: '',
      qidValid: false,
      fetching: false,
      submitted: false,
      questionnaire: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkVal = this.checkVal.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
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
      this.checkVal(name)
    })
  }

  checkVal (name) {
    const v = this.state[name]
    const valid = check.nonEmptyString(v)
    this.setState({ [`${name}Valid`]: valid })
  }

  async submit () {
    const { uid, uidValid, qid, qidValid } = this.state
    this.checkVal('uid')
    this.checkVal('qid')
    this.setState({ submitted: true })
    if (!uidValid || !qidValid) return
    this.setState({ fetching: true })
    const rtn = await firebaseDB.ref(`/questionnaire/${uid}`).once('value')
    const qs = rtn.val()
    const questionnaire = _.chain(qs)
      .reduce((acc, cur) => {
        if (acc !== null) return acc
        if (check.assigned(cur[qid])) return cur[qid]
        return null
      }, null)
      .value()
    this.setState({ fetching: false, questionnaire })
  }

  render () {
    const { uid, fetching, uidValid, submitted, qid, qidValid, questionnaire } = this.state
    return <Fragment>
      <Form.Input
        key='uid'
        fluid
        value={uid}
        label='uid'
        disabled={fetching}
        name='uid'
        error={!uidValid && submitted ? {
          content: '尚未填入或內容錯誤',
          pointing: 'below'
        } : null}
        onChange={this.handleChange}
        onBlur={() => { this.onInputBlur('uid') }}
      />
      <Form.Input
        key='qid'
        fluid
        value={qid}
        label='qid'
        disabled={fetching}
        name='qid'
        error={!qidValid && submitted ? {
          content: '尚未填入或內容錯誤',
          pointing: 'below'
        } : null}
        onChange={this.handleChange}
        onBlur={() => { this.onInputBlur('qid') }}
      />
      <Form.Button fluid
        primary
        loading={fetching}
        disabled={fetching}
        onClick={this.submit} >提交</Form.Button>
    </Fragment>
  }
}

export default FetchQuestionnaire
