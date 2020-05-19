import React from 'react'
import PropTypes from 'prop-types'
import { Statistic } from 'semantic-ui-react'

const Numbers = ({ content = [] }) => (
  <Statistic.Group>
    {content.map(({ value, label, dangerous, warning }, idx) => {
      let color
      if (dangerous) color = 'red'
      else if (warning) color = 'orange'
      return <Statistic color={color} size="large" key={idx} >
        <Statistic.Value>{value}</Statistic.Value>
        <Statistic.Label>{label}</Statistic.Label>
      </Statistic>
    })}
  </Statistic.Group>
)

Numbers.propTypes = {
  content: PropTypes.array
}

export default Numbers
