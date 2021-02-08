import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Table, Button, Modal, Header, Image } from 'semantic-ui-react'
import status from '../../status'
import { mailMethodOptions, payMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'
import { firebaseStorage } from '../../../firebaseInit'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

const ConfirmModalComponent = (props) => {
  const [paymentCompleting, setPaymentCompleting] = useState(false)
  const [payDate, setPayDate] = useState(
    new Date(moment().tz('Asia/Taipei').format())
  )
  const { p } = props
  const completePayment = async () => {
    setPaymentCompleting(true)
    const tzTime = moment(payDate).tz('Asia/Taipei').format()
    await props.completePayment(p.uid, tzTime)
    setPaymentCompleting(false)
  }
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`確認${p.name}的支付時間`}</Header>
      支付時間: <DatePicker
        selected={payDate}
        onChange={date => setPayDate(date)}
        showTimeSelect
        disabled={paymentCompleting}
        timeIntervals={1}
        dateFormat="yyyy MM dd h:mm"
      />
    </Modal.Description>
    <Modal
      size="mini"
      trigger={<Button content="支付完成" loading={paymentCompleting} disabled={paymentCompleting} primary />}
      header='確認支付完成嗎?'
      content='記得小心確認有轉帳給對的人喔'
      actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: completePayment }]}
    />
  </Modal.Content>
}

ConfirmModalComponent.propTypes = {
  p: PropTypes.object,
  completePayment: PropTypes.func
}

const InfoModalComponent = (props) => {
  const { p, passbook } = props
  if (!p.payDetail) return <div>N/A</div>
  const { payDetail } = p
  const payMethod = translate(payMethodOptions, payDetail.payMethod, '未設定')
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`${p.name}的支付資訊`}</Header>
      姓名:{p.name}<br/>
      報酬金額:{p.compensation}元<br/>
      支付方式:{payMethod}<br/>
      {
        payDetail.payMethod === 'linePay'
          ? `LinePay帳號:${payDetail.linePayAccount}`
          : null
      }
      {
        payDetail.payMethod === 'bankTransfer'
          ? <div>
            銀行帳號:{payDetail.bankAccount}
            <br/>
            銀行代號:{payDetail.bankCode}
            <Image src={passbook} size="large"/>
          </div>
          : null
      }
      {
        payDetail.payMethod === 'jko'
          ? `街口帳號:${payDetail.jkoAccount}`
          : null
      }
    </Modal.Description>
  </Modal.Content>
}

InfoModalComponent.propTypes = {
  p: PropTypes.object,
  passbook: PropTypes.string
}

const ReversedInfoModalComponent = (props) => {
  const { p, sendReverseNotice } = props
  const { receiptReverseInfo } = p
  const [loading, setLoading] = useState(false)
  const mailMethod = translate(mailMethodOptions, p.mailMethod, '未送出')
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`${p.name}的回郵資訊`}</Header>
      姓名:{receiptReverseInfo.mailBackName}<br/>
      地址:{receiptReverseInfo.mailBackAddress}<br/>
      電話:{receiptReverseInfo.mailBackCell}<br/>
      郵遞區號:{receiptReverseInfo.mailBackPostNumber}<br/>
      寄送方法:{mailMethod}<br/>
      回郵時間:{receiptReverseInfo.reverseNoticedTime || '尚未送出回郵'} <br/>
      <Modal
        size="mini"
        trigger={<Button content="通知回郵已寄出" loading={loading} disabled={!!receiptReverseInfo.reverseNoticedTime} primary />}
        header='是否通知回郵已寄出'
        content='請在貼上28元郵資並且確實寄出後再點選，記得要在地址旁寫上電話號碼。'
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

ReversedInfoModalComponent.propTypes = {
  p: PropTypes.object,
  passbook: PropTypes.string,
  sendReverseNotice: PropTypes.func,
  receiptReverseInfo: PropTypes.object
}

export default class ConsentPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReceiptReminder: false,
      sendingPayMethodReminder: false,
      passbook: null
    }
    this.sendReceiptReminder = this.sendReceiptReminder.bind(this)
    this.sendPayMethodReminder = this.sendPayMethodReminder.bind(this)
    this.sendReverseNotice = this.sendReverseNotice.bind(this)
  }

  async componentDidMount () {
    const { participant } = this.props
    const { payDetail } = participant
    if ([status.RECEIPT_CHOSEN, status.PAYMENT_REQUIRED].includes(participant.status) &&
      payDetail.payMethod === 'bankTransfer') {
      const storageRef = firebaseStorage.ref()
      const passbook = await storageRef.child(payDetail.imgPath).getDownloadURL()
      this.setState({ passbook })
    }
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

  async sendReverseNotice () {
    const { participant } = this.props
    try {
      this.setState({ sendingReminder: true })
      await axios.post('/apis/participant/receipt/reversesent', {
        uid: participant.uid
      })
      this.setState({ sendingReminder: false })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { passbook } = this.state
    const { participant: p, completePayment } = this.props
    const { payDetail } = p
    const { sendingReceiptReminder, sendingPayMethodReminder } = this.state
    const mailMethod = translate(mailMethodOptions, p.receiptMailMethod, '未送出')
    const receiptMailTime = !p.receiptMailTime ? '未送出' : moment(new Date(p.receiptMailTime)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Fragment>
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
          {p.compensation + '元' || 'N/A'}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.WAIT_FOR_RECEIPT_REVERSED
            ? <Fragment><Modal
              size="massive"
              trigger={<Button content="回郵資訊與動作" primary />}
            >
              <ReversedInfoModalComponent p={p} sendReverseNotice={this.sendReverseNotice}/>
            </Modal>
            </Fragment>
            : null}
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
          {p.status === status.PAYMENT_REQUIRED || p.status === status.RECEIPT_CHOSEN
            ? <Fragment><Modal
              size="large"
              trigger={<Button content="支付資訊" primary />}
            >
              <InfoModalComponent p={p} passbook={passbook}/>
            </Modal>
            <Modal
              size="mini"
              trigger={<Button content="支付完成" primary />}
            >
              <ConfirmModalComponent p={p} completePayment={completePayment}/>
            </Modal>
            </Fragment>
            : null}
        </Table.Cell>
      </Fragment>)
  }
}

ConsentPendingCell.propTypes = {
  completePayment: PropTypes.func,
  sendReceiptReminder: PropTypes.func,
  sendPayMethodReminder: PropTypes.func,
  participant: PropTypes.object
}
