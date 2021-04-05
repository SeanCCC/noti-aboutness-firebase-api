import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ScheduleModal from './ScheduleModal'
import MultiplePayModal from './MultiplePayModal'
import { Table, Button, Modal } from 'semantic-ui-react'
import interviewStatus from '../../interviewStatus'
import check from 'check-types'
import status from '../../status'
import { cityOptions, jobOptions, genderOptions } from '../../formOptions'

const translate = (options, value) => {
  const opt = options.find(opt => opt.value === value)
  return opt ? opt.text : 'N/A'
}

export default class InterviewInviteCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cancelingInterview: false,
      decliningInterview: false,
      finishingInterview: false
    }
    this.cancelInterview = this.cancelInterview.bind(this)
    this.declineInterview = this.declineInterview.bind(this)
    this.finishInterview = this.finishInterview.bind(this)
  }

  async cancelInterview () {
    const { cancelInterview, participant } = this.props
    this.setState({ cancelingInterview: true })
    await cancelInterview(participant.uid)
    this.setState({ cancelingInterview: false })
  }

  async declineInterview () {
    const { declineInterview, participant } = this.props
    this.setState({ decliningInterview: true })
    await declineInterview(participant.uid)
    this.setState({ decliningInterview: false })
  }

  async finishInterview () {
    const { finishInterview, participant } = this.props
    this.setState({ finishingInterview: true })
    await finishInterview(participant.uid)
    this.setState({ finishingInterview: false })
  }

  render () {
    const {
      participant: p,
      scheduleInterview,
      rescheduleInterview,
      finishInterview,
      askAboutPayment
    } = this.props
    const {
      cancelingInterview,
      decliningInterview,
      finishingInterview
    } = this.state
    const city = translate(cityOptions, p.city)
    const job = translate(jobOptions, p.occupation)
    const gender = translate(genderOptions, p.gender)
    return (
      <Fragment>
        <Table.Cell>
          {p.name}/{p.age}歲/{gender}<br/>{city}/{job}<br/>{p.remoteInterview && '可遠端訪談' }
        </Table.Cell>
        <Table.Cell>
          {p.interviewInviteTime}
        </Table.Cell>
        <Table.Cell>
          {p.interviewScheduleTime || '尚未安排時間'}
        </Table.Cell>
        <Table.Cell>
          {check.assigned(p.compensation) ? p.compensation + 300 + '元' : 'N/A'}
        </Table.Cell>
        <Table.Cell>
          {p.interviewStatus === interviewStatus.PENDING &&
           <ScheduleModal p={p} scheduleInterview={scheduleInterview}/>
          }
          {p.interviewStatus === interviewStatus.SCHEDULED &&
            p.status === status.INTERVIEWEE &&
            <MultiplePayModal
              participant={p}
              finishInterview={finishInterview}
              askAboutPayment={askAboutPayment}
            />}
          {
            p.interviewStatus === interviewStatus.SCHEDULED &&
              p.status === status.RESEARCH_RUNNING &&
              <Modal
                size="mini"
                trigger={<Button content="訪談完成" loading={finishingInterview} disabled={finishingInterview} primary />}
                header='確認訪談完成'
                content='無'
                actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.finishInterview }]}
              />
          }
          { p.interviewStatus === interviewStatus.PENDING && <Modal
            size="mini"
            trigger={<Button content="參與者拒絕訪談" loading={decliningInterview} disabled={decliningInterview} primary />}
            header='確認參與者拒絕訪談'
            content='無'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.declineInterview }]}
          />}
          {p.interviewStatus === interviewStatus.SCHEDULED && <Modal
            size="mini"
            trigger={<Button content="取消訪談" loading={cancelingInterview} disabled={cancelingInterview} primary />}
            header='確認取消訪談'
            content='無'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.cancelInterview }]}
          />}
          {p.interviewStatus === interviewStatus.SCHEDULED &&
            <ScheduleModal
              p={p}
              scheduleInterview={scheduleInterview}
              rescheduleInterview={rescheduleInterview}
            />
          }
        </Table.Cell>
      </Fragment>)
  }
}

InterviewInviteCell.propTypes = {
  scheduleInterview: PropTypes.func,
  finishInterview: PropTypes.func,
  cancelInterview: PropTypes.func,
  askAboutPayment: PropTypes.func,
  declineInterview: PropTypes.func,
  rescheduleInterview: PropTypes.func,
  participant: PropTypes.object
}
