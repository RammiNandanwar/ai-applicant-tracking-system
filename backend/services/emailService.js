const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendApplicationStatusEmail = async ({
    applicantEmail,
    applicantName,
    jobTitle,
    company,
    status
}) => {
    const statusMessages = {
        shortlisted:
            "Congratulations! Your application has been shortlisted.",
        interview:
            "Your application has moved to the interview stage.",
        selected:
            "Congratulations! You have been selected for the position.",
        rejected:
            "Thank you for applying. Unfortunately, your application was not selected at this time.",
        applied:
            "Your application has been successfully submitted."
    };

    const message =
        statusMessages[status] ||
        "Your application status has been updated.";

    const mailOptions = {
        from: `"ATS Recruitment System" <${process.env.EMAIL_USER}>`,
        to: applicantEmail,
        subject: `Application Update - ${jobTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px;">

                <h2>Application Status Update</h2>

                <p>Hello ${applicantName || "Candidate"},</p>

                <p>
                    ${message}
                </p>

                <div style="
                    background: #f5f7fb;
                    padding: 18px;
                    border-radius: 10px;
                    margin: 20px 0;
                ">

                    <p>
                        <strong>Position:</strong>
                        ${jobTitle}
                    </p>

                    <p>
                        <strong>Company:</strong>
                        ${company || "Company"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${status}
                    </p>

                </div>

                <p>
                    Thank you for using our Applicant Tracking System.
                </p>

                <p>
                    Best regards,<br>
                    ATS Recruitment Team
                </p>

            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendApplicationStatusEmail
};