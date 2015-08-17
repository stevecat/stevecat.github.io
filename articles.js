function show_posts(inc) {

  if (filemem.length>0) {

    var end = inc + pagination;
    if (end > filemem.length) end = filemem.length;

    for (var i = inc; i < end; i++) {

      var file = filemem[i];

      if (filecache[file.path]) {

          // We can just display it..
          $('#articles').append(article_container_html(filecache[file.path], file.id));

      } else {

          // We need to download it first..
         $('#articles').append(article_container_html("a", file.id));
         article_load(file);

      }

    }

  } else {
    console.log("No articles.")
  }

  // Update menu links
  fill_dates();

}

function article_container_html(html, id) {
  return "<div id='"+id+"'>"+html+"</div>";
}

function md2html(md) {

  var converter = new showdown.Converter();
  return converter.makeHtml(md);

}

function make_date_object(path) {

  // turn a YYYY-MM-DD.md into a useful date.

    // Drop the .md
    var full = path.substring(0, path.length - 3);

    // Explode by the hyphens
    var units = full.split("-");

    // Create a JS date
    var d = new Date(units[0], (units[1]-1), units[2]);

    // Make object with nicely formatted strings.
    var obj = {};

      // Month Year, for the menu.
      obj.monthyear = months[d.getMonth()]+" "+units[0];

      // Full date for display
      obj.nicedate = parseInt(units[2])+nth(units[2])+" "+months[d.getMonth()]+" "+units[0];

    return obj;

}

function nth(d) {
  if(d>3 && d<21) return 'th'; // thanks kennebec
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

function fill_dates() {

  // Compile date counts
  var count = {};

  for (var i = 0; i < filemem.length; i++) {

    var thisdate = filemem[i].date.monthyear;

    if (count[thisdate]) {
      count[thisdate]++;
    } else {
      count[thisdate]=1;
    }

  }

  // Create some links
  var html = "";

  $.each(count, function( index, value ) {

    html += "<a class=\"menu-item\" href=\"#\">";
    html += "<span class=\"counter\">"+value+"</span>";
    html += index;
    html += "</a>";

  });

  $('#blog-sub').html(html);

}
