import React, { Component } from 'react'
import { Header, Segment, Button, Checkbox, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

const questionList = [
  { text: 'test' },
  { text: 'test' }
]

const likertScale = (text, no, value, onChange) => {
  return <div>
    {`${no + 1}. ${text}`}
    <div className="likert-scale">
      <div className="align-center">非常不認同</div>
      {[1, 2, 3, 4, 5].map((idx) => {
        return <div className="align-center" key={`${no}-${idx}`}>
          <div>{idx}</div>
          <Checkbox radio checked={value === idx} onChange={() => { onChange(no, idx) }} />
        </div>
      })}
      <div className="align-center">非常認同</div>
    </div>
  </div>
}

export default class Bigfive extends Component {
  constructor (props) {
    super(props)
    this.state = {
      done: false,
      submitted: false,
      result: [],
      errorList: []
    }
    this.onChange = this.onChange.bind(this)
    this.validate = this.validate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange (no, value) {
    const { result } = this.state
    const _result = [...result]
    _result[no] = value
    this.setState({ result: _result })
  }

  validate () {
    const { result } = this.state
    const errorList = questionList.reduce((acu, cur, idx) => {
      let _acu = [...acu]
      if (result[idx] === null || result[idx] === undefined) { _acu = [..._acu, idx] }
      return _acu
    }, []).map(v => v + 1)
    return errorList
  }

  onSubmit () {
    const errorList = this.validate()
    const done = errorList.length === 0
    this.setState({ submitted: true, errorList, done })
    // if (!done) return
  }

  render () {
    const { result, done, submitted, errorList } = this.state
    const errorText = errorList.join(',')
    return (
      <div className="page">
        <Header as='h2' textAlign="center">五大人格量表</Header>
        <Segment attached>
          五大人格量表解說
        </Segment>
        <Segment attached>
          {questionList.map(({ text }, idx) => likertScale(text, idx, result[idx], this.onChange))}
        </Segment>
        {submitted && !done ? <Segment attached>
          <Message negative>
            <Message.Header>量表尚未完成</Message.Header>
            <p>請檢查第{errorText}題</p>
          </Message>
        </Segment> : null}
        <Segment attached>
          <Button fluid primary onClick={this.onSubmit} >下一步</Button>
        </Segment>
      </div>
    )
  }
}

Bigfive.propTypes = {
  location: PropTypes.object
}
