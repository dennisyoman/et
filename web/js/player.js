$(document).ready(function () {
  //載入完成要執行init
  $("#player")
    .unbind()
    .bind("compLoaded", function () {
      //init
      $(this)
        .addClass("loaded")
        .delay(500)
        .queue(function () {
          $(this).dequeue();
        });
      if (audioPositionSwitch) {
        $("#player .main-player").addClass("rtl");
      }
      //hammer dragger
      var playerDragger = new Hammer(document.getElementById("dragger"));
      playerDragger.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      playerDragger.on("pan", function (ev) {
        handlePlayerDrag(ev);
      });

      var $playerElem = new Object();
      var playerBoundary = $("#player .bar-container").width();
      var isPlayerDragging = false;
      var handlePlayerDrag = function (ev) {
        var elem = ev.target;

        if (!isPlayerDragging) {
          isPlayerDragging = true;
          $playerElem = elem;
          lastPosX = elem.offsetLeft;
          //
          //if ($("#player .play").hasClass("active")) {
          currentAudio.pause();
          $("#player .play").addClass("active");
          $("#player .repeat").addClass("active");
          //} else {
          //currentAudio.play();
          //}
        }
        if (elem == $playerElem) {
          var posX = ev.deltaX / stageRatio + lastPosX;
          //console.log(posX);
          //console.log(playerBoundary / stageRatio);

          if (posX < 0) {
            posX = 0;
          }
          if (posX > playerBoundary / stageRatio) {
            posX = playerBoundary / stageRatio;
          }

          elem.style.left = posX + "px";
          $(currentAudio).get(0).currentTime =
            ($(currentAudio).get(0).duration * posX) /
            (playerBoundary / stageRatio);
          startTime = $(currentAudio).get(0).currentTime;
        }

        if (ev.isFinal) {
          isPlayerDragging = false;
          $playerElem = new Object();
          $("#player .repeat").removeClass("active");
        }
      };
      //hammer range
      var lastATPosX, lastATPosY;
      var playerRange = new Hammer(document.getElementById("range"));
      playerRange.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      playerRange.on("pan", function (ev) {
        handlePlayerRange(ev);
      });

      var handlePlayerRange = function (ev) {
        var elem = ev.target;
        var deltaX = $("#widget").offset().left;
        var deltaY = $("#widget").offset().top;

        if (!isPlayerDragging) {
          isPlayerDragging = true;
          $("#widget").append(`<div id="audioTrack" class="audioTrack">
          <audio preload="auto" src="${$(currentAudio).attr(
            "src"
          )}"/><span></span></div>`);
          currentAudio.pause();
          $("#player .play").addClass("active");
          $("#player .repeat").addClass("active");
        }
        //moving
        $("#audioTrack").get(0).style.top =
          Math.round(
            ev.center.y / stageRatio -
              deltaY / stageRatio -
              $("#audioTrack").height() / stageRatio / 2
          ) + "px";
        $("#audioTrack").get(0).style.left =
          Math.round(
            ev.center.x / stageRatio -
              deltaX / stageRatio -
              $("#audioTrack").width() / stageRatio / 2
          ) + "px";

        if (ev.isFinal) {
          isPlayerDragging = false;
          $("#audioTrack").attr("src", $(currentAudio).attr("src"));
          $("#audioTrack").attr("st", startTime);
          $("#audioTrack").attr("et", $(currentAudio).get(0).currentTime);

          $("#audioTrack")
            .unbind()
            .bind("mousedown", function (ev) {
              click.x = ev.clientX;
              click.y = ev.clientY;
              getHighestDepthWidget($(this));
            })
            .bind("mouseup", function (ev) {
              if (
                Math.abs(click.x - ev.clientX) <
                  click.threshold * stageRatioReal &&
                Math.abs(click.y - ev.clientY) <
                  click.threshold * stageRatioReal
              ) {
                playAudioTrack($(this));
              }
            });
          makeDraggable($("#audioTrack"));
          //
          //startTime = $(currentAudio).get(0).currentTime;
        }
      };
    });

  //check loading
  checkCompLoading("#player");
});

var startTime = 0;
var endTime = 0;
var repeatEndTime = -1;
var playerGotoPosition = function () {
  var draggerP = Math.floor(
    (100 / $(currentAudio).get(0).duration) * $(currentAudio).get(0).currentTime
  );
  var rangeS = Math.floor((100 / $(currentAudio).get(0).duration) * startTime);
  $("#player .dragger").css("left", draggerP + "%");
  $("#player .range")
    .css("left", rangeS + "%")
    .css("width", draggerP - rangeS + "%");
  //
  if (repeatEndTime != -1) {
    if ($(currentAudio).get(0).currentTime >= repeatEndTime) {
      //playPlayer();
      currentAudio.pause();
      $("#player .repeat").addClass("active");
    }
  }
};
var playerAudioEnd = function () {
  if ($("#player .loop").hasClass("active")) {
    stopPlayer();
    playPlayer();
    startTime = 0;
    repeatEndTime = -1;
  } else {
    $("#player .play").addClass("active");
    $("#player .repeat").addClass("active");
    //resetSpeakerBtn();
  }
};

var resetSpeakerBtn = function () {
  $(".sideTool > div.speaker").removeClass("active");
  $(".sideTool > div.song").removeClass("active");
  $(".sideTool > div.kala").removeClass("active");
  $(".sideTool > div.dia_audio").removeClass("active");
  $(".sideTool > div.dia_check").removeClass("active");
  $(".sideTool > div.btn_check").removeClass("active");
};

var switchPosition = function () {
  audioPositionSwitch = !audioPositionSwitch;
  $("#player .main-player").toggleClass("rtl");
};
var playPlayer = function () {
  repeatEndTime = -1;
  $("#player .play").toggleClass("active");
  if ($("#player .play").hasClass("active")) {
    currentAudio.pause();
    $("#player .repeat").addClass("active");
    //console.log("et:" + $(currentAudio).get(0).currentTime);
  } else {
    $("#player .repeat").removeClass("active");
    //console.log("st:" + $(currentAudio).get(0).currentTime);
    startTime = $(currentAudio).get(0).currentTime;
    if ($(currentAudio).get(0).currentTime == $(currentAudio).get(0).duration) {
      startTime = 0;
    }
    currentAudio.play();
  }
};

var repeatPlayer = function () {
  $("#player .repeat").removeClass("active");
  repeatEndTime = currentAudio.currentTime;
  currentAudio.currentTime = startTime;
  currentAudio.play();
};
var loopPlayer = function () {
  $("#player .loop").toggleClass("active");
};
var stopPlayer = function () {
  $("#player .play").addClass("active");
  currentAudio.pause();
  currentAudio.currentTime = 0;
  $("#player .dragger").css("left", 0);
  $("#player .range").css("width", 0).css("left", 0);
  $("#player .repeat").removeClass("active");
  repeatEndTime = -1;
  startTime = 0;
  //resetSpeakerBtn();
};
var closePlayer = function () {
  resetAudio();
  resetSpeakerBtn();
};

var playAudioTrack = function (tar) {
  //tar.toggleClass("active");
  if (!tar.hasClass("active")) {
    //pause currentAudioTrack
    if (currentAudioTrack != undefined) {
      currentAudioTrack.pause();
      $(".audioTrack.active").attr("ct", currentAudioTrack.currentTime);
    }
    $(".audioTrack").removeClass("active");
    //
    tar.addClass("active");
    currentAudioTrack = new Audio(tar.attr("src"));
    currentAudioTrack.pause();
    currentAudioTrack.currentTime = tar.attr("st");
    if (tar.attr("ct")) {
      currentAudioTrack.currentTime = tar.attr("ct");
    }
    currentAudioTrack.play();
    $(currentAudioTrack)
      .unbind()
      .on("timeupdate", function () {
        var pb =
          (currentAudioTrack.currentTime - tar.attr("st")) /
          (tar.attr("et") - tar.attr("st"));
        tar.find(">span").css("width", pb * 19 + "px");
        if (currentAudioTrack.currentTime >= tar.attr("et")) {
          currentAudioTrack.pause();
          tar.find(">span").css("width", "19px");
          tar.removeClass("active").removeAttr("ct");
        }
      })
      .on("end", function () {
        tar.removeClass("active").removeAttr("ct");
        tar.find(">span").css("width", "100%");
      });
  } else {
    currentAudioTrack.pause();
    tar.removeClass("active").attr("ct", currentAudioTrack.currentTime);
  }
  //
};
