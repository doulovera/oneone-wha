const logOnPetition = (req, res, next) => {
  console.info(`${req.method} - ${req.url}`)
  next()
}

export default logOnPetition
