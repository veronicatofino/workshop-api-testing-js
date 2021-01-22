const agent = require('superagent');
const chai = require('chai');
const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');

const { expect } = chai;
chai.use(require('chai-json-schema'));

const urlBase = 'https://api.github.com';

describe('Given event Github API resources', () => {
  describe('When wanna verify the List public events', () => {
    let response;

    before(async () => {
      response = await agent
        .get(`${urlBase}/events`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Then the body should have the right schema', () => {
      expect(response).to.be.jsonSchema(listPublicEventsSchema);
    });
  });
});
