var username = "stevecat", repo = "stevecat.github.io", pagination = 6,
filemem=[], filecache=[];

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var months=["January","February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November",
            "December"];

$( document ).ready(function() {

  // Load posts...

    // Get the repo's SHA so we can collect the latest commits.
    display_posts();


});

function display_posts() {

  // Clear filelist in memory
  filemem=[];

  // Reset display
  reset_display();

  // Collect the SHA for the latest commit.
  var uri = "https://api.github.com/repos/"+username+"/"+repo+"/git/refs";

  $.getJSON( uri )
  .success(function( json ) {

      if (json[0]["object"]["sha"]) {

        // Use
        var sha = json[0]["object"]["sha"];
        find_articles_sha(sha);

      } else {
        json_error("JSON error", "Cannot find SHA");
      }

  })
  .fail(function( jqxhr, textStatus, error ) {
    json_error(textStatus, error);
  });

}

function find_articles_sha(sha) {

  var uri =  "https://api.github.com/repos/"+username+"/"+repo+"/git/trees/"+sha;

  $.getJSON( uri )
  .success(function( json ) {

        // find the /articles/ directory
        uri_get_articles(json);

  })
  .fail(function( jqxhr, textStatus, error ) {
    json_error(textStatus, error);
  });

}


function uri_get_articles(json) {

  var found = false;

  $.each(json["tree"], function( index, value ) {

    if (value.path==="articles") {
      found=true;

      // Use the url here to get the file listing!
      find_files(value.url);
    }

  });

  if (!found) { console.log('Articles does not exist'); }

}

function find_files(articles_uri) {


      $.getJSON( articles_uri )
      .success(function( json ) {

        // Collect from .tree to build an array of the files.
        $.each(json["tree"], function( index, value ) {

          var str=this.path, date=make_date_object(this.path);
          var f = {path:this.path, sha:this.sha,url:this.url,id:str.substring(0, str.length - 3), date:date};
          filemem.push(f);

        });

        // Reverse the array
        filemem.reverse();

        // Now download and display some posts!
        show_posts(0);

      })
      .fail(function( jqxhr, textStatus, error ) {
        json_error(textStatus, error);
      });


}

function json_error(textStatus, error) {
  var err = textStatus + ", " + error;
  console.log( "Request Failed: " + err );
}

function article_load(obj) {

  $('#'+obj.id).html('loading...');

  var uri = obj.url;

  $.getJSON( uri )
  .success(function( json ) {

    // Decode from Base64
    var decoded = Base64.decode(json.content);

    // Conver from markdown to html
    var html = md2html(decoded);

    // Save to the filecache for quicker navigation and
    // to avoid the ratelimit..
    filecache[obj.path] = html;

    // Display!
    $('#'+obj.id).html(html);

    console.log(decoded);

  })
  .fail(function( jqxhr, textStatus, error ) {
    json_error(textStatus, error);
  });

}
