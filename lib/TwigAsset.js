const path = require('path');
const os = require('os');
const Twig = require('twig');
const { Asset } = require('parcel-bundler');

const promisify = function (fn) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      fn(...args, function (err, ...res) {
        if (err) return reject(err);

        if (res.length === 1) return resolve(res[0]);

        resolve(res);
      });
    });
  };
};

class TwigAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'html';
  }

  async parse(code) {
    let data = (await this.getConfig(['.twigdata.js'], {packageKey: 'twig'})) || {};
    let opts = (await this.getConfig(['.twigrc.js'], {packageKey: 'twig'})) || {};

    let render = promisify(Twig.renderFile.bind(null, path.dirname(this.name), data));

    return await render();
  }

  generate () {
    return [
      {
        type: 'html',
        value: this.ast || '',
        hasDependencies: false
      }
    ];
  }
}

module.exports = TwigAsset;
