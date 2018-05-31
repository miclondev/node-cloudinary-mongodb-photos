//figure set of credentials to return

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
}else {
    //we are in development
    module.exports = require('./dev');
}