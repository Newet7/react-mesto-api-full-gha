/* GET /users/:userId - возвращает пользователя по _id
   GET /users — возвращает всех пользователей
   POST /users — создаёт пользователя
   PATCH /users/me — обновляет профиль
   PATCH /users/me/avatar — обновляет аватар профиля
*/

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
  NODE_ENV, JWT_SECRET,
} = process.env

const {
  User,
} = require('../models/user')

const {
  UnauthorizedError,
} = require('../errors/UnauthorizedError')

const {
  NotFoundError,
} = require('../errors/NotFoundError')

const {
  ConflictError,
} = require('../errors/ConflictError')

// login (/POST) авторизация(залогиниывание) пользователя по email и password

async function login(req, res, next) {
  try {
    const {
      email, password,
    } = req.body

    const user = await User.findOne({
      email,
    }).select('+password')

    if (!user) {
      throw new UnauthorizedError('Неверные данные для входа')
    }
    const hasRightPassword = await bcrypt.compare(password, user.password)

    if (!hasRightPassword) {
      throw new UnauthorizedError('Неверные данные для входа')
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret',
      {
        expiresIn: '7d',
      },
    )
    res.send({
      token,
    })
  } catch (err) {
    next(err)
  }
}

// GET /users/:userId - возвращает пользователя по _id
async function getUser(req, res, next) {
  try {
    const {
      userId,
    } = req.params
    const user = await User.findById(userId)

    if (!user) {
      throw new NotFoundError('Пользователь не найден')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

// GET /users/me - возвращает информацию о текущем пользователе

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
      throw new NotFoundError('Пользователь не найден')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

// GET /users — возвращает всех пользователей
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({
    })
    res.send(users)
  } catch (err) {
    next(err)
  }
}

const SALT_LENGTH = 10

// POST /users — создаёт пользователя
async function createUser(req, res, next) {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH)
    let user = await User.findOne({
      email,
    })

    if (user) {
      throw new ConflictError('Пользователь с таким email уже существует')
    }

    user = await User.create({
      email, password: passwordHash, name, about, avatar,
    })
    user = user.toObject()
    delete user.password
    res.status(201).send(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /users/me — обновляет профиль
async function updateUser(req, res, next) {
  try {
    const userId = req.user._id
    const {
      name, about,
    } = req.body
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name, about,
      },
      {
        new: true, runValidators: true,
      },
    )
    res.send(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /users/me/avatar — обновляет аватар профиля
async function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id
    const {
      avatar,
    } = req.body
    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
      },
    )
    res.send(user)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
}
