import { Component } from 'react'
import { apkFileLink } from './Participant/constants'

class AppDownload extends Component {
  componentDidMount () {
    window.location.assign(apkFileLink)
  }

  render () {
    return null
  }
}

export default AppDownload
