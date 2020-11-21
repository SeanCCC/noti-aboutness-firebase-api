import React, { Component } from 'react'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { Header, Table, Segment, Embed, Message, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'
import { mobileOpitons } from '../Recruit/formOptions'
import { ContactComp } from '../Contact'
import QRCode from 'qrcode.react'
import { LoadingPage, ErrorPage } from './ResultPage'
import { apkFileLink, batteryLinkTable, esmTutorial, installYoutubeId } from './constants'

export default class ScorePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      esmDistDaily: [],
      totalEsm: 'NA',
      avgEsm: 'NA',
      dnum: 'NA'
    }
  }

  async componentDidMount () {
    try {
      const { location } = this.props
      const { search } = location
      const { id } = queryString.parse(search)
      const res = await axios.get(`/apis/participant/score?id=${id}`)
      console.log({ res })
      const { esmDistDaily, totalEsm, avgEsm, dnum } = res.data
      this.setState({ esmDistDaily, totalEsm, avgEsm, dnum, loading: false })
    } catch (err) {
      console.error(err)
      this.setState({ error: true })
    }
  }

  render () {
    const { loading, esmDistDaily, totalEsm, avgEsm, dnum, error } = this.state
    if (error) return <ErrorPage/>
    if (loading) return <LoadingPage text="載入中"/>
    const { phoneBrand } = this.props
    const brand = mobileOpitons.find(o => o.value === phoneBrand)
    const brandName = !brand ? null : brand.text
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">問卷填寫進度與使用教學</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">問卷填寫進度</Header>
          約定問卷日均數量爲3個<br/>
          到目前共{dnum}日<br/>
          每日平均{avgEsm}則通知<br/>
          共{totalEsm}則通知<br/>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>日期</Table.HeaderCell>
                <Table.HeaderCell>完成表單數量</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                esmDistDaily.map((item, idx) => {
                  return <Table.Row key={idx}>
                    <Table.Cell collapsing>{item.date}</Table.Cell>
                    <Table.Cell>{item.amount}</Table.Cell>
                  </Table.Row>
                })
              }
            </Table.Body>
          </Table>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">App下載連結</Header>
          <a target="_blank"
            href={apkFileLink}
            rel='noreferrer noopener'>
            <Button fluid
              primary
              className="short-padded">
              <Icon name='file pdf'/>
            下載實驗用App
            </Button>
          </a>
          <div className='align-center short-padded'>
              實驗App下載用QRCode
            <QRCode value={apkFileLink} />
          </div>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">App安裝與使用教學影片</Header>
          <Embed
            id={installYoutubeId}
            hd
            source='youtube'
            iframe={{
              allowFullScreen: true
            }}
          />
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">關閉Facebook聊天大頭貼功能</Header>
          1. 前往 Messenger，點按左上方的大頭貼照。
          2. 向下捲動並點按聊天大頭貼。
          3. 切換按鍵以關閉。
        </Segment>
        {!brandName || !batteryLinkTable[phoneBrand] ? (
          <Segment attached>
            <Header as='h3'
              textAlign="center">關於電量設定</Header>
            如果有開啟低電量模式，請於研究期間關閉<br/>
          </Segment>
        ) : (<Segment attached>
          <Header as='h3'
            textAlign="center">{brandName}的電量設定</Header>
            請關閉低電量設定，並查看下方文件，依照教學進行設定。<br/>
          <a target="_blank"
            href={batteryLinkTable[phoneBrand]}
            rel='noreferrer noopener'>
            <Button
              fluid
              primary >
              <Icon name='linkify'/>
          如何進行電量設定
            </Button>
          </a>
        </Segment>)}
        <Segment attached>
          <Header as='h3'
            textAlign="center">問卷相關補充說明</Header>
          <a target="_blank"
            href={esmTutorial}
            rel='noreferrer noopener'>
            <Button
              fluid
              primary >
              <Icon name='linkify'/>
          查看補充說明
            </Button>
          </a>
        </Segment>
        <Header textAlign="center"
          as='h3'>遇到困難請聯絡『研究計畫聯絡人』</Header>
        <ContactComp/>
      </div>
    )
  }
}

ScorePage.propTypes = {
  location: PropTypes.object,
  phoneBrand: PropTypes.array
}
