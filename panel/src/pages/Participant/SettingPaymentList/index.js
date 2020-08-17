import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import moment from 'moment-timezone'
import axios from 'axios'
import SettingPaymentCell from './SettingPaymentCell'
import HighlightTableBody from '../../HighlightTableBody'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class SettingPaymentList extends Component {
  async completePayment (uid, date) {
    const payDate = moment(date).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
    await sleep(1000)
    try {
      await axios.post('/apis/participant/payment/done', { uid, payDate })
    } catch (err) {
      console.error(err)
    }
  }

  async sendReceiptReminder (uid) {
    try {
      await axios.post('/apis/participant/receipt/remind', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  async sendPayMethodReminder (uid) {
    try {
      await axios.post('/apis/participant/paymethod/remind', { uid })
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
          <Table.HeaderCell>領據寄送方法</Table.HeaderCell>
          <Table.HeaderCell>領據寄送時間</Table.HeaderCell>
          <Table.HeaderCell>支付工具</Table.HeaderCell>
          <Table.HeaderCell>報酬金額</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <HighlightTableBody
        Cell={SettingPaymentCell}
        participants={participants}
        porpMapper={
          (p) => {
            return {
              completePayment: this.completePayment,
              sendReceiptReminder: () => this.sendReceiptReminder(p.uid),
              sendPayMethodReminder: () => this.sendPayMethodReminder(p.uid),
              participant: p
            }
          }
        }/>
    </Table>
  }
}

SettingPaymentList.propTypes = {
  participants: PropTypes.array
}
