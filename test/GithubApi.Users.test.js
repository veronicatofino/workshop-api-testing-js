const { expect } = require('chai');
const agent = require('superagent');
const statusCode = require('http-status-codes');
const responseTime = require('superagent-response-time');

const urlBase = 'https://api.github.com';

describe('Given a Github Api URL to do a response time test', () => {
  describe('When want to bring all the users and check the response time of the request', () => {
    let response;
    let rTime;
    const callback = (req, time) => {
      rTime = time;
    };

    before(async () => {
      response = await agent.get(`${urlBase}/users`)
        .use(responseTime(callback))
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it('Then the response time should have been less than five seconds', () => {
      expect(response.status).to.equal(statusCode.OK);
      expect(rTime).to.satisfy((num) => num < 5000);
    });
  });
});
