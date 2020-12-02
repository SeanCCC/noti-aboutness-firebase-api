import React, { Component } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { Header, Segment, Button, Icon, Message, Image, Modal } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
import { consentFileLink } from './constants'
import { LoadingPage, ErrorPage } from './ResultPage'
import LabMap from './LabMap'

export default class MailInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uploading: false,
      loading: false,
      mailMethod: null,
      error: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentDidMount () {
    try {
      const { location } = this.props
      const { search } = location
      const { id } = queryString.parse(search)
      const res = await axios.get(`/apis/participant/mailmethod?id=${id}`)
      const { mailMethod } = res.data
      this.setState({ mailMethod, loading: false })
    } catch (err) {
      console.error(err)
      this.setState({ error: true })
    }
  }

  async onSubmit () {
    const { nextStep } = this.props
    this.setState({ uploading: true })
    await nextStep()
    this.setState({ uploading: false })
  }

  render () {
    const { uploading, error, loading, mailMethod } = this.state
    if (error) return <ErrorPage/>
    if (loading) return <LoadingPage text="載入中"/>
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">簽署並寄出同意書</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        1.您可以透過回郵（下方有詳細資訊）或下載影印取得『同意書簽署注意事項』<br/>
        2.請依照下方『同意書簽署流程』簽署研究者參與同意書<br/>
        3.交付至實驗室信箱或寄到實驗室，實驗室的位置在下方有詳細說明。<br/>
        4.如果選擇郵寄，請盡可能以掛號方式寄出，這可以確保信件一定會到達，以避免您不必要的困擾。<br/>
        5.選擇郵寄時，如果因故無法使用掛號，請使用限時郵件。<br/>
        6.所有影印、郵務方面支出，均已經包含在報酬中。<br/>
        7.請在『確實交付同意書後』後點選『我已經交付文件』（在下方）
          <a target="_blank"
            href={consentFileLink}
            rel='noreferrer noopener'>
            <Button fluid
              primary>
              <Icon name='file pdf'/>
            下載『研究者參與同意書』
            </Button>
          </a>
          <Message info>
            <Message.Header>我們已經將此頁面的網址寄給了您，您隨時可以回來看這些資訊。</Message.Header>
          </Message>
        </Segment>
        <Segment>
          <Header as='h3'
            textAlign="center">同意書簽署注意事項</Header>
          <Message warning>
            <Icon name='warning' />
            請詳閱此內容。
          </Message>
            請下載印出『研究者參與同意書』，如果理解同意上面的內容，請簽署。<br/>
            下方兩項需要完成，整份同意書才算簽署完成。<br/>
            請在『第五段』勾選您同意的資料使用方法，<br/>
            請在『第十段』填寫正楷姓名、簽名、日期、聯絡電話與通訊住址。
          <Image fluid
            src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/sign-diagram1-1.jpg"/>
          <Image fluid
            src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/sign-diagram2-1.jpg"/>
        </Segment>
        {['registeredMail', 'ordinaryMail'].includes(mailMethod) &&
          <Segment attached>
            <Header as='h3'
              textAlign="center">文書寄出資訊</Header>
        您需要將同意書郵寄至實驗室，盡量採用掛號的方法，<br/>
        如果不方便前往郵局掛號，請採用限時郵件的方式寄出，<br/>
        實測4張紙與一個信封不超過50克，限時郵件郵票貼23元以上就會足夠。<br/>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：30010新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
          </Segment>}
        {['reversedRegisteredMail', 'reversedOrdinaryMail'].includes(mailMethod) &&
          <Segment attached>
            <Header as='h3'
              textAlign="center">回郵資訊</Header>
        我們會將已經填好地址並貼好郵票的的信封與未簽名的研究者參與同意書都用限時郵件寄送給您，<br/>
        並且會在寄出信封與同意書後寄信通知您，<br/>
        您只需要在完全理解並同意研究者參與同意書的內容後，參考上方『同意書簽署注意事項』完成同意書須填內容，<br/>
        並且透過掛號或限時郵件寄出即可。
          </Segment>}
        {['selfDeliver'].includes(mailMethod) &&
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
          </Segment>}
        <Segment attached>
          <Modal
            size="mini"
            trigger={<Button fluid
              color="green"
              loading={uploading}
              disabled={uploading} >我已經交付文件</Button>}
            header='請在同意書確實交付後再點選確認'
            content='如果尚未完成，請您盡量在一周內交付，感激不盡。'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.onSubmit }]}
          />
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

MailInfo.propTypes = {
  nextStep: PropTypes.func,
  location: PropTypes.object
}
