const Net = require('net');
var queryString = require('querystring');
var ssdp = require('dgram');
var url = require('url');

const client = new Net.Socket();
var _port;
var _host;
var _ssdpSocket;

module.exports = class Yeelight {

    constructor(host, port) {
        _port = port;
        _host = host;

    }

    createRequest(id, method, params) {
        return JSON.stringify({
            id: id,
            method: method,
            params: params
        });
        ;
    }

    sendRequest(method, params, callback) {
        if (params === null || params === undefined || Array.isArray(params)) {
            params = [];
        } else if (!Array.isArray(params)) {
            params = [params];
        }
        var request = this.createRequest(1, method, params);


        var socket = client.connect({ port: _port, host: _host }, function () {
            console.log('Connected.');
        });
        socket.write(`${request}\r\n`);
        socket.on('data', function (data) {
            if (callback) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    callback(e);
                    return;
                }
                if (data['error']) {
                    callback(new Error(data['error']['message']));
                } else {
                    callback(null, data['result']);
                }
            }
            socket.destroy();
        });

        socket.on('error', function () {
            console.log('connection error.')
            socket.destroy();
        });

    };

    //     discoverBulb(callback){
    //         var port = 1982;
    //         var host = '239.255.255.250';
    //         var ssdpSocket = ssdp.createSocket('udp4');

    //         if (_ssdpSocket) {
    //             _ssdpSocket.close();
    //             _ssdpSocket = null;
    //         }
    //         _ssdpSocket = ssdpSocket;

    //         ssdpSocket.on('message', function (message) {
    //             var data = queryString.parse(message.toString(), '\r\n', ': ');
    //             var location = data['Location'];
    //             var methods = data['support'];
    //             if (location) {
    //                 var urlObj = url.parse(location);
    //                 var bulb = new Yeelight(
    //                     data['id'],
    //                     urlObj['port'],
    //                     urlObj['hostname'],
    //                     methods ? methods.trim().split(' ') : []
    //                 );
    //                 if (callback) {
    //                     callback(bulb);
    //                 }
    //             }
    //         });
    //         ssdpSocket.bind(port, function () {
    //             ssdpSocket.addMembership(host);
    //             ssdpSocket.send(
    //                 'M-SEARCH * HTTP/1.1\r\n' +
    //                 'HOST: ' + host + ':' + port + '\r\n' +
    //                 'MAN: "ssdp:discover"\r\n' +
    //                 'ST: wifi_bulb\r\n',
    //                 port, host
    //             );
    //         });
    //     }

}
