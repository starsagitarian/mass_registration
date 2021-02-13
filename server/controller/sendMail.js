const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const {OAuth2} = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// send mail
const sendEmail = async (to, url) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = await oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        //service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken:accessToken.token
        }, 
        tls: {
        rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: `"St. Mark Mission, London" <${SENDER_EMAIL_ADDRESS}>`,
        to: to,
        subject: "Regarding your booking",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Book Of Seats</h2>
            <p>Congratulations! You're almost set to start using St. Mark Mission's Book Of Seats App.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your email!</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if(err) return err;
        return infor;
    })
}

const forgotPassword = async (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = await oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        //service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken:accessToken.token
        }, 
        tls: {
        rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: `"St. Mark Mission, London" <${SENDER_EMAIL_ADDRESS}>`,
        to: to,
        subject: "Uh OH!! you forgot your password",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">St. Mark Mission, Book Of Seats</h2>
            <h3 style="text-align: center;">Reset your Password!!</h3>
            <p>So you forgot your Password!! No worries, Just click the button below to validate your email address.</p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if(err) return err;
        return infor;
    })
}

module.exports = { sendEmail, forgotPassword }