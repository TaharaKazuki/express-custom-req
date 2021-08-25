import fs from 'fs'
import express, { Express, Request, Response } from 'express'

import toursJSON from './dev-data/data/tours-simple.json'

type responseType = typeof toursJSON

const app: Express = express()

app.use(express.json())
app.use((req, _res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const tours: responseType = JSON.parse(
  `${fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)}`
)

const getAllTours = (_req: Request, res:Response) => {
  res.status(200).json({
    status: 'success',
    data: { tours }
  })
}

const getTour = (req: Request, res: Response) => {
  const id = +req.params.id
  const tour = tours.find(el => el.id === id)
  if(!tour) { 
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  })
}

app.route('/api/v1/tours').get(getAllTours)
app.route('/api/v1/tours/:id').get(getTour)

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
  console.info(`Running Server PORT:${PORT}`)
})