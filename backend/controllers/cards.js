const {
  Card,
} = require('../models/card')

const {
  NotFoundError,
} = require('../errors/NotFoundError')
// const {
//  UnauthorizedError
// } = require('../errors/UnauthorizedError')

const {
  ForbiddenError,
} = require('../errors/ForbiddenError')

// GET /cards — возвращает все карточки
async function getAllCards(req, res, next) {
  try {
    const cards = await Card.find({
    }).populate('owner').populate('likes')
    res.send(cards.reverse())
  } catch (err) {
    next(err)
  }
}

// POST /cards — создаёт карточку
async function createCard(req, res, next) {
  try {
    const {
      name, link,
    } = req.body
    const ownerId = req.user._id
    const card = await Card.create({
      name, link, owner: ownerId,
    })
    await card.populate('owner')
    await card.populate('likes')
    res.status(201).send(card)
  } catch (err) {
    next(err)
  }
}

// DELETE /cards/:cardId — удаляет карточку по идентификатору
async function deleteCard(req, res, next) {
  try {
    const {
      cardId,
    } = req.params

    const card = await Card.findById(cardId).populate('owner').populate('likes')

    if (!card) {
      throw new NotFoundError('Карточка не найдена')
    }

    const ownerId = card.owner.id
    const userId = req.user._id

    if (ownerId !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку')
    }

    await Card.deleteOne(card)

    res.send(card)
  } catch (err) {
    next(err)
  }
}

// PUT /cards/:cardId/likes — поставить лайк карточке
async function putLike(req, res, next) {
  try {
    const userId = req.user._id
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: {
          likes: userId,
        },
      }, // добавить _id в массив, если его там нет
      {
        new: true,
      },
    ).populate('owner').populate('likes')

    if (!card) {
      throw new NotFoundError('Карточка не найдена')
    }
    res.send(card)
  } catch (err) {
    next(err)
  }
}

// DELETE /cards/:cardId/likes — убрать лайк с карточки
async function deleteLike(req, res, next) {
  try {
    const userId = req.user._id
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: {
          likes: userId,
        },
      }, // убрать _id из массива, если он есть
      {
        new: true,
      },
    ).populate('owner').populate('likes')
    if (!card) {
      throw new NotFoundError('Карточка не найдена')
    }
    res.send(card)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createCard, getAllCards, deleteCard, putLike, deleteLike,
}
