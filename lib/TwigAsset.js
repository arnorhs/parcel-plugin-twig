const path = require('path')
const Twig = require('twig')
const { Asset } = require('parcel-bundler')

class TwigAsset extends Asset {
  constructor (name, options) {
    super(name, options)
    this.type = 'html'
  }

  async getTwigConfig () {
    const opts = (await this.getConfig(
      ['.twigrc', '.twigrc.js'],
      { packageKey: 'twig' }
    )) || {}

    return {
      path: this.name,
      async: false,
      debug: false,
      trace: false,
      ...opts,
      data: this.contents,
    }
  }

  async generate () {
    const {
      functions,
      filters,
      extend,
      data,
      ...optionsForTwig
    } = await this.getTwigConfig()

    if (functions) {
      Object.keys(functions).forEach(function (key) {
        Twig.extendFunction(key, functions[key])
      })
    }

    if (filters) {
      Object.keys(filters).forEach(function (key) {
        Twig.extendFilter(key, filters[key])
      })
    }

    if (extend) {
      Twig.extend(extend)
    }

    return Twig.twig(optionsForTwig).render(data)
  }
}

module.exports = TwigAsset
