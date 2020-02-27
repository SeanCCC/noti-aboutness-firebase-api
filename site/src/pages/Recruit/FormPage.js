import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'
import check from 'check-types'
import axios from 'axios'
import { genderOptions, boolOptions, androidSystemVersion, mobileOpitons, osOptions, cityOptions } from './formOptions'

const formContent = [
  {
    type: 'group',
    content: [{
      type: 'input',
      label: '姓名',
      name: 'name'
    }, {
      type: 'select',
      label: '性別',
      name: 'gender',
      options: genderOptions
    }, {
      type: 'input',
      label: '年齡',
      placeholder: '填入數字即可',
      name: 'age'
    }]
  }, {
    type: 'input',
    label: '職業',
    name: 'occupation'
  }, {
    type: 'select',
    label: '所在縣市',
    name: 'city',
    options: cityOptions
  }, {
    type: 'input',
    label: '電子郵件',
    name: 'email'
  }, {
    type: 'input',
    label: '手機號碼',
    name: 'phoneNumber',
    placeholder: '09XXXXXXXX'
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '手機品牌',
      name: 'phoneBrand',
      options: mobileOpitons
    }, {
      type: 'input',
      label: '手機品牌名稱（如果上一題選其他才要填）',
      placeholder: '上一題選其他才要填',
      name: 'brandName'
    }]
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '手機系統',
      name: 'phoneSystem',
      options: osOptions
    }, {
      type: 'select',
      label: 'Android系統版本',
      name: 'androidVersion',
      options: androidSystemVersion
    }]
  }, {
    type: 'group',
    content: [{
      type: 'select',
      label: '是否有3G/4G方案',
      name: 'cellularAccess',
      options: boolOptions
    }, {
      type: 'select',
      label: '是否有網路吃到飽',
      name: 'unlimitedCellular',
      options: boolOptions
    }]
  }
]

export default class FormPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      uploading: false,
      name: {
        value: undefined,
        valid: false
      },
      gender: {
        value: undefined,
        valid: false
      },
      age: {
        value: undefined,
        valid: false
      },
      occupation: {
        value: undefined,
        valid: false
      },
      city: {
        value: undefined,
        valid: false
      },
      email: {
        value: undefined,
        valid: false
      },
      phoneNumber: {
        value: undefined,
        valid: false
      },
      phoneBrand: {
        value: undefined,
        valid: false
      },
      brandName: {
        value: undefined,
        valid: false
      },
      phoneSystem: {
        value: undefined,
        valid: false
      },
      androidVersion: {
        value: undefined,
        valid: false
      },
      cellularAccess: {
        value: undefined,
        valid: false
      },
      unlimitedCellular: {
        value: undefined,
        valid: false
      }
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
    if (['name', 'occupation', 'email'].includes(name)) checkFunc = check.nonEmptyString
    else if (['age'].includes(name)) checkFunc = (input) => check.number(Number(input))
    else if (['phoneNumber'].includes(name)) checkFunc = (input) => check.match(input, /^09\d{8}$/)
    else if (['gender', 'city', 'phoneBrand', 'phoneSystem', 'androidVersion', 'cellularAccess', 'unlimitedCellular'].includes(name)) {
      checkFunc = check.not.undefined
    } else if (['brandName'].includes(name)) {
      checkFunc = this.state.phoneBrand.value === 'other' ? check.nonEmptyString : () => true
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
      const { label, placeholder } = item
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
            content: '尚未填入或內容錯誤',
            pointing: 'below'
          } : null}
          onChange={this.handleChange}
          onBlur={() => { this.onInputBlur(name) }}
        />
      )
    } else if (type === 'select') {
      const { label, name, placeholder, options } = item
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
            content: '尚未填入或內容錯誤',
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
    const getList = ['name', 'occupation', 'email', 'age', 'phoneNumber', 'gender', 'city', 'phoneBrand', 'phoneSystem', 'androidVersion', 'cellularAccess', 'unlimitedCellular', 'brandName']
    const payload = getList.reduce((acu, name) => {
      const cur = this.state[name].value
      acu[name] = cur
      return acu
    }, {})
    this.setState({ uploading: true })
    await axios.post('/apis/recruit/form', payload)
    this.setState({ uploading: false })
  }

  render () {
    const { uploading } = this.state
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
