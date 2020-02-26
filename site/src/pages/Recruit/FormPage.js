import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'

const genderOptions = [
  { key: 'm', text: '男', value: 'male' },
  { key: 'f', text: '女', value: 'female' }
]

const boolOptions = [
  { key: 'true', text: '是', value: true },
  { key: 'false', text: '否', value: false }
]

const androidSystemVersion = [
  { key: '4', text: '4以下', value: '4' },
  { key: '5', text: '5.x.x', value: '5' },
  { key: '6', text: '6.x.x', value: '6' },
  { key: '7', text: '7.x.x', value: '7' },
  { key: '8', text: '8.x.x', value: '8' },
  { key: '9', text: '9.x.x', value: '9' },
  { key: '10', text: '10.x.x', value: '10' }
]

const mobileOpitons = [
  { key: 'apple', text: '蘋果', value: 'apple' },
  { key: 'samsung', text: '三星', value: 'samsung' },
  { key: 'oppo', text: 'OPPO', value: 'oppo' },
  { key: 'asus', text: '華碩', value: 'asus' },
  { key: 'htc', text: 'HTC', value: 'htc' },
  { key: 'sony', text: 'Sony', value: 'sony' },
  { key: 'xiaomi', text: '小米', value: 'xiaomi' },
  { key: 'huawei', text: '華為', value: 'huawei' },
  { key: 'google', text: 'Google', value: 'google' },
  { key: 'lg', text: 'LG', value: 'lg' },
  { key: 'vivo', text: 'VIVO', value: 'vivo' },
  { key: 'other', text: '其他', value: 'other' }
]

const osOptions = [
  { key: 'android', text: 'Android', value: 'android' },
  { key: 'ios', text: 'iOS', value: 'ios' },
  { key: 'other', text: '其他', value: 'other' }
]

export default class FormPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      name: null,
      gender: null,
      age: null,
      occupation: null,
      city: null,
      email: null,
      phoneNumber: null,
      phoneBrand: null,
      phoneSystem: null,
      androidVersion: null,
      cellularAccess: null,
      unlimitedCellular: null,
      brandName: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e, { name, value }) {
    this.setState({ [name]: value })
  }

  render () {
    return (
      <div className="page">
        <Header as='h2' textAlign="center">招募問卷</Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input fluid label='姓名' placeholder='姓名' name='name' onChange={this.handleChange} />
            <Form.Select
              fluid
              label='性別'
              name = 'gender'
              options={genderOptions}
              placeholder='性別'
              onChange={this.handleChange}
            />
            <Form.Input fluid name='age' label='年齡' placeholder='填入數字即可' onChange={this.handleChange} />
          </Form.Group>
          <Form.Input fluid name='occupation' label='職業' placeholder='職業' onChange={this.handleChange} />
          <Form.Input fluid name='city' label='所在縣市' placeholder='所在縣市' onChange={this.handleChange} />
          <Form.Input fluid name='email' label='電子郵件' placeholder='電子郵件' onChange={this.handleChange} />
          <Form.Input fluid name='phoneNumber' label='手機號碼' placeholder='手機號碼' onChange={this.handleChange} />
          <Form.Group widths='equal'>
            <Form.Select
              fluid
              label='手機品牌'
              name='phoneBrand'
              options={mobileOpitons}
              placeholder='手機品牌'
              onChange={this.handleChange}
            />
            <Form.Select
              fluid
              label='手機系統'
              name='phoneSystem'
              options={osOptions}
              placeholder='手機系統'
              onChange={this.handleChange}
            />
            <Form.Select
              fluid
              label='Android系統版本'
              name='androidVersion'
              options={androidSystemVersion}
              placeholder='Android系統版本'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Select
              fluid
              label='是否有3G/4G方案'
              options={boolOptions}
              placeholder='是否有3G/4G方案'
              name='cellularAccess'
              onChange={this.handleChange}
            />
            <Form.Select
              fluid
              label='是否有網路吃到飽'
              options={boolOptions}
              placeholder='是否有網路吃到飽'
              name='unlimitedCellular'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Button fluid primary >提交</Form.Button>
        </Form>
      </div>
    )
  }
}
