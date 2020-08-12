import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import Numbers from './Numbers'

const Home = (props) => {
  const {
    researchRunningNumber,
    consentPendingNumber,
    researchPendingNumber,
    candidatesNumber,
    researchDoneNumber
  } = props
  return <div className="page">
    <Header as="h1">實驗主面板</Header>
    <div className="numbers">
      <Header as="h3">候選人面板</Header>
      <Numbers content={candidatesNumber} />
    </div>
    <div className="numbers">
      <Header as="h3">等待同意書</Header>
      <Numbers content={consentPendingNumber} />
    </div>
    <div className="numbers">
      <Header as="h3">正在準備實驗</Header>
      <Numbers content={researchPendingNumber} />
    </div>
    <div className="numbers">
      <Header as="h3">數值異常</Header>
      <Numbers content={researchRunningNumber} />
    </div>
    <div className="numbers">
      <Header as="h3">訪談與報酬</Header>
      <Numbers content={researchDoneNumber} />
    </div>
  </div>
}

Home.propTypes = {
  researchRunningNumber: PropTypes.array,
  consentPendingNumber: PropTypes.array,
  researchPendingNumber: PropTypes.array,
  candidatesNumber: PropTypes.array,
  researchDoneNumber: PropTypes.array
}

const mapStateToProps = ({
  researchRunningNumber,
  consentPendingNumber,
  researchPendingNumber,
  candidatesNumber,
  researchDoneNumber
}) => ({
  researchRunningNumber,
  consentPendingNumber,
  researchPendingNumber,
  candidatesNumber,
  researchDoneNumber
})

export default connect(mapStateToProps)(Home)
