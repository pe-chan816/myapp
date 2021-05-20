const { environment } = require('@rails/webpacker')

// Rails6でJQueryを使うための追記
const webpack = require('webpack')
environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery/src/jquery',
    jQuery: 'jquery/src/jquery'
  })
)
// ここまで

module.exports = environment
