'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./reactivity.min.js');
} else {
    module.exports = require('./reactivity.js');
}
