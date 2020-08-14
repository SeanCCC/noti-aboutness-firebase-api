
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import axios from 'axios'
import ResearchOngoingCell from './ResearchOngoingCell'

class ResearchPendingList extends Component {
  async sendReminderMail (uid) {
    try {
      await axios.post('/apis/participant/researchRemind', { uid })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { participants, uploadRecord } = this.props
    // console.log({ hightlightList })
    return <Table basic='very' celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>姓名</Table.HeaderCell>
          <Table.HeaderCell>每日平均通知</Table.HeaderCell>
          <Table.HeaderCell>每日平均問卷</Table.HeaderCell>
          <Table.HeaderCell>實驗開始時間</Table.HeaderCell>
          <Table.HeaderCell>動作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {participants.map((p, idx) => <ResearchOngoingCell
          sendReminderMail={this.sendReminderMail}
          participant={p}
          record={uploadRecord[p.uid]}
          key={idx}/>)}
      </Table.Body>
    </Table>
  }
}

const mapStateToProps = (state) => ({
  uploadRecord: state.uploadRecord,
  researchRunningNumber: state.researchRunningNumber
})

ResearchPendingList.propTypes = {
  participants: PropTypes.array,
  uploadRecord: PropTypes.object,
  researchRunningNumber: PropTypes.array
}

export default connect(mapStateToProps)(ResearchPendingList)
