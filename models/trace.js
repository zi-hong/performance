var mongoose = require("mongoose");	
var Schema = mongoose.Schema;	
var userScheMa = new Schema({
	creatTime: Number
});	
exports.traceData = mongoose.model('traceData', userScheMa);