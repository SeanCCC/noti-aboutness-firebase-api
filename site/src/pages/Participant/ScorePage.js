import React, { Component } from 'react'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { Header, Table } from 'semantic-ui-react'
import axios from 'axios'
import { ContactComp } from '../Contact'
import { LoadingPage, ErrorPage } from './ResultPage'

export default class ScorePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      esmDistDaily: [],
      totalEsm: 'NA',
      avgEsm: 'NA',
      dnum: 'NA'
    }
  }

  async componentDidMount () {
    try {
      const { location } = this.props
      const { search } = location
      const { id } = queryString.parse(search)
      const res = await axios.get(`/apis/participant/score?id=${id}`)
      console.log({ res })
      const { esmDistDaily, totalEsm, avgEsm, dnum } = res.data
      this.setState({ esmDistDaily, totalEsm, avgEsm, dnum, loading: false })
    } catch (err) {
      console.error(err)
      this.setState({ error: true })
    }
  }

  render () {
    const { loading, esmDistDaily, totalEsm, avgEsm, dnum, error } = this.state
    if (error) return <ErrorPage/>
    if (loading) return <LoadingPage text="載入中"/>
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">問卷填寫進度</Header>
        約定問卷日均數量爲3個<br/>
        到目前共{dnum}日<br/>
        每日平均{avgEsm}則通知<br/>
        共{totalEsm}則通知<br/>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>日期</Table.HeaderCell>
              <Table.HeaderCell>完成表單數量</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              esmDistDaily.map((item, idx) => {
                return <Table.Row key={idx}>
                  <Table.Cell collapsing>{item.date}</Table.Cell>
                  <Table.Cell>{item.amount}</Table.Cell>
                </Table.Row>
              })
            }
          </Table.Body>
        </Table>
        <ContactComp/>
      </div>
    )
  }
}

ScorePage.propTypes = {
  location: PropTypes.object
}
