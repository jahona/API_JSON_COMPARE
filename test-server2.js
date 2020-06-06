const express = require('express');

const app = express();

app.get('/test1', function(req, res) {
    res.json({
        'param1': 'value1',
        'param2': 'value2'
    });
});

app.get('/test2', function(req, res) {
    res.json([
        {
            'param1': '사자1',
            'param2': '거북이1'
        },
        {
            'param1': '토끼1',
            'param2': '호랑이1'
        }
    ]);
})

app.listen(3001, function() {
    console.log('server start : 3001');
})