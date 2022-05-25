import nodemailer from "nodemailer";

export async function sendEmail(to:string, html:string) {

    // let testAccount = await nodemailer.createTestAccount();
    // console.log('testAccount:', testAccount);

    let transporter = nodemailer.createTransport({
    service:'Gmail', 
    auth: {
      user: 'botfakeq@gmail.com',
      pass: 'qwertypassword!',
    }
  });

  
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', 
    to: to, 
    subject: "Change of Password",
    html
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
