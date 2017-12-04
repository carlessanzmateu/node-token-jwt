const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );
const config = require( './config' );
const User = require( './app/models/user' );
const port = process.env.PORT || 8080;

mongoose.connect( config.database );
app.set( 'superSecret', config.secret );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.use( morgan( 'dev' ) );

// PUBLIC ROUTES ------

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

// API ROUTES -----

const apiRoutes = express.Router();

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


//EL ORDEN ES IMPORTANTE; SOLO BLOQUEA LAS QUE SE DEFINAN
//DESPUES DE ESTE MIDDLEWARE
apiRoutes.use( ( req, res, next ) => {
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
} );

apiRoutes.get( '/', ( req, res ) => {
    res.json( { message: 'Welcome to the coolest API on earth!' } );
} );

apiRoutes.get( '/users', ( req, res ) => {
    User.find( {}, ( err, users ) => {
        res.json( users );
    } );
} );


app.use( '/api', apiRoutes );
app.listen( port );
console.log( `Magic happens at http://localhost:${ port }` );
