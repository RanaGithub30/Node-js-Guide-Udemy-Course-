const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

exports.sendMail = (req, res, next) => {
    res.render('mail/send');
}

exports.sendMailProcess = async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).send('Email is required!');
    }
    
    try{
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // Mailtrap SMTP host
            port: process.env.EMAIL_PORT, // Mailtrap SMTP port
            auth: {
                user: process.env.EMAIL_USER, // Mailtrap username
                pass: process.env.EMAIL_PASS  // Mailtrap password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: email, // Recipient email
            subject: 'Welcome!',
            text: `Hi there! Thanks for using our service. This is a test email sent to ${email}.`,
            html: `<p>Hi there! Thanks for using our service. This is a test email sent to <strong>${email}</strong>.</p>`
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        res.send(`Email successfully sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
}