if(process.env.NODE_ENV ==='production'){
    modeule.exports = { mongoURI :
    'mongodb://root:mlab1234@ds211865.mlab.com:11865/video-idea-app'}
}
else
{
     module.exports = {mongoURI : 'mongodb://localhost/video-idea-app'}
}