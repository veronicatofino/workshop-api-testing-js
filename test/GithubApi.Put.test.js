const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Given a Github Api URL for users tests', () => {
  describe(`When want to follow the user ${githubUserName}`, () => {
    let responseUserFollowed;

    before(async () => {
      responseUserFollowed = await agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it('Then the user should haven been followed', async () => {
      expect(responseUserFollowed.status).to.equal(statusCode.NO_CONTENT);
      expect(responseUserFollowed.body).to.eql({});
    });

    describe('When want to verify that the user has been followed', () => {
      let responseUserVer;

      before(async () => {
        responseUserVer = await agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      });

      it('Then the user should be in the list of following users', () => {
        expect(responseUserVer.status).to.equal(statusCode.OK);
        expect(responseUserVer.body).to.containSubset([{
          login: githubUserName
        }]);
      });

      describe('When want to follow the same user', () => {
        before(async () => {
          responseUserFollowed = await agent.put(`${urlBase}/user/following/${githubUserName}`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        });

        it('Then the answer should be the same', async () => {
          expect(responseUserFollowed.status).to.equal(statusCode.NO_CONTENT);
          expect(responseUserFollowed.body).to.eql({});
        });
      });
    });
  });
});
