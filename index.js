const express = require('express');
const path = require('path');
const {connectToMongoDB} = require('./connect');
const urlRouter = require('./routes/url');
const staticRouter = require('./routes/static');
const URL = require('./models/url');

const app = express();
const PORT = 8007;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=> console.log('MongoDB connected'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/url', urlRouter);
app.use('/', staticRouter);

app.get('/url/:shortId', async(req,res)=> {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },
    {
        $push: {
        visitHistory: {
            timestamp: Date.now(),
        },
      },    
    }
     );
    return res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=> console.log(`Server started at PORT ${PORT}`));