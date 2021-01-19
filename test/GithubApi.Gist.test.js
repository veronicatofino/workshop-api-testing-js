const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const promiseExample = `let myPromise = new Promise((Resolve, Reject) => {
    setTimeout(() => {
        Resolve('It works');
    }, 3000);
});`;

describe('Given a Github Api URL for gists tests', () => {
  describe('When want to create a new gist', () => {
    let responseGist;
    const jsonBody = {
      description: 'Gist description example',
      files: {
        'gistPromiseExample.js': {
          content: promiseExample
        }
      },
      public: true
    };

    before(async () => {
      responseGist = await agent.post(`${urlBase}/gists`).send(jsonBody)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it('Then the gist should have been created', async () => {
      expect(responseGist.status).to.equal(statusCode.CREATED);
      expect(responseGist.body).to.containSubset(jsonBody);
    });

    describe('When want to get the gist created', () => {
      let responseGetGist;

      before(async () => {
        responseGetGist = await agent.get(responseGist.body.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      });

      it('Then the gist should be retrieved', async () => {
        expect(responseGetGist.status).to.equal(statusCode.OK);
        expect(responseGetGist.body).to.containSubset(jsonBody);
      });

      describe('When want to delete the gist created', () => {
        let responseDelGist;

        before(async () => {
          responseDelGist = await agent.delete(responseGist.body.url)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        });

        it('Then the gist should have been deleted', async () => {
          expect(responseDelGist.status).to.equal(statusCode.NO_CONTENT);
          expect(responseDelGist.body).to.eql({});
        });

        describe('When want to consult the gist again', () => {
          let responseGistGet;
          before(async () => {
            await agent.get(responseGist.body.url)
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'agent')
              .catch((err) => {
                responseGistGet = err;
              });
          });
          it('Then the gist should not exist', async () => {
            expect(responseGistGet.status).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
