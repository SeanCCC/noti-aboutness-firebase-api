import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { genderOptions, mobileOpitons, cityOptions, jobOptions, networkAccessOptions, networkLimit } from './formOptions'
import moment from 'moment-timezone'

const translate = (options, value) => {
  return options.find(opt => opt.value === value).text
}

class CandidateCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingAcceptMail: false,
      sendingDeclineMail: false,
      error: false
    }
    this.sendAcceptMail = this.sendAcceptMail.bind(this)
    this.sendDeclineMail = this.sendDeclineMail.bind(this)
  }

  async sendAcceptMail () {
    const { candidate } = this.props
    const { uuid } = candidate
    this.setState({ sendingAcceptMail: true })
    try {
      await axios.post('/apis/recruit/accept', { uuid })
    } catch (e) {
      console.error(e)
    }
    this.setState({ sendingAcceptMail: false })
  }

  async sendDeclineMail () {
    const { candidate } = this.props
    const { uuid } = candidate
    this.setState({ sendingDeclineMail: true })
    try {
      await axios.post('/apis/recruit/decline', { uuid })
    } catch (e) {
      console.error(e)
      this.setState({ error: true })
    }
    this.setState({ sendingDeclineMail: false })
  }

  render () {
    const { candidate: c } = this.props
    const { sendingDeclineMail, sendingAcceptMail } = this.state
    const city = translate(cityOptions, c.city)
    const occupation = translate(jobOptions, c.occupation)
    const gender = translate(genderOptions, c.gender)
    const brand = translate(mobileOpitons, c.phoneBrand)
    const cellularAccess = translate(networkLimit, c.cellularAccess)
    const onlineFrequency = translate(networkAccessOptions, c.onlineFrequency)
    const lastInvitationSent = !c.lastInvitationSent ? '未寄送' : moment(new Date(c.lastInvitationSent)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Table.Row>
        <Table.Cell>
          {c.name}
        </Table.Cell>
        <Table.Cell>
          {city} {occupation}<br/>
          {c.age}歲 {gender}<br/>
        </Table.Cell>
        <Table.Cell>
          {brand}<br/>
        Android {c.androidVersion}
        </Table.Cell>
        <Table.Cell>
          {cellularAccess} <br />
          {onlineFrequency}
        </Table.Cell>
        <Table.Cell>
          {c.email} <br />
          {c.phoneNumber}
        </Table.Cell>
        <Table.Cell>
          {lastInvitationSent}<br/>
          {!c.lastInvitationSent
            ? <Fragment>
              <Button content="寄送邀請函" loading={sendingAcceptMail} primary disabled={sendingDeclineMail} onClick={this.sendAcceptMail}/>
              <Modal
                trigger={<Button content="寄送婉拒信" loading={sendingDeclineMail} negative disabled={sendingAcceptMail}/>}
                header='確認'
                content='確定要婉拒嘛？？要想清楚喔～～'
                actions={['取消', { key: 'decline', content: '確定婉拒', positive: true, onClick: this.sendDeclineMail }]}
              />
            </Fragment>
            : <Button content="重新寄送" loading={sendingAcceptMail} onClick={this.sendAcceptMail}/>}
        </Table.Cell>
      </Table.Row>)
  }
}

CandidateCell.propTypes = {
  candidate: PropTypes.object
}

export default function CandidateList (props) {
  const { candidates } = props
  return <Table basic='very' celled collapsing>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>姓名</Table.HeaderCell>
        <Table.HeaderCell>基本資料</Table.HeaderCell>
        <Table.HeaderCell>手機品牌</Table.HeaderCell>
        <Table.HeaderCell>手機網路</Table.HeaderCell>
        <Table.HeaderCell>聯絡資訊</Table.HeaderCell>
        <Table.HeaderCell>寄信情形</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {candidates.map((c, idx) => <CandidateCell candidate={c} key={idx}/>)}
    </Table.Body>
  </Table>
}

CandidateList.propTypes = {
  candidates: PropTypes.array
}
