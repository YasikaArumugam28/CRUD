var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        
    },
    Age: {
        type: Number,
      
    },
  
});
 
module.exports=new mongoose.model('star', schema);