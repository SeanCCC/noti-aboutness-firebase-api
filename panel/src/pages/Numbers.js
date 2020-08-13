import React from 'react'
import PropTypes from 'prop-types'
import { Statistic, Popup } from 'semantic-ui-react'

const Numbers = ({ content = [] }) => (
  <Statistic.Group>
    {content.map(({ value, label, dangerous, warning, message }, idx) => {
      let color
      if (dangerous) color = 'red'
      else if (warning) color = 'orange'
      return <Popup key={idx} disabled={!message} content={message} trigger={
        <Statistic color={color} size="mini" >
          <Statistic.Value>{value}</Statistic.Value>
          <Statistic.Label>{label}</Statistic.Label>
        </Statistic>
      } />
    })}
  </Statistic.Group>
)

Numbers.propTypes = {
  content: PropTypes.array
}

export default Numbers
