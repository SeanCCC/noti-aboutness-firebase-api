import React, { Fragment } from 'react'
import { Segment } from 'semantic-ui-react'

export function ContactComp () {
  return (
    <Fragment>
      <Segment attached >
研究計畫聯絡人<br/>
張忠喬, 研究生<br/>
國立交通大學資訊科學與工程研究所<br/>
0975-068-858<br/>
notiatmuilab@gmail.com<br/>
      </Segment>
      <Segment attached>
    研究計畫主持人<br/>
張永儒, 助理教授<br/>
國立交通大學資訊工程學系<br/>
(03) 5712121 #56632<br/>
armuro@cs.nctu.edu.tw<br/>
      </Segment>
    </Fragment>
  )
}
