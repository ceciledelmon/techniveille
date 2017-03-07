/////////////
//Parse csv file
/////////////
d3.csv('/scripts/data.csv')
    .row(row)
    .get(loaded);

function loaded(data) {
  for (var i = 0; i < data.length; i++) {
    d3.select("div.main")
      .append("img")
      .attr("src", data[i].img)
      .attr("alt", data[i].title);
  }
  console.log('ok', data);

}

//formattage data
function row(d) {
    return {
        title: d.title,
        subtitle: d.subtitle,
        date: d.date,
        summary: d.summary,
        img: d.img,
        link: d.link,
    };
}
