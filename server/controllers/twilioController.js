var twilio = require('../twilio/twilioApi');

module.exports  = {
    sendMessage:  function (phone, message) {
        twilio(phone, message);
    }
}