import { ConfigUtility } from '../src/utility';

describe('When test MongoLayer', () => {
    it('should able to connect test mongodb', () => {
        const config = new ConfigUtility();
        const actual = config.getDbConnectionString();
        const expected = 'mongodb+srv://admin:fccdbo123!@cluster0-pwbs7.mongodb.net';

        expect(actual).toEqual(expected);
    });
});
