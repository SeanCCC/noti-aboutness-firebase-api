import React, { Component } from 'react'
import { Header, Segment, Button, Checkbox, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import bigfiveForm from './bigfiveForm'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

const likertScale = (text, no, value, onChange) => {
  return <div>
    {`${no + 1}. ${text}`}
    <div className="likert-scale">
      <div className="align-right">非常不精準</div>
      {[1, 2, 3, 4, 5].map((idx) => {
        return <div className="align-center"
          key={`${no}-${idx}`}>
          <div>{idx}</div>
          <Checkbox radio
            checked={value === idx}
            onChange={() => { onChange(no, idx) }} />
        </div>
      })}
      <div className="align-left">非常精準</div>
    </div>
  </div>
}

export default class Bigfive extends Component {
  constructor (props) {
    super(props)
    this.state = {
      done: false,
      submitted: false,
      loading: false,
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
    const errorList = bigfiveForm.reduce((acu, cur, idx) => {
      let _acu = [...acu]
      if (result[idx] === null || result[idx] === undefined) { _acu = [..._acu, idx] }
      return _acu
    }, []).map(v => v + 1)
    return errorList
  }

  async onSubmit () {
    const { result } = this.state
    const errorList = this.validate()
    const done = errorList.length === 0
    this.setState({ submitted: true, errorList, done })
    const { nextStep } = this.props
    if (!done) return
    this.setState({ loading: true })
    await nextStep({ result })
    this.setState({ loading: false })
  }

  render () {
    const { result, done, submitted, errorList, loading } = this.state
    const errorText = errorList.join(',')
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">五大人格量表（約花費五分鐘）</Header>
        <Segment attached>
          請以目前一般狀況中的自己描述，而非希望在未來成為的自己。
          請對照你所認識其他與你同性別且年紀相近的人，來描述你如實所見的自己。
          你的回應將會被絕對保密，因此你可以放心坦白地作答。
          請針對以下每個敘述指出對應的選項（1. 非常不精準 2. 有些不精準 3. 普通 4. 有些精準 5. 非常精準）
          作為您對自己的描述
        </Segment>
        <Segment attached>
          {bigfiveForm.map(({ text }, idx) => likertScale(text, idx, result[idx], this.onChange))}
        </Segment>
        {submitted && !done ? <Segment attached>
          <Message negative>
            <Message.Header>量表尚未完成</Message.Header>
            <p>{`請檢查第${errorText}題`}</p>
          </Message>
        </Segment> : null}
        <Segment attached>
          <Button fluid
            primary
            onClick={this.onSubmit}
            loading={loading}
            disabled={loading} >下一步</Button>
        </Segment>
      </div>
    )
  }
}

Bigfive.propTypes = {
  nextStep: PropTypes.func
}
