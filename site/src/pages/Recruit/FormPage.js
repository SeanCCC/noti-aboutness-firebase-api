import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'
import check from 'check-types'
import axios from 'axios'
import { genderOptions, boolOptions, androidSystemVersion, mobileOpitons, osOptions, cityOptions, jobOptions, networkAccessOptions, networkLimit } from './formOptions'
import { Redirect } from 'react-router-dom'
const formContent = [
  {
    type: 'group',
    content: [{
      type: 'input',
      label: '請輸入您的全名',
      name: 'name'
    }, {
      type: 'select',
      label: '您的性別是',
      name: 'gender',
      options: genderOptions
    }, {
      type: 'input',
      label: '請問您目前幾歲',
      placeholder: '填入數字即可',
      name: 'age',
      errorMsg: '輸入錯誤或不符合招募條件(20歲至60歲)'
    }]
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '請輸入您的職業',
      name: 'occupation',
      options: jobOptions
    }, {
      type: 'select',
      label: '請輸入您的所在縣市',
      name: 'city',
      options: cityOptions
    }]
  }, {
    type: 'group',
    content: [{
      type: 'input',
      label: '請輸入您的電子郵件',
      name: 'email'
    }, {
      type: 'input',
      label: '請出入您的手機號碼',
      name: 'phoneNumber',
      placeholder: '09XXXXXXXX'
    }]
  },
  {
    type: 'select',
    label: '請問您『目前』是否有與主持人（張永儒老師）有利害關係，例如：與主持人有課程或指導師生關係',
    name: 'personOfInterest',
    placeholder: '請選擇',
    errorMsg: '輸入錯誤或不符合招募條件(不得有利害關係)',
    options: boolOptions
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '請選擇您的手機品牌',
      name: 'phoneBrand',
      errorMsg: '該實驗目前不支援Android系統以外的手機系統',
      options: mobileOpitons
    }, {
      type: 'input',
      label: '請輸入您的手機品牌名稱（如果上一題選其他才要填）',
      placeholder: '上一題選其他才要填',
      name: 'brandName'
    }]
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '請選擇您的手機系統',
      errorMsg: '該實驗目前不支援Android系統以外的手機系統',
      name: 'phoneSystem',
      options: osOptions
    }, {
      type: 'select',
      label: '請選擇您的手機系統版本',
      errorMsg: '該實驗目前不支援Android 4以下或非Android系統的手機',
      name: 'androidVersion',
      options: androidSystemVersion
    }]
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '您搭配數據方案，每月數據限制是多少？',
      name: 'cellularAccess',
      options: networkLimit
    }, {
      type: 'select',
      label: '請問您多常透過手機連到網路？',
      name: 'onlineFrequency',
      options: networkAccessOptions
    }]
  }
]

const createDefaultState = () => {
  return formContent.reduce((acu, cur) => {
    const _acu = { ...acu }
    const defaultValue = {
      value: undefined,
      valid: false
    }
    if (cur.type === 'group') {
      cur.content.forEach(({ name }) => {
        _acu[name] = defaultValue
      })
    } else {
      _acu[cur.name] = defaultValue
    }
    return _acu
  }, {})
}

