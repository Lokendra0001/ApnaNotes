const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto")

const userSchema = new Schema({
    profileImg: {
        type: String,
        default: "/images/defaultAvator.png"
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    bio: {
        type: String,
        default: "A user who enjoys exploring, learning and engaging with thoughtful content."
    }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    const salt = randomBytes(10).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.password = hashedPassword;
    user.salt = salt;
    next();
})

userSchema.static("verifyPassword", function (user, password) {
    const salt = user.salt;
    const newHashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (user.password !== newHashedPassword) return false;

    return true;
})

const User = model('user', userSchema);

module.exports = User;