const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user.model')
const Message = require('./message.model')

const chatSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: [],
    },
  ],
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
