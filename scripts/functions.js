var data1 = [];
var options = {};
var multiUrl = "";
var updateInterval = 2000;
var isInLocal = false;

function graf() {
  data1 = [];
  getCoinAjax3(coinsSpecial);

  options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Currencies Live report",
      fontColor: "#FAB946"
    },
    subtitles: [
      {
        text: "Update interval 2 seconds"
      }
    ],
    axisX: {
      title: "Time",
      labelFontColor: "gray"
    },
    axisY: {
      title: "Price in USD $",
      titleFontColor: "#FAB946",
      lineColor: "#4F81BC",
      labelFontColor: "gray",
      tickColor: "#4F81BC",
      includeZero: false,
      valueFormatString: "##0.####"
    },

    toolTip: {
      shared: true,
      fontSize: 14,
      enabled: true
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: data1
  };
  $("#chartContainer").CanvasJSChart(options);

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }
}

setInterval(function() {
  if ($("#graf").hasClass("active")) {
    $.getJSON(multiUrl, function(data) {
      updData = Object.entries(data);
      var time = new Date();

      for (let index = 0; index < options.data.length; index++) {
        let tempData = {
          x: time.getTime(),
          y: updData[index][1].USD
        };
        options.data[index].dataPoints.push(tempData);
      }

      $("#chartContainer")
        .CanvasJSChart()
        .render();
    });
  }
}, updateInterval);

function searchCurrencies() {
  var input, filter, cards, div, p, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("output");
  cards = div.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
    p = cards[i].getElementsByTagName("p")[0];
    txtValue = p.textContent || p.innerText;

    if (txtValue.toUpperCase() == filter) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function deleteSpecialCoins() {
  coinsSpecial = [];
}
