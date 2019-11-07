var coinsArray = [];
var coinsSpecial = [];
var allCoins = [];

$(document).ready(function() {
  $(document).ajaxStart(function() {
    if ($("#graf").hasClass("active")) {
    } else {
      $(".loader").css("display", "block");
      $("#output").css("opacity", "0.5");
    }
  });

  $(document).ajaxComplete(function() {
    $(".loader").css("display", "none");
    $("#output").css("opacity", "1");
  });

  getCoinAjax1();
}); //end
