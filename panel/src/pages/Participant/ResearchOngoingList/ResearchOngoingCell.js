import React, { Component, Fragment } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Header } from 'semantic-ui-react'
import BlockChart from './BlockChart'

const ModalComponent = (props) => {
  const { p, record } = props
  if (!record) return <div>N/A</div>
  return <Modal.Content scrolling>
    <Modal.Description>
      <Header as="h2">{`${p.name}的更多資訊`}</Header>
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
      sendingReminder: false
    }
    this.sendReminder = this.sendReminder.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  render () {
    const { participant: p, record = {} } = this.props
    const { sendingReminder } = this.state
    return (
      <Fragment >
        <Table.Cell>
          {p.name}
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
          <br/>上次寄信：{p.researchReminderSent || '無'}
        </Table.Cell>
      </Fragment>)
  }
}

ResearchOngoingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object,
  record: PropTypes.object
}

export default ResearchOngoingCell
