import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Accordion, Header, Icon } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
import Numbers from '../Numbers'
import ConsentPendingList from './ConsentPendingList'

class DoneParticipants extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: [],
      loading: false
    }
    this.handleAccordionClick = this.handleAccordionClick.bind(this)
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

  render () {
    const { loading, activeIndex } = this.state
    const {
      researchDoneNumber,
      researchDoneParticipants
    } = this.props
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗後面板</Header>
      <div className="numbers">
        <Header as="h3">尚未寄信</Header>
        <Numbers content={researchDoneNumber} />
      </div>
      <Accordion fluid styled className="short-marginned">
        <Accordion.Title
          size="x-large"
          active={activeIndex === 0}
          index={0}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />尚未寄信({researchDoneParticipants.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(0)}>
          <ConsentPendingList
            participants={researchDoneParticipants}
          />
        </Accordion.Content>
      </Accordion>
    </div>
  }
}

DoneParticipants.propTypes = {
  researchDoneParticipants: PropTypes.array,
  researchDoneNumber: PropTypes.array
}

const mapStateToProps = (state) => ({
  researchDoneParticipants: state.researchDoneParticipants,
  researchDoneNumber: state.researchDoneNumber
})

export default connect(mapStateToProps)(DoneParticipants)
