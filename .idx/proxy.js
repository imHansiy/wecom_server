var express = require('express');
var request = require('request');
var getRawBody = require('raw-body');
var contentType = require('content-type');
var app = express();

const ProjectIdxUrl = "https://3000-idx-wecomserver-1724431339943.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/wecom";
let BEARER_TOKEN = 'your_bearer_token_here';

// 使用 getRawBody 解析 /update-token 的请求体
app.post('/update-token', (req, res) => {
    const type = req.headers['content-type'] || 'text/plain';
    const charset = contentType.parse(type).parameters.charset || 'utf-8';

    getRawBody(req, {
        encoding: charset,
    }, (err, body) => {
        if (err) {
            return res.status(400).send('Invalid body');
        }

        // 解析 JSON 请求体
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (parseError) {
            return res.status(400).send('Invalid JSON');
        }

        const { token } = parsedBody;
        if (!token) {
            return res.status(400).send('Token is required');
        }

        BEARER_TOKEN = token;
        res.send('Bearer token updated successfully');
    });
});

app.use('/', (req, res) => {
    console.log("请求根路径");
    const type = req.headers['content-type'] || 'text/plain';
    const charset = contentType.parse(type).parameters.charset || 'utf-8';

    getRawBody(req, {
        encoding: charset,
    }, (err, body) => {
        if (err) {
            return res.status(400).send('Invalid body');
        }
        request({
            url: ProjectIdxUrl + req.url,
            method: req.method,
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': type,
            },
            body: body  // 确保原始 body 被传递
        }).pipe(res);
    });
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
