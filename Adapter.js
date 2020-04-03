


const adapter = new FacebookAdapter({
     verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
     app_secret: process.env.FACEBOOK_APP_SECRET,
     access_token: process.env.FACEBOOK_ACCESS_TOKEN
});

adapter.use(new FacebookEventTypeMiddleware());

const controller = new Botkit({
    adapter,
    // ...other options
});

controller.on('message', async(bot, message) => {
    await bot.reply(message, 'I heard a message!');
});


const { FacebookAdapter } = require('botbuilder-adapter-facebook');
const restify = require('restify');

const adapter = new FacebookAdapter({
     verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
     app_secret: process.env.FACEBOOK_APP_SECRET,
     access_token: process.env.FACEBOOK_ACCESS_TOKEN
});
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get('/api/messages', (req, res) => {
     if (req.query['hub.mode'] === 'subscribe') {
          if (req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
               const val = req.query['hub.challenge'];
               res.sendRaw(200, val);
          } else {
               console.log('failed to verify endpoint');
               res.send('OK');
          }
     }
});

server.post('/api/messages', (req, res) => {
     adapter.processActivity(req, res, async(context) => {
         await context.sendActivity('I heard a message!');
     });
});

server.listen(process.env.port || process.env.PORT || 3000, () => {
     console.log(`\n${ server.name } listening to ${ server.url }`);
 });