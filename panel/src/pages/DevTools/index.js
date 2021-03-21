import React from 'react'
import { Header } from 'semantic-ui-react'
import AddUser from './AddUser'

const ToolPage = () => {
  return <div className="page">
    <Header as="h1">快速新增參與者</Header>
    <AddUser/>
  </div>
}

export default ToolPage
