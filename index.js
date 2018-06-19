module.exports = function (bundler) {
  bundler.addAssetType('twig', require.resolve('./lib/TwigAsset'));
}
