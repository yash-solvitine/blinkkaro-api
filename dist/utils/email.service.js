"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodejs_1 = __importDefault(require("@emailjs/nodejs"));
const config_1 = require("../config/config");
const logger_1 = require("./logger");
class EmailService {
    static async sendWaitlistConfirmation({ name, email, }) {
        try {
            await nodejs_1.default.send(config_1.config.email.serviceId, config_1.config.email.waitlistTemplateId, {
                name: name,
                email: email,
                from_name: "BlinkKaro Team",
            }, {
                publicKey: config_1.config.email.publicKey,
            });
            logger_1.log.info("Waitlist confirmation email sent", { email });
        }
        catch (error) {
            logger_1.log.error("Error sending waitlist confirmation email", { error, email });
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map