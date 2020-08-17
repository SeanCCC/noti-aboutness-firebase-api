import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import CandidateCell from './CandidateCell'
import HighlightTableBody from '../../HighlightTableBody'

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
    <HighlightTableBody
      Cell={CandidateCell}
      participants={candidates}
      porpMapper={
        (c) => {
          return {
            candidate: c
          }
        }
      }/>
  </Table>
}

CandidateList.propTypes = {
  candidates: PropTypes.array
}
