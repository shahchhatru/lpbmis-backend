const nodemailer = require('nodemailer');

const BASE_URL = 'https://lpbmis.gov.np';

const EMAIL_USER = 'grgukesh9111@gmail.com';
const EMAIL_PASS = 'nqgz gnnq rhoo szkp';

async function sendOtpEmail(email, otp, name, url = BASE_URL) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER, // generated ethereal user
      pass: EMAIL_PASS, // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"LPBMIS" <${EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'LPBMIS LOGIN LINK', // Subject line
    text: `Hi ${name},  please use this link to login to your account`, // plain text body
    html: `<td style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;margin:0 2px 0 auto;min-width:80px;background-color:#47a2ea">
      <a href="${url}/otpLogin?token=${otp}"
        target="_blank"
        data-saferedirecturl="https://www.google.com/url?q=${url}/otpLogin?token%3D${otp}">
        <center>
          <font size="3">
          <span style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px">
            Log&nbsp;in&nbsp;as&nbsp;${name}
          </span></font></center>
      </a>
    </td>`, // html body
  });

  console.log('Message sent: %s', info.messageId, info);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

async function sendUserCreatedEmail(email, name, password, url, reset = false) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER, // generated ethereal user
      pass: EMAIL_PASS, // generated ethereal password
    },
  });
  const message = reset ? 'your account has been registered.' : 'your password has been reset.';
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"LPBMIS" <${EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'LPBMIS Account registered', // Subject line
    text: `Hi ${name}, ${message}.`, // plain text body
    html: `<td style="display:flex;align-items:center;">
    <button  style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;min-width:80px;background-color:#47a2ea;margin-right: 10px">
      <a href="${url}/login"
        target="_blank"
        style="text-decoration:none"
        data-saferedirecturl="https://www.google.com/url?q=${url}/login">
        <center>
          <font size="3">
          <span style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px">
            Log&nbsp;in&nbsp;as&nbsp;${name}
          </span></font></center>
      </a> </button> with default password "${password}"
    </td>`, // html body
  });

  console.log('Message sent: %s', info.messageId, info);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = {
  sendOtpEmail,
  sendUserCreatedEmail,
};
