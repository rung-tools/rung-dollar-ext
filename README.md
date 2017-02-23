## Rung ─ Dollar quotation extension

This is a demo extension to Rung showing how to be alerted when dollar in a specific currency be lower or equal to a specified
value.

### Full source

```js
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
```

When you clone this repo and install the packages, you can do `node index.js` to start the _Query Wizard_ via _CLI_. We
integrate with a third-party API called `fixer.io`.

You'll get this screen and the result:

![](http://i.imgur.com/cmZEHNQ.png)

If you get a valid value as output, an alert would be generated. Otherwise, nothing would happen.
