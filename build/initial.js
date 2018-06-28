const _ = require('lodash');
fs = require('fs'),
config = require('./config'),
chalk = require('chalk');

_.forEach(config.init,function(i){
  fs.copyFile(i.from + i.file, i.to + i.file, function(err){
    if (err) throw err;
    console.log(chalk.greenBright(i.file + ': copy success!'));
  });
});
