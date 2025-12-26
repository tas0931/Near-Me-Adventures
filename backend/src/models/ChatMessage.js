const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
