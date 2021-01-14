import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Header } from 'semantic-ui-react'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
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
    await props.scheduleInterview(p.uid, tzTime)
    setSchedulingInterview(false)
  }
  return <Modal
    size="mini"
    trigger={<Button content="安排訪談時間" primary />}
  >
    <Modal.Content scrolling>
      <Modal.Description>
        <Header as="h2">{`確認${p.name}的訪談時間`}</Header>
      訪談時間: <DatePicker
          selected={interviewTime}
          onChange={date => setInterviewDate(date)}
          showTimeSelect
          disabled={schedulingInterview}
          timeIntervals={1}
          dateFormat="yyyy MM dd h:mm aa"
        />
      </Modal.Description>
      <Modal
        size="mini"
        trigger={<Button content="設定訪談時間" loading={schedulingInterview} disabled={schedulingInterview} primary />}
        header='確認時間'
        content='無'
        actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: scheduleInterview }]}
      />
    </Modal.Content>
  </Modal>
}

ScheduleModal.propTypes = {
  p: PropTypes.object,
  scheduleInterview: PropTypes.func
}

export default ScheduleModal
