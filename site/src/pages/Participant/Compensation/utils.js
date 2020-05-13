import axios from 'axios'
import FormData from 'form-data'

export function postFormData (rul, data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })

  const request = axios.create({
    withCredentials: true
  }).post(rul, formData)
    .then(r => r.data)
    .catch(function (e) {
      console.error(e)
    })

  return request
}
