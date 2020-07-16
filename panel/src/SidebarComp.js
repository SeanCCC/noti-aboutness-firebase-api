import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Icon, Menu, Sidebar } from 'semantic-ui-react'

class SidebarComp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nextPath: null
    }
    this.redirect = this.redirect.bind(this)
    this.setNextPath = this.setNextPath.bind(this)
  }

  setNextPath (nextPath) {
    this.setState({ nextPath })
  }

  redirect () {
    const { nextPath } = this.state
    const { location } = this.props
    const { pathname } = location
    if (nextPath === pathname || nextPath === null) {
      return null
    } else {
      return <Redirect to={nextPath}/>
    }
  }

  render () {
    return (
      <Sidebar.Pushable>
        {this.redirect()}
        <Sidebar
          as={Menu}
          animation='push'
          icon='labeled'
          vertical
          visible
          width='thin'
        >
          <Menu.Item as='a' >
            <Icon name='home' />
            主面板
          </Menu.Item>
          <Menu.Item as='a' onClick={
            () => this.setNextPath('/recruit')
          }>
            候選人面板
          </Menu.Item>
          <Menu.Item as='a' onClick={
            () => this.setNextPath('/participant/prepare')
          }>
            實驗前面板
          </Menu.Item>
          <Menu.Item as='a' onClick={
            () => this.setNextPath('/participant/ongoing')
          }>
            實驗中面板
          </Menu.Item>
          <Menu.Item as='a' onClick={
            () => this.setNextPath('/participant/done')
          }>
            實驗後面板
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          {this.props.children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

SidebarComp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
  visible: PropTypes.bool
}

export default withRouter(SidebarComp)
