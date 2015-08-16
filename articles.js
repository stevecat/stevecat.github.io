function show_posts(inc) {

  if (filemem.length>0) {

    var end = inc + pagination;
    if (end > filemem.length) end = filemem.length;

    for (var i = inc; i < end; i++) {

      var file = filemem[i];

      console.log(file);

    }

  } else {
    console.log("No articles.")
  }

}
