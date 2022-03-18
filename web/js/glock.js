$(document).ready(function () {
  //載入完成要執行init
  $("#main-glock")
    .unbind()
    .bind("compLoaded", function () {
      //
      $(this).find("p").text(initGlock);
      startGlock = new Date().getTime();
      setTimeout(function () {
        gclockCountingDown();
      }, 100);

      //hammer dragger

      var glockDragger = new Hammer(document.getElementById("main-glock"));
      glockDragger
        .get("pan")
        .set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });
      glockDragger.on("pan", function (ev) {
        handleGlockDrag(ev);
      });
      var isGlockDragging = false;
      var $glockElem = $("#main-glock").get(0);
      var handleGlockDrag = function (ev) {
        if (!isGlockDragging) {
          isGlockDragging = true;
          lastPosX = $glockElem.offsetLeft;
        }
        if (isGlockDragging) {
          var posX = ev.deltaX / stageRatio + lastPosX;

          $glockElem.style.left = posX + "px";
        }

        if (ev.isFinal) {
          isGlockDragging = false;
        }
      };
      $(this)
        .unbind()
        .bind("mousedown", function (ev) {
          click.x = ev.clientX;
          click.y = ev.clientY;
        })
        .bind("mouseup", function (ev) {
          if (
            Math.abs(click.x - ev.clientX) < click.threshold * stageRatioReal &&
            Math.abs(click.y - ev.clientY) < click.threshold * stageRatioReal
          ) {
            toggleGlock();
          }
        });
    });

  //check loading
  checkCompLoading("#main-glock");
});
//

var initGlock = 99;
var startGlock;
//func
var toggleGlock = function (e) {
  $("#main-glock").toggleClass("active");
};

var gclockCountingDown = function () {
  var diff = parseInt(new Date().getTime() - startGlock);
  var left = initGlock - parseInt(diff / 1000 / 60);

  if (left <= 0) {
    left = 0;
  } else {
    setTimeout(function () {
      gclockCountingDown();
    }, 1000);
  }
  $("#main-glock").find("p").text(left);
};
