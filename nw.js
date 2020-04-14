let Service = require('node-windows').Service;

let svc = new Service({
    name: 'node_chat',    //服务名称
    description: '咨询平台服务', //描述
    script: 'D:/app.js' //nodejs项目要启动的文件路径
});

svc.on('install', () => {
    svc.start();
});

svc.install();