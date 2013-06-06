/**
 * Created with JetBrains WebStorm.
 * User: rekbun
 * Date: 6/5/13
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */
var http= require('http');
var urlUtil=require('url');

var server=null;
var adapters=[];
var adaptersSSL=[];
var handleRequest= function(request,response)
                   {
                       console.log("request received");
                        var urlObject= urlUtil.parse(request.url,true);
                        var apiName=urlObject.pathname;
                        if(apiName=="/lb")
                        {
                            if(adapters.length>0)
                            {
                                var random=Math.floor((Math.random()*10)%adapters.length);
                                var address= adapters[random].address;
                                adapters[random].count++;

                                response.end(""+JSON.stringify(address));
                            }
                        }
                       console.log("request served");
                       return "returned";

                   };







var config=require("../app.conf.js");


function attachRequestHandlers() {
    server.on("request",handleRequest);
    server.on("close",function(errno){
        console.log("error"+errno);
    });

    server.on("clientError",function(error){
        console.log("error");
    }) ;
}

function start(port) {
    server= http.createServer();
    attachRequestHandlers();
    server.listen(port);
    console.log("server started");
}

var _ref = config.SERVER;
for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
    console.log("called server");
    var frontEnd = _ref[_i];
    adapters.push({
        address: frontEnd,
        count: 0
    });
}

_ref = config.SERVERSSL;
for (var _i = 0,_len = _ref.length; _i < _len; _i++) {
    var frontEnd = _ref[_i];
    adaptersSSL.push({
        address: frontEnd,
        count: 0
    });
}

start(config.PORT);