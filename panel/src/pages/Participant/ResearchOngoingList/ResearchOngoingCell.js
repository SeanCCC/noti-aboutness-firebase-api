import React, { Component, Fragment } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Header } from 'semantic-ui-react'
import axios from 'axios'
import BlockChart from './BlockChart'
import { cityOptions, jobOptions } from '../../formOptions'
import check from 'check-types'

const translate = (options, value) => {
  const opt = options.find(opt => opt.value === value)
  return opt ? opt.text : 'N/A'
}

const ModalComponent = (props) => {
  const { p, record } = props
  if (!record) return <div>N/A</div>
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`${p.name}的更多資訊`}</Header>
      <Header as="h3">聯絡資訊與uid</Header>
      Email: {p.email}<br/>
      手機號碼：{p.phoneNumber}<br/>
      手機：{p.phoneBrand}的{p.deviceModal}<br/>
      uid:{p.uid}
      <Header as="h3">問卷分佈</Header>
      <ResponsiveContainer width='100%' aspect={3}>
        <LineChart data={record.esmDistDaily} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="linear" dataKey="amount" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <Header as="h3">通知分佈</Header>
      <Header as="h4">小時分佈</Header>
      <BlockChart data={record.notiDistHourly}/>
      <Header as="h4">日分佈</Header>
      <ResponsiveContainer width='100%' aspect={3}>
        <LineChart data={record.notiDistDaily} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="linear" dataKey="amount" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Modal.Description>
  </Modal.Content>
}

ModalComponent.propTypes = {
  p: PropTypes.object,
  record: PropTypes.object
}

class ResearchOngoingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReminder: false,
      sendingInvitation: false
    }
    this.sendReminder = this.sendReminder.bind(this)
    this.sendInterviewInvitation = this.sendInterviewInvitation.bind(this)
    this.endResearch = this.endResearch.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  async sendInterviewInvitation () {
    const { inviteInterview, participant } = this.props
    this.setState({ sendingInvitation: true })
    await inviteInterview(participant.uid)
    this.setState({ sendingInvitation: false })
  }

  async endResearch (uid) {
    try {
      await axios.post('/apis/participant/research/done', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participant: p, record = {} } = this.props
    const { sendingReminder, sendingInvitation } = this.state
    const city = translate(cityOptions, p.city)
    const job = translate(jobOptions, p.occupation)
    return (
      <Fragment >
        <Table.Cell>
          {p.name}<br/>{city}/{job}
        </Table.Cell>
        <Table.Cell>
          {record.meanNotiCount || 'N/A'}
        </Table.Cell>
        <Table.Cell>
          {record.meanEsmCount || 'N/A'}
        </Table.Cell>
        <Table.Cell>
          {p.researchStartDate}
        </Table.Cell>
        <Table.Cell>
          <Modal
            size="fullscreen"
            trigger={<Button content="更多資訊" primary />}
          >
            <ModalComponent p={p} record={record}/>
          </Modal>
          <Modal
            size="mini"
            trigger={<Button content="寄出提醒信" loading={sendingReminder} disabled={sendingReminder} primary />}
            header='是否寄出提醒信'
            content='寄太多信會變成騷擾，務必先確認寄信頻率'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
          />
          {check.assigned(p.interviewStatus) ? null : <Modal
            size="mini"
            key={`${p.uid}-invitemodal`}
            trigger={<Button content="已經寄出訪談邀約" loading={sendingInvitation} disabled={sendingInvitation} primary />}
            header={`是否已經寄出${p.name}的訪談邀約？`}
            content='無'
            actions={['取消', { key: 'confirm', content: '是的', positive: true, onClick: this.sendInterviewInvitation }]}
          />}
          <Modal
            size="mini"
            trigger={<Button content="結束實驗" />}
            header='是否結束實驗'
            content='這是測試功能'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: () => this.endResearch(p.uid) }]}
          />
          <br/>上次寄信：{p.researchReminderSent || '無'}
        </Table.Cell>
      </Fragment>)
  }
}

ResearchOngoingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  inviteInterview: PropTypes.func,
  participant: PropTypes.object,
  record: PropTypes.object
}

export default ResearchOngoingCell
