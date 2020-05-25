import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Accordion, Header, Icon } from 'semantic-ui-react'
import status from '../status'
import LoadingPage from '../LoadingPage'
import Numbers from '../Numbers'
import moment from 'moment-timezone'
import ConsentPendingList from './ConsentPendingList'
import ResearchPendingList from './ResearchPendingList'
import { dbRef } from '../util'

export default class PrepareParticipant extends Component {
  constructor (props) {
    super(props)
    this.state = {
      consentPendingParticipants: [],
      researchPendingParticipants: [],
      consentPendingNumber: [],
      activeIndex: [],
      loading: true
    }
    this.createPrepareNumber = this.createPrepareNumber.bind(this)
    this.updateParticipants = this.updateParticipants.bind(this)
    this.handleAccordionClick = this.handleAccordionClick.bind(this)
    this.createrResearchPendingNumber = this.createrResearchPendingNumber.bind(this)
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
    const consentPendingParticipants =
      participants.filter((d) => [status.INIT, status.VIDEO_DONE, status.CONSENT_SENT].includes(d.status))
    const researchPendingParticipants =
      participants.filter((d) => [status.CONSENT_VALID, status.BIG_FIVE_DONE, status.APP_VALID].includes(d.status))
    this.setState({
      consentPendingParticipants,
      researchPendingParticipants,
      loading: false
    }, this.createNumbers)
  }

  createNumbers () {
    this.createPrepareNumber()
    this.createrResearchPendingNumber()
  }

  createPrepareNumber () {
    const { consentPendingParticipants } = this.state
    const consentSentCount = consentPendingParticipants
      .filter((p) => p.status === status.CONSENT_SENT)
      .length
    const now = moment()
    const consentSent3DCount = consentPendingParticipants
      .filter((p) => {
        const then = moment(p.consentSentTime)
        const ms = now.diff(then)
        const hours = moment.duration(ms).asHours()
        return p.status === status.CONSENT_SENT && hours > 3 * 24
      })
      .length
    const consentPending = consentPendingParticipants.length
    const content = [
      { value: consentSent3DCount, label: '送出後已過三日', dangerous: consentSent3DCount > 0 },
      { value: consentSentCount, label: '已經送出', warning: consentSentCount > 0 },
      { value: consentPending, label: '總人數' }
    ]
    this.setState({ consentPendingNumber: content })
  }

  createrResearchPendingNumber () {
    const { researchPendingParticipants } = this.state
    const yetConfigAppCount = researchPendingParticipants
      .filter((p) => p.status !== status.APP_VALID)
      .length
    const researchPending = researchPendingParticipants.length
    const content = [
      { value: yetConfigAppCount, label: '尚未設定App' },
      { value: researchPending, label: '總人數' }
    ]
    this.setState({ researchPendingNumber: content })
  }

  render () {
    const {
      loading,
      consentPendingNumber,
      researchPendingNumber,
      consentPendingParticipants,
      researchPendingParticipants,
      activeIndex
    } = this.state
    if (loading) return <LoadingPage/>
    return <div className="page">
      <Header as="h1">實驗前準備</Header>
      <div className="numbers">
        <Header as="h3">等待同意書</Header>
        <Numbers content={consentPendingNumber} />
      </div>
      <div className="numbers">
        <Header as="h3">尚未設定App</Header>
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
  fetchParticipants: PropTypes.func
}
