const backApp = require("./backend");

// 注册后台服务，只有在development环节才会开启。
console.log(backApp.server)
var server = backApp.server.listen(3001, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例, 访问地址为 http://%s:%s", host, port)
})
