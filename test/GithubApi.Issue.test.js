const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'veronicatofino';
const repository = 'repoA';

describe('Given a Github Api URL for Issuses tests', () => {
  describe(`When want to login with the user ${githubUserName}`, () => {
    let responseLogin;

    before(async () => {
      responseLogin = await agent.post(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it('Then the user should be logged in and at least one of his/her repositories should be public', async () => {
      expect(responseLogin.status).to.equal(statusCode.OK);
      expect(responseLogin.body.public_repos).to.satisfy((num) => num > 1);
    });

    describe(`When want obtain the repository ${repository} from the user`, () => {
      let responseRepositories;
      let repositoryWanted;

      before(async () => {
        responseRepositories = await agent.get(responseLogin.body.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        repositoryWanted = responseRepositories.body.find((element) => element.name === repository);
      });

      it('Then the repository wanted should be in the list of repositories', () => {
        expect(repositoryWanted.name).to.equal(repository);
        expect(repositoryWanted.private).to.equal(false);
        expect(repositoryWanted.description).to.equal('Im repo A');
      });

      describe(`When want to create an issue in the repository ${repository}`, () => {
        let responseNewIssue;
        let numberIssue;

        before(async () => {
          const jsonBody = {
            title: 'Issue test from API'
          };

          responseNewIssue = await agent.post(`${urlBase}/repos/${githubUserName}/${repository}/issues`).send(jsonBody)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        });

        it('Then the issue should have been created', () => {
          expect(responseNewIssue.status).to.equal(statusCode.CREATED);
          expect(responseNewIssue.body.title).to.equal('Issue test from API');
          expect(responseNewIssue.body.body).to.equal(null);
          numberIssue = responseNewIssue.body.number;
        });

        describe('When want to update the body of the issue created', () => {
          let responseIssue;

          before(async () => {
            const jsonBody = {
              body: 'Issue test body'
            };

            responseIssue = await agent.patch(`${urlBase}/repos/${githubUserName}/${repository}/issues/${numberIssue}`).send(jsonBody)
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'agent');
          });

          it('Then the body of the issue should have been updated', () => {
            expect(responseIssue.status).to.equal(statusCode.OK);
            expect(responseIssue.body.title).to.equal('Issue test from API');
            expect(responseIssue.body.body).to.equal('Issue test body');
          });
        });
      });
    });
  });
});
