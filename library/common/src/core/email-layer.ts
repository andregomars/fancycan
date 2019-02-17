import sgMail = require('@sendgrid/mail');
import { ConfigUtility } from '../utility';

export class EmailLayer {

    public static async send(to: string, subject: string, html: string) {
        const apiKey = ConfigUtility.getEmailApiKey();
        sgMail.setApiKey(apiKey);

        const from = ConfigUtility.getEmailFrom();
        const msg = {
            to: to,
            from: from,
            subject: subject,
            html: html
        };

        await sgMail.send(msg);
    }

}
