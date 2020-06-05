const request = require('request');
const fs = require('fs');
const async = require('async');
const { Parser } = require('json2csv');
const json2csvParser = new Parser();
const path = require('path'); 

const configBuffer = fs.readFileSync(path.join('config', process.argv[2]));
const configJSON = configBuffer.toString();
const config = JSON.parse(configJSON);

const apiList = config.apiList;
const src = config.src;
const dst = config.dst;
const srcDomain = src.domain;
const dstDomain = dst.domain;

const filename = 'result.csv';

fs.writeFileSync(filename, '\uFEFF');

API_call_loop();

function API_call_loop() {
    let idx = 0;
    
    async.whilst(
        function test(cb) {
            cb(null, idx < apiList.length);
        },
        function iter(cb) {
            API_call(apiList[idx], function(err, result) {
                if(err) {
                    return cb(err);
                }
                
                cb(null);
            });

            idx++;
        },
        function(err, n) {

        }
    );
}

function API_call(urlInfo, cb) {
    async.parallel({
        src: function(cb) {
            requestSync({
                uri: srcDomain + urlInfo.uri,
                method: urlInfo.method
            }, function(error, result) {
                if(error) {
                    return cb(error);
                }
    
                cb(null, result);
            });
        },
        dst: function(cb) {
            requestSync({
                uri: dstDomain + urlInfo.uri,
                method: urlInfo.method
            }, function(error, result) {
                if(error) {
                    return cb(error);
                }
    
                cb(null, result);
            });
        }
    }, function(err, results) {
        if(err) {
            console.log(err);
            return cb(err);
        } else {
            let datas = [];
            let srcJSON = JSON.parse(results.src);
            let dstJSON = JSON.parse(results.dst);
    
            datas = datas.concat(srcJSON);
            datas = datas.concat(makeEmptyParams(srcJSON));
            datas = datas.concat(dstJSON);
            datas = datas.concat(makeEmptyParams(dstJSON));
    
            console.log('----- Request Data -----');
            console.log(datas);
            
            console.log('----- Convert Csv Data -----');
            const csv = json2csvParser.parse(datas);
            console.log(csv);
    
            fs.appendFileSync(filename, csv + '\n');

            cb(null);
        }
    });
}

function requestSync(option, cb) {
    request(option, function (error, response, body) {
        if(error) {
            return cb(error);
        }
      
        cb(null, body);
    });    
}

function makeEmptyParams(obj) {
    let params = {};
    let keys;

    if(Array.isArray(obj)) {
        keys = Object.keys(obj[0]);
    } else if (typeof obj === 'object') {
        keys = Object.keys(obj);
    }

    for(let i=0 ; i<keys.length ; i++) {
        params[keys[i] + ''] = '';
    }

    return params;
}