import React, { Component } from 'react'
import { Header, Segment, Dimmer, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      await axios.get(`/apis/recruit/form/mailcheck?id=${id}`)
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

export function SuccessPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>驗證成功</Header>
      <Segment attached>
          研究團隊將於短期內與您聯絡
      </Segment>
    </div>
  )
}

export function FailPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>驗證失敗</Header>
      <Segment attached>
        表單尚未填寫，請<Link to="/recruit/form">填寫問卷</Link>
      </Segment>
    </div>
  )
}

export function RepeatPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>驗證失敗</Header>
      <Segment attached>
          此信箱過去已驗證
      </Segment>
    </div>
  )
}

export function ErrorPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>驗證失敗</Header>
      <Segment attached>
        出現未知的錯誤，研究團隊將儘速著手處理
      </Segment>
    </div>
  )
}
