import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'semantic-ui-react'
import axios from 'axios'
import status from '../../status'

export default class ResearchPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReminder: false
    }
    this.sendReminder = this.sendReminder.bind(this)
    this.startResearch = this.startResearch.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  async startResearch (uid) {
    try {
      await axios.post('/apis/participant/research/start', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { sendingReminder } = this.state
    const { participant: p } = this.props
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.BIG_FIVE_DONE || p.status === status.APP_VALID ? '是' : '否'}
        </Table.Cell>
        <Table.Cell>
          {p.deviceId !== undefined ? '是' : '否'}
        </Table.Cell>
        <Table.Cell>
          {p.researchStartDate}
        </Table.Cell>
        <Table.Cell>

          {p.status !== status.APP_VALID
            ? <Fragment>
            上次寄信：{p.preResearchReminderSent || '無'} <br/>
            上次狀態變動：{p.lastStatusChanged || '無'} <br/>
              <Modal
                size="mini"
                trigger={<Button content="寄出提醒信" loading={sendingReminder} disabled={sendingReminder} primary />}
                header='是否寄出提醒信'
                content='寄太多信會變成騷擾，務必先確認寄信頻率'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
              />
            </Fragment>
            : null}
          {p.status === status.APP_VALID
            ? <Modal
              size="mini"
              trigger={<Button content="直接進入實驗" />}
              header='是否直接進入實驗'
              content='這是測試功能'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: () => this.startResearch(p.uid) }]}
            /> : null}
        </Table.Cell>
      </Fragment>)
  }
}

ResearchPendingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
