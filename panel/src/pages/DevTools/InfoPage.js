import React from 'react'
import PropTypes from 'prop-types'
import { compose, withProps } from 'recompose'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps'

const NotiMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDqdkpbhVJtZZm6RLAwSCyp9dy2xuB1gP0&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />
  }),
  withScriptjs,
  withGoogleMap
)((lat, lng) => (
  <GoogleMap defaultZoom={18}
    defaultCenter={{ lat, lng }}>
    {<Marker position={{ lat, lng }} />}
  </GoogleMap>
))

const InfoPage = ({ q }) => {
  const { app, time, title, detail, latitude, longitude } = q
  console.log({ latitude, longitude })
  return <div>
    來源：{app}<br/>
    跳出時間：{time}<br/>
    標題：{title}<br/>
    內容：{detail}<br/>
    位置：<NotiMap lat={latitude} lng={longitude}/>
  </div>
}

InfoPage.propTypes = {
  q: PropTypes.object
}

export default InfoPage
