import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export class EmailService {
  async verify ({ input }) {
    const { url, email, token } = input
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your e-mail address',
        html: createEmailBody(token)
      }
    } catch (err) {

    }
    function createEmailBody (token) {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de Correo Electrónico</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }

                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                h1 {
                    color: #333;
                }

                p {
                    color: #666;
                }

                .verification-link {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4caf50;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 3px;
                    margin-top: 15px;
                }

                .verification-link:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verificación de Correo Electrónico</h1>
                <p>¡Gracias por registrarte! Para completar tu registro, haz clic en el enlace de verificación a continuación:</p>
                <a href="https://${url}/verify/${token}" class="verification-link">Verificar Correo Electrónico</a>
            </div>
        </body>
        </html>`
    }
  }
}
