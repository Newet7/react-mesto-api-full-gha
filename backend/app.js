require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const {
  errors,
} = require('celebrate')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const {
  routes,
} = require('./routes')
const {
  handleError,
} = require('./middlewares/handleError')

const {
  requestLogger, errorLogger,
} = require('./middlewares/logger')

const {
  PORT = 3000, DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
})

// подключаемся к серверу mongo
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`)
  })
  .catch((err) => {
    console.log('Error on database connection')
    console.error(err)
  })

app.use(cors())

app.use(requestLogger) // подключаем логгер запросов

app.use(limiter)

app.use(helmet())

// подключаем роуты и всё остальное...
app.use(express.json())

// Краш-тест сервера
// (вызывает принудительное падение сервера
// для проверки автоматического перезапуска)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт')
  }, 0)
})

app.use(routes)

app.use(errorLogger) // подключаем логгер ошибок

app.use(errors()) // обработчик ошибок celebrate

app.use(handleError)

app.listen(PORT, () => {
  console.log(`is running on port ${PORT}`)
})
