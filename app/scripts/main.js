var opinionSubject = [
  'accessibility',
  'price',
  'innovation'
];
var jsonCircles = [ { "x_axis": 10, "y_axis": 10, "radius": 5, "color" : "#8642ff" }];

/////////////
//Parse csv file
/////////////
d3.csv('/scripts/data.csv')
    .row(row)
    .get(loaded);

function sortByDateAscending(a, b) {
  // Dates will be cast to numbers automagically:
  return b.date - a.date;
}

function loaded(data) {
  console.log("data length", data.length);

  data = data.sort(sortByDateAscending);

  for (var i = 0; i < data.length; i++) {
    // Date Section part
    var timelineItem = d3.select("div.timeline-content").append('div').attr('class', 'timelineItem');

    var dateSection = timelineItem
      .append("div")
      .attr("class", "date");
    dateSection.append("img")
      .attr("src", "../images/icon-shoe.png")
      .attr("alt", "categorie icon")
      .exit();
    dateSection.append("div")
      .html(function(d) {
        return "<span>" + data[i].day + "." + data[i].mounth + "." + data[i].year + " </span>" + "<span>" + data[i].subtitle + "</span>";
      })
      .exit();

    var contentSection = timelineItem
      .append("section").attr('class', 'content');
    contentSection.append("h3").text(data[i].title).exit();
    contentSection.append("p").text(data[i].summary).exit();
    contentSection.append("a").attr("href", "#").text("TODO : icon see more").exit();

    var opinionSection = timelineItem
      .append("div")
      .attr("class", "opinion")
      .append("ul");

    opinionSubject.forEach(function(opinionTypeLabel) {
      var opinionType = opinionSection.append("li");
      var opinionGrade = 2;
      switch (opinionTypeLabel) {
        case 'accessibility':
          opinionGrade = data[i].accessibility;
          break;
        case 'price':
          opinionGrade = data[i].price;
          break;
        case 'innovation':
          opinionGrade = data[i].innovation;
          break;
      }
      opinionType.append('h4').text(opinionTypeLabel).exit();
      var notation = opinionType.append('ul');
      for (var j = 1; j < 6; j++) {
        var circle = notation.append("li")
          .append("svg")
          .attr("width", 20)
          .attr("height", 20)
          .data(jsonCircles)
          .append("circle")
          .attr("cx", function (d) { return d.x_axis; })
          .attr("cy", function (d) { return d.y_axis; })
          .attr("r", function (d) { return d.radius; })
        if (j < opinionGrade) {
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

    var imageSection = timelineItem
      .append("div")
      .attr('class', 'imageArticle')
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
        date: new Date(d.year, d.month, d.day),
        day: d.day,
        mounth: d.month,
        year: d.year,
        summary: d.summary,
        img: d.img,
        link: d.link,
        accessibility: d.accessibility,
        price:d.price,
        innovation:d.innovation,
    };
}
