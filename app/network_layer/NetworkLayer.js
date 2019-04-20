
import { Alert } from 'react-native'

const APIEndPoints = {
  ListMovies: "https://yts.am/api/v2/list_movies.json"
}

export default NetworkRequest = (url, param = {}, method, header = {}, success, failed) => {

  var bodyParam = param

  if ((method == 'GET') || (method == 'HEAD')) {
    bodyParam = null
  }

  if (method == 'GET') {
    var arrayKeys = Object.keys(param)
    var GETParam = ""

    for (var i = 0; i < arrayKeys.length; i++) {
      var key = arrayKeys[i]
      if (GETParam == "") {
        GETParam = key + "=" + param[key]
      } else {
        GETParam = GETParam + "&" + key + "=" + param[key]
      }
    }

    if (GETParam != "") {
      url = url + "?" + GETParam
    }

  }

  fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      ContentType: 'application/json',
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParam
  }).then(response => {
    return response.json()
  }).then(responseJSON => {
    console.log('JSON_REPONSE: ' + JSON.stringify(responseJSON))
    success(responseJSON)
  }).catch(error => {
    console.log('ERROR: ' + error)
    failed(error)
  })
};


export const getMovies = (param, success, failed) => {
  NetworkRequest(APIEndPoints.ListMovies, param, 'GET', {}, (responseJSON) => {
    success(responseJSON)
  }, (error) => {
    failed(error)
  });
}