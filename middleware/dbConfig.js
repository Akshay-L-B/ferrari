const sql=require("mssql/msnodesqlv8")
var config={
  server:"BHARATH\\SQLEXPRESS",
  database:"players",
  driver:"msnodesqlv8",
  user:"sa",
  password:"123",
  options:{
    trustedCOnnection:true
  }
}

sql.connect(config,function(err){
    if(err)console.log(err);
    var request=new sql.Request();
    request.query("select * from players",function(err,records){
      if(err)console.log(err);
      else console.log(records);
    })

})
