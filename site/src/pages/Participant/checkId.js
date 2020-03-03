import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { UnauthPage, ErrorPage, LoadingPage } from './ResultPage'

export const checkId = (WrappedComponent) => {
  class HOC extends Component {
    constructor (props) {
      super(props)
      this.state = {
        authed: null,
        loading: true,
        error: false
      }
    }

    async componentDidMount () {
      try {
        const { id } = queryString.parse(this.props.location.search)
        await axios.get(`/apis/site/form?id=${id}`)
        this.setState({ loading: false, authed: true })
      } catch (err) {
        if (err.response && err.response.status === 401) this.setState({ loading: false, authed: false })
        else this.setState({ loading: false, error: true })
      }
    }

    render () {
      const { authed, loading } = this.state
      if (loading) return <LoadingPage text="網址檢查中"/>
      else if (authed === true) return <WrappedComponent {...this.props}/>
      else if (authed === false) return <UnauthPage/>
      else return <ErrorPage/>
    }
  }
  HOC.propTypes = {
    location: PropTypes.object
  }
  return HOC
}
