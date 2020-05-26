import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CandidateList from './CandidateList'
import { connect } from 'react-redux'
import { Accordion, Icon, Header } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import { dbRef } from '../util'
import { updateCandidates } from '../../redux/actions'

class Recruit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: [],
      loading: true
    }
    this.handleClick = this.handleClick.bind(this)
    this.updateCandidates = this.updateCandidates.bind(this)
  }

  componentDidMount () {
    dbRef('candidate', this.updateCandidates)
  }

  updateCandidates (candidates) {
    this.setState({ loading: false, candidates })
    this.props.updateCandidates({ candidates })
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
    const { candidates } = this.props
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
          <CandidateList candidates={candidates} />
        </Accordion.Content>

      </Accordion>

    </div>
  }
}

const mapStateToProps = (state) => ({
  candidates: state.candidates
})

Recruit.propTypes = {
  updateCandidates: PropTypes.func,
  candidates: PropTypes.array
}

export default connect(mapStateToProps, { updateCandidates })(Recruit)
