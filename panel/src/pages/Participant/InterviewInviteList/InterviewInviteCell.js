import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Header } from 'semantic-ui-react'
import status from '../../status'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ScheduleModalComponent = (props) => {
  const [schedulingInterview, setSchedulingInterview] = useState(false)
  const [interviewTime, setInterviewDate] = useState(
    new Date(moment().tz('Asia/Taipei').format())
  )
  const { p } = props
  const scheduleInterview = async () => {
    setSchedulingInterview(true)
    const tzTime = moment(interviewTime).tz('Asia/Taipei').format()
    await props.scheduleInterview(p.uid, tzTime)
    setSchedulingInterview(false)
  }
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`確認${p.name}的訪談時間`}</Header>
      訪談時間: <DatePicker
        selected={interviewTime}
        onChange={date => setInterviewDate(date)}
        showTimeSelect
        disabled={schedulingInterview}
        timeIntervals={1}
        dateFormat="yyyy MM dd h:mm aa"
      />
    </Modal.Description>
    <Modal
      size="mini"
      trigger={<Button content="設定訪談時間" loading={schedulingInterview} disabled={schedulingInterview} primary />}
      header='確認時間'
      content='無'
      actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: scheduleInterview }]}
    />
  </Modal.Content>
}

ScheduleModalComponent.propTypes = {
  p: PropTypes.object,
  scheduleInterview: PropTypes.func
}

export default class InterviewInviteCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReminder: false,
      finishingInterview: false,
      cancelingInterview: false
    }
    this.sendReminder = this.sendReminder.bind(this)
    this.finishInterview = this.finishInterview.bind(this)
    this.cancelInterview = this.cancelInterview.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  async finishInterview () {
    const { finishInterview, participant } = this.props
    this.setState({ finishingInterview: true })
    await finishInterview(participant.uid)
    this.setState({ finishingInterview: false })
  }

  async cancelInterview () {
    const { cancelInterview, participant } = this.props
    this.setState({ cancelingInterview: true })
    await cancelInterview(participant.uid)
    this.setState({ cancelingInterview: false })
  }

  render () {
    const { participant: p, scheduleInterview } = this.props
    const { sendingReminder, finishingInterview, cancelingInterview } = this.state
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
            ? <Modal
              size="mini"
              trigger={<Button content="安排訪談時間" primary />}
            >
              <ScheduleModalComponent p={p} scheduleInterview={scheduleInterview}/>
            </Modal>
            : null}
          {p.status === status.INTERVIEW_SCHEDULED
            ? <Modal
              size="mini"
              trigger={<Button content="完成訪談並支付報酬" loading={finishingInterview} disabled={finishingInterview} primary />}
              header='完成訪談並支付報酬'
              content='檢查是否完成支付與簽名領據'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.finishInterview }]}
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
  participant: PropTypes.object
}
