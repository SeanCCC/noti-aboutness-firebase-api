import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Header } from 'semantic-ui-react'
import axios from 'axios'
import status from '../../status'
import { mailMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'
import check from 'check-types'

const InfoModalComponent = (props) => {
  const { p, sendReverseNotice } = props
  const [loading, setLoading] = useState(false)
  const mailMethod = translate(mailMethodOptions, p.mailMethod, '未送出')
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`${p.name}的回郵資訊`}</Header>
      姓名:{p.mailBackName}<br/>
      地址:{p.mailBackAddress}<br/>
      電話:{p.mailBackCell}<br/>
      郵遞區號:{p.mailBackPostNumber}<br/>
      寄送方法:{mailMethod}<br/>
      回郵時間:{p.reverseNoticedTime || '尚未送出回郵'} <br/>
      <Modal
        size="mini"
        trigger={<Button content="通知回郵已寄出" loading={loading} disabled={!!p.reverseNoticedTime} primary />}
        header='是否通知回郵已寄出'
        content='請在確實寄出後再點選'
        actions={['取消', {
          key: 'confirm',
          content: '確定',
          positive: true,
          onClick: async () => {
            setLoading(true)
            await sendReverseNotice()
            setLoading(false)
          }
        }]}
      />
    </Modal.Description>
  </Modal.Content>
}

InfoModalComponent.propTypes = {
  p: PropTypes.object,
  passbook: PropTypes.string,
  sendReverseNotice: PropTypes.func
}

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

export default class ConsentPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      acceptingConsent: false,
      sendingReminder: false,
      sendingSendReminder: false
    }
    this.sendAcceptMail = this.sendAcceptMail.bind(this)
    this.sendReminder = this.sendReminder.bind(this)
    this.sendReverseNotice = this.sendReverseNotice.bind(this)
    this.sendSendReminder = this.sendSendReminder.bind(this)
  }

  async sendAcceptMail () {
    const { participant } = this.props
    try {
      this.setState({ acceptingConsent: true })
      await axios.post('/apis/participant/consent/accept', {
        uid: participant.uid
      })
      this.setState({ acceptingConsent: false })
    } catch (err) {
      console.error(err)
    }
  }

  async sendReminder () {
    const { participant } = this.props
    try {
      this.setState({ sendingReminder: true })
      await axios.post('/apis/participant/consent/remind', {
        uid: participant.uid
      })
      this.setState({ sendingReminder: false })
    } catch (err) {
      console.error(err)
    }
  }

  async sendSendReminder () {
    const { participant } = this.props
    try {
      this.setState({ sendingSendReminder: true })
      await axios.post('/apis/participant/consent/sendremind', {
        uid: participant.uid
      })
      this.setState({ sendingSendReminder: false })
    } catch (err) {
      console.error(err)
    }
  }

  async sendReverseNotice () {
    const { participant } = this.props
    try {
      this.setState({ sendingReminder: true })
      await axios.post('/apis/participant/consent/reversesent', {
        uid: participant.uid
      })
      this.setState({ sendingReminder: false })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participant: p } = this.props
    const { acceptingConsent, sendingReminder, sendingSendReminder } = this.state
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
          {p.status === status.WAIT_FOR_REVERSED
            ? <Fragment><Modal
              size="massive"
              trigger={<Button content="回郵資訊與動作" primary />}
            >
              <InfoModalComponent p={p} sendReverseNotice={this.sendReverseNotice}/>
            </Modal>
            </Fragment>
            : null}
          {p.status === status.CONSENT_SENT || p.status === status.CONSENT_CHOSEN
            ? <Fragment>
              <Modal
                size="mini"
                trigger={<Button content="確認同意書" loading={acceptingConsent} disabled={acceptingConsent} primary />}
                header='確認同意書有效'
                content='資料是否有填寫完整？'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendAcceptMail }]}
              />
              <Modal
                size="mini"
                trigger={<Button content="寄出提醒信" loading={sendingSendReminder} disabled={sendingSendReminder} primary />}
                header='是否寄出提醒信'
                content='寄太多信會變成騷擾，務必先確認寄信頻率'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendSendReminder }]}
              />
              <br/>上次動作時間：{p.reverseNoticedTime || p.lastStatusChanged}
            </Fragment>
            : <Fragment>
              <Modal
                size="mini"
                trigger={<Button content="寄出提醒信" loading={sendingReminder} disabled={sendingReminder} primary />}
                header='是否寄出提醒信'
                content='寄太多信會變成騷擾，務必先確認寄信頻率'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
              />
              <br/>{check.assigned(p.consentReminderSent) ? '上次寄提醒信' : '上次寄信'}：{p.consentReminderSent || p.lastStatusChanged}
            </Fragment>}
        </Table.Cell>
      </Fragment>)
  }
}

ConsentPendingCell.propTypes = {
  participant: PropTypes.object
}
