const { expect } = require('chai');
const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
chai.use(require('chai-dom'));

const urlBase = 'https://github.com';
const githubUserName = 'aperdomob';
const redirectUrl = 'https://github.com/aperdomob/new-redirect-test';

describe('Given a Github Api URL to do a redirect test', () => {
  describe('When want to check that, consuming an URL with the HEAD method, it returns a new URL for redirection', () => {
    let responseHeadRedirect;

    before(async () => {
      await agent.head(`${urlBase}/${githubUserName}/redirect-test`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .catch((err) => {
          responseHeadRedirect = err;
        });
    });

    it('Then should return the redirected URL', () => {
      expect(responseHeadRedirect.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(responseHeadRedirect.response.headers.location).to.equal(redirectUrl);
    });

    describe('When want to check that, consuming an URL with the GET method, it redirects automaticallly to a new URL', () => {
      let responseGetRedirect;

      before(async () => {
        responseGetRedirect = await agent.get(`${urlBase}/${githubUserName}/redirect-test`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      });

      it('Then should return the HTML document of the redirected URL', () => {
        expect(responseGetRedirect.status).to.equal(statusCode.OK);
        expect(responseGetRedirect.text).to.have.string(`<meta property="og:url" content="${redirectUrl}" />`);
      });
    });
  });
});
