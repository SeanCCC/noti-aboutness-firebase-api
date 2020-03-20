import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'semantic-ui-react'
import { genderOptions, mobileOpitons, cityOptions, jobOptions, networkAccessOptions, networkLimit } from './formOptions'
import moment from 'moment-timezone'

const translate = (options, value) => {
  return options.find(opt => opt.value === value).text
}

const CandidateCell = ({ candidate: c }) => {
  const [loading, setLoading] = useState(false)
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
            <Button content="寄送邀請函" primary/>
            <Button content="寄送婉拒信" negative/>
          </Fragment>
          : <Button content="重新寄送"/>}

      </Table.Cell>
    </Table.Row>)
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
