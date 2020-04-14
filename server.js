const bodyParser = require('body-parser'),
    express = require('express'),
    http = require('http'),
    nodemailer = require('nodemailer'),
    path = require('path'),
    app = express();


require('dotenv').config();

app.use(express.static(path.join(__dirname, process.env.CLIENT_FOLDER)));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.CLIENT_FOLDER, 'index.html'));
});

// email configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVER_MAIL_USER,
        pass: process.env.SERVER_MAIL_PWD
    }
});

app.post('/contact', (req, res) => {
    console.log('contact request: ', req.body);
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const botDetected = req.body.fake;
    const text = 'Nou missage de ' + name + ' amb email: ' + email + 'i comentari: ' + message;
    const html = `<p>Nou missage de ${name} amb email: ${email}, i comentari:</p> <p>${message}</p>`;

    const mailOptions = {
        from: process.env.SERVER_MAIL_USER,
        to: process.env.DESTINATION_MAIL,
        subject: `Informacio email web de ${name}`,
        text: text,
        html: html
    };

    if (name && email && message) {
        if (!botDetected) {
            res.message = 'Missatge enviat!';
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
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
