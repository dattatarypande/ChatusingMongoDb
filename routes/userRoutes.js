module.exports=function(app){
    var userhandlers=require('../controllers/usercontroller');
    app.route('/profile')
    .post(userhandlers.loginRequired,userhandlers.profile);


    app.route('auth/register')
    .post(userhandlers.register);



    app.route('auth/sign-in')
    .post(userhandlers.sign_in);
}

