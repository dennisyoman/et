$(document).ready(function () {
  //載入完成要執行init
  $("#login_wrapper")
    .unbind()
    .bind("compLoaded", function () {
      //init
      $(this)
        .addClass("loaded")
        .delay(2000)
        .queue(function () {
          $(this).dequeue();
        });
      deactiveLoading();

      $(".showpw")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            $("#password").attr("type", "text");
          } else {
            $("#password").attr("type", "password");
          }
        });

      $(document).on("keypress", function (e) {
        if ($("#ok").length > 0) {
          if (e.which == 13) {
            $("#ok").click();
          }
        }
      });
    });

  //check loading
  checkCompLoading("#login_wrapper");
});

var ok = function () {
  //fullscreen
  if (testmode) {
    getSeriesXML();
  } else {
    checkLogin();
  }
};
