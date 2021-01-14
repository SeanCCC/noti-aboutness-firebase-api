import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import axios from 'axios'
import InterviewInviteCell from './InterviewInviteCell'
import HighlightTableBody from '../../HighlightTableBody'

export default class InterviewInviteList extends Component {
  async scheduleInterview (uid, interviewScheduleTime) {
    try {
      await axios.post('/apis/participant/interview/schedule', { uid, interviewScheduleTime })
    } catch (err) {
      console.error(err)
    }
  }

  async sendReminderMail (uid) {
    try {
      await axios.post('/apis/participant/interview/remind', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async finishInterview (uid) {
    try {
      await axios.post('/apis/participant/interview/finish', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async cancelInterview (uid) {
    try {
      await axios.post('/apis/participant/interview/cancel', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async askAboutPayment (uid) {
    try {
      await axios.post('/apis/participant/payment/ask', { uid, interview: true })
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
          <Table.HeaderCell>邀請時間</Table.HeaderCell>
          <Table.HeaderCell>接受時間</Table.HeaderCell>
          <Table.HeaderCell>訪談時間</Table.HeaderCell>
          <Table.HeaderCell>報酬金額</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <HighlightTableBody
        Cell={InterviewInviteCell}
        participants={participants}
        porpMapper={
          (p) => {
            return {
              scheduleInterview: this.scheduleInterview,
              sendReminderMail: this.sendReminderMail,
              finishInterview: this.finishInterview,
              cancelInterview: this.cancelInterview,
              askAboutPayment: this.askAboutPayment,
              participant: p
            }
          }
        }/>
    </Table>
  }
}

InterviewInviteList.propTypes = {
  participants: PropTypes.array
}
