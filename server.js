const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'name': 'William T Anderson', 'mother': 'Ellen Anderson', 'father': 'James W Anderson', 'b_year': 1892 },
  { 'name': 'Russell H Anderson', 'mother': 'Rose Anderson', 'father': 'William T Anderson', 'b_year': 1918 },
  { 'name': 'William J Anderson', 'mother': 'Rose Anderson', 'father': 'William T Anderson', 'b_year': 1915 } 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' && request.url === '/data'){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )

  } 
  else if (request.method === 'GET' && request.url === '/app'){
  sendFile(response, 'public/app.html')

  }
  else if (request.method === 'GET' && request.url === '/data') {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    })
    
    response.end(JSON.stringify(appdata))

  }
  else{
    sendFile( response, filename )

  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const newMem = JSON.parse(dataString)

    console.log(newMem)
    appdata.push(newMem)

    response.writeHead( 201, 'New Member Added', {'Content-Type': 'application/json' })

    // change this to incorporate data
    response.end(JSON.stringify(newMem))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
