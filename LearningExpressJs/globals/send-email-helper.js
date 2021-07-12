const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.sendMail = (redirectTo, res, content) => {
    try {
        res.redirect(redirectTo ? redirectTo : '/');
        return transporter.sendMail({
            to: content.toEmail,
            from: 'ahm.moh.has@gmail.com',
            subject: "LoL Shop - " + content.subject,
            html: content.html
        }).then(() => console.log('Email', '"' + content.subject + '"', 'is sent to', content.toEmail));
    }
    catch (err) {
        //TODO: Handle this the way you handle monogoConnect and remove the following lines
        console.log(err);
        res.redirect(redirectTo ? redirectTo : '/');
    }
}