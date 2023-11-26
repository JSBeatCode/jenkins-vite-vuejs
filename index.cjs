const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const nodemailer = require('nodemailer');
require('dotenv').config();
const axios = require('axios');
const os = require('os');
// const fetch = require('node-fetch');
const states = {
    clientIp: '',
}


app.use(express.json())
app.use(cors())
app.use(express.static('dist'));
// app.get('/', (req, res) => {
    // res.sendFile("index.html", {root: path.join(__dirname)}, () => {});
    // res.status(200).send('Hello There!')
// })

app.use((req, res, next) => {
    const clientIp = req.ip;
    console.log('Client IP: ' + clientIp);
    states.clientIp = clientIp;
    next();
})

app.get('/getmsg', (req, res) => {
    //const url = "http://ec2-54-180-85-94.ap-northeast-2.compute.amazonaws.com:7771/getmsg"
    const url = "http://localhost:3010/data"
    axios.get(url).then(response => {
        console.log(response.data)
        res.status(200).send(response.data)
    })
})

app.post('/sendmsg', (req, res) => {
    console.log(req.body)
    //const url = "http://ec2-54-180-85-94.ap-northeast-2.compute.amazonaws.com:7771/getmsg"
    const url = "http://localhost:3010/data"
    const customHeaders = {
        'Content-Type': 'application/json', // Content-Type header for JSON data
      };
      
      axios.post(url, req.body, {
        headers: customHeaders
      })
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(error => {
          console.error('POST request error:', error);
        });
})


app.post('/email', (req, res) => {
    console.log(req.body)
    sendEmail(req.body)
})

app.get('/getInfo', (req, res) => {
    const interfaces = os.networkInterfaces();
    
    for (const interfaceName in interfaces) {
        const networkInterface = interfaces[interfaceName];

        for (const iface of networkInterface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                res.send({
                    address: iface.address
                })
            }
        }
    }
})


app.listen(7771, () => {
    console.log('Server Started ' + states.clientIp + ' on Port!', 7771)
})


function sendEmail(contents) {
    
    // SMTP 설정
    const transporter = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 465,
        auth: {
            user: process.env.MAIL_ADDR,
            pass: process.env.MAIL_PASS
        }
    });

    // 이메일 옵션
    const mailOptions = {
        from: process.env.MAIL_ADDR,
        to: process.env.MAIL_ADDR,
        subject: '네이버 메일을 통한 이메일 발송',
        text: JSON.stringify(contents)
    }

    // 이메일 보내기
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('메일에러: ' + error);
        } else {
            console.log('전송 성공')
        }
    });
}
