/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var mongoose = require('mongoose');
mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true});
const Book = mongoose.model('Book', { 
title:	String,
comments: []
});
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     Book.find({}, function(err, data){
       if (err) return (err);
       var log = data.map((d)=>{ return {_id: d.id, title: d.title, commentcount: d.comments.length} });
      
       res.json(log);
     })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      Book.create({
        title: title
      }, function(err, data){
        if (err) return (err);
        res.json({_id: data._id, title: data.title});
      })
      
   
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err){
        if (err) return (err);
        return 'complete delete successful'
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    Book.exists({_id: bookid}) == false ? 'book does not exist' :  
    Book.findById(bookid, function(err, data){
        if (err) return (err);
      console.log(data);
        res.json({_id: data._id, title: data.title, comments: data.comments});
      })
     })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
