var TODOopinion = [
  'Accessibilité',
  'Price',
  'Innovation'
];
var jsonCircles = [ { "x_axis": 10, "y_axis": 10, "radius": 5, "color" : "#8642ff" }];

/////////////
//Parse csv file
/////////////
d3.csv('/scripts/data.csv')
    .row(row)
    .get(loaded);

function loaded(data) {
  console.log("data length", data.length);
  for (var i = 0; i < data.length; i++) {
    // Date Section part
    var dateSection = d3.select("div.timeline-content")
      .append("div")
      .attr("class", "date");
    dateSection.append("img")
      .attr("src", "../images/icon-shoe.png")
      .attr("alt", "categorie icon")
      .exit();
    dateSection.append("div")
      .html(function(d) {
        return "<span>" + data[i].date + " </span>" + "<span>" + data[i].subtitle + "</span>";
      })
      .exit();

    var contentSection = d3.select("div.timeline-content")
      .append("section");
    contentSection.append("h3").text(data[i].title).exit();
    contentSection.append("p").text(data[i].summary).exit();
    contentSection.append("a").attr("href", "#").text("TODO : icon see more").exit();

    var opinionSection = d3.select("div.timeline-content")
      .append("div")
      .attr("class", "opinion")
      .append("ul");

    TODOopinion.forEach(function(opinionTypeLabel) {
      var opinionType = opinionSection.append("li");
      opinionType.append('h4').text(opinionTypeLabel).exit();
      var notation = opinionType.append('ul');
      for (var j = 0; j < 5; j++) {
        console.log(j);
        var circle = notation.append("li")
          .append("svg")
          .attr("width", 20)
          .attr("height", 20)
          .data(jsonCircles)
          .append("circle")
          .attr("cx", function (d) { return d.x_axis; })
          .attr("cy", function (d) { return d.y_axis; })
          .attr("r", function (d) { return d.radius; })
        if (j < 2) {
          // @TODO : change var with dynamic
          circle
            .data(jsonCircles)
            .style("fill", function(d) { return d.color; })
        } else {
          circle
              .data(jsonCircles)
              .style("stroke", function(d) { return d.color; })
              .style("fill", "white")
        }
      }
    });

    var imageSection = d3.select("div.timeline-content")
      .append("div")
      .append("img")
      .attr("src", data[i].img)
      .attr("alt", data[i].title);
  }
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
