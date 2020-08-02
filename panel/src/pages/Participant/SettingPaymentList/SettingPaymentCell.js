import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import status from '../../status'
import { mailMethodOptions, payMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

export default class ConsentPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      paymentCompleting: false,
      sendingReceiptReminder: false,
      sendingPayMethodReminder: false
    }
    this.paymentCompleted = this.paymentCompleted.bind(this)
    this.sendReceiptReminder = this.sendReceiptReminder.bind(this)
    this.sendPayMethodReminder = this.sendPayMethodReminder.bind(this)
  }

  async paymentCompleted () {
    const { participant, paymentCompleted } = this.props
    this.setState({ paymentCompleting: true })
    await paymentCompleted(participant.uid)
    this.setState({ paymentCompleting: false })
  }

  async sendReceiptReminder () {
    const { sendReceiptReminder, participant } = this.props
    this.setState({ sendingReceiptReminder: true })
    await sendReceiptReminder(participant.uid)
    this.setState({ sendingReceiptReminder: false })
  }

  async sendPayMethodReminder () {
    const { sendPayMethodReminder, participant } = this.props
    this.setState({ sendingPayMethodReminder: true })
    await sendPayMethodReminder(participant.uid)
    this.setState({ sendingPayMethodReminder: false })
  }

  render () {
    const { participant: p } = this.props
    const { payDetail } = []
    const { paymentCompleting, sendingReceiptReminder, sendingPayMethodReminder } = this.state
    const mailMethod = translate(mailMethodOptions, p.receiptMailMethod, '未送出')
    const receiptMailTime = !p.receiptMailTime ? '未送出' : moment(new Date(p.receiptMailTime)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {mailMethod}
        </Table.Cell>
        <Table.Cell>
          {receiptMailTime}
        </Table.Cell>
        <Table.Cell>
          {!payDetail ? '未設定' : translate(payMethodOptions, payDetail.payMethod, '未設定')}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.SET_RECEIPT_MAIL_METHOD
            ? <Fragment><Modal
              size="mini"
              trigger={<Button content="寄出領據提醒信" loading={sendingReceiptReminder} disabled={sendingReceiptReminder} primary />}
              header='是否寄出領據提醒信'
              content='寄太多信會變成騷擾，務必先確認寄信頻率'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReceiptReminder }]}
            />
            <br/>上次寄信：{p.receiptReminderSent || '無'}</Fragment>
            : null}
          {p.status === status.SET_PAY_METHOD
            ? <Fragment><Modal
              size="mini"
              trigger={<Button content="寄出支付方法提醒信" loading={sendingPayMethodReminder} disabled={sendingPayMethodReminder} primary />}
              header='是否寄出支付方法提醒信'
              content='寄太多信會變成騷擾，務必先確認寄信頻率'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendPayMethodReminder }]}
            />
            <br/>上次寄信：{p.payMethodReminderSent || '無'}</Fragment>
            : null}
          {p.status === status.PAYMENT_REQUIRED
            ? <Modal
              size="mini"
              trigger={<Button content="支付完成" loading={paymentCompleting} disabled={paymentCompleting} primary />}
              header='確認支付完成嗎?'
              content='記得小心確認有轉帳給對的人喔'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.paymentCompleted }]}
            />
            : null}
        </Table.Cell>
      </Table.Row>)
  }
}

ConsentPendingCell.propTypes = {
  paymentCompleted: PropTypes.func,
  sendReceiptReminder: PropTypes.func,
  sendPayMethodReminder: PropTypes.func,
  participant: PropTypes.object
}
