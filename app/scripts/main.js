//import anime from 'animejs';

var opinionSubject = [
  'accessibility',
  'price',
  'innovation'
];
var jsonCircles = [ { 'x_axis': 10, 'y_axis': 10, 'radius': 5, 'color' : '#7000ff' }];

/////////////
//Parse csv file
/////////////
d3.csv('./scripts/data.csv')
    .row(row)
    .get(loaded);

function sortByDateAscending(a, b) {
  // Dates will be cast to numbers automagically:
  return b.date - a.date;
}

function loaded(data) {
  data = data.sort(sortByDateAscending);
  for (var i = 0; i < data.length; i++) {
    // Date Section part
    var timelineItem = d3.select('div.timeline-content').append('div').attr('class', 'timelineItem');

    var timeline = timelineItem.append('div').attr('class', 'timeline');

    var dateSection = timelineItem
      .append('div')
      .attr('class', 'date');
    dateSection.append('div').attr('class', 'icon-cat-container').append('img')
      .attr('src', './images/icon-shoe.png')
      .attr('alt', 'categorie icon')
      .exit();
    dateSection.append('div')
      .html(function(d) {
        return '<span>' + data[i].year + '.' + data[i].mounth + '.' + data[i].day + ' </span>' + '<span>' + data[i].subtitle + '</span>';
      })
      .exit();

    var contentSection = timelineItem
      .append('section').attr('class', 'content');
    contentSection.append('h3').text(data[i].title).append('span').exit();
    contentSection.append('p').text(data[i].summary).exit();
    contentSection.append('a').attr('class', 'seeMore').attr('href', '#').text('...').exit();

    var opinionSection = timelineItem
      .append('div')
      .attr('class', 'opinion')
      .append('ul');

    opinionSubject.forEach(function(opinionTypeLabel) {
      var opinionType = opinionSection.append('li');
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
        var circle = notation.append('li')
          .append('svg')
          .attr('width', 20)
          .attr('height', 20)
          .data(jsonCircles)
          .append('circle')
          .attr('cx', function (d) { return d.x_axis; })
          .attr('cy', function (d) { return d.y_axis; })
          .attr('r', function (d) { return d.radius; })
        if (j < opinionGrade) {
          circle
            .data(jsonCircles)
            .style('fill', function(d) { return d.color; })
        } else {
          circle
              .data(jsonCircles)
              .style('stroke', function(d) { return d.color; })
              .style('fill', 'white')
        }
      }
    });

    var imageSection = timelineItem
      .append('div')
      .attr('class', 'imageArticle')

      .append("img")
      .attr("src", data[i].img)
      .attr("alt", data[i].title);

    if (data[i].mustHave != "0") {
      //var mustHave = d3.select("div.mustHaveArticles");
      var title = "";
      var color = "blue";
      var left = 1;
      switch (data[i].mustHave) {
        case "1":
          title += "trust-worthy";
          var mustHave = d3.select("div.articlesLeft");
        break;
        case "2":
          title += "iconic";
          color = "purple";
          var mustHave = d3.select("div.articlesRight");
        break;
        case "3":
          title += "fashionable";
          var mustHave = d3.select("div.articlesLeft");
        break;
        case "4":
          title += "unexepcted";
          color = "purple";
          var mustHave = d3.select("div.articlesRight");
        break;
      }
      var mustHaveCont = mustHave.append('div').attr('class', 'mustHave-item-container '+color);

      var mustHaveBack = mustHaveCont.append('div').attr('class', 'mustHave-item-back');
      mustHaveBack.append('div').attr('class', 'image').style('background-image', 'url('+data[i].img+')').exit();
      mustHaveBack.append('div').attr('class', 'overlay');

      var mustHaveTitle = mustHaveCont.append('div').attr('class', 'mustHave-item').append('h3').attr('class', 'mustHave-title');
      mustHaveTitle.append('span').text('The most').exit();
      mustHaveTitle.append('span').text(title);

      var mustHaveHover = mustHaveCont.append('div').attr('class', 'mustHave-item-hover');
      var mustHaveHoverTitle = mustHaveHover.append('h3').attr('class', 'mustHave-title');
      mustHaveHoverTitle.append('span').text('The most').exit();
      mustHaveHoverTitle.append('span').text(title);

      mustHaveHover.append('p').text(data[i].summary);
    }
  }
  animationsInit();
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
        mustHave:d.mustHave,
    };
}

function animationsInit() {
  //var containerElement = document.getElementById("js-content");
  //console.log(containerElement);

  //var containerMonitor = scrollMonitor.createContainer(containerElement);
  //var childElement = document.getElementsByClassName("timelineItem");
  //var elementWatcher = containerMonitor.create(childElement);
    var sourcesButton = d3.select('a.sourcesButton');
    sourcesButton.on('click',  function(d) {
      d3.event.preventDefault();
      sourcesButton.text()
      var list = d3.select('ul.sourcesList');
      list.classed('sourcesList-active', !list.classed('sourcesList-active'));
      var listBack = d3.select('div.sourcesListBack');
      list.classed('sourcesListBack-active', !list.classed('sourcesListBack-active'));
    });
  }
