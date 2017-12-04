const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const config = require( './config' );
const port = process.env.PORT || 8080;
const apiRoutes = express.Router();

mongoose.connect( config.database );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

require( './app/routes/public' )( app, port );
require( './app/routes/api' )( config, app, apiRoutes );

app.use( morgan( 'dev' ) );


app.listen( port );
console.log( `Magic happens at http://localhost:${ port }` );
