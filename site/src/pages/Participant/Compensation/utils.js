import axios from 'axios'
import FormData from 'form-data'
import Resizer from 'react-image-file-resizer'
import atob from 'atob'

export function postFormData (rul, data, file) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  if (file !== undefined) {}formData.append('file', file)
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  const request = axios.create({
    withCredentials: true
  }).post(rul, formData, config)
  return request
}

function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export function fileResizer (file) {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1440,
      1440,
      'JPEG',
      70,
      0,
      uri => {
        const file = dataURLtoFile(uri, 'file.jpg')
        resolve({ uri, file })
      },
      'base64'
    )
  })
}
