const bodyParser = require('body-parser'),
    express = require('express'),
    http = require('http'),
    nodemailer = require('nodemailer'),
    path = require('path'),
    smtpTransport = require('nodemailer-smtp-transport'),
    app = express();


require('dotenv').config();


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let smtpTrans = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    auth: {
        user: process.env.SERVER_MAIL_USER,
        pass: process.env.SERVER_MAIL_PWD
    }
}));

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, process.env.CLIENT_FOLDER, 'index.html'));
// });

app.post('/contact', (req, res) => {
    console.log(req.body);
    let name = req.body.name,
        email = req.body.email,
        subject = req.body.subject,
        message = req.body.message,
        botDetected = req.body.fake,
        text = 'Nou missage de ' + name +
            ' amb email: ' + email +
            'i comentari: ' + message,
        html = `<p>Nou missage de ${name} amb email: ${email}, i comentari:</p>
                <p>${message}</p>`,
        mailOptions = {
            to: process.env.DESTINATION_MAIL,
            subject: subject,
            text: text,
            html: html
        };
    if (name && email && message) {
        if (!botDetected) {
            subject = subject || 'Nou missage a camins ONG';
            res.message = 'Missatge enviat!';
            smtpTrans.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                    res.end('Error');
                } else {
                    console.log(response);
                    res.end('Send');
                }
            });
        } else {
            res.end('Error');
        }
    } else {
        res.end('Error');
    }
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8088';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on localhost:${port}`));
