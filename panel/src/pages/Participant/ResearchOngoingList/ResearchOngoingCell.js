import React, { Component } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Header } from 'semantic-ui-react'
import BlockChart from './BlockChart'

class ModalComponent extends Component {
  render () {
    const { p } = this.props
    const { record } = this.state
    console.log(p)
    if (!record) return <div>N/A</div>
    return <Modal.Content scrolling>
      <Modal.Description>
        <Header as="h2">{`${p.name}的更多資訊`}</Header>
        <Header as="h3">問卷分佈</Header>
        <ResponsiveContainer width='100%' aspect={3}>
          <LineChart data={p.formDistDaily} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="linear" dataKey="amount" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
        <Header as="h3">通知分佈</Header>
        <Header as="h4">小時分佈</Header>
        <BlockChart data={p.notiDistHourly}/>
        <Header as="h4">日分佈</Header>
        <ResponsiveContainer width='100%' aspect={3}>
          <LineChart data={p.notiDistDaily} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
}

ModalComponent.propTypes = {
  p: PropTypes.object,
  uploadRecord: PropTypes.object
}

export default class ResearchOngoingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // sendingReminder: false
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
    // const { sendingReminder } = this.state
    const { participant: p } = this.props
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.meanNoti}
        </Table.Cell>
        <Table.Cell>
          {p.meanForm}
        </Table.Cell>
        <Table.Cell>
          {p.researchStartDate}
        </Table.Cell>
        <Table.Cell>
          <Modal
            size="fullscreen"
            trigger={<Button content="更多資訊" primary />}
          >
            <ModalComponent p={p}/>
          </Modal>
        </Table.Cell>
      </Table.Row>)
  }
}

ResearchOngoingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
