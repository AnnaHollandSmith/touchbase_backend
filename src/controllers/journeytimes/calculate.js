import request from 'request-promise'

const calculate = (req, res, next) => {
  const {origin, destination, mode} = req.query 
  
  request.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&traffic_model=pessimistic&key=${process.env.GOOGLE_API_KEY}&departure_time=now`)
    .then(response => JSON.parse(response))  
    .then(responseObject => {
      const duration = responseObject.routes[0].legs.reduce( (total, leg) => total + leg.distance.value, 0)
      res.send({duration})
    })
    
    .catch(error => console.log(error))
}


export default calculate