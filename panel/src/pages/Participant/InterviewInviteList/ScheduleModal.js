import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Header } from 'semantic-ui-react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import interviewStatus from '../../interviewStatus'
import 'react-datepicker/dist/react-datepicker.css'

const ScheduleModal = (props) => {
  const [schedulingInterview, setSchedulingInterview] = useState(false)
  const [interviewTime, setInterviewDate] = useState(
    new Date(moment().tz('Asia/Taipei').format())
  )
  const { p } = props
  const scheduleInterview = async () => {
    setSchedulingInterview(true)
    const tzTime = moment(interviewTime).tz('Asia/Taipei').format()
    if (p.interviewStatus === interviewStatus.SCHEDULED) {
      await props.rescheduleInterview(p.uid, tzTime)
    } else await props.scheduleInterview(p.uid, tzTime)
    setSchedulingInterview(false)
  }
  const btnText = p.interviewStatus === interviewStatus.SCHEDULED
    ? '變更訪談時間' : '安排訪談時間'
  return <Modal
    size="mini"
    trigger={<Button content={btnText} primary />}
  >
    <Modal.Content scrolling>
      <Modal.Description>
        <Header as="h2">{`確認${p.name}的訪談時間`}</Header>
      訪談時間: <DatePicker
          selected={interviewTime}
          onChange={date => setInterviewDate(date)}
          showTimeSelect
          disabled={schedulingInterview}
          timeIntervals={5}
          dateFormat="yyyy/MM/dd HH:mm"
        />
      </Modal.Description>
      <Modal
        size="mini"
        trigger={<Button content="設定訪談時間" loading={schedulingInterview} disabled={schedulingInterview} primary />}
        header='確認時間'
        content={`${p.name}的訪談設定在${moment(interviewTime).tz('Asia/Taipei').format()}嗎？`}
        actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: scheduleInterview }]}
      />
    </Modal.Content>
  </Modal>
}

ScheduleModal.propTypes = {
  p: PropTypes.object,
  scheduleInterview: PropTypes.func,
  rescheduleInterview: PropTypes.func
}

export default ScheduleModal
