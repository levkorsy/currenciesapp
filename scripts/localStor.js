function CheckAndSaveToLocal(coinId) {
  if (coinsArray.length == 0) {
    coinsArray.push(coinItem);
    localStorage.setItem("coinsArray", JSON.stringify(coinsArray));
  } else {
    var isIs = false;
    for (var i = 0; i < coinsArray.length; i++) {
      if (coinsArray[i]["id"] == coinId) {
        coinsArray[i] = coinItem;
        isIs = true;
      }
    }

    if (isIs == false) {
      coinsArray.push(coinItem);
      localStorage.setItem("coinsArray", JSON.stringify(coinsArray));
    }
  }
}

function checkIsInLocal(coinId) {
  let now = new Date().getTime().toString();
  if (coinsArray.length == 0) {
    isInLocal = false;
  } else {
    for (var i = 0; i < coinsArray.length; i++) {
      let timeOfReq = coinsArray[i]["time"];
      let timePassed = now - timeOfReq;

      if (coinsArray[i]["id"] == coinId && timePassed < 120000) {
        isInLocal = true;

        $("#" + coinId).html(`
                  <div class="more-info-card">
                  <img src="${
                    coinsArray[i].imgSrc
                  }" alt="" class="rounded mx-auto d-block">
                  <ul>Price another valute (from localstrg)
                      <li>UDS: ${coinsArray[i].usd}  $</li>
                      <li>EUR: ${coinsArray[i].eur}  &euro;</li>
                      <li>ILS: ${coinsArray[i].ils}  &#8362;</li>
                  </ul>
                  </div>`);
        break;
      } else {
        isInLocal = false;
      }
    }
  }
}

function saveCoinsToLocal() {
  if (localStorage !== undefined) {
    localStorage.setItem("coinsArray", JSON.stringify(coinsArray));
  } else {
    // Sorry! No Web Storage support..
  }
}

function getCoinsFromLocal() {
  if (localStorage !== undefined) {
    coinsArray = JSON.parse(localStorage.getItem("coinsArray"));
  } else {
    // Sorry! No Web Storage support..
  }
}
