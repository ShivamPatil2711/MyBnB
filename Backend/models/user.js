const mongoose=require("mongoose");
const userSchema=mongoose.Schema({// Structure of the Table BLUEPRINT OF THE TABLE
FirstName:{type:String,required:true},
LastName:{type:String,required:true}, 
email:{type:String,required:true},
password:{type:String,required:true},
userType:{type:String,required:true},
favourites:[{type:mongoose.Schema.Types.ObjectId,ref:"Home"}],
listedhomes:[{type:mongoose.Schema.Types.ObjectId,ref:"Home"}],
});
module.exports=mongoose.model("User",userSchema);// Class name User + it acts as both class + table

  