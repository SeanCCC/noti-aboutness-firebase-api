import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import ResearchOngoingList from './ResearchOngoingList'

class ResearchOngoing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render () {
    const { loading } = this.state
    const {
      researchRunningParticipants
    } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗中面板</Header>
      {/* <div className="numbers">
        <Header as="h3">尚未寄信</Header>
        <Numbers content={researchDoneNumber} />
      </div> */}
      <ResearchOngoingList
        participants={researchRunningParticipants}
      />
    </div>
  }
}

ResearchOngoing.propTypes = {
  researchRunningParticipants: PropTypes.array,
  researchOngoingNumber: PropTypes.array
}

const mapStateToProps = (state) => ({
  researchRunningParticipants: state.researchRunningParticipants,
  researchOngoingNumber: state.researchOngoingNumber
})

export default connect(mapStateToProps)(ResearchOngoing)
