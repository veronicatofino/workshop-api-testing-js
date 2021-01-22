const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const fetch = require('isomorphic-fetch');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const promiseExample = `let myPromise = new Promise((Resolve, Reject) => {
    setTimeout(() => {
        Resolve('It works');
    }, 3000);
});`;

describe('Given a Github Api URL to do a isomorphic fetch test', () => {
  describe('When want to create a new gist', () => {
    // let responseStatus;
    let gist;
    let gistResponse;
    const jsonBody = {
      description: 'Gist description example',
      files: {
        'gistPromiseExample.js': { content: promiseExample }
      },
      public: true
    };
    const fetchBodyPost = {
      method: 'POST',
      headers: { Authorization: `Token ${process.env.ACCESS_TOKEN}` },
      body: JSON.stringify(jsonBody)
    };

    before(async () => {
      await fetch(`${urlBase}/gists`, fetchBodyPost)
        .then(async (response) => {
          gistResponse = response.status;
          gist = await response.json();
        });
    });

    it('Then the gist should have been created', async () => {
      expect(gistResponse).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(jsonBody);
    });

    describe('When want to get the gist created', () => {
      let responseGetGist;
      let gistGet;
      const fetchBodyGet = {
        method: 'GET',
        headers: { Authorization: `Token ${process.env.ACCESS_TOKEN}` }
      };

      before(async () => {
        await fetch(gist.url, fetchBodyGet)
          .then(async (response) => {
            responseGetGist = response.status;
            gistGet = await response.json();
          });
      });

      it('Then the gist should be retrieved', () => {
        expect(responseGetGist).to.equal(statusCode.OK);
        expect(gistGet).to.containSubset(jsonBody);
      });

      describe('When want to delete the gist created', () => {
        let responseDelGist;
        const fetchBodyDel = {
          method: 'DELETE',
          headers: { Authorization: `Token ${process.env.ACCESS_TOKEN}` }
        };

        before(async () => {
          await fetch(gist.url, fetchBodyDel)
            .then((response) => {
              responseDelGist = response.status;
            });
        });

        it('Then the gist should have been deleted', async () => {
          expect(responseDelGist).to.equal(statusCode.NO_CONTENT);
        });

        describe('When want to consult the gist again', () => {
          let responseGistGet;
          const fetchGetBody = {
            method: 'GET',
            headers: { Authorization: `Token ${process.env.ACCESS_TOKEN}` }
          };

          before(async () => {
            await fetch(gist.url, fetchGetBody)
              .then(async (response) => {
                responseGistGet = response.status;
              });
          });

          it('Then the gist should not exist', async () => {
            expect(responseGistGet).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
