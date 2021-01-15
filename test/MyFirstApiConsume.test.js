const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const expect = chai.expect;

describe('First Api Tests', () => {
    it('Consume GET Service', async () => {
        const response = await agent.get('https://httpbin.org/ip');

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
    });

    it('Consume GET Service with query parameters', async () => {
        const query = {
            name: 'John',
            age: '31',
            city: 'New York'
        };

        const response = await agent.get('https://httpbin.org/get').query(query);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.args).to.eql(query);
    });

    it('Consume DELETE Service', async () => {
        const response = await agent.delete('https://httpbin.org/delete');

        expect(response.status).to.equal(statusCode.OK);
    });

    it('Consume PUT Service with json entry', async () => {
        const jsonBody = {
            name: "veronica",
            years: 21
        }

        const response = await agent.put('https://httpbin.org/put').send(jsonBody);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(jsonBody);
    });

    it('Consume PUT Service with query entry', async () => {
        const argsBody = {
            name: "veronica",
            years: "21"
        }

        const response = await agent.put('https://httpbin.org/put').query(argsBody);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.args).to.eql(argsBody);
    });

    it('Consume PATCH Service with json entry of one field', async () => {
        const jsonBody = {
            name: "valentina"
        }

        const response = await agent.patch('https://httpbin.org/patch').send(jsonBody);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(jsonBody);
    });

    it('Consume PATCH Service with form-data entry', async () => {
        const name = 'jessica'

        const response = await agent.patch('https://httpbin.org/patch').field('name', name);

        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.form.name).to.equal(name);
    });

    it('Consume HEAD Service', async () => {
        const response = await agent.head('https://httpbin.org/headers');

        expect(response.status).to.equal(statusCode.OK);
    });
});
