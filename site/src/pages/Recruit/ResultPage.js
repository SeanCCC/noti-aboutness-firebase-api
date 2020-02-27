import React from 'react'
import { Header, Segment } from 'semantic-ui-react'

export function AcceptPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Segment attached>
      您已經完成表單，研究團隊會在數日內透過您填入的電子信箱聯絡您，請密切關注。
      </Segment>
    </div>
  )
}

export function EmailCheckPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Segment attached>
      您已經完成表單，研究團隊已經寄了一封信箱驗證信給您，請您點擊內附的連結。
      </Segment>
    </div>
  )
}

export function ReturnPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Segment attached>
        由於研究團隊的程式需要安裝在Android手機上，研究團隊無法就您納入參與者，您填寫的資料將不會以任何形式保存。
      </Segment>
    </div>
  )
}
