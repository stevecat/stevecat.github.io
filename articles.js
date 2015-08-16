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

}

function article_container_html(html, id) {
  return "<div id='"+id+"'>"+html+"</div>";
}

function md2html(md) {

  var converter = new showdown.Converter();
  return converter.makeHtml(md);

}
