
var express = require('express')
var app = express()
var md5 = require("md5");
var request = require('request');
var http = require('http');
var iconv = require('iconv-lite');
var request = require('request');
var phoneKey=[];
var request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.get('/api/products', function (req, res) {
    const data = { "appId": "F74B63E1F64F7D161EE2CD666666F27F", "barcodes": ["1585980034279", "1910211514366-2"] }// let F = this.http.post(url,'');
    var signature = md5('1120749499853035880' + JSON.stringify(data));
    var clientServerOptions = {
        uri: 'https://area17-win.pospal.cn/pospal-api2/openapi/v1/productOpenApi/queryProductByBarcodes',
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'data-signature': signature
        }
    }

    request.post('https://area17-win.pospal.cn/pospal-api2/openapi/v1/productOpenApi/queryProductByBarcodes',
        clientServerOptions,
        function (error, response, body) {
            res.send(body);
        });
});

app.post('/api/imgs', function (req, res) {
    var Barcode =  req.body.barcode;
    const data = {"appId": 'F74B63E1F64F7D161EE2CD666666F27F',"productBarcode": Barcode}   
    var signature = md5('1120749499853035880' + JSON.stringify(data));
    var url = `https://area17-win.pospal.cn/pospal-api2/openapi/v1/productOpenApi/queryProductImagesByBarcode`;
    var clientServerOptions = {
        uri: url,
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'data-signature': signature
        }
    }
    request.post(url,
        clientServerOptions,
        function (error, response, body) {
            res.send(body);

        });


});

app.post('/api/getMseeage', function (req, res) {
    console.log("getMseeage")
    var d = new Date();

     console.log(d.getTime())
    var text = `驗證碼:5555`
    buf = iconv.encode(text, 'Big5');
    var data={
        key: req.body.key,
        value:4444,
        time:d.getTime()

    }

   
      var msg=format(buf)
        request(`https://api.kotsms.com.tw/kotsmsapi-1.php?username=cash&password=cash1234&dstaddr=
        0911768292&smbody=${msg}`, 
        function (error, response, body) {
            
            console.log(body)
            if(!error){
                res.send({result:"success"});
                phoneKey.push(data);
     
            }else{
                res.send({result:"fail"});
            }

          
          
        });
    res.send({result:"success"});

});
app.post('/api/verifyMsg', function (req, res) {
    var key =  req.body.key;
    var value= req.body.value;

    const found = phoneKey.findIndex(element => element.key == key);
    console.log(found);
    if(found!==-1){
        if(value==phoneKey[found].value){
            console.log(value);
            console.log(phoneKey[found].value);
            res.send({result:"success"});
        }
        else{
            console.log(value);
            console.log(phoneKey[found].value);
            res.send({result:"fail"});
        }
    }

  
});

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
function format(buf) {
    var rtn = "";
    for (var i = 0; i < buf.length; i++) {
        rtn += "%" + buf[i].toString(16);
    }
    return rtn;
}