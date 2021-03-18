import React from 'react'
import { Header } from 'semantic-ui-react'
import Numbers from './Numbers'

const Home = () => {
  return <div className="page">
    <Header as="h1">實驗主面板</Header>
    <div className="numbers">
      <Header as="h3">候選人面板</Header>
      <Numbers numberName='candidatesNumber' />
    </div>
    <div className="numbers">
      <Header as="h3">等待同意書</Header>
      <Numbers numberName='consentPendingNumber' />
    </div>
    <div className="numbers">
      <Header as="h3">正在準備實驗</Header>
      <Numbers numberName='researchPendingNumber' />
    </div>
    <div className="numbers">
      <Header as="h3">數值異常</Header>
      <Numbers numberName='researchRunningNumber' />
    </div>
    <div className="numbers">
      <Header as="h3">訪談與報酬</Header>
      <Numbers numberName='researchDoneNumber' />
    </div>
    <div className="numbers">
      <Header as="h3">已支付金額</Header>
      <Numbers numberName='totalPayment' />
    </div>
    <div className="numbers">
      <Header as="h3">已完成問卷</Header>
      <Numbers numberName='totalEsmNumber'/>
    </div>
  </div>
}

export default Home
