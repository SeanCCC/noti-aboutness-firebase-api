import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { genderOptions, mobileOpitons, cityOptions, jobOptions, networkAccessOptions, networkLimit } from '../../formOptions'
import moment from 'moment-timezone'

const translate = (options, value) => {
  const opt = options.find(opt => opt.value === value)
  return opt ? opt.text : 'N/A'
}

export default class CandidateCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingAcceptMail: false,
      acceptMailSent: false,
      sendingDeclineMail: false,
      declineMailSent: false,
      error: false
    }
    this.sendAcceptMail = this.sendAcceptMail.bind(this)
    this.sendDeclineMail = this.sendDeclineMail.bind(this)
  }

  async sendAcceptMail () {
    const { candidate } = this.props
    const { uid } = candidate
    this.setState({ sendingAcceptMail: true })
    try {
      await axios.post('/apis/recruit/accept', { uid })
      this.setState({ acceptMailSent: true })
    } catch (e) {
      console.error(e)
    }
    this.setState({ sendingAcceptMail: false })
  }

  async sendDeclineMail () {
    const { candidate } = this.props
    const { uid } = candidate
    this.setState({ sendingDeclineMail: true })
    try {
      await axios.post('/apis/recruit/decline', { uid })
      this.setState({ declineMailSent: true })
    } catch (e) {
      console.error(e)
      this.setState({ error: true })
    }
    this.setState({ sendingDeclineMail: false })
  }

  render () {
    const { candidate: c } = this.props
    const { sendingDeclineMail, sendingAcceptMail, acceptMailSent, declineMailSent } = this.state
    const city = translate(cityOptions, c.city)
    const occupation = translate(jobOptions, c.occupation)
    const gender = translate(genderOptions, c.gender)
    const brand = translate(mobileOpitons, c.phoneBrand)
    const cellularAccess = translate(networkLimit, c.cellularAccess)
    const onlineFrequency = translate(networkAccessOptions, c.onlineFrequency)
    const lastInvitationSent = !c.lastInvitationSent ? '未寄送' : moment(new Date(c.lastInvitationSent)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    const AcceptButton = acceptMailSent
      ? <Button content="寄送成功" primary disabled/>
      : <Button content="寄送邀請函" loading={sendingAcceptMail} primary disabled={sendingDeclineMail || declineMailSent} onClick={this.sendAcceptMail}/>
    const DeclineButton = declineMailSent
      ? <Button content="寄送成功" negative disabled/>
      : <Modal
        size="mini"
        trigger={<Button content="寄送婉拒信" loading={sendingDeclineMail} negative disabled={sendingAcceptMail || acceptMailSent}/>}
        header='確認'
        content='確定要婉拒嘛？？要想清楚喔～～'
        actions={['取消', { key: 'decline', content: '確定婉拒', negative: true, onClick: this.sendDeclineMail }]}
      />
    const ResendButton = acceptMailSent
      ? <Button content="寄送成功" disabled/>
      : <Modal
        size="mini"
        trigger={<Button content="重新寄送" loading={sendingAcceptMail} />}
        header='確認'
        content='確定要重新寄送嘛？'
        actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendAcceptMail }]}
      />
    return (
      <Table.Row>
        <Table.Cell>
          {c.name}
        </Table.Cell>
        <Table.Cell>
          {city} {occupation}<br/>
          {c.age}歲 {gender}<br/>
          {c.travelPlan ? '近一個月有旅行計畫' : '無旅行計畫'}
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
              {AcceptButton}
              {DeclineButton}
            </Fragment>
            : ResendButton}
        </Table.Cell>
      </Table.Row>)
  }
}

CandidateCell.propTypes = {
  candidate: PropTypes.object
}
