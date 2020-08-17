import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import axios from 'axios'
import ResearchPendingCell from './ResearchPendingCell'
import HighlightTableBody from '../../HighlightTableBody'

export default class ResearchDoneList extends Component {
  async sendReminderMail (uid) {
    try {
      await axios.post('/apis/participant/preResearchRemind', { uid })
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
          <Table.HeaderCell>實驗完成日期</Table.HeaderCell>
          <Table.HeaderCell>上次邀約時間</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <HighlightTableBody
        Cell={ResearchPendingCell}
        participants={participants}
        porpMapper={
          (p) => {
            return {
              sendReminderMail: this.sendReminderMail,
              participant: p
            }
          }
        }/>
    </Table>
  }
}

ResearchDoneList.propTypes = {
  participants: PropTypes.array
}
