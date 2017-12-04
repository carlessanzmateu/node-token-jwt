module.exports = ( app, jwt ) => {
    return ( req, res, next ) => {
        // check header or url parameters or post parameters for token
        const token = req.body.token || req.query.token || req.headers[ 'x-access-token' ]
        
            // decode token
            if( token ) {
                jwt.verify( token, app.get( 'superSecret' ), ( err, decoded ) => {
                    if( err ) {
                        return res.json( {
                            success: false,
                            message: 'Failed to authenticate token.'
                        } );
                    } else {
                        // si todo va bien, guarda la petición
                        // para usarla en otras rutas
                        req.decoded = decoded;
                        next();
                    }
                } );
            } else {
                return res.status( 403 ).send({
                    success: false,
                    message: 'No token provided.'
                })
            }
    }
}