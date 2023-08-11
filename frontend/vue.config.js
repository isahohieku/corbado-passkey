module.exports = {
  lintOnSave: true,
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("corbado-"),
        },
      }));
  },
  devServer: {
    port: 3000,
    proxy: "http://localhost:4000/api/v1",
  },
};
