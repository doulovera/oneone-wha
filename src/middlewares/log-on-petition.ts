const logOnPetition = (req: any, res: any, next: any) => {
  console.info(`${req.method} - ${req.url}`)
  next()
}

export default logOnPetition
