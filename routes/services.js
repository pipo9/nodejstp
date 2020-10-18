var express = require('express') 
var app = express() 
var fs = require('fs'); 
var path = require('path'); 
const mongoose = require('mongoose');


require('dotenv/config'); 
    var multer = require('multer'); 
    
    var storage = multer.diskStorage({ 
        destination: (req, file, cb) => { 
            cb(null, 'uploads') 
        }, 
        filename: (req, file, cb) => { 
            cb(null, file.fieldname + '-' + Date.now()) 
        } 
    }); 
    
 var upload = multer({ storage: storage }); 
 var imgModel = require('../models/imagemodel'); 

// Uploading the image 
app.get('/upload',(req,res)=>{
    res.render('upload'); 
});
// Retriving the images 
app.get('/find', (req, res) => {
	 imgModel.find({}, function(err, result) {
		if (err) {
		  console.log(err);
		} else {
		  res.render('find',{items:result});
		}
	  });
      
}); 

app.post('/find', upload.single('image'), (req, res, next) => { 

	var obj = { 
		name: req.body.name, 
		desc: req.body.desc, 
		img: { 
			data: fs.readFileSync(path.join('C:/Users/achraf/Desktop/nodejstp/uploads/' + req.file.filename)), 
			contentType: 'image/png'
		} 
	} 
	imgModel.create(obj, (err, item) => { 
		if (err) { 
			console.log(err); 
		} 
		else { 
			res.redirect('/services/find'); 
			
		} 
	}); 
}); 
// Retriving the last image 
app.get('/show', (req, res) => {
	mongoose.connection.collection('images').find()
    .sort({$natural: -1})
	.limit(1)
	.next()
    .then(
      function(doc) {
        res.render('show',{image:doc});
      },
      function(err) {
        console.log('Error:', err);
      })
}); 

module.exports = app;


