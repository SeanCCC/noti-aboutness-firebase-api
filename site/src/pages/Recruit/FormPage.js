import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'

const genderOptions = [
  { key: 'm', text: '男', value: 'male' },
  { key: 'f', text: '女', value: 'female' },
  { key: 'o', text: '其他', value: 'other' }
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
      name: ''
    }
  }

  render () {
    return (
      <div className="page">
        <Header as='h1'>招募問卷</Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input fluid label='姓名' placeholder='姓名' />
            <Form.Select
              fluid
              label='性別'
              options={genderOptions}
              placeholder='性別'
            />
            <Form.Input fluid label='年齡' placeholder='填入數字即可' />
          </Form.Group>
          <Form.Input fluid label='職業' placeholder='職業' />
          <Form.Input fluid label='所在縣市' placeholder='所在縣市' />
          <Form.Input fluid label='電子郵件' placeholder='電子郵件' />
          <Form.Input fluid label='手機號碼' placeholder='手機號碼' />
          <Form.Group widths='equal'>
            <Form.Select
              fluid
              label='手機品牌'
              options={mobileOpitons}
              placeholder='手機品牌'
            />
            <Form.Select
              fluid
              label='手機系統'
              options={osOptions}
              placeholder='手機系統'
            />
            <Form.Select
              fluid
              label='Android系統版本'
              options={androidSystemVersion}
              placeholder='Android系統版本'
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Select
              fluid
              label='是否有3G/4G方案'
              options={boolOptions}
              placeholder='是否有3G/4G方案'
            />
            <Form.Select
              fluid
              label='是否有網路吃到飽'
              options={boolOptions}
              placeholder='是否有網路吃到飽'
            />
          </Form.Group>
          <Form.Button>提交</Form.Button>
        </Form>
      </div>
    )
  }
}
