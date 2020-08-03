import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Accordion, Header, Icon } from 'semantic-ui-react'
import LoadingPage from '../LoadingPage'
// import Numbers from '../Numbers'
import status from '../status'
import ConsentPendingList from './ConsentPendingList'
import PayOrInviteList from './PayOrInviteList'
import SettingPaymentList from './SettingPaymentList'

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
      // researchDoneNumber,
      researchDoneParticipants
    } = this.props
    if (loading) return <LoadingPage/>
    const payOrInvite = researchDoneParticipants.filter(p => p.status === status.RESEARCH_DONE)
    const Inverviewees = researchDoneParticipants.filter(p => [status.INTERVIEW_ACCEPTED, status.INTERVIEW_INVITED, status.INTERVIEW_SCHEDULED].includes(p.status))
    const settingPayment = researchDoneParticipants.filter(p => [status.SET_RECEIPT_MAIL_METHOD, status.SET_PAY_METHOD, status.PAYMENT_REQUIRED].includes(p.status))
    const allDone = researchDoneParticipants.filter(p => [status.PAYMENT_DONE].includes(p.status))
    return <div className="page">
      <Header as="h1">實驗後面板</Header>
      {/* <div className="numbers">
        <Header as="h3">帶</Header>
        <Numbers content={researchDoneNumber} />
      </div> */}
      <Accordion fluid styled className="short-marginned">
        <Accordion.Title
          size="x-large"
          active={activeIndex === 0}
          index={0}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />尚未寄邀請訪談或領取報酬({payOrInvite.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(0)}>
          <PayOrInviteList
            participants={payOrInvite}
          />
        </Accordion.Content>
        <Accordion.Title
          size="x-large"
          active={activeIndex === 1}
          index={1}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />訪談相關名單({Inverviewees.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(1)}>
          <ConsentPendingList
            participants={Inverviewees}
          />
        </Accordion.Content>
        <Accordion.Title
          size="x-large"
          active={activeIndex === 2}
          index={2}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />報酬待領取({settingPayment.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(2)}>
          <SettingPaymentList
            participants={settingPayment}
          />
        </Accordion.Content>
        <Accordion.Title
          size="x-large"
          active={activeIndex === 3}
          index={3}
          onClick={this.handleAccordionClick}
        >
          <Header as="h3"><Icon name='dropdown' />全程完成({allDone.length})</Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(3)}>
          <ConsentPendingList
            participants={allDone}
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
