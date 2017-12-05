const supertest = require( 'supertest' );
const chai = require( 'chai' );
const uuid = require( 'uuid' );
const app = require( '../server' );

global.app = app;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest( app );
