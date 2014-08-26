/**
 * Loglog node chrome
 */

var http    = require('http');
var cluster = require('cluster');
var fs      = require('fs');
var NS      = require('node-static');
var io      = require('socket.io');
var child   = require('child_process');

module.exports = function( options ){
  // Does the user have multiple workers running? If so, avoid setting
  // this up on master.
  if ( cluster.isMaster && Object.keys( cluster.workers ).length > 0 ){
    return function(){};
  }

  options = options || {};

  var defaults = {
    port: 8000
  , browserCommand: 'open http://localhost:{port}'
  , dir:  __dirname
  , indexTmpl: function( data ){
      return fs.readFileSync( __dirname + '/index.tmpl.html' )
        .toString()
        .replace( '{port}', data.port );
    }
  };

  for ( var key in defaults ){
    if ( !(key in options ) ){
      options[ key ] = defaults[ key ];
    }
  }

  fs.writeFileSync( __dirname + '/index.html', options.indexTmpl( options ) );

  var fileServer = new NS.Server( options.dir );

  var server = http.createServer( function( req, res ){
    req.addListener( 'end', fileServer.serve.bind( fileServer, req, res ) ).resume();
  });

  io = io( server );

  server.listen( options.port );

  // This is just unnecessary
  // child.exec( options.browserCommand.replace( '{port}', options.port ) );

  return function( entry ){
    io.sockets.emit( 'entry', entry );
  };
};