var express = require('express');
const Emp = require('./Models/emp')
const User = require('./Models/User')
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
var app = express();
const mongoose = require('mongoose');//Routes
app.get('/', function (req, res) {
    res.send('Hello World!');
});
//Database
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
mongoose.connection.once('open',function(){
    console.log('Database connected Successfully');
}).on('error',function(err){
    console.log('Error', err);
})
//Admin Bro
AdminBro.registerAdapter(AdminBroMongoose)
const AdminBroOptions = {
  resources: [User, Emp],
}
const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email })
        if (user) {
          if (password === user.encryptedPassword) {
            return user
          }
        }
      return false
    },
    cookiePassword: 'session Key',
  })
app.use(adminBro.options.rootPath, router)
app.listen(8000, function () {
    console.log('Listening to Port 8000');
});