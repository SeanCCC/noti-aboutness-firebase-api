import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import axios from 'axios'
import PayOrInviteCell from './PayOrInviteCell'

export default class PayOrInviteList extends Component {
  async inviteInterview (uid) {
    try {
      await axios.post('/apis/participant/interview/invite', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async askAboutPayment (uid) {
    try {
      await axios.post('/apis/participant/payment/ask', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participants } = this.props
    return <Table basic='very' celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>姓名</Table.HeaderCell>
          <Table.HeaderCell>問卷完成數量</Table.HeaderCell>
          <Table.HeaderCell>實驗結束日期</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {participants.map((p, idx) => <PayOrInviteCell
          askAboutPayment={() => this.askAboutPayment(p.uid)}
          inviteInterview={() => this.inviteInterview(p.uid)}
          participant={p}
          key={idx}/>)}
      </Table.Body>
    </Table>
  }
}

PayOrInviteList.propTypes = {
  participants: PropTypes.array
}
