const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});


const sendOtpMail = async (email, otp) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: 'Quiz Application Password Reset OTP',

            html: `
                <h2>Password Reset OTP</h2>

                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in 5 minutes.</p>
            `
        });

        console.log('otp email sent');

        return true;

    } catch (error) {

        console.log('mail error full');

        console.log(error);

        console.log(error.message);

        console.log(error.code);

        return false;
    }

};


module.exports = {
    sendOtpMail
};