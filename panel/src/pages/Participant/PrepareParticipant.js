import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Accordion, Header, Icon } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import Numbers from '../Numbers'
import ConsentPendingList from './ConsentPendingList'
import ResearchPendingList from './ResearchPendingList'
import { dbRef } from '../util'
import { updateParticipants } from '../../redux/actions'

class PrepareParticipant extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: [],
      loading: true
    }
    this.updateParticipants = this.updateParticipants.bind(this)
    this.handleAccordionClick = this.handleAccordionClick.bind(this)
  }

  componentDidMount () {
    dbRef('participant', this.updateParticipants)
  }

  handleAccordionClick (e, titleProps) {
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

  updateParticipants (participants) {
    this.props.updateParticipants({ participants })
    this.setState({
      loading: false
    })
  }

  render () {
    const { loading, activeIndex } = this.state
    const {
      consentPendingNumber,
      researchPendingNumber,
      consentPendingParticipants,
      researchPendingParticipants
    } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗前面板</Header>
      <div className="numbers">
        <Header as="h3">等待同意書</Header>
        <Numbers content={consentPendingNumber} />
      </div>
      <div className="numbers">
        <Header as="h3">正在準備實驗</Header>
        <Numbers content={researchPendingNumber} />
      </div>
      <Accordion fluid styled className="short-marginned">
        <Accordion.Title
          size="x-large"
          active={activeIndex === 0}
          index={0}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />等待同意書名單({consentPendingParticipants.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(0)}>
          <ConsentPendingList
            participants={consentPendingParticipants}
          />
        </Accordion.Content>
        <Accordion.Title
          size="x-large"
          active={activeIndex === 1}
          index={1}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />正在準備實驗({researchPendingParticipants.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(1)}>
          <ResearchPendingList
            participants={researchPendingParticipants}
          />
        </Accordion.Content>
      </Accordion>
    </div>
  }
}

PrepareParticipant.propTypes = {
  updateParticipants: PropTypes.func,
  consentPendingParticipants: PropTypes.array,
  researchPendingParticipants: PropTypes.array,
  consentPendingNumber: PropTypes.array,
  researchPendingNumber: PropTypes.array
}

const mapStateToProps = (state) => ({
  consentPendingParticipants: state.consentPendingParticipants,
  researchPendingParticipants: state.researchPendingParticipants,
  consentPendingNumber: state.consentPendingNumber,
  researchPendingNumber: state.researchPendingNumber
})

export default connect(mapStateToProps, { updateParticipants })(PrepareParticipant)