export default class FormPage extends Component {
  constructor (props) {
    super(props)
    const defaultState = createDefaultState()
    this.state = {
      submitted: false,
      repeat: false,
      uploading: false,
      error: false,
      accept: false,
      ...defaultState
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkVal = this.checkVal.bind(this)
    this.checkForm = this.checkForm.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderGroup = this.renderGroup.bind(this)
    this.renderForm = this.renderForm.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  checkVal (name) {
    let checkFunc = () => true
    if (['name', 'email'].includes(name)) checkFunc = check.nonEmptyString
    else if (['age'].includes(name)) checkFunc = (input) => check.number(Number(input)) && Number(input) >= 20 && Number(input) <= 60
    else if (['phoneNumber'].includes(name)) checkFunc = (input) => check.match(input, /^09\d{8}$/)
    else if (['phoneSystem'].includes(name)) checkFunc = (input) => input === 'android'
    else if (['phoneBrand'].includes(name)) checkFunc = (input) => input !== 'apple' && check.not.undefined(input)
    else if (['androidVersion'].includes(name)) checkFunc = (input) => input !== 'notAndroid' && input !== '4' && check.not.undefined(input)
    else if (['gender', 'city', 'occupation', 'cellularAccess', 'onlineFrequency'].includes(name)) {
      checkFunc = check.not.undefined
    } else if (['brandName'].includes(name)) {
      checkFunc = this.state.phoneBrand.value === 'other' ? check.nonEmptyString : () => true
    } else if (['personOfInterest'].includes(name)) {
      checkFunc = (input) => input === false
    } else return true
    const item = this.state[name]
    const valid = checkFunc(item.value)
    this.setState({ [name]: { ...item, valid } })
    return valid
  }

  checkForm () {
    return Object.keys(this.state).reduce((acu, name) => {
      const valid = this.checkVal(name)
      return valid && acu
    }, true)
  }

  handleChange (e, { name, value }) {
    const item = this.state[name]
    const { submitted } = this.state
    this.setState({ [name]: { ...item, value } }, () => {
      if (submitted) {
        this.checkVal(name)
      }
      if (name === 'phoneBrand') {
        this.checkVal('brandName')
      }
    })
  }

  onInputBlur (name) {
    const item = this.state[name]
    const { value } = item
    if (value === undefined) return
    this.setState({ [name]: { ...item, value: value.trim() } })
  }

  renderItem (item) {
    const { type, name } = item
    const { valid, value } = this.state[name]
    const { submitted, uploading } = this.state
    if (type === 'input') {
      const { label, placeholder, errorMsg } = item
      return (
        <Form.Input
          key={name}
          fluid
          value={value}
          label={label}
          disabled={uploading}
          placeholder={placeholder || label}
          name={name}
          error={!valid && submitted ? {
            content: errorMsg || '尚未填入或內容錯誤',
            pointing: 'below'
          } : null}
          onChange={this.handleChange}
          onBlur={() => { this.onInputBlur(name) }}
        />
      )
    } else if (type === 'select') {
      const { label, name, placeholder, options, errorMsg } = item
      return (
        <Form.Select
          key={name}
          fluid
          value={value}
          label={label}
          disabled={uploading}
          placeholder={placeholder || label}
          name={name}
          error={!valid && submitted ? {
            content: errorMsg || '尚未選擇或內容錯誤',
            pointing: 'below'
          } : null}
          options={options}
          onChange={this.handleChange}
        />
      )
    } else return null
  }

  renderGroup (item, idx) {
    const { content } = item
    return (
      <Form.Group widths='equal' key={idx}>
        {content.map(item => this.renderItem(item))}
      </Form.Group>
    )
  }

  renderForm (item, idx) {
    const { type } = item
    if (type === 'group') return this.renderGroup(item, idx)
    else return this.renderItem(item)
  }

  async onSubmit () {
    const valid = this.checkForm()
    this.setState({ submitted: true })
    if (!valid) return
    const getList = formContent.reduce((acu, cur) => {
      const _acu = [...acu]
      if (cur.type === 'group') {
        cur.content.forEach(item => {
          _acu.push(item.name)
        })
      } else {
        _acu.push(cur.name)
      }
      return _acu
    }, [])
    const payload = getList.reduce((acu, name) => {
      const cur = this.state[name].value
      acu[name] = cur
      return acu
    }, {})
    this.setState({ uploading: true })
    try {
      const res = await axios.post('/apis/form', payload)
      this.setState({ uploading: false, accept: true })
      if (res.status === 400) this.setState({ uploading: false, repeat: true })
      else this.setState({ uploading: false, error: true })
    } catch (err) {
      if (err.response && err.response.status === 400) this.setState({ uploading: false, repeat: true })
      else this.setState({ uploading: false, error: true })
    }
  }

  render () {
    const { uploading, accept, error, repeat, email } = this.state
    if (accept) {
      return <Redirect to={`/recruit/mail?email=${email.value}`} />
    } else if (error) {
      return <Redirect to='/recruit/error' />
    } else if (repeat) {
      return <Redirect to='/recruit/repeat' />
    }
    return (
      <div className="page">
        <Header as='h2' textAlign="center">招募問卷</Header>
        <Form>
          {formContent.map(this.renderForm)}
          <Form.Button fluid primary loading={uploading} onClick={this.onSubmit} >提交</Form.Button>
        </Form>
      </div>
    )
  }
}
