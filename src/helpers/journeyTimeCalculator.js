import request from 'request-promise'

const journeyTimeCalculator = (origin, destination, mode) => {
  return new Promise((resolve, reject) => {
    request.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&traffic_model=pessimistic&key=${process.env.GOOGLE_API_KEY}&departure_time=now`)
      .then(response => JSON.parse(response))
      .then(responseObject => {
        const duration = responseObject.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0)
        resolve(duration)
      })
      .catch(error => reject(error))
  })
}

export default journeyTimeCalculator
