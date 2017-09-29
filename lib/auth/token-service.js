require('dotenv').config();
const jwt = require('jsonwebtoken-promisified');
const appSecret = process.env.APP_SECRET;


module.exports = {
  sign(user) {
    const payload = {
      id: user._id,
      roles: user.roles
    };
    return jwt.signAsync(
      { id: payload.id, roles: payload.roles },
      appSecret,
      '7d'
    );
  },

  verify(token) {
    return jwt.verifyAsync(token, appSecret)
    .then(result => {
      return result
    })
  }
};
