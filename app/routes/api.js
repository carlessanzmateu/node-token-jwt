// API ROUTES -----

module.exports = ( config, app, apiRoutes ) => {
    const jwt = require( 'jsonwebtoken' );
    const User = require( '../models/user' );
    const tokenMiddleware = require( '../middlewares/token' );

    app.set( 'superSecret', config.secret );

    apiRoutes.post( '/authenticate', ( req, res ) => {
        User.findOne( {
            name: req.body.name
        }, ( err, user ) => {
            if( err ) {
                throw err;
            }
    
            if( !user ) {
                res.json( { success: false, message: 'Authentication failed. User not found.' } );
            } else if( user ) {
                if( user.password != req.body.password ) {
                    res.json( { success: false, message: 'Authentication failed. Wrong password' } );
                } else {
                    const payload = {
                        admin: user.admin,
                    };
    
                    const token = jwt.sign( payload, app.get( 'superSecret' ), {
                        expiresIn: 1440, //24hours
                    } );
    
                    res.json( {
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                    } )
                } 
            }
        } );
    } );
    
    apiRoutes.get( '/', tokenMiddleware, ( req, res ) => {
        res.json( { message: 'Welcome to the coolest API on earth!' } );
    } );
    
    apiRoutes.get( '/users', tokenMiddleware, ( req, res ) => {
        User.find( {}, ( err, users ) => {
            res.json( users );
        } );
    } );
    
    
    app.use( '/api', apiRoutes );
}
