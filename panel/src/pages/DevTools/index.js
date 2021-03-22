import React from 'react'
import { Header } from 'semantic-ui-react'
import AddUser from './AddUser'
// import FetchQuestionnaire from './FetchQuestionnaire'

const ToolPage = () => {
  return <div className="page">
    <Header as="h1">快速新增參與者</Header>
    <AddUser/>
    {/* <Header as="h1">取得問卷結果</Header>
    <FetchQuestionnaire/> */}
  </div>
}

export default ToolPage
