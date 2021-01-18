const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const md5 = require('md5');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';

describe('Given a Github Api Test url', () => {
  describe('When want access to an user', () => {
    let responseUser;

    before(async () => {
      responseUser = await agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it(`Then the user ${githubUserName} should be retrieved`, () => {
      expect(responseUser.status).to.equal(statusCode.OK);
      expect(responseUser.body.name).to.equal('Alejandro Perdomo');
      expect(responseUser.body.company).to.equal('PSL');
      expect(responseUser.body.location).to.equal('Colombia');
    });

    describe(`When want obtain the repository ${repository} from the user`, () => {
      let responseRepositories;
      let repositoryWanted;

      before(async () => {
        responseRepositories = await agent.get(responseUser.body.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        repositoryWanted = responseRepositories.body.find((element) => element.name === repository);
      });

      it('Then the repository wanted should be there', () => {
        expect(repositoryWanted.name).to.equal(repository);
        expect(repositoryWanted.private).to.equal(false);
        expect(repositoryWanted.description).to.equal('An awesome html report for Jasmine');
      });

      describe(`When want to download the repository ${repository}`, () => {
        let responseDownload;

        before(async () => {
          responseDownload = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/zipball/${repositoryWanted.default_branch}`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        });

        it('Then the repository should be downloaded', () => {
          expect(responseDownload.status).to.equal(statusCode.OK);
          expect(responseDownload.headers['content-type']).to.equal('application/zip');
        });

        describe(`When want to obtain the list of files and find the README.md of the repository  ${repository}`, () => {
          let responseFiles;
          let fileReadMe;

          before(async () => {
            responseFiles = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/contents/`)
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'agent');
          });

          it('Then the file README.md should be included in the list', () => {
            expect(responseFiles.body).to.containSubset([{
              name: 'README.md',
              path: 'README.md',
              sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
            }]);
            fileReadMe = responseFiles.body.find((element) => element.name === 'README.md');
          });

          describe('When want to download the README file and check the MD5 of the file', () => {
            let responseReadMe;
            const MD5Wanted = '0e62b07144b4fa997eedb864ff93e26b';

            before(async () => {
              responseReadMe = await agent.get(fileReadMe.download_url);
            });

            it('Then the MD5 of the file should be the same of the file downloaded', () => {
              expect(md5(responseReadMe.text)).to.equal(MD5Wanted);
            });
          });
        });
      });
    });
  });
});
