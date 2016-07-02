/**
 * Created by yuhuanxi on 16/7/2.
 */

"use strict"

var Koa = require('koa');
var app = new Koa();
var router = require('koa-router')();
var uuid = require('node-uuid');
var path = require('path');

const Pageres = require('pageres');

router
    .get('/convert', function*() {
        var qu = this.request.query;
        var url = qu.url;
        var size = qu.size;
        var imgName = uuid.v4().split('-')[0];

        var workDir = path.resolve('./');
        console.log(workDir);

        // 组合完整的文件路径:当前目录+'pub';
        var filePath = path.join(workDir, 'img');

        new Pageres({delay: 2, filename: imgName})
            .src(url, [size])
            .dest(filePath)
            .run()
            .then(()=> {
                console.log('done');
            });
        this.body = 'Hello World';
    })

app
    .use(router.routes())
    .use(router.allowedMethods());

console.log('服务已经启动');

console.log('请在地址栏输入 ' +
    'http://localhost:3000/convert?' +
    'url=http://www.baidu.com' +
    '&size=1920x1080 ' + '进行测试');

app.listen(3000);
