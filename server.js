  const express = require("express");
  const app = express();
  const server = app.listen(8000)
  const io = require('socket.io')(server);
  const mongoose = require('mongoose');
  const session = require('express-session');
  const flash = require('express-flash');
  const moment = require('moment');
app.use(flash());
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

const CommentSchema = new mongoose.Schema({
  name: {type: String, required: [true, "A Name is required "]},
  comment: {type: String, required: [true, "A Comment is required "]},
}, {timestamps: true})
const Comment = mongoose.model('Comment', CommentSchema)

const PostSchema = new mongoose.Schema({
  message: {type: String, required: [true, "A Message is required"]},
  comments: [CommentSchema]
}, {timestamps: true})
const Post = mongoose.model('Post', PostSchema)

const UserSchema = new mongoose.Schema({
  name: {type: String, required: [true, "A Name is required"]},
  posts: [PostSchema]

}, {timestamps: true})
const User = mongoose.model('User', UserSchema)


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public")); 


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');  

app.get('/', (request, response) =>{
    User.find()
        .then(result_user => {  
          Comment.find()
                .then(result_comment =>{
                  response.render('index', {result_user: result_user, result_comment: result_comment});
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    
});
app.post('/Post_Message', (request, response) =>{
    const user = new User(request.body)
    const post = new Post(request.body)
    post.save()
        .then(result_post =>{
          user.save()
              .then(result_user => {
                  User.updateOne({_id: result_user._id},
                    { 
                      posts: result_post
                    }
                  )
                  .then(result=>{
                    request.flash("success", "Data Successful Save!")
                    response.redirect('/');
                  })
                  .catch()
              })
              .catch(err => {
                for (var key in err.errors){
                  request.flash("validation", err.errors[key].message)
                }
                response.redirect('/');
              });
        })
        .catch(err => {
          for (var key in err.errors){
            request.flash("validation", err.errors[key].message)
          }
          response.redirect('/');
        });
    
});
app.post('/Post_Comment', (request, response) =>{
      const comment = new Comment(request.body)
      comment.save()
              .then(result_comment =>{
                 console.log(request.body.id)
                   Post.updateOne({_id: request.body.id},
                        { 
                          comments: result_comment
                        }
                      )
                      .then(result=>{
                        console.log(result)
                        request.flash("success", "Comment Successful Save!")
                        response.redirect('/');
                      })
                      .catch(err => res.json(err));
              })
              .catch(err => {
                  for (var key in err.errors){
                    request.flash("validation", err.errors[key].message)
                  }
                  response.redirect('/');
                });
     // User.updateOne({_id: request.body.id},
     //                { 
     //                  comments: result_post
     //                }
     //              )
     //              .then(result=>{
     //                request.flash("success", "Data Successful Save!")
     //                response.redirect('/');
     //              })
     //              .catch()
});
// user.save()
    //     .then(result => {
    //         console.log(posts._id)
    //         // Post.updateOne({_id: result._id},
    //         //   {
    //         //     posts:,
    //         //   }
    //         // )
    //         // request.flash("success", "Data Successful Save!")
    //         response.redirect('/');
    //     })
    //     .catch(err => {
    //       for (var key in err.errors){
    //         request.flash("validation", err.errors[key].message)
    //       }
    //       response.redirect('/');
    //     });
// app.post('/mongoose/new', (request, response)=>{
//   const mongoose = new Mongoose(request.body)
//   mongoose.save()
//   .then(new_mongoose =>{
//     response.render('new', {new_mongoose : new_mongoose, moment: moment})
//   })
//   .catch(err =>{
//     for (var key in err.errors){
//       request.flash("validation", err.errors[key].message)
//     }
//   response.redirect('/')
//   });
  
// });
// app.get('/mongoose/:id', (request, response) =>{
//     Mongoose.findOne({_id: request.params.id})
//             .then(mongoose_id =>{
//                 response.render('display', {mongoose: mongoose_id, moment: moment})
//             })
//             .catch()
// });
// app.get('/mongoose/edit/:id', (request, response) =>{
//      Mongoose.findOne({_id: request.params.id})
//             .then(mongoose_id =>{
//                 response.render('Edit', {mongoose: mongoose_id, moment: moment})
//             })
//             .catch(err => res.json(err));
// })
// app.post('/mongoose/edit', (request, response) =>{
//     Mongoose.updateOne({_id: request.body.id},
//       {
//         name: request.body.name,
//         description: request.body.description,
//         createdAt: request.body.createdAt
//       }
//     )
//     .then(result =>{
//         request.flash('validation',"successful Update");
//         response.redirect('/')
//     })
//     .catch(err => res.json(err));
// });
// app.get('/mongoose/destroy/:id', (request, response) =>{

//     Mongoose.remove({_id: request.params.id})
//             .then(Delete_mongoose =>{
//               request.flash('validation', "Successful to Destroy")
//               response.redirect('/')
//             })
//             .catch(err => res.json(err));
// });







