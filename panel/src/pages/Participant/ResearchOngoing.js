import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import ResearchOngoingList from './ResearchOngoingList'
import Numbers from '../Numbers'

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
      researchRunningParticipants,
      researchRunningNumber
    } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗中面板</Header>
      <div className="numbers">
        <Header as="h3">數值異常</Header>
        <Numbers content={researchRunningNumber} />
      </div>
      <ResearchOngoingList
        participants={researchRunningParticipants}
      />
    </div>
  }
}

ResearchOngoing.propTypes = {
  researchRunningParticipants: PropTypes.array,
  researchOngoingNumber: PropTypes.array,
  researchRunningNumber: PropTypes.array
}

const mapStateToProps = (state) => ({
  researchRunningParticipants: state.researchRunningParticipants,
  researchOngoingNumber: state.researchOngoingNumber,
  researchRunningNumber: state.researchRunningNumber
})

export default connect(mapStateToProps)(ResearchOngoing)
