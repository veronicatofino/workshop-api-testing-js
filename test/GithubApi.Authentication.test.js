const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'veronicatofino';
const repository = 'workshop-api-testing-js';

describe('Github Api Test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
    });
  });
});
