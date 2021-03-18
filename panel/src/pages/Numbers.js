import React from 'react'
import PropTypes from 'prop-types'
import { Statistic, Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setNumberHightlight } from '../redux/actions'

const Numbers = (props) => {
  const { numberName, setNumberHightlight } = props
  const content = props[numberName]
  return (
    <Statistic.Group>
      {content.map((n, idx) => {
        const { value, label, dangerous, warning, message } = n
        let color
        if (dangerous) color = 'red'
        else if (warning) color = 'orange'
        return <Popup key={idx} disabled={!message} content={message} trigger={
          <Statistic color={color} size="mini" onClick={() => {
            setNumberHightlight(numberName, idx)
          }} >
            <Statistic.Value>{value}</Statistic.Value>
            <Statistic.Label>{label}</Statistic.Label>
          </Statistic>
        } />
      })}
    </Statistic.Group>
  )
}

Numbers.propTypes = {
  numberName: PropTypes.string,
  researchRunningNumber: PropTypes.array,
  consentPendingNumber: PropTypes.array,
  researchPendingNumber: PropTypes.array,
  candidatesNumber: PropTypes.array,
  researchDoneNumber: PropTypes.array,
  totalPaidNumber: PropTypes.array,
  setNumberHightlight: PropTypes.func,
  totalEsmNumber: PropTypes.array
}

const mapStateToProps = ({
  researchRunningNumber,
  consentPendingNumber,
  researchPendingNumber,
  candidatesNumber,
  researchDoneNumber,
  totalPaidNumber,
  totalUnpaidNumber,
  totalEsmNumber
}) => ({
  researchRunningNumber,
  consentPendingNumber,
  researchPendingNumber,
  candidatesNumber,
  researchDoneNumber,
  totalPayment: [
    ...totalPaidNumber,
    { label: '', number: '' },
    ...totalUnpaidNumber,
    { label: '', number: '' }
  ],
  totalEsmNumber
})

export default connect(mapStateToProps, { setNumberHightlight })(Numbers)
