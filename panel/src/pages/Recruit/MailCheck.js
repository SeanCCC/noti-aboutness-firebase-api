import React, { Component } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import axios from 'axios'
import { SuccessPage, RepeatPage, ErrorPage, FailPage } from './ResultPage'

export default class MailCheckPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      succeed: null,
      loading: true,
      error: false,
      repeat: false
    }
  }

  async componentDidMount () {
    const { id } = queryString.parse(this.props.location.search)
    try {
      await axios.get(`/apis/site/form/mailcheck?id=${id}`)
      this.setState({ succeed: true, loading: false })
    } catch (err) {
      console.error(err)
      if (err.response && err.response.status === 400) {
        if (err.response.data === 'no record') this.setState({ succeed: false, loading: false })
        else if (err.response.data === 'repeated') this.setState({ repeat: true, loading: false })
      } else {
        this.setState({ error: true, loading: false })
      }
    }
  }

  render () {
    const { succeed, loading, error, repeat } = this.state
    if (loading) return <CheckingPage/>
    else if (succeed === true) return <SuccessPage/>
    else if (succeed === false) return <FailPage/>
    else if (repeat === true) return <RepeatPage/>
    else if (error) return <ErrorPage/>
    else return null
  }
}

MailCheckPage.propTypes = {
  location: PropTypes.object
}

function CheckingPage () {
  return (
    <div className="page">
      <Dimmer active inverted>
        <Loader inverted>驗證信箱中</Loader>
      </Dimmer>
    </div>
  )
}
