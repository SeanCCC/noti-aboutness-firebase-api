import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import axios from 'axios'
import ConsentPendingCell from './ConsentPendingCell'
import HighlightTableBody from '../../HighlightTableBody'

export default class ConsentPendingList extends Component {
  async acceptConsent (uid) {
    try {
      await axios.post('/apis/participant/consent/accept', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async sendReminderMail (uid) {
    try {
      await axios.post('/apis/participant/consent/remind', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participants } = this.props
    return <Table basic='very' celled >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>姓名</Table.HeaderCell>
          <Table.HeaderCell>是否已看介紹片</Table.HeaderCell>
          <Table.HeaderCell>寄送方法</Table.HeaderCell>
          <Table.HeaderCell>寄送時間</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <HighlightTableBody
        Cell={ConsentPendingCell}
        participants={participants}
        porpMapper={
          (p) => {
            return {
              acceptConsent: () => this.acceptConsent(p.uid),
              sendReminderMail: () => this.sendReminderMail(p.uid),
              participant: p
            }
          }
        }/>
    </Table>
  }
}

ConsentPendingList.propTypes = {
  participants: PropTypes.array
}
