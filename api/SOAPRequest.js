let fs = require('fs');
let path = require('path');
let rootPath = path.join(__dirname,'..');

const _formatMessage = Symbol('formatMessage');
class SOAPRequest {
    /**
     *
     * @param {Object} httpOptions
     * @param {Object} body
     * @param {string} transport
     *
     */
    constructor(httpOptions={},body={}) {
        this.httpOptions = httpOptions;
        this._transport = null;
        this.body = body;
        this.soapEnv = null;
    }

    /**
     * @returns {Object}
     */
    get transport() {
        return this._transport;
    }

    /**
     * @param {string} transport
     */
    set transport(transport) {
        if (transport === 'http')
            this._transport = require('http');
        else if (transport === 'https')
            this._transport = require('https');
        else
            throw new TypeError('Invalid transport type, only http or https is supported');
    }

    /**
     * @param {string} serviceName
     * @param {string} version
     */
    createSoapEnvelope(serviceName,version='') {
        let location = __dirname+'/'+serviceName+version+'.json';
        this.soapEnv = JSON.parse(fs.readFileSync(location,'utf-8'));
    }

    /**
     * @returns {string} xml string
     */
    [_formatMessage]() {
        let js2xml = require('js2xmlparser');
        this.soapEnv['soapenv:Body'] = this.body;
        let options = {declaration:{'include': false},
            prettyPrinting:{'enabled': true}};
        return js2xml.parse('soapenv:Envelope',this.soapEnv,options);
    }

    /**
     * @returns {Promise} promise object
     */
    sendRequest() {
        let _this = this;
        return new Promise((resolve,reject)=> {
            let xml2js = require('xml2js').parseString;
            let soapMsg = _this[_formatMessage]();
            console.log(_this.httpOptions);
            let request = _this._transport.request(_this.httpOptions,function(response) {
                let data = '';
                response.setEncoding('utf8');
                if (response.headers['set-cookie']) {
                    _this.httpOptions.headers['Cookie'] = response.headers['set-cookie'];
                    if (_this.httpOptions.headers['Authorization'])
                        delete _this.httpOptions.headers['Authorization'];
                }
                response.on('data',(d)=> { data += d; });
                response.on('end',()=> {
                  console.log(data);
                    xml2js(data,(err,jsonresult)=> {
                        if (err) reject(err);
                        resolve({code:response.statusCode,result:jsonresult});
                    });
                });
            });
            request.write(soapMsg);
            request.on('error',(err)=> { reject(err); });
            request.end();
        });
    }
}

module.exports = SOAPRequest;
