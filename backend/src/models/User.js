const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
        wishlist: [
            {
                itemId: { type: String },
                title: { type: String },
                img: { type: String },
                duration: { type: String },
                price: { type: String },
                addedAt: { type: Date, default: Date.now }
            }
        ]
        ,
        bookings: [
            {
                itemId: { type: String },
                title: { type: String },
                img: { type: String },
                duration: { type: String },
                price: { type: Number },
                priceLabel: { type: String },
                paid: { type: Boolean, default: false },
                paidAt: { type: Date },
                paymentId: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);