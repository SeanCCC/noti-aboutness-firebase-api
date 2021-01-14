import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ScheduleModal from './ScheduleModal'
import MultiplePayModal from './MultiplePayModal'
import { Table, Button, Modal } from 'semantic-ui-react'
import status from '../../status'

export default class InterviewInviteCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReminder: false,
      cancelingInterview: false
    }
    this.sendReminder = this.sendReminder.bind(this)
    this.cancelInterview = this.cancelInterview.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  async cancelInterview () {
    const { cancelInterview, participant } = this.props
    this.setState({ cancelingInterview: true })
    await cancelInterview(participant.uid)
    this.setState({ cancelingInterview: false })
  }

  render () {
    const { participant: p, scheduleInterview, finishInterview, askAboutPayment } = this.props
    const { sendingReminder, cancelingInterview } = this.state
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.interviewInviteTime}
        </Table.Cell>
        <Table.Cell>
          {p.interviewAcceptTime || '尚未接受'}
        </Table.Cell>
        <Table.Cell>
          {p.interviewScheduleTime || '尚未安排時間'}
        </Table.Cell>
        <Table.Cell>
          {p.compensation + 300 + '元' || 'N/A'}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.INTERVIEW_INVITED
            ? <Fragment>
              <Modal
                size="mini"
                trigger={<Button content="寄出提醒信" loading={sendingReminder} disabled={sendingReminder} primary />}
                header='是否寄出提醒信'
                content='寄太多信會變成騷擾，務必先確認寄信頻率'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
              />
              <br/>上次寄提醒信：{p.interviewInviteRemindTime || '無'}
            </Fragment> : null}
          {p.status === status.INTERVIEW_ACCEPTED
            ? <ScheduleModal p={p} scheduleInterview={scheduleInterview}/>
            : null}
          {p.status === status.INTERVIEW_SCHEDULED
            ? <MultiplePayModal
              participant={p}
              finishInterview={finishInterview}
              askAboutPayment={askAboutPayment}
            />
            : null}
          <Modal
            size="mini"
            trigger={<Button content="取消訪談" loading={cancelingInterview} disabled={cancelingInterview} primary />}
            header='確認取消訪談'
            content='無'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.cancelInterview }]}
          />
        </Table.Cell>
      </Fragment>)
  }
}

InterviewInviteCell.propTypes = {
  scheduleInterview: PropTypes.func,
  sendReminderMail: PropTypes.func,
  finishInterview: PropTypes.func,
  cancelInterview: PropTypes.func,
  askAboutPayment: PropTypes.func,
  participant: PropTypes.object
}
