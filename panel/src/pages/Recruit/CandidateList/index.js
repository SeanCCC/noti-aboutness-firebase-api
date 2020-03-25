import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import CandidateCell from './CandidateCell'

export default function CandidateList (props) {
  const { candidates, fetchCandidates } = props
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
      {candidates.map((c, idx) => <CandidateCell fetchCandidates={fetchCandidates} candidate={c} key={idx}/>)}
    </Table.Body>
  </Table>
}

CandidateList.propTypes = {
  candidates: PropTypes.array,
  fetchCandidates: PropTypes.func
}
