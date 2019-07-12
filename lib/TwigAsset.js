const path = require('path')
const Twig = require('twig')
const {Asset} = require('parcel-bundler')

class TwigAsset extends Asset {
  constructor (name, options) {
    super(name, options)
    this.type = 'html'
  }

  async generate () {
    let opts = (await this.getConfig(['.twigrc', '.twigrc.js'],
      {packageKey: 'twig'})) || {}

    const twigOpts = {
      path: path.dirname(this.name),
      data: this.contents,
      async: false,
      debug: opts.debug || false,
      trace: opts.trace || false
    }

    if (opts.functions) {
      Object.keys(opts.functions).forEach(function (key) {
        Twig.extendFunction(key, opts.functions[key])
      })
    }

    if (opts.filters) {
      Object.keys(opts.filters).forEach(function (key) {
        Twig.extendFilter(key, opts.filters[key])
      })
    }

    if (opts.extend) {
      Twig.extend(options.extend)
      delete options.extend
    }

    return Twig.twig(twigOpts).render(opts.data)
  }
}

module.exports = TwigAsset
