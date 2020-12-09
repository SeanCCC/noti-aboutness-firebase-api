import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Modal, Message, Image, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
import LabMap from './LabMap'
import check from 'check-types'

export default class MailChoose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      submitted: false,
      loading: false,
      mailBackAddress: '',
      mailBackCell: '',
      mailBackPostNumber: '',
      mailBackName: '',
      valid: false
    }
    this.toggle = this.toggle.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.checkVal = this.checkVal.bind(this)
  }

  handleChange (e, { name, value }) {
    const { submitted } = this.state
    this.setState({ [name]: value }, () => {
      if (submitted) {
        this.checkVal()
      }
    })
  }

  async checkVal () {
    const {
      mailMethod,
      mailBackAddress,
      mailBackCell,
      mailBackPostNumber,
      mailBackName
    } = this.state
    if (check.null(mailMethod)) {
      await this.setState({ valid: false })
      return false
    }
    if (['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)) {
      if (check.emptyString(mailBackAddress) ||
      check.emptyString(mailBackCell) ||
      check.emptyString(mailBackPostNumber) ||
      check.emptyString(mailBackName)
      ) {
        await this.setState({ valid: false })
        return false
      }
    }
    await this.setState({ valid: true })
    return true
  }

  onInputBlur (name) {
    const value = this.state[name]
    if (value === null) return
    this.setState({ [name]: value.trim() }, this.checkVal)
  }

  toggle (value) {
    this.setState({ mailMethod: value }, this.checkVal)
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const {
      mailMethod, mailBackAddress,
      mailBackCell,
      mailBackPostNumber,
      mailBackName
    } = this.state
    const { nextStep } = this.props
    await this.checkVal()
    if (!this.state.valid) return
    this.setState({ loading: true })
    let data
    if (['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)) {
      data = {
        mailMethod,
        mailBackAddress,
        mailBackCell,
        mailBackPostNumber,
        mailBackName
      }
    } else data = { mailMethod }
    await nextStep(data)
    this.setState({ loading: false })
  }

  render () {
    const {
      mailMethod,
      submitted,
      loading,
      mailBackAddress,
      mailBackName,
      mailBackPostNumber,
      mailBackCell,
      valid
    } = this.state
    const btnMsg = ['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)
      ? '送出後請等待研究團隊寄出回郵信封與提供相關細節。'
      : '送出後我們會將交件細節寄給您，並將頁面轉到相關頁面，方便您取得需要的資訊。並請在一週內交付同意書。'
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">選擇同意書交付方法</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        1.請在此頁選擇同意書交付方式。<br/>
        2.交付至實驗室信箱或寄到實驗室，實驗室的位置在下方有詳細說明。<br/>
        3.如果選擇郵寄，請盡可能以掛號方式寄出，這可以確保信件一定會到達，以避免您不必要的困擾。<br/>
        4.選擇郵寄時，如果因故無法使用掛號，請使用限時郵件。<br/>
        5.所有影印、郵務方面支出，均已經包含在報酬中。<br/>
        6.請在選取交件方式後點選『送出』（在下方）
          <Message info>
            <Message.Header>請在此頁選擇同意書交件方法，在後續步驟，我們將會提供同意書檔案與您選擇的方法的交件細節。</Message.Header>
          </Message>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">文書寄出資訊</Header>
        您需要將同意書郵寄至實驗室，盡量採用掛號的方法，<br/>
        如果不方便前往郵局掛號，請採用限時郵件的方式寄出，<br/>
        限時郵件郵票貼23元以上就會足夠。<br/>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：30010新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">回郵資訊</Header>
        我們會將已經填好地址並貼好郵票的的信封與未簽名的研究者參與同意書都用限時郵件寄送給您，<br/>
        並且會在寄出信封與同意書後寄信通知您，<br/>
        您只需要在完全理解並同意研究者參與同意書的內容後，參考上方『同意書簽署注意事項』完成同意書須填內容，<br/>
        並且透過掛號或限時郵件寄出即可。
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">同意書親自交付資訊</Header>
        請直接將同意書投入郵箱即可<br/>
        郵箱位址：新竹市東區大學路1001號交通大學電子與資訊研究中心二樓33號信箱<br/>
        門禁時間：防疫期間下午六點半點後需要刷卡進出，非防疫期間晚上七點後需要刷卡進出。
          <Header as='h4'
            textAlign="center">實驗室地圖</Header>
          <LabMap/>
          <Header as='h4'
            textAlign="center">郵箱位置圖</Header>
          <Image fluid
            src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/2FMap.jpg"/>
          <Image fluid
            src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/boxes.jpg"/>
          <Image fluid
            src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/box.jpg"/>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='同意書由本人交付至實驗室信箱。'
            onChange={() => { this.toggle('selfDeliver') }}
            checked={mailMethod === 'selfDeliver'}
          />
          <Checkbox
            label='同意書以掛號方式寄出。'
            onChange={() => { this.toggle('registeredMail') }}
            checked={mailMethod === 'registeredMail'}
          />
          <Checkbox
            label='同意書以限時郵件方式寄出。'
            onChange={() => { this.toggle('ordinaryMail') }}
            checked={mailMethod === 'ordinaryMail'}
          />
          <Checkbox
            label='同意書與信封袋將用回郵取得，然後以掛號寄出。'
            onChange={() => { this.toggle('reversedRegisteredMail') }}
            checked={mailMethod === 'reversedRegisteredMail'}
          />
          <Checkbox
            label='同意書與信封袋將用回郵取得，然後以限時郵件寄出。'
            onChange={() => { this.toggle('reversedOrdinaryMail') }}
            checked={mailMethod === 'reversedOrdinaryMail'}
          />
        </Segment>
        {['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod) &&
         <Segment attached>
           <Input
             key='mailBackName'
             value={mailBackName}
             fluid
             label={'回郵收件人'}
             disabled={loading}
             placeholder={'請輸入同意書收件人的名稱'}
             name='mailBackName'
             onChange={this.handleChange}
             onBlur={() => { this.onInputBlur('mailBackName') }}
           />
           <Input
             key='mailBackAddress'
             value={mailBackAddress}
             fluid
             label={'回郵地址'}
             disabled={loading}
             placeholder={'請輸入同意書要寄往的地址'}
             name='mailBackAddress'
             onChange={this.handleChange}
             onBlur={() => { this.onInputBlur('mailBackAddress') }}
           />
           <Input
             key='mailBackPostNumber'
             value={mailBackPostNumber}
             fluid
             label={'回郵郵遞區號'}
             disabled={loading}
             placeholder={'請輸入同意書要寄往的郵遞區號'}
             name='mailBackPostNumber'
             onChange={this.handleChange}
             onBlur={() => { this.onInputBlur('mailBackPostNumber') }}
           />
           <Input
             key='mailBackCell'
             value={mailBackCell}
             fluid
             label={'回郵收件人手機'}
             disabled={loading}
             placeholder={'請輸入同意書收件人的手機號碼'}
             name='mailBackCell'
             onChange={this.handleChange}
             onBlur={() => { this.onInputBlur('mailBackCell') }}
           />
         </Segment>}
        <Segment attached>
          {submitted && !valid
            ? <Message negative>
              <Message.Header>請選擇交件方式，並填寫必要資訊。</Message.Header>
            </Message>
            : null}
          <Modal
            size="mini"
            trigger={<Button fluid
              color="green"
              loading={loading}
              disabled={loading} >送出</Button>}
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

MailChoose.propTypes = {
  nextStep: PropTypes.func
}
