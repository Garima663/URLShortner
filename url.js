const generateShortId = require('ssid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body.url) {return res.status(404).json({error: 'url is required'})}
     const shortID = generateShortId();
    //  const check = await URL.findOne(
    //   {redirectURL: body.url}
    //   );
    //  if(shortID === check.shortId) {
     
    //    return res.render('home', {
    //     id: shortID,
    //    }); }
     await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
     });
    
     return res.render('home', {
      id: shortID,
     });
    // return res.json({id: shortID});
}

async function handleGetAnalytics (req,res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
      return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
      });
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};