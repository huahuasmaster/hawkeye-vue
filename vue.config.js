module.exports = {
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/hawkeye/api': {
        target: 'http://localhost:18084',
        ws: true,
        changeOrigin: true
      },
    },
    port:18081
  }
}
