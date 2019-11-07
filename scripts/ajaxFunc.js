function getCoinAjax1() {
  $("#output").html("");
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    type: "GET",
    success: function(response) {
      for (let index = 0; index < 200; index++) {
        // To get all curencies need to changethis : index < response.length
        let coinItem = {
          id: response[index].id,
          symbol: response[index].symbol,
          name: response[index].name
        };
        allCoins.push(coinItem);

        $("#output").append(`
                      <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2 shadow p-3 mb-5 border-dark mb-3 rounded">
                      <div class="card-header">
                      <div class="row">
                          <div class="col-sm-8">
                          <p class="card-header">${response[index].symbol}</p>
                          </div>
                          <div class="col-sm-4">
                          <label class="switch">
                           <input type="checkbox" class="toggle-group" data-group="${
                             response[index].symbol
                           }">
                          <span class="slider round"></span>
                          </label>
                          </div>
                          </div>
                          </div>
                          <div class="card-body">
                              <p class="card-text">${response[index].name}</p>
                              <button class="btn btn-warning moreInfoBtn" data-id="${
                                response[index].id
                              }">More info.....</button>
                          </div>
                          <div class="moreInfo" id="${response[index].id}">
                          </div>
                          
                      </div>
                      `);
      }
      $(".moreInfo").hide("slow");

      $(".moreInfoBtn").on("click", function() {
        $(this).text(function(i, text) {
          return text === "More info....."
            ? ".....less info"
            : "More info.....";
        });

        var createTime = Date.now();
        var coinId = $(this).attr("data-id");

        $("#" + coinId).slideToggle(1000);

        getCoinAjax2(coinId, createTime);
      });

      $(".toggle-group").on("click", function() {
        var coinSpecialId = $(this).attr("data-group");
        if (coinsSpecial.length < 5 && $(this).is(":checked")) {
          coinsSpecial.push(coinSpecialId);
        } else if (coinsSpecial.length <= 5 && !$(this).is(":checked")) {
          for (var i = 0; i < coinsSpecial.length; i++) {
            if (coinsSpecial[i] === coinSpecialId) {
              coinsSpecial.splice(i, 1);
            }
          }
        } else if (coinsSpecial.length >= 5 && $(this).is(":checked")) {
          $(".modal-body").html("");
          for (let index = 0; index < coinsSpecial.length; index++) {
            $(".modal-body").append(`<div class="row">
                          <div class=" col-sm-9">
                        <span class="modal-item">${coinsSpecial[index]}</span> 
                        </div> 
                        <div class=" col-sm-3">
                        
                        <label class="switch">
                       <input type="checkbox" checked class="delete-coin" data-id="${
                         coinsSpecial[index]
                       }" data-group="${coinsSpecial[index]}">
                       <span class="slider round"></span>
                          </label></div>
                          </div>
  `);
            $(".delete-coin").on("click", function() {
              let coinSpecialIdDelete = $(this).attr("data-id");

              if (!$(this).is(":checked")) {
                for (var i = 0; i < coinsSpecial.length; i++) {
                  if (coinsSpecial[i] === coinSpecialIdDelete) {
                    coinsSpecial.splice(i, 1);
                    $(
                      'input[type="checkbox"][data-group="' +
                        coinSpecialIdDelete +
                        '"]'
                    ).prop("checked", false);
                  }
                }
              } else if ($(this).is(":checked") && coinsSpecial.length < 5) {
                if (
                  coinsSpecial[coinsSpecial.length - 1] !== coinSpecialIdDelete
                ) {
                  coinsSpecial.push(coinSpecialIdDelete);
                  $(
                    'input[type="checkbox"][data-group="' +
                      coinSpecialIdDelete +
                      '"]'
                  ).prop("checked", true);
                }
              }
            });
          }
          $("#myModal").modal();
          return false;
        }
      });
    }
  });
}

function getCoinAjax2(coinId, createTime) {
  checkIsInLocal(coinId);

  if (!isInLocal) {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/" + coinId,

      type: "GET",
      success: function(responseCoin) {
        coinItem = {
          id: coinId,
          usd: responseCoin.market_data.current_price.usd,
          eur: responseCoin.market_data.current_price.eur,
          ils: responseCoin.market_data.current_price.ils,
          time: createTime,
          imgSrc: responseCoin.image.large
        };

        CheckAndSaveToLocal(coinId);

        $("#" + coinId).html(`
                  <div class="more-info-card">
                  <img src="${
                    responseCoin.image.large
                  }" alt="" class="rounded mx-auto d-block">
                  <ul>Price another valute
                      <li>UDS: ${
                        responseCoin.market_data.current_price.usd
                      }  $</li>
                      <li>EUR: ${
                        responseCoin.market_data.current_price.eur
                      }  &euro;</li>
                      <li>ILS: ${
                        responseCoin.market_data.current_price.ils
                      }  &#8362;</li>
                  </ul>
                  </div>`);
      }
    });
  }
}

function getCoinAjax3(coinsSpecial) {
  data1 = [];

  if (coinsSpecial.length == 0) {
    alert("You need to choose curencies");
  } else {
    multiUrl = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";

    for (let index = 0; index < coinsSpecial.length; index++) {
      multiUrl += coinsSpecial[index].toUpperCase() + ",";
    }
    multiUrl += "&tsyms=USD";
    $.ajax({
      url: multiUrl,
      type: "GET",
      success: function(responseCoin) {
        if (responseCoin.Response == "Error") {
          alert("There is no response on chosen curencies");
          return false;
        }

        arrayCoinsUsd = Object.entries(responseCoin);
        var time = new Date();

        for (let index = 0; index < arrayCoinsUsd.length; index++) {
          let coinForGraf = {
            type: "spline",
            name: arrayCoinsUsd[index][0],
            showInLegend: true,
            xValueType: "dateTime",
            xValueFormatString: "hh:mm:ss",
            yValueFormatString: "$#,###.####",
            dataPoints: [
              {
                x: time.getTime(),
                y: arrayCoinsUsd[index][1].USD
              }
            ]
          };

          data1.push(coinForGraf);
        }
      }
    });
  }
}
