var username = "stevecat", repo = "stevecat.github.io", pagination = 6,
filemem=[], filecache=[];

$( document ).ready(function() {

  // Load posts...

    // Get the repo's SHA so we can collect the latest commits.
    display_posts();


});

function display_posts() {

  // Clear filelist in memory
  filemem=[];

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

          var f = {path:this.path, sha:this.sha,url:this.url};
          filemem.push(f);

        });

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
