var twilio = require('twilio')

var sms = function(phone, context) {
  var accountSID = process.env.sid
  var token = process.env.token
  var client = new twilio.RestClient(accountSID, token);
  console.log(phone, context)
  client.messages.create({
    to: phone,
    from: '3479348362',
    body: context
  }, function(err, message) {
    if (err) {
      'Houston we have a problem'
    } else {
      console.log(message.dateCreated)
    }
  })
}
module.exports = sms;