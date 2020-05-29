import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CandidateList from './CandidateList'
import { connect } from 'react-redux'
import { Accordion, Icon, Header, Button } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import Numbers from '../Numbers'

class Recruit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: [],
      loading: false
    }
    this.handleClick = this.handleClick.bind(this)
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
    const { activeIndex, loading } = this.state
    const { candidates, candidatesNumber } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">候選人面板</Header>
      <div className="numbers">
        <Header as="h3">候選名單</Header>
        <Numbers content={candidatesNumber} />
      </div>
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
          <CandidateList candidates={candidates} />
        </Accordion.Content>
      </Accordion>
      <Button/>
    </div>
  }
}

Recruit.propTypes = {
  updateCandidates: PropTypes.func,
  candidatesNumber: PropTypes.array,
  candidates: PropTypes.array
}

const mapStateToProps = (state) => ({
  candidates: state.candidates,
  candidatesNumber: state.candidatesNumber
})

export default connect(mapStateToProps)(Recruit)
