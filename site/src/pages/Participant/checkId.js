import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { UnauthPage, ErrorPage, LoadingPage } from './ResultPage'
import { Redirect } from 'react-router-dom'
import status from '../status'

const statusMoveTable = [
  { status: status.INIT, path: '/participant/orientation', api: '/apis/participant/done/video' },
  { status: status.VIDEO_DONE, path: '/participant/mailchoose', api: '/apis/participant/done/sendchoose' },
  { status: status.CONSENT_CHOSEN, path: '/participant/mailinfo', api: '/apis/participant/done/sendconsent' },
  { status: status.WAIT_FOR_REVERSED, path: '/participant/waitreversed' },
  { status: status.CONSENT_SENT, path: '/participant/waiting' },
  { status: status.CONSENT_VALID, path: '/participant/bigfive', api: '/apis/participant/done/bigfive' },
  { status: status.BIG_FIVE_DONE, path: '/participant/instruction' },
  { status: status.READY, path: '/participant/ready' },
  { status: status.RESEARCH_RUNNING, path: '/participant/score' },
  { status: status.RESEARCH_DONE, path: '/participant/complete' },
  { status: status.SET_RECEIPT_MAIL_METHOD, path: '/participant/compensation/choosemail', api: '/apis/participant/done/receipt' },
  { status: status.SET_PAY_METHOD, path: '/participant/compensation/choosepay' },
  { status: status.WAIT_FOR_RECEIPT_REVERSED, path: '/participant/compensation/waitreversed' },
  { status: status.RECEIPT_CHOSEN, path: '/participant/compensation/mailinfo', api: '/apis/participant/done/sendreceipt' },
  { status: status.PAYMENT_REQUIRED, path: '/participant/waitforpay' },
  { status: status.ALL_DONE, path: '/participant/done' }
]

export const checkId = (WrappedComponent) => {
  class HOC extends Component {
    constructor (props) {
      super(props)
      this.state = {
        authed: null,
        loading: true,
        error: false,
        status: status.INIT,
        phoneBrand: null,
        receiptMailMethod: null
      }
      this.redirect = this.redirect.bind(this)
      this.nextStep = this.nextStep.bind(this)
      this.setStatus = this.setStatus.bind(this)
    }

    async componentDidMount () {
      try {
        const { id } = queryString.parse(this.props.location.search)
        const res = await axios.get(`/apis/participant/checkid?id=${id}`)
        const data = res.data
        this.setState({ loading: false, authed: true, ...data })
      } catch (err) {
        if (err.response && err.response.status === 401) this.setState({ loading: false, authed: false })
        else this.setState({ loading: false, error: true })
      }
    }

    async nextStep (payload) {
      const { status } = this.state
      const { location } = this.props
      const { search } = location
      const { id } = queryString.parse(search)
      const match = statusMoveTable.find(item => {
        return item.status === status
      })
      const { api } = match
      if (api === undefined) return
      const res = await axios.post(api, { id, ...payload })
      const data = res.data
      await this.setState({ ...data })
    }

    setStatus (status) {
      this.setState({ status })
    }

    redirect () {
      const { status } = this.state
      const { location } = this.props
      const { pathname, search } = location
      const { id } = queryString.parse(search)
      const match = statusMoveTable.find(item => {
        return item.status === status
      })
      window.scrollTo(0, 0)
      if (match === undefined) {
        this.setState({ error: true, authed: false })
        return <ErrorPage/>
      } else if (match.path === pathname) {
        return null
      } else {
        const newPath = `${match.path}?id=${id}`
        return <Redirect to={newPath}/>
      }
    }

    render () {
      const { authed, loading, status, phoneBrand, receiptMailMethod } = this.state
      if (loading) return <LoadingPage text="載入中"/>
      else if (authed === true) {
        return this.redirect() || <WrappedComponent {...this.props}
          receiptMailMethod={receiptMailMethod}
          phoneBrand={phoneBrand}
          nextStep={this.nextStep}
          status={status}
          setStatus={this.setStatus}/>
      } else if (authed === false) return <UnauthPage/>
      else return <ErrorPage/>
    }
  }
  HOC.propTypes = {
    location: PropTypes.object
  }
  return HOC
}
