import React from 'react'
import { Header, Button } from 'semantic-ui-react'
import {
  Link
} from 'react-router-dom'

export default function Introduction () {
  return (
    <div className="page">
      <Header as='h1'>手機通知跳出時機影響因素研究招募問卷</Header>
      <Header as='h2'>介紹</Header>
      <Header as='h2'>報酬</Header>
      <Header as='h2'>期間</Header>
      <Header as='h2'>進行方式</Header>
      <div className='submit-button'>
        <Link to="/recruit/form">
          <Button primary>填寫問卷</Button>
        </Link>
      </div>
    </div>
  )
}
