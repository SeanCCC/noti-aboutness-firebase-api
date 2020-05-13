import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { UnauthPage, ErrorPage, LoadingPage } from './ResultPage'
import { Redirect } from 'react-router-dom'
import status from '../status'

const statusMoveTable = [
  { status: status.INIT, path: '/participant/orientation', api: '/apis/participant/done/video' },
  { status: status.VIDEO_DONE, path: '/participant/mailinfo', api: '/apis/participant/done/sendconsent' },
  { status: status.CONSENT_SENT, path: '/participant/waiting' },
  { status: status.CONSENT_VALID, path: '/participant/instruction' },
  { status: status.READY, path: '/participant/ready' },
  { status: status.RESEARCH_RUNNING, path: '/participant/running' },
  { status: status.RESEARCH_DONE, path: '/participant/complete' },
  { status: status.SET_RECEIPT_MAIL_METHOD, path: '/participant/compensation/choosemail', api: '/apis/participant/done/receipt' },
  { status: status.SET_PAY_METHOD, path: '/participant/compensation/choosepay' },
  { status: status.PAYMENT_REQUIRED, path: '/participant/waitforpay' }
]

export const checkId = (WrappedComponent) => {
  class HOC extends Component {
    constructor (props) {
      super(props)
      this.state = {
        authed: null,
        loading: true,
        error: false,
        status: status.INIT
      }
      this.redirect = this.redirect.bind(this)
      this.nextStep = this.nextStep.bind(this)
    }

    async componentDidMount () {
      try {
        const { id } = queryString.parse(this.props.location.search)
        const res = await axios.get(`/apis/participant/checkid?id=${id}`)
        const { status } = res.data
        this.setState({ loading: false, authed: true, status })
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
      const newStatus = res.data.status
      await this.setState({ status: newStatus })
    }

    redirect () {
      const { status } = this.state
      const { location } = this.props
      const { pathname, search } = location
      const { id } = queryString.parse(search)
      const match = statusMoveTable.find(item => {
        return item.status === status
      })
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
      const { authed, loading } = this.state
      if (loading) return <LoadingPage text="載入中"/>
      else if (authed === true) {
        return this.redirect() || <WrappedComponent {...this.props}
          nextStep={this.nextStep}/>
      } else if (authed === false) return <UnauthPage/>
      else return <ErrorPage/>
    }
  }
  HOC.propTypes = {
    location: PropTypes.object
  }
  return HOC
}
