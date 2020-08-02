import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import axios from 'axios'
import SettingPaymentCell from './SettingPaymentCell'

export default class SettingPaymentList extends Component {
  async paymentCompleted (uid) {
    try {
      await axios.post('/apis/participant/payment/done', { uid })
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
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {participants.map((p, idx) => <SettingPaymentCell
          paymentCompleted={() => this.paymentCompleted(p.uid)}
          sendReceiptReminder={() => this.sendReceiptReminder(p.uid)}
          sendPayMethodReminder={() => this.sendPayMethodReminder(p.uid)}
          participant={p}
          key={idx}/>)}
      </Table.Body>
    </Table>
  }
}

SettingPaymentList.propTypes = {
  participants: PropTypes.array
}
