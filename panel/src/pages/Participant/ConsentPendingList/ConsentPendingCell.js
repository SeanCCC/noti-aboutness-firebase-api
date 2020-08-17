import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import status from '../../status'
import { mailMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

export default class ConsentPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      acceptingConsent: false,
      sendingReminder: false
    }
    this.sendAcceptMail = this.sendAcceptMail.bind(this)
    this.sendReminder = this.sendReminder.bind(this)
  }

  async sendAcceptMail () {
    const { participant, acceptConsent } = this.props
    this.setState({ acceptingConsent: true })
    await acceptConsent(participant.uid)
    this.setState({ acceptingConsent: false })
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  render () {
    const { participant: p } = this.props
    const { acceptingConsent, sendingReminder } = this.state
    const mailMethod = translate(mailMethodOptions, p.mailMethod, '未送出')
    const consentSentTime = !p.consentSentTime ? '未送出' : moment(new Date(p.consentSentTime)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.INIT ? '否' : '是'}
        </Table.Cell>
        <Table.Cell>
          {mailMethod}
        </Table.Cell>
        <Table.Cell>
          {consentSentTime}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.CONSENT_SENT
            ? <Modal
              size="mini"
              trigger={<Button content="確認同意書" loading={acceptingConsent} disabled={acceptingConsent} primary />}
              header='確認同意書有效'
              content='資料是否有填寫完整？'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendAcceptMail }]}
            />
            : <Fragment>
              <Modal
                size="mini"
                trigger={<Button content="寄出提醒信" loading={sendingReminder} disabled={sendingReminder} primary />}
                header='是否寄出提醒信'
                content='寄太多信會變成騷擾，務必先確認寄信頻率'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
              />
              <br/>上次寄提醒信：{p.consentReminderSent || '無'}
            </Fragment>}
        </Table.Cell>
      </Fragment>)
  }
}

ConsentPendingCell.propTypes = {
  acceptConsent: PropTypes.func,
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
