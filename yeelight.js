const net = require('net');

const client = new net.Socket();
var _port;
var _host;

module.exports = class Yeelight {

    constructor(host,port)
    {
        _port = port;
        _host = host;

    }

    createRequest(id,method,params){
        return JSON.stringify({
            id : id,
            method : method,
            params : params
        });
;
    }
    
    lightControlRequest(method,params)
{
    var request = this.createRequest(1,method,params);
    client.connect({ port: _port, host: _host }, function() {
        console.log('Connected.');
          console.log(client.write(`${request}\r\n`));
    });
};
}
