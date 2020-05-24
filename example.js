const yeelight = require('./yeelight');

const host = '192.168.1.99';
const port = 55443;

var yeelightController = new yeelight(host, port);


yeelightController.sendRequest('toggle', null, function (err, result) {
    console.log(result);
}); //toggle test

