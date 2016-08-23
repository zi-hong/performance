var mongoose = require("mongoose");	
var Schema = mongoose.Schema;	
var userScheMa = new Schema({
	creatTime: Number
});	
exports.infoData = mongoose.model('infoData', userScheMa);