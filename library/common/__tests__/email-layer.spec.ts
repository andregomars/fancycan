import { EmailLayer } from '../src/core';

describe('When test email layer', () => {
    it.skip('should call email api failed due to incorrect credential', async () => {
        const to = 'andregomars@gmail.com';
        const subject = 'a test from sendgrid api by fancycan';
        const html = '<h1>Hello Email!</h1>';

        let actual = false;
        try {
            await EmailLayer.send(to, subject, html);
        } catch (err) {
            actual = err.message;
        }

        expect(actual).toEqual('Unauthorized');
    });
});
