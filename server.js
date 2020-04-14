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
    const text = 'Nou missatge de contacte via web de la persona amb nom: ' + name + ' i email: ' + email + ', ha fet el comentari següent: ' + message;
    const html = `<p>Hola,</p><p>Nou missatge de contacte via web de la persona amb nom: <b>${name}</b> i email: <b>${email}</b>, ha fet el comentari següent:</p> <p><b>${message}</b></p>`;

    const mailOptions = {
        from: process.env.SERVER_MAIL_USER,
        to: process.env.DESTINATION_MAIL,
        subject: `Nou missatge email web de la persona ${name} amb email ${email}`,
        text: text,
        html: html
    };

    if (name && email && message) {
        if (!botDetected) {
            res.message = 'Missatge enviat!';
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                }
                res.json({ success: true })
            });
        } else {
            console.log('Bot not detected')
            return res.status(500).send('Error Bot Detected');
        }
    } else {
        return res.status(500).send('Error Bot Detected');
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
