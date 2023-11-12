// import validator from 'validator'

const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      // required: [true, 'Поле "name" должно быть заполнено'],
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      // required: [true, 'Поле "about" должно быть заполнено'],
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      // required: true,
    },
  },
  {
    versionKey: false,
  },
  // {
  //   versionKey: false,
  // },
)

const User = mongoose.model('user', userSchema)

module.exports = {
  User,
}

// создаём модель и экспортируем её
// module.exports = mongoose.model('user', userSchema);
