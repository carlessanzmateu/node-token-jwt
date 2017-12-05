describe( 'Task API Routes', function() {
    // beforeEach( function( done ) {
    //     app.db.object = {};
    //     app.db.object.user = {
    //         id: uuid(),
    //         name: 'Carles Sanz',
    //         password: 'foo'
    //     };
    //     app.db.write();
    //     done();
    // } );

    describe( 'GET /', function() {
        it( 'should return a 200 status', function( done ) {
            request.get( '/' )
            .expect( 200 )
            .end( function( err, res ) {
                done( err );
            } )
        } )        
    });
} );
