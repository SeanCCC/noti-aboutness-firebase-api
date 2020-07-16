import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Accordion, Header, Icon } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import Numbers from '../Numbers'
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
      // researchDoneNumber,
      researchOngoingParticipants
    } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗中面板</Header>
      {/* <div className="numbers">
        <Header as="h3">尚未寄信</Header>
        <Numbers content={researchDoneNumber} />
      </div> */}
      <ResearchOngoingList
        participants={researchOngoingParticipants}
      />
    </div>
  }
}

ResearchOngoing.propTypes = {
  researchOngoingParticipants: PropTypes.array,
  researchOngoingNumber: PropTypes.array
}

const mapStateToProps = (state) => ({
  researchOngoingParticipants: state.researchOngoingParticipants,
  researchOngoingNumber: state.researchOngoingNumber
})

export default connect(mapStateToProps)(ResearchOngoing)
