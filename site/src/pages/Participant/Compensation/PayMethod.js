import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Message, Modal, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import check from 'check-types'
import { ContactComp } from '../../Contact'
import { JkoSegment, LinePaySegment, BankTransferSegment } from './PaySegments'
import { postFormData, fileResizer } from './utils'

export default class PayMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false,
      uploading: false,
      bankCode: null,
      bankCodeValid: false,
      bankAccount: null,
      bankAccountValid: false,
      jkoAccount: null,
      jkoValid: false,
      linePayAccount: null,
      linePayValid: false,
      payMethod: null,
      illegal: false,
      error: false,
      accept: false,
      file: null,
      uri: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.checkVal = this.checkVal.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setPayMethod = this.setPayMethod.bind(this)
    this.submitPayInfo = this.submitPayInfo.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
  }

  async submitPayInfo (payInfo, payMethod, file) {
    const { id, setStatus } = this.props
    try {
      const res = await postFormData(
        '/apis/participant/done/compensation',
        { ...payInfo, payMethod, id }, file
      )
      if (res.status === 200) this.setState({ accept: true })
      const newStatus = res.data.status
      setStatus(newStatus)
    } catch (err) {
      if (err.response && err.response.status === 400) this.setState({ illegal: true })
      else this.setState({ error: true })
    }
  }

  async onFileChange (originFile) {
    const result = await fileResizer(originFile[0])
    const { file, uri } = result
    this.setState({
      file, uri
    })
  }

  setPayMethod (value) {
    this.setState({ payMethod: value })
  }

  handleChange (e, { name, value }) {
    const { submitted } = this.state
    this.setState({ [name]: value }, () => {
      if (submitted) {
        this.checkVal(name)
      }
    })
  }

  async checkVal (name) {
    const value = this.state[name]
    const valid = check.nonEmptyString(value)
    if (name === 'jkoAccount') {
      await this.setState({ jkoValid: valid })
    } else if (name === 'linePayAccount') {
      await this.setState({ linePayValid: valid })
    } else if (name === 'bankAccount') {
      await this.setState({ bankAccountValid: valid })
    } else if (name === 'bankCode') {
      await this.setState({ bankCodeValid: valid })
    }
    return valid
  }

  onInputBlur (name) {
    const value = this.state[name]
    if (value === null) return
    this.setState({ [name]: value.trim() })
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const { payMethod, file } = this.state
    if (payMethod === null) return
    await this.checkVal('jkoAccount')
    await this.checkVal('linePayAccount')
    await this.checkVal('bankAccount')
    await this.checkVal('bankCode')
    const {
      jkoValid,
      linePayValid,
      bankAccountValid,
      bankCodeValid
    } = this.state
    if (payMethod === 'bankTransfer' && (!bankAccountValid || !bankCodeValid || file === null)) return
    else if (payMethod === 'linePay' && !linePayValid) return
    else if (payMethod === 'jko' && !jkoValid) return
    this.setState({ uploading: true })
    const { bankAccount, bankCode, linePayAccount, jkoAccount } = this.state
    if (payMethod === 'bankTransfer') {
      await this.submitPayInfo({ bankAccount, bankCode }, payMethod, file)
    } else if (payMethod === 'linePay') {
      await this.submitPayInfo({ linePayAccount }, payMethod)
    } else if (payMethod === 'jko') {
      await this.submitPayInfo({ jkoAccount }, payMethod)
    }
    this.setState({ uploading: false })
  }

  render () {
    const {
      submitted,
      uploading,
      jkoValid,
      jkoAccount,
      linePayValid,
      linePayAccount,
      bankAccountValid,
      bankCodeValid,
      bankCode,
      bankAccount,
      payMethod,
      uri
    } = this.state
    const { receiptMailMethod } = this.props
    const btnMsg = ['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(receiptMailMethod)
      ? '送出後請等待研究團隊寄出回郵信封與提供相關細節。'
      : '送出後我們會將交件細節寄給您，並將頁面轉到相關頁面，方便您取得需要的資訊。並請在一週內交付領據。'

    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">領取報酬</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        1.請選擇收款方式，然後點擊最底下『送出』<br/>
        2.在進行付款時，我們會『核對收款人本名是否與報名表單填寫的一致』。
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='我想用街口支付領取報酬。'
            onChange={() => { this.setPayMethod('jko') }}
            checked={payMethod === 'jko'}
          />
          <Checkbox
            label='我想用LINE pay領取報酬。'
            onChange={() => { this.setPayMethod('linePay') }}
            checked={payMethod === 'linePay'}
          />
          <Checkbox
            label='我想用接收匯款的方式領取報酬。'
            onChange={() => { this.setPayMethod('bankTransfer') }}
            checked={payMethod === 'bankTransfer'}
          />
          {submitted && payMethod === null
            ? <Message negative>
              <Message.Header>請選擇領取方式</Message.Header>
            </Message>
            : null}
        </Segment>
        { payMethod === 'jko' ? <JkoSegment jkoValid={jkoValid}
          jkoAccount={jkoAccount}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
        /> : null }
        { payMethod === 'linePay' ? <LinePaySegment linePayValid={linePayValid}
          linePayAccount={linePayAccount}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
        /> : null }
        { payMethod === 'bankTransfer' ? <BankTransferSegment bankAccountValid={bankAccountValid}
          bankAccount={bankAccount}
          bankCodeValid={bankCodeValid}
          bankCode={bankCode}
          handleChange={this.handleChange}
          submitted={submitted}
          uploading={uploading}
          onInputBlur={this.onInputBlur}
          onFileChange={this.onFileChange}
          imageUrl={uri}
        /> : null }
        <Segment attached>
          <Modal
            size="mini"
            trigger={<Button fluid
              color="green"
              loading={uploading}
              disabled={uploading} >送出</Button>}
            header='注意事項'
            content={btnMsg}
            actions={[{ key: 'confirm', content: '確定', positive: true, onClick: this.onSubmit }]}
          />
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

PayMethod.propTypes = {
  id: PropTypes.string,
  setStatus: PropTypes.func,
  receiptMailMethod: PropTypes.string
}
