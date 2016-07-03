/**
 * Created by yuhuanxi on 16/7/2.
 */

"use strict"

var Koa = require('koa');
var app = new Koa();
var router = require('koa-router')();
var uuid = require('node-uuid');
var path = require('path');

var Pageres = require('pageres');

router.get('/convert/:url/:size', function* (ctx, next) {
        var remoteUrl = decodeURIComponent(this.params.url);
        var size = this.params.size;
        var imgName = uuid.v4().split('-')[0];

        var filePath = path.join(__dirname, 'img');
		console.log(remoteUrl, size, filePath, imgName);
		
        //TODO You can not handl the time when the window onload finished'
        new Pageres({delay: 2, filename: imgName})
            .src(remoteUrl, [size])
            .dest(filePath)
            .run()
            .then(function() {
                console.log('done');
            });
        
        var fileFullPath = path.join(filePath, imgName);
	  	//pagers formart png & jpg default png, it seems not support pdf. 
	  	//sad story! so you have to do something else...
	  	var mimetype = 'image/png' || 'application/pdf';        

		this.set('Content-disposition', 'attachment; filename=' + imgName);
	  	this.set('Content-type', mimetype);
		
		var fs = require('fs');
	  	var filestream = fs.createReadStream(fileFullPath);
	  	this.body = yield new Promise(function(resolve,reject){  
	        fs.readFile(fileFullPath, function(err,data){  
	            if(err){  
	                reject(err);//文件存在返回true  
	            }else{  
	                resolve(data);//文件不存在，这里会抛出异常  
	            }
	        });  
	    }).then(function(data){
	            console.log(data);  
	            return data;  
		},function(err){  
	            console.log(err);  
	            return err;  
	     });
    })


app.use(router.routes());
app.use(router.allowedMethods());


console.log('message: ' + "PhantomJS, which is used for generating the screenshots, "+
"is installed automagically, but in some rare cases it might fail to and you'll get an Error: "+
"spawn EACCES error. Download(url:http://phantomjs.org/download.html) "+
"PhantomJS manually and reinstall pageres if that happens.");

console.log('请在地址栏输入 ' +
    'http://127.0.0.1:3000/convert/' + 
    encodeURIComponent('http://www.baidu.com?a=1&b=2') +
    '/1920x1080 ' + '进行测试');

app.listen(3000);
