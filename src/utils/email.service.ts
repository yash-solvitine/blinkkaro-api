import emailjs from "@emailjs/nodejs";
import { config } from "../config/config";
import { log } from "./logger";

export class EmailService {
  /**
   * Send waitlist confirmation email
   */
  static async sendWaitlistConfirmation({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) {
    try {
      await emailjs.send(
        config.email.serviceId,
        config.email.waitlistTemplateId,
        {
          name: name,
          email: email,
          from_name: "BlinkKaro Team",
        },
        {
          publicKey: config.email.publicKey,
        }
      );

      log.info("Waitlist confirmation email sent", { email });
    } catch (error) {
      log.error("Error sending waitlist confirmation email", { error, email });
      // Don't throw the error as email sending is not critical
    }
  }
}
