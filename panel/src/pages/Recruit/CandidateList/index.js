import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios'
import { Table } from 'semantic-ui-react'
import { mockCandidate } from '../mock'
import CandidateCell from './CandidateCell'
import LoadingPage from '../LoadingPage'

export default class CandidateList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      candidates: mockCandidate,
      loading: false
    }
    this.fetchCandidates = this.fetchCandidates.bind(this)
  }

  componentDidMount () {
    this.fetchCandidates()
  }

  async fetchCandidates () {
    this.setState({ loading: true })
    const res = await axios.get('/apis/recruit/candidates')
    const candidates = res.data
    this.setState({ candidates, loading: false })
  }

  render () {
    const { candidates, loading } = this.state
    if (loading) return <LoadingPage/>
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
        {candidates.map((c, idx) => <CandidateCell fetchCandidates={this.fetchCandidates} candidate={c} key={idx}/>)}
      </Table.Body>
    </Table>
  }
}

// CandidateList.propTypes = {
//   candidates: PropTypes.array
// }
