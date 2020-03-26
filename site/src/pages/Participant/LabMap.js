import React from 'react'
import { compose, withProps } from 'recompose'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps'

const LabMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDqdkpbhVJtZZm6RLAwSCyp9dy2xuB1gP0&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />
  }),
  withScriptjs,
  withGoogleMap
)(() => (
  <GoogleMap defaultZoom={18} defaultCenter={{ lat: 24.786790, lng: 121.001758 }}>
    {<Marker position={{ lat: 24.786790, lng: 121.001758 }} />}
  </GoogleMap>
))

export default LabMap
