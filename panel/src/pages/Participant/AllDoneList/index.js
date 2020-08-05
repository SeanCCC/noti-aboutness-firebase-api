import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import AllDoneCell from './AllDoneCell'

const AllDoneList = (props) => {
  const { participants } = props
  return <Table basic='very' celled collapsing>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>姓名</Table.HeaderCell>
        <Table.HeaderCell>結束時間</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {participants.map((p, idx) => <AllDoneCell
        participant={p}
        key={idx}/>)}
    </Table.Body>
  </Table>
}

AllDoneList.propTypes = {
  participants: PropTypes.array
}

export default AllDoneList
