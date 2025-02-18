var fs = require('fs');

const DEFAULT_NS = 'portal'

module.exports = {
    input: [
        'src/**/*.{js,jsx,ts,tsx}',
    ],
    output: '../internal/server/locales',
    options: {
        removeUnusedKeys: true,
        sort: true,
        debug: true,
        lngs: ['en'],
        ns: [
            'portal',
            'settings',
        ],
        defaultLng: 'en',
        defaultNs: 'portal',
        defaultValue: (lng, ns, key) => {
            return key
        },
        resource: {
            loadPath: '{{lng}}/{{ns}}.json',
            savePath: '{{lng}}/{{ns}}.json',
            jsonIndent: 2,
        },
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        }
    },
    transform: function customTransform(file, enc, done) {
        'use strict';
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let ns;
        const match = content.match(/useTranslation\(.+\)/);
        if (match) ns = match[0].split(/(\'|\")/)[2];
        let count = 0;
        parser.parseFuncFromString(content, { list: ['translate'] }, function(
            key,
            options
        ) {
            parser.set(
                key,
                Object.assign({}, options, {
                    ns: ns ? ns : DEFAULT_NS,
                    nsSeparator: ':',
                    keySeparator: '.'
                })
            );
            ++count;
        });
        done();
    }
};
