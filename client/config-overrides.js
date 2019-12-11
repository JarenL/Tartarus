/* config-overrides.js */
const fs = require('fs');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.module.rules[2].oneOf[1].include = [
    config.module.rules[2].oneOf[1].include,
    fs.realpathSync('../landing')
  ];
  console.log(config);
  return config;
};
