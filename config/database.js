if(process.env.NODE_ENV ==='production'){
    modeule.exports = { mongoURI :
    'mongodb://root:password@ds211865.mlab.com:11865/video-idea-app'}
}
else
{
     module.exports = {mongoURI : 'mongodb://localhost/video-idea-app'}
}