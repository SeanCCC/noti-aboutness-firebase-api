import React from 'react'
import { Header, Button, Segment, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ContactComp } from '../Contact'
import { fullAtThisStage } from '../Participant/constants'

export default function Introduction () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>『注意力中心之社群運算』: 建立資訊接受度感知之行動通知與電腦媒介溝通系統-探討影響通知接收時機的因素間交互關係</Header>
      <Segment attached>
        {!fullAtThisStage || <Message
          info
          header='此階段參與者已經飽和，但還是歡迎您填寫表單，這會讓我們在往後的招募階段可以主動聯絡您。'
        />}
      交通大學資訊工程系 移動裝置與普及運算實驗室正在招募受測者收集和研究智慧型手機用
戶的移動性。我們希望您使用我們的 Android 手機應用程序填寫問卷與記錄手機資訊！
通過參與這項研究，您將幫助研究人員評估手機通知適當的跳出時間。這將幫助未來的研究
人員建立更完善的通知管理系統。
      </Segment>
      <Header textAlign="center"
        as='h2'>報酬</Header>
      <Segment attached>
      完成實驗後，我們會提供300元的基本報酬，以感謝您花費的時間並支應實驗中產生的雜支。<br/>
      在此之上，我們也會就每則問卷提供20元的報酬，以感謝您對問卷資料的寶貴貢獻。
      </Segment>
      <Header textAlign="center"
        as='h2'>實驗任務</Header>
      <Segment attached>
實驗開始後的至少十四天內，會需要透過實驗App：<br/>
1.手機背景上傳通知相關資訊：我們會在背景收集手機的多種與通知相關的資訊，所有資訊均會嚴密保存。我們也會刪除所有可以辨識您身份的個人資料。<br/>
2.回答每日問卷：收到通知提醒 (非睡眠時段) 後，平均每日填寫三份問卷。
      </Segment>
      <Header textAlign="center"
        as='h2'>招募條件</Header>
      <Segment attached>
      1.您必須年滿 20 歲，且未逾 60 歲。<br/>
2.您必須使用 8.0 或更高版本的 Android 智慧型手機作為『主要手機』。{'（請進入設定>關於手機>Android版本處查看）'}<br/>
3.將會排除與主持人有利害關係的學生，包含主持人開課學生、指導學生，均會排除。
      </Segment>
      <Header textAlign="center"
        as='h2'>參與期間配合事項</Header>
      <Segment attached>
1.您將會需要每天攜帶主要手機。<br/>
2.您將會需要完全參與研究，即在 14 天內持續填寫問卷，填寫每則問卷約費時8分鐘。<br/>
3.您將會需要關閉Facebook messanger聊天大頭貼的功能。<a target="_blank"
          href="https://www.facebook.com/help/messenger-app/android/1611232179138526?rdrhc"
          rel='noreferrer noopener'>
            （看看什麼是聊天大頭貼？）
        </a><br/>
4.您將會需要關閉影響研究App運作的相關電量設定。（之後有詳細說明）<br/>
5.您將會需要開啟GPS定位功能。
      </Segment>
      <Header textAlign="center"
        as='h2'>聯絡我們</Header>
      <Segment.Group attached>
        <ContactComp/>
      </Segment.Group>
      <div className='submit-button'>
        <Link to="/recruit/form">
          <Button primary>填寫問卷</Button>
        </Link>
      </div>
    </div>
  )
}
