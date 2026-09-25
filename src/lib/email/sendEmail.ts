import emailjs from "@emailjs/browser";

export async function sendOtpEmail(
  toEmail: string,
  otp: string,
): Promise<boolean> {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        OTP: otp,
      },
      { publicKey },
    );
    return response.status === 200;
  } catch (error) {
    // Keep dev flowing while EmailJS keys are still placeholders.
    console.error("Could not send the OTP email:", error);
    return false;
  }
}
