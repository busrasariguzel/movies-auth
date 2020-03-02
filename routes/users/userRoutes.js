const express = require('express');
const router = express.Router();
const User = require('./models/Users');
const bcrypt = require('bcryptjs');
const passport=require('passport');
require('../../lib/passport')

router.get('/success', (req,res)=>{
  if(req.isAuthenticated()){
    return res.render('success')
  }else{
    res.send('unauthorized')
  }
  
})


//find all users
router.get('/', (req,res)=>{
  //empty object allows us to fill with users
  User.find({})
  .then(users=>{
    return res.status(200).json({message:'success', users})
  }).catch(err=> res.status(500).json({message:'Server error'}))
});


// with OUT passport
// router.post('/register', (req,res)=>{
//   // validate the inputs / make sure all fields are filled
//   if(!req.body.name || !req.body.email || !req.body.password) {
//     return res.status(403).json({message:'All inputs must be filled.'})
//   }
//   //check if user exists with the unique value which is email

//   User.findOne({email: req.body.email})
//   .then(user=>{
//     //check to see if there is a user value 
//     if(user){
//       return res.status(400).json({message:'User already exists'})
//     }
//   // create a new user from the model
//     const newUser= new User();
//     // salt password..place extra characters in password to make harder to guess
//     const salt = bcrypt.genSaltSync(10);
//     // hash password
//     const hash = bcrypt.hashSync(req.body.password, salt);
//   // set values for the user to model keys
//   newUser.name = req.body.name;
//   newUser.email = req.body.email;
//   newUser.password = hash;



  
//   // save the user
//     newUser.save()
//     .then(user => {
//       return res.status(200).json({message:'User created', user})


//     }).catch(err=> res.status(400).json({message:'User not saved', err}))

//   }).catch(err=> {
//     return res.status(418).json({message: 'We messed up', err})
//   })
// });



// register with passport
const myValidation = (req,res,next) => {
  //validate inputs
  if(!req.body.name || !req.body.email || !req.body.password) {
    return res.status(403).json({message:'All inputs must be filled.'})
  }
  next();
}

// REGISTER WITH PASSPORT
router.post('/register', myValidation, (req,res)=>{
  // validate the inputs / make sure all fields are filled
  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   return res.status(403).json({message:'All inputs must be filled.'})
  // }
  //check if user exists with the unique value which is email

  User.findOne({email: req.body.email})
  .then(user=>{
    //check to see if there is a user value 
    if(user){
        res.render('/users/fail')
      return res.status(400).json({message:'User already exists'})
    }
  // create a new user from the model
    const newUser= new User();
    // salt password..place extra characters in password to make harder to guess
    const salt = bcrypt.genSaltSync(10);
    // hash password
    const hash = bcrypt.hashSync(req.body.password, salt);
  // set values for the user to model keys
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = hash;

  // save the user
    newUser.save()
    .then(user => {
      return req.login(user, (err)=> {
        if(err){
          return res.status(500).json({message:'Server error', err})
        } else {
        //   console.log('register...',req.session)
          res.redirect('/users/loggedIn')
        }
      })


    }).catch(err=> res.status(400).json({message:'User not saved', err}))

  }).catch(err=> {
    return res.status(418).json({message: 'We messed up', err})
  })
});


router.get('/register', (req, res) => {
    return res.render('userViews/register')
});
router.get('/login', (req, res) => {
    return res.render('userViews/login')
});
router.get('/loggedIn', (req, res) => {
    return res.render('userViews/loggedIn')
});

router.get('/fail', (req, res) => {
    return res.render('userViews/fail')
});
router.get('/registered', (req, res) => {
    return res.render('userViews/registered')
});

//LOGIN WITH PASSWORD
router.post('/login', 
  //authenticate using local login from passport file
  passport.authenticate('local-login',{
  successRedirect: '/users/loggedIn',
  failureRedirect:'/users/fail',
  failureFlash:true
})
);


// router.post('/register', 
//   //authenticate using local login from passport file
//   passport.authenticate('local-login',{
//   successRedirect: '/users/loggedIn',
//   failureRedirect:'/users/login',
//   failureFlash:true
// })
// );


//LOGIN WITHOUT PASSWORD
// router.post('/login', (req,res)=> {
//   //validate the input
//   if(req.body.email && req.body.password){
//     // find user 
//     User.findOne({email:req.body.email})
//     .then((user)=> {
//       //compare password
//       //bcrypt returns a true or false as a result
//       bcrypt.compare(req.body.password, user.password)
//       .then(
//         (result)=> {
//           if(!result){
//             return res.status(403).json({message:'Incorrect credentials'})
//           } else{
//             return res.status(200).json({message:'You are now logged in', user})
//           }
//         }
//       ).catch(err =>
//         res.status(200).json({message:'incorrect credentials'})
//       );

//       }
//     ).catch(err=>res.status(500).json({message:'We messed up'}))
    
//   } else {
//     return res.status(403).json({message:'All inputs must be filled'});
//   }
  
// })

// router.put('/update/:id', (req,res)=>{
//   // search for user in the database based on the parameters
//   User.findById(req.params.id)
//   .then((user)=> {
// if(user){
//   // fill in values for inputs or leave value if no input// if they dont put anything it stays the same
//   user.name = user.body.name ? req.body.name : user.name;
//   user.email = user.body.email ? req.body.email : user.email;
//   //save user
//   user.save()
//   .then((user)=> {
//     return res.status(200).json({message:'User updated',user})
//   }).catch(err=>res.status(400).json({message:'User not updated', err}))
// }else{
//   return res.status(403).json({message:'user not found'})
// }
//   }).catch(err=>res.status(500).json({message:'server error', err}))
// })
router.put('/update/:id', (req, res) => {
  // search for user in the database based on parameters
  User.findById(req.params.id)
  .then((user) => {
    if (user) {
      //fill in values for input or leave value if no input
      user.name = req.body.name ? req.body.name : user.name;
      user.email = req.body.email ? req.body.email : user.email;
      // save user
      user
      .save()
      .then((user) => {
        return res.status(200).json({message: "User updated", user})
      }).catch(err => res.status(400).json({message: "cannot reuse credentials", err}))
    }
  }).catch(err => res.status(500).json({message: 'user not found'}));
});


//logout

router.get('/logout', (req,res)=>{
  req.session.destroy();
//   console.log('logout...', req.session)
  req.logout();
  return res.redirect('/')
})

module.exports = router;
