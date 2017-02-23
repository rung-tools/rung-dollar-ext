const { create, run } = require('rung-sdk');
const { OneOf, Money } = require('rung-sdk/dist/types');
const Bluebird = require('bluebird');
const agent = require('superagent');
const promisifyAgent = require('superagent-promise');
const { path } = require('ramda');

const request = promisifyAgent(agent, Bluebird);

function main(context, done) {
    const { currency, value } = context.params;

    return request.get('http://api.fixer.io/latest?base=USD')
        .then(path(['body', 'rates', currency]))
        .then(dollar => dollar <= value
            ? `Dollar is lower or equal to ${value}`
            : null)
        .then(done)
        .catch(() => done());
}

const params = {
    currency: {
        description: 'Currency to check dollar quotation',
        type: OneOf(['BRL', 'EUR']),
        default: 'BRL'
    },
    value: {
        description: 'When lower or equal to this, we\'ll tell you',
        type: Money,
        default: 3.0
    }
};

const app = create(main, { params });
app.run();

module.exports = app;
