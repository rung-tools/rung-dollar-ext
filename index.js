const { create, run } = require('rung-sdk');
const { OneOf, Double } = require('rung-sdk/dist/types');
const Bluebird = require('bluebird');
const agent = require('superagent');
const promisifyAgent = require('superagent-promise');

const request = promisifyAgent(agent, Bluebird);

function main(context, done) {
    const { currency, value } = context.params;

    return request.get('http://api.fixer.io/latest')
        .then(({ body }) => {
            done(body);
        });
}

const params = {
    currency: {
        description: 'Currency to check dollar quotation',
        type: OneOf(['BRL', 'EUR']),
        default: 'BRL'
    },
    value: {
        description: 'When lower than this, we\'ll tell you',
        type: Double,
        default: 3.0
    }
};

const app = create(main, { params });
app.run();

module.exports = app;

