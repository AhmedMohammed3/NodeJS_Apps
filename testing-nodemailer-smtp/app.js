const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
	host: 'smtp.hostinger.com',
	port: 465,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: 'noreply@radiologysc.gq',
		pass: 'Ab123456'
	}
});

transporter.verify(function (error, success) {
	if (error) {
		console.log(error);
	} else {
		console.log('Server is ready to take our messages');
	}
});
const htmlstream = fs.createReadStream("index.html");

const message = {
	from: 'noreply@radiologysc.gq',
	to: 'ahm.moh.has@gmail.com',
	subject: 'Message title',
	html: htmlstream
};

transporter.sendMail(message, function(err) {
  if (err) {
    console.log(err);
  }
});