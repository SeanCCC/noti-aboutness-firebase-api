import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Header } from 'semantic-ui-react'
import axios from 'axios'
import status from '../../status'
import ConsentPendingCell from './ConsentPendingCell'
import LoadingPage from '../../LoadingPage'
import Numbers from '../../Numbers'
import moment from 'moment-timezone'

export default class ConsentPendingList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      participants: [],
      loading: false
    }
    this.fetchConsentPending = this.fetchConsentPending.bind(this)
    this.createNumbers = this.createNumbers.bind(this)
  }

  componentDidMount () {
    this.fetchConsentPending()
  }

  createNumbers () {
    const { participants } = this.state
    const consentSentCount = participants
      .filter((p) => p.status === status.CONSENT_SENT)
      .length
    const now = moment()
    const consentSent3DCount = participants
      .filter((p) => {
        const then = moment(p.consentSentTime)
        const ms = now.diff(then)
        const hours = moment.duration(ms).asHours()
        return p.status === status.CONSENT_SENT && hours > 3 * 24
      })
      .length
    const consentPending = participants.length
    const content = [
      { value: consentSent3DCount, label: '送出後已過三日', dangerous: true },
      { value: consentSentCount, label: '已經送出', warning: true },
      { value: consentPending, label: '總人數', warning: true }
    ]
    this.setState({ numberContent: content })
  }

  async fetchConsentPending () {
    try {
      this.setState({ loading: true })
      const res = await axios.get('/apis/participant/consent/pending')
      const participants = res.data
      this.setState({ participants, loading: false }, this.createNumbers)
    } catch (err) {
      console.error(err)
    }
  }

  async acceptConsent (uid) {
    try {
      await axios.post('/apis/participant/consent/accept', { uid })
      await this.fetchConsentPending()
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participants, loading, numberContent } = this.state
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h3" title="待簽署同意書"/>
      <Numbers content={numberContent} />
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>姓名</Table.HeaderCell>
            <Table.HeaderCell>是否已看介紹片</Table.HeaderCell>
            <Table.HeaderCell>寄送方法</Table.HeaderCell>
            <Table.HeaderCell>寄送時間</Table.HeaderCell>
            <Table.HeaderCell>動作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {participants.map((p, idx) => <ConsentPendingCell
            acceptConsent={() => this.acceptConsent(p.uid)}
            participant={p}
            key={idx}/>)}
        </Table.Body>
      </Table></div>
  }
}

ConsentPendingList.propTypes = {
  participants: PropTypes.array,
  fetchParticipants: PropTypes.func
}
