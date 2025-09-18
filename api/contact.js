// Vercel Serverless Function for contact form
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, comments, verify } = req.body;

  // Email validation function
  function isEmail(email) {
    const emailRegex =
      /^[-_.[:alnum:]]+@((([[:alnum:]]|[[:alnum:]][[:alnum:]-]*[[:alnum:]])\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i;
    return emailRegex.test(email);
  }

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error:
        '<div class="error_message">Attention! You must enter your name.</div>',
    });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({
      error:
        '<div class="error_message">Attention! Please enter a valid email address.</div>',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({
      error:
        '<div class="error_message">Attention! You have enter an invalid e-mail address, try again.</div>',
    });
  }

  if (!comments || comments.trim() === "") {
    return res.status(400).json({
      error:
        '<div class="error_message">Attention! Please enter your message.</div>',
    });
  }

  if (!verify || verify.trim() === "" || verify.trim() !== "4") {
    return res.status(400).json({
      error:
        '<div class="error_message">Attention! The verification number is incorrect.</div>',
    });
  }

  // Here you can integrate with email services like:
  // - SendGrid
  // - Mailgun
  // - Nodemailer with SMTP
  // - Or any other email service

  // For now, we'll just return a success response
  // You'll need to add actual email sending functionality

  try {
    // Email sending logic would go here
    console.log("Contact form submission:", { name, email, comments });

    return res.status(200).json({
      success: `
        <fieldset>
          <div id='success_page'>
            <h3>Email Sent Successfully.</h3>
            <p>Thank you <strong>${name}</strong>, your message has been submitted to us.</p>
          </div>
        </fieldset>
      `,
    });
  } catch (error) {
    return res.status(500).json({ error: "ERROR!" });
  }
}
