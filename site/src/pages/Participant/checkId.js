import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { UnauthPage, ErrorPage, LoadingPage } from './ResultPage'
import { Redirect } from 'react-router-dom'
import status from '../status'

const redirectTable = [
  { status: status.INIT, path: '/participant/orientation' },
  { status: status.VIDEO_DONE, path: '/participant/bigfive' },
  { status: status.BIG_FIVE_DONE, path: '/participant/mailinfo' },
  { status: status.CONSENT_SENT, path: '/participant/waiting' },
  { status: status.CONSENT_VALID, path: '/participant/instruction' },
  { status: status.READY, path: '/participant/ready' }
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
    }

    async componentDidMount () {
      try {
        const { id } = queryString.parse(this.props.location.search)
        const res = await axios.get(`/apis/site/participant/checkid?id=${id}`)
        const { status } = res.data
        this.setState({ loading: false, authed: true, status })
      } catch (err) {
        if (err.response && err.response.status === 401) this.setState({ loading: false, authed: false })
        else this.setState({ loading: false, error: true })
      }
    }

    redirect () {
      const { status } = this.state
      const { location } = this.props
      const { pathname, search } = location
      const { id } = queryString.parse(search)
      const matchRedirect = redirectTable.find(item => {
        return item.status === status
      })
      if (matchRedirect === undefined) {
        this.setState({ error: true, authed: false })
        return <ErrorPage/>
      } else if (matchRedirect.path === pathname) {
        return null
      } else return <Redirect to={`${matchRedirect.path}?id=${id}`}/>
    }

    render () {
      const { authed, loading } = this.state
      if (loading) return <LoadingPage text="網址檢查中"/>
      else if (authed === true) {
        return this.redirect() || <WrappedComponent {...this.props}/>
      } else if (authed === false) return <UnauthPage/>
      else return <ErrorPage/>
    }
  }
  HOC.propTypes = {
    location: PropTypes.object
  }
  return HOC
}
