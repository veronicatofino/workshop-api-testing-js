const { expect } = require('chai');
const agent = require('superagent');
const statusCode = require('http-status-codes');
const responseTime = require('superagent-response-time');

const urlBase = 'https://api.github.com';

describe('Given a Github Api URL to do users test', () => {
  describe('When want check the response time of the request and count how many users it brings', () => {
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

    it('Then the response time should be less than five seconds', () => {
      expect(response.status).to.equal(statusCode.OK);
      expect(rTime).to.satisfy((num) => num < 5000);
    });

    it('And the number of user should be 30', () => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.length(30);
    });

    describe('When want to bring only 10 users', () => {
      let responseCountT;
      const queryArgsT = {
        per_page: 10
      };

      before(async () => {
        responseCountT = await agent.get(`${urlBase}/users`)
          .query(queryArgsT)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      });

      it('Then the number of users should be 10', () => {
        expect(responseCountT.status).to.equal(statusCode.OK);
        expect(responseCountT.body).to.have.length(10);
      });

      describe('When want to bring only 50 users', () => {
        let responseCountF;
        const queryArgsF = {
          per_page: 50
        };

        before(async () => {
          responseCountF = await agent.get(`${urlBase}/users`)
            .query(queryArgsF)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        });

        it('Then the number of users should be 50', () => {
          expect(responseCountF.status).to.equal(statusCode.OK);
          expect(responseCountF.body).to.have.length(50);
        });
      });
    });
  });
});
