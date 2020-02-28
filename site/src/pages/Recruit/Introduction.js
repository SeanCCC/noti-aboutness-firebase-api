import React from 'react'
import { Header, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Introduction () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>『注意力中心之社群運算』: 建立資訊接受度感知之行動通知與電腦媒介溝通系統-探討影響通知接收時機的因素間交互關係</Header>
      <Segment attached>
      交通大學資訊工程系 移動裝置與普及運算實驗室正在招募受測者收集和研究智慧型手機用
戶的移動性。我們希望您使用我們的 Android 手機應用程序填寫問卷與記錄手機資訊！
通過參與這項研究，您將幫助研究人員評估手機通知適當的跳出時間。這將幫助未來的研究
人員建立更完善的通知管理系統。
      </Segment>
      <Header textAlign="center" as='h2'>報酬</Header>
      <Segment attached>
      完成實驗，您會獲得最少新台幣 860 元至最多 1200 元的報酬。
      </Segment>
      <Header textAlign="center" as='h2'>實驗任務</Header>
      <Segment attached>
實驗開始後的至少十四天內，會需要透過實驗App：<br/>
1.手機背景上傳通知相關資訊：我們會在背景收集手機的多種與通知相關的資訊，所有資訊均會去連結並嚴密保存。<br/>
2.回答每日問卷：收到通知提醒 (非睡眠時段) 後，平均填寫八份每日問卷。
      </Segment>
      <Header textAlign="center" as='h2'>招募條件</Header>
      <Segment attached>
      1.您必須年滿 20 歲，且未逾 60 歲。<br/>
2.您必須使用 5.0 或更高版本的 Android 智慧型手機作為主要手機。<br/>
3.您必須每天攜帶主要手機。<br/>
4.您必須完全參與研究，即在 14 天內填寫至少 112 則問卷。<br/>
5.將會排除與主持人有利害關係的學生，包含主持人開課學生、指導學生，均會排除。
      </Segment>
      <Header textAlign="center" as='h2'>聯絡我們</Header>
      <Segment.Group attached>
        <Segment>
        研究計畫聯絡人<br/>
張忠喬, 研究生<br/>
國立交通大學資訊科學與工程研究所<br/>
0975-068-858<br/>
notiatmuilab@gmail.com<br/>
        </Segment>
        <Segment>
        研究計畫主持人<br/>
張永儒, 助理教授<br/>
國立交通大學資訊工程學系<br/>
(03) 5712121 #56632<br/>
armuro@cs.nctu.edu.tw<br/>
        </Segment>
      </Segment.Group>
      <div className='submit-button'>
        <Link to="/recruit/form">
          <Button primary>填寫問卷</Button>
        </Link>
      </div>
    </div>
  )
}
