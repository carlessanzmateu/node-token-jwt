// PUBLIC ROUTES ------

module.exports = ( app, port ) => {
    app.get( '/', ( req, res )=> {
        res.send( `Hello! The API is at http://localhost:${ port } /api` );
    });
    
    app.get( '/setup', ( req, res ) => {
        const nick = new User( {
            name: 'Nick Cerminara',
            password: 'password',
            admin: true,
        } );
    
        nick.save( ( err ) => {
            if( err ) {
                throw err;
            }
    
            console.log( 'User saved successfully' );
            res.json( { success: true } );
        });
    } );
}
