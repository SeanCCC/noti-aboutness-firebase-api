import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export default function LoadingPage () {
  return (
    <div className="page">
      <Dimmer active inverted>
        <Loader inverted>載入中</Loader>
      </Dimmer>
    </div>
  )
}
