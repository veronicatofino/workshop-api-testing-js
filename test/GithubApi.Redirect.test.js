const { expect } = require('chai');
const agent = require('superagent');
const statusCode = require('http-status-codes');

const urlBase = 'https://github.com';
const githubUserName = 'aperdomob';
const redirectUrl = 'https://github.com/aperdomob/new-redirect-test';

describe('Given a Github Api URL for redirect test', () => {
  describe('When want to redirect to a differente url with the HEAD method', () => {
    let responseHeadRedirect;
    before(async () => {
      await agent.head(`${urlBase}/${githubUserName}/redirect-test`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .catch((err) => {
          responseHeadRedirect = err;
        });
    });

    it('The url should have been redirected', () => {
      expect(responseHeadRedirect.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(responseHeadRedirect.response.headers.location).to.equal(redirectUrl);
    });

    describe('When want to redirect to a differente url with the GET method', () => {
      let responseGetRedirect;
      before(async () => {
        responseGetRedirect = await agent.get(`${urlBase}/${githubUserName}/redirect-test`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      });

      it('The url should have been redirected', () => {
        expect(responseGetRedirect.status).to.equal(statusCode.OK);
      });
    });
  });
});
