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
            'param1': '사자',
            'param2': '거북이'
        },
        {
            'param1': '토끼',
            'param2': '호랑이'
        }
    ]);
})

app.listen(3000, function() {
    console.log('server start : 3000');
})