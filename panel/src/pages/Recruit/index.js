import React, { Component } from 'react'
import CandidateList from './CandidateList'
import { Accordion, Icon, Header } from 'semantic-ui-react'
import { mockCandidate } from './mock'
import LoadingPage from './LoadingPage'
import axios from 'axios'

// import {
//   Switch,
//   Route,
//   useRouteMatch,
//   Redirect
// } from 'react-router-dom'

export default class Recruit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: [],
      candidates: mockCandidate,
      loading: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.fetchCandidates = this.fetchCandidates.bind(this)
  }

  componentDidMount () {
    // this.fetchCandidates()
  }

  async fetchCandidates () {
    this.setState({ loading: true })
    const res = await axios.get('/apis/recruit/candidates')
    const candidates = res.data
    this.setState({ candidates, loading: false })
  }

  handleClick (e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const include = activeIndex.includes(index)
    let newIndex = []
    if (include) {
      newIndex = activeIndex.filter(item => item !== index)
    } else {
      newIndex = [...activeIndex, index]
    }

    this.setState({ activeIndex: newIndex })
  }

  render () {
    const { activeIndex, loading, candidates } = this.state
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Accordion fluid styled>
        <Accordion.Title
          size="x-large"
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Header as="h3"><Icon name='dropdown' />候選名單({candidates.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(0)}>
          <CandidateList candidates={candidates} fetchCandidates={this.fetchCandidates}/>
        </Accordion.Content>

      </Accordion>

    </div>
  }
}
