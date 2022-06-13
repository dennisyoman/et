$(document).ready(function () {
  //載入完成要執行init
  $("#main-panel")
    .unbind()
    .bind("compLoaded", function () {
      //
      if (
        sid == "GP" ||
        sid == "WS" ||
        sid == "Reader" ||
        (sid == "WRYG" && lid == "T")
      ) {
        $(".btn_games > div").find("span").eq(0).addClass("disabled");
      }
      if (sid != "GP" && sid != "WLS1") {
        $(".btn_games > div").find("span").eq(1).addClass("disabled");
      }
      //btn
      $(".btn_games")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_games");
          }
          clickthen();
        });
      $(".btn_widget")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_widget");
          }
          clickthen();
        });
      $(".btn_erasor")
        .unbind()
        .bind("click", function () {
          //clean painting
          $("#widget > .painting,#canvas-board > .canvas").remove();
          resetPanelBtns("btn_erasor");
          clickthen();
        });
      $(".btn_paletton")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_paletton");
            $(".btn_brush").addClass("active");
            appendPainting(true);
          } else {
            $(".btn_brush").removeClass("active");
            appendPainting(false);
          }
          clickthen();
        });

      $(".btn_brush")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_brush");
            $(".btn_paletton").addClass("active");
            appendPainting(true);
          } else {
            $(".btn_paletton").removeClass("active");
            appendPainting(false);
          }
          clickthen();
        });
      $(".btn_board")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_board");
          }
          clickthen();
        });
      $(".btn_zoom")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_zoom");
          }
          createZoomSensor();
        });
      $(".btn_bulb")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            $("#main").hide();
            resetPanelBtns("btn_bulb");
          } else {
            $("#main").show();
          }
          clickthen();
        });
      $(".btn_focus")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_focus");
            appendMasker(true);
          } else {
            appendMasker(false);
          }
          clickthen();
        });
      $(".btn_wb")
        .unbind()
        .bind("click", function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            resetPanelBtns("btn_wb");
            appendWBS();
            $(".btn_remove").addClass("up");
          } else {
            $(".btn_remove").removeClass("up");
          }
          clickthen();
        });
      $(".btn_remove")
        .unbind()
        .bind("click", function () {
          $("#widget .wbcard").remove();
          $(this).hide();
          clickthen();
        });
      //pen tool
      $(".pen_tool")
        .find("span.colour")
        .each(function () {
          $(this).css("background", $(this).attr("col"));
        });
      $(".pen_tool")
        .find("span")
        .unbind()
        .bind("click", function (e) {
          e.stopPropagation();
          if ($(this).hasClass("colour")) {
            $(this)
              .addClass("active")
              .siblings(".colour.active")
              .removeClass("active");
            //
            if ($(".pen_tool .size.active").length == 0) {
              $(".pen_tool .size.sm").click();
            }
          } else if ($(this).hasClass("size")) {
            $(this)
              .addClass("active")
              .siblings(".size.active,.eraser.active")
              .removeClass("active");
          } else if ($(this).hasClass("eraser")) {
            $(this)
              .addClass("active")
              .siblings(".size.active")
              .removeClass("active");
          }
          clickthen();
          setPen();
        });
      //init
      $(this)
        .addClass("loaded")
        .delay(500)
        .queue(function () {
          //pen tool
          $(".pen_tool .colour").eq(0).click();
          $(".pen_tool .size.sm").eq(0).click();
          $(this).dequeue();
        });
      //deactiveLoading();
    });
  //get unit title
  let ut = "";
  $(contentXML)
    .find("section")
    .each(function (i) {
      if (parseInt($(this).attr("section")) == parseInt(sectionID)) {
        ut = $(this).attr("name");
      }
    });
  if (ut.length > 18) {
    $("#unit-title").addClass("multiline");
  } else {
    $("#unit-title").removeClass("multiline");
  }
  $("#unit-title").html(ut);
  //get user info
  $(".user-info .username").html(uName);
  $(".user-info .duedate").html(dueDate);
  $(".user-info .unitpath").html(sid + "-B" + bid + "-L" + lid);

  //check loading
  checkCompLoading("#main-panel");
});

//games
var appendMonopoly = function (e) {
  //e.stopPropagation();

  if ($("#widget").children(".monopoly").length < 1) {
    $("#widget").append(`<div id="monopoly" class="monopoly"/>`);
    $.getComponent("./DATA/HTML/GAME/monopoly.html", "#monopoly");
  }
};
var appendFlipcard = function (e) {
  //e.stopPropagation();

  if ($("#widget").children(".flipcard").length < 1) {
    $("#widget").append(`<div id="flipcard" class="flipcard"/>`);
    $.getComponent("./DATA/HTML/GAME/flipcard.html", "#flipcard");
  }
};

//board
var appendBoardSmall = function (e) {
  $("#widget .smallboard").remove();

  $("#widget").append(`<div id="smallboard" class="smallboard"/>`);
  $.getComponent(
    "./DATA/HTML/WIDGET/smallboard.html",
    "#smallboard",
    "",
    "",
    "",
    "",
    true
  );
};
var appendBoardLarge = function (e) {
  $("#widget .largeboard").remove();

  $("#widget").append(`<div id="largeboard" class="largeboard"/>`);
  $.getComponent(
    "./DATA/HTML/WIDGET/largeboard.html",
    "#largeboard",
    "",
    "",
    "",
    "",
    true
  );
};

//widget
var appendPiece = function (e) {
  e.stopPropagation();
  //pieceArr
  var pieceClass = "";
  //for (i = 0; i < pieceArr.length; i++) {
  //if (
  //$("#widget").children(".piece." + pieceArr[i]).length < 1 &&
  //pieceClass == ""
  //) {
  pieceClass =
    pieceArr[$("#widget").children(".piece").length % pieceArr.length];
  //
  if ($("#piece").length < 1) {
    $("#widget").append(
      `<div id="piece" class="wow bounceIn piece ${pieceClass}"/>`
    );
    rootSoundEffect($pop);
    $("#piece")
      .unbind()
      .bind("mousedown", function (ev) {
        getHighestDepthWidget($(this));
      });
    getHighestDepthWidget($("#piece"));
    makeDraggable($("#piece"), false);
  } else {
    console.log("too fast");
  }
  //
  //break;
  //}
  //}
};
var appendScorer = function (e) {
  e.stopPropagation();
  //pieceArr
  var pieceClass =
    pieceArr[$("#widget").children(".scorer").length % pieceArr.length];
  //
  //
  if ($("#scorer").length < 1) {
    $("#widget").append(`<div id="scorer" class="scorer ${pieceClass}"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/scorer.html",
      "#scorer",
      "",
      "",
      "",
      "",
      true
    );
  } else {
    console.log("點太快了`,急甚麼?");
  }
  //
};

var appendRoulette = function (e) {
  e.stopPropagation();

  if ($("#widget").children(".roulette").length < 1) {
    $("#widget").append(`<div id="roulette" class="roulette"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/roulette.html",
      "#roulette",
      "",
      "",
      "",
      "",
      true
    );
  }
};
var appendFisher = function (e) {
  //e.stopPropagation();

  if ($("#widget").children(".fisher").length < 1) {
    $("#widget").append(`<div id="fisher" class="fisher"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/fisher.html",
      "#fisher",
      "",
      "",
      "",
      "",
      true
    );
  }
};
var appendFinger = function (e) {
  e.stopPropagation();

  if ($("#widget").children(".finger").length < 1) {
    $("#widget").append(`<div id="finger" class="finger"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/finger.html",
      "#finger",
      "",
      "",
      "",
      "",
      true
    );
  }
};
var appendCountdown = function (e) {
  e.stopPropagation();

  if ($("#widget").children(".countdown").length < 1) {
    $("#widget").append(`<div id="countdown" class="countdown"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/countdown.html",
      "#countdown",
      "",
      "",
      "",
      "",
      true
    );
  }
};
var appendCounter = function (e) {
  e.stopPropagation();

  if ($("#widget").children(".counter").length < 1) {
    $("#widget").append(`<div id="counter" class="counter"/>`);
    $.getComponent(
      "./DATA/HTML/WIDGET/counter.html",
      "#counter",
      "",
      "",
      "",
      "",
      true
    );
  }
};
var appendDice = function (e, type) {
  if (e != "") {
    e.stopPropagation();
  }
  if ($("#dice").length < 1) {
    switch (type) {
      case 1:
        if ($("#widget").children(".dice.red").length == 0) {
          $("#widget").append(`<div id="dice" class="dice red"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        } else if ($("#widget").children(".dice.green").length == 0) {
          $("#widget").append(`<div id="dice" class="dice green"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        }
        break;
      case 2:
        if ($("#widget").children(".dice.purple").length == 0) {
          $("#widget").append(`<div id="dice" class="dice purple"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        } else if ($("#widget").children(".dice.yellow").length == 0) {
          $("#widget").append(`<div id="dice" class="dice yellow"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        }
        break;
      case 3:
        if ($("#widget").children(".dice.blue").length == 0) {
          $("#widget").append(`<div id="dice" class="dice blue"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        } else if ($("#widget").children(".dice.pink").length == 0) {
          $("#widget").append(`<div id="dice" class="dice pink"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        }
      case 4:
        if ($("#widget").children(".dice.aan").length == 0) {
          $("#widget").append(`<div id="dice" class="dice aan"/>`);
          $.getComponent(
            "./DATA/HTML/WIDGET/dice.html",
            "#dice",
            "",
            "",
            "",
            "",
            true
          );
        }
        break;
    }
    $("#widget #dice").hide();
  } else {
    console.log("too fast");
  }
};

var createZoomSensor = function () {
  if ($("#widget").children("#zoomSensor").length < 1) {
    $("#widget").append(`<div id="zoomSensor" class="zoomSensor"/>`);

    trigZoomHammer();
  } else {
    $("#zoomSensor").remove();
  }
};

//zoom
var canvasCord;
var downCord = [];
var upCord = [];
var isZoomDragging = false;

var trigZoomHammer = function () {
  //hammer
  var myElement = document.getElementById("zoomSensor");
  var mc = new Hammer(myElement);
  mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
  mc.on("pan", function (ev) {
    handleZoomDrag(ev);
  });
};

var handleZoomDrag = function (ev) {
  var elem = ev.target;
  var newZoomRatio = stageRatioReal / stageRatioMain;
  if (!isZoomDragging && $(elem).hasClass("zoomSensor")) {
    isZoomDragging = true;
    downCord = [
      (ev.center.x - $("#root").offset().left) / newZoomRatio,
      (ev.center.y - $("#root").offset().top) / newZoomRatio,
    ];
    appendZoomer();

    //pre setup
    $(".voc,.visible,.sideTool > *,.tabs").each(function () {
      if ($(this).css("display") != "none") {
        $(this).hide().addClass("bi");
      }
    });
    $(".btn_zoom > div").each(function () {
      if ($(this).css("display") != "none") {
        $(this).hide();
      }
    });
  }
  if ($(elem).hasClass("zoomSensor")) {
    upCord = [
      (ev.center.x - $("#root").offset().left) / newZoomRatio,
      (ev.center.y - $("#root").offset().top) / newZoomRatio,
    ];
    //custom zoomer
    $("#zoomer").css("top", Math.min(downCord[1], upCord[1]) + "px");
    $("#zoomer").css("left", Math.min(downCord[0], upCord[0]) + "px");
    $("#zoomer").css("height", Math.abs(downCord[1] - upCord[1]) + "px");
    $("#zoomer").css("width", Math.abs(downCord[0] - upCord[0]) + "px");
    $("#zoomer").attr("ih", Math.abs(downCord[1] - upCord[1]));
    $("#zoomer").attr("iw", Math.abs(downCord[0] - upCord[0]));
  }

  if (ev.isFinal) {
    isZoomDragging = false;
    $("#zoomSensor").css("pointer-events", "none");
    //pre setup
    $(".wow.animated")
      .removeClass("wow")
      .removeClass("animated")
      .addClass("wa");
    $(".wow").removeClass("wow").addClass("w");
    $("#root").css("overflow", "visible");
    $("*:not(.card,.card *)").addClass("noAni");
    $(".card.active:not(.flipback)").addClass("keepCardFace");
    $(".card.active.flipback").addClass("keepCardback");
    //
    console.log($("#main").css("top"));
    $("#main").css({
      padding: "400px",
      "margin-top": "-400px",
      "margin-left": "-400px",
    });

    //flipback
    html2canvas(
      $("#root").get(0),
      //可以帶上寬高擷取你所需要的部分內容
      {
        x: Math.min(downCord[0], upCord[0]) * newZoomRatio,
        y: Math.min(downCord[1], upCord[1]) * newZoomRatio,
        width: Math.abs(downCord[0] - upCord[0]) * newZoomRatio,
        height: Math.abs(downCord[1] - upCord[1]) * newZoomRatio,
        scrollX: 0,
        scrollY: 0,
        scale: html2canvasScale,
      }
    ).then(function (canvas) {
      var ctx = canvas.getContext("2d");

      ctx.webkitImageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      ctx.imageSmoothingEnabled = true;
      $("#zoomer .canvas").css("transform", "scale(" + 1 / newZoomRatio + ")");
      //create a new canvas
      var newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      $("#zoomer .canvas").empty().get(0).appendChild(canvas);
      $("#zoomer .drawer").empty().get(0).appendChild(newCanvas);

      //finalize
      $("#zoomer .overlay").remove();
      $("#zoomer")
        .addClass("active")
        .attr("id", "")
        .delay(80)
        .queue(function () {
          $(this).dequeue();
          makeDrawable($(this));
          makeDraggable($(this), false, $(this));
        });
      //inactive btn
      $(".btn_zoom").click();
      //after setup
      $(".wa").addClass("wow").addClass("animated").removeClass("wa");
      $(".w").addClass("wow").removeClass("w");
      $("#root").css("overflow", "hidden");
      $(".noAni").removeClass("noAni");
      $(".keepCardFace").removeClass("keepCardFace");
      $(".keepCardback").removeClass("keepCardback");
      $(".bi").show().removeClass("bi");
      $("#main").css({
        padding: "0px",
        "margin-top": "0px",
        "margin-left": "0px",
      });
    });
  }
};

var makeDrawable = function (tar) {
  var can = tar.find(".drawer > canvas").get(0);
  var ctx = can.getContext("2d");
  var isDraw = false;
  ctx.strokeStyle = "#66ccff";
  ctx.lineWidth = 5 * html2canvasScale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  var startX, startY;
  var _eraserWidth = 100;
  var intPoint = [0, 0];

  // Mouse Down Event
  ["mousedown", "touchstart"].forEach(function (e) {
    can.addEventListener(e, function (event) {
      isDraw = true;
      var tw = parseInt(tar.get(0).style.width) / parseInt(tar.attr("iw"));
      var th = parseInt(tar.get(0).style.height) / parseInt(tar.attr("ih"));

      if (event.clientX) {
        startX = ((event.clientX - tar.offset().left) * html2canvasScale) / tw;
        startY = ((event.clientY - tar.offset().top) * html2canvasScale) / th;
      } else {
        startX =
          ((event.touches[0].clientX - tar.offset().left) * html2canvasScale) /
          tw;
        startY =
          ((event.touches[0].clientY - tar.offset().top) * html2canvasScale) /
          th;
      }
      intPoint = [startX, startY];
    });
  });

  // Mouse Move Event
  ["mousemove", "touchmove"].forEach(function (e) {
    can.addEventListener(e, function (event) {
      var tw = parseInt(tar.get(0).style.width) / parseInt(tar.attr("iw"));
      var th = parseInt(tar.get(0).style.height) / parseInt(tar.attr("ih"));

      if (isDraw) {
        if (tar.find(".erase").hasClass("active")) {
          if (event.clientX) {
            ctx.clearRect(
              ((event.clientX - tar.offset().left) * html2canvasScale) / tw -
                _eraserWidth / 2,
              ((event.clientY - tar.offset().top) * html2canvasScale) / th -
                _eraserWidth / 2,
              _eraserWidth,
              _eraserWidth
            );
          } else {
            ctx.clearRect(
              ((event.touches[0].clientX - tar.offset().left) *
                html2canvasScale) /
                tw -
                _eraserWidth / 2,
              ((event.touches[0].clientY - tar.offset().top) *
                html2canvasScale) /
                th -
                _eraserWidth / 2,
              _eraserWidth,
              _eraserWidth
            );
          }
        } else {
          if (event.clientX) {
            drawLine(
              startX,
              startY,
              ((event.clientX - tar.offset().left) * html2canvasScale) / tw,
              ((event.clientY - tar.offset().top) * html2canvasScale) / th
            );
          } else {
            drawLine(
              startX,
              startY,
              ((event.touches[0].clientX - tar.offset().left) *
                html2canvasScale) /
                tw,
              ((event.touches[0].clientY - tar.offset().top) *
                html2canvasScale) /
                th
            );
          }
        }
      }
    });
  });

  ["mouseup", "touchend"].forEach(function (e) {
    can.addEventListener(e, function (event) {
      //first dot
      if (
        intPoint[0] == startX &&
        intPoint[1] == startY &&
        !tar.find(".erase").hasClass("active")
      ) {
        ctx.arc(startX, startY, ctx.lineWidth / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        ctx.closePath();
      }
      isDraw = false;
    });
  });
  ["mouseleave"].forEach(function (e) {
    can.addEventListener(e, function (event) {
      isDraw = false;
    });
  });

  function drawLine(x, y, stopX, stopY) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(stopX, stopY);
    ctx.closePath();
    ctx.stroke();
    startX = stopX;
    startY = stopY;
  }
};

var appendZoomer = function () {
  if ($("#widget").children("#zoomer").length < 1) {
    $("#widget").append(`<div id="zoomer" class="zoomer"/>`);
    $("#zoomer").css("top", downCord[1] + "px");
    $("#zoomer").css("left", downCord[0] + "px");
    var zoomerHTML = `<div class="zoomer_wrapper">
            <span class="edit"></span>
            <span class="erase"></span>
            <span class="eraseAll"></span>
            <div class="drawer"></div>
            <div class="canvas"></div>
            <div class="overlay"></div>
            <span class="resizer lt" />
            <span class="resizer rt" />
            <span class="resizer lb" />
            <span class="resizer rb" />
          </div>`;
    $("#zoomer").html(zoomerHTML);
    //js
    $("#zoomer")
      .unbind()
      .bind("mousedown", function (e) {
        getHighestDepthWidget($(this));
      })
      .bind("touchstart", function (e) {
        getHighestDepthWidget($(this));
      });
    getHighestDepthWidget($("#zoomer"));

    $("#zoomer .edit")
      .unbind()
      .bind("click", function (e) {
        $(this).toggleClass("active").siblings(".erase").removeClass("active");

        if ($(this).hasClass("active")) {
          $(this).siblings(".eraseAll").addClass("active");
          $(this).siblings(".drawer").addClass("editable");
        } else {
          $(this).siblings(".eraseAll").removeClass("active");
          $(this).siblings(".drawer").removeClass("editable");
        }
      });
    $("#zoomer .erase")
      .unbind()
      .bind("click", function (e) {
        $(this).toggleClass("active").siblings(".edit").removeClass("active");
        if ($(this).hasClass("active")) {
          $(this).siblings(".drawer").addClass("editable");
          $(this).siblings(".eraseAll").addClass("active");
        } else {
          $(this).siblings(".eraseAll").removeClass("active");
          $(this).siblings(".drawer").removeClass("editable");
        }
      });
    $("#zoomer .eraseAll")
      .unbind()
      .bind("click", function (e) {
        $(this).removeClass("active");
        $(this).siblings(".edit").removeClass("active");
        $(this).siblings(".erase").removeClass("active");
        $(this).siblings(".drawer").removeClass("editable");
        //
        var clearTar = $(this).siblings(".drawer").find("canvas");
        var cctx = clearTar.get(0).getContext("2d");
        cctx.clearRect(0, 0, clearTar.attr("width"), clearTar.attr("height"));
      });
    /*
    $.getComponent(
      "./DATA/HTML/WIDGET/zoomer.html",
      "#zoomer",
      "",
      "",
      "",
      "",
      true
    );
    */
  }
};

//painting

var appendPainting = function (active) {
  if (active) {
    $("#canvas-board").clearQueue();
    canvasCord = [2560, 1280, 0, 0];
    if ($("#widget").children("#painting").length < 1) {
      $("#widget").append(`<div id="painting" class="painting"/>`);
      $.getComponent(
        "./DATA/HTML/WIDGET/painting.html",
        "#painting",
        "",
        "",
        "",
        "",
        true
      );
    }
  } else {
    $(".pen_tool").find("span.size.sm").click();
    $("#painting").remove();
    clickthen();
  }
};

var appendMasker = function (active) {
  if (active) {
    if ($("#widget").children("#masker").length < 1) {
      $("#widget").append(`<div id="masker" class="masker"/>`);
      $.getComponent(
        "./DATA/HTML/WIDGET/masker.html",
        "#masker",
        "",
        "",
        "",
        "",
        true
      );
    }
  } else {
    $("#masker").remove();
  }
};

//wb
var WRYGLessonID = ["1C", "1R", "2C", "2R", "3C", "3R", "T"];
var widgetWB = [];
var getWBS = function () {
  widgetWB = [];
  if (sid != "WRYG") {
    $(wbXML)
      .find("item")
      .each(function (i) {
        var ssid = $(this).find("sid").text();
        var bbid = $(this).find("bid").text();
        var llid = parseInt($(this).find("lid").text());
        var word = $(this).find("word").text();
        var img = $(this).find("img").text();
        var sfx = $(this).find("sfx").text();
        var pos = $(this).find("pos").text();
        var ExampleSentence = $(this).find("ExampleSentence").text();
        if (sid == "GLD" || sid == "WRYG") {
          word = $(this).find("Content").text();
        }
        if (ssid == sid && bbid == bid) {
          if (widgetWB[llid]) {
            widgetWB[llid].push([word, img, sfx, pos, ExampleSentence]);
          } else {
            widgetWB[llid] = new Array();
            widgetWB[llid].push([word, img, sfx, pos, ExampleSentence]);
          }
        }
      });
  } else {
    $(wbXML)
      .find("lesson")
      .each(function (i) {
        var ssid = $(this).attr("sid");
        var bbid = $(this).attr("bid");
        var llid = WRYGLessonID.indexOf($(this).attr("lid"));
        $(this)
          .find("section")
          .each(function (j) {
            var name = $(this).attr("name");
            if (name == "Vocabulary") {
              $(this)
                .find("item")
                .each(function (k) {
                  var context = $(this).text();
                  contextArr = context.split("|");
                  if (ssid == sid && bbid == bid) {
                    if (widgetWB[llid]) {
                      widgetWB[llid].push([
                        contextArr[0],
                        "",
                        contextArr[2],
                        contextArr[1],
                        contextArr[5],
                      ]);
                    } else {
                      widgetWB[llid] = new Array();
                      widgetWB[llid].push([
                        contextArr[0],
                        "",
                        contextArr[2],
                        contextArr[1],
                        contextArr[5],
                      ]);
                    }
                  }
                });
            }
          });
      });
  }
};
var appendWBS = function () {
  getWBS();

  var wbs = "<div>";
  wbs += '<ul class="lesson">';
  for (var k = 0; k < widgetWB.length; k++) {
    if (widgetWB[k]) {
      var LessonName = k;
      if (sid == "WRYG") {
        LessonName = WRYGLessonID[k];
      }
      wbs +=
        "<li ind='" +
        k +
        "' ><span class='all wow bounceIn'></span>Lesson " +
        LessonName +
        "</li>";
    }
  }
  wbs += "</ul>";
  wbs += '<ul class="word">';
  wbs += "</ul></div>";
  $(".btn_wb").html(wbs);
  //
  $(".btn_wb")
    .find("ul.lesson > li")
    .unbind()
    .bind("click", function (e) {
      e.stopPropagation();
      $(this)
        .addClass("selected")
        .siblings(".selected")
        .removeClass("selected");
      //
      var wbs = "";
      var tempID = parseInt($(this).attr("ind"));
      var smallClass = widgetWB[tempID].length > 9 ? "small" : "";
      for (var k = 0; k < widgetWB[tempID].length; k++) {
        var wordArr = widgetWB[tempID][k][0].split("^");
        if (wordArr[1]) {
          wbs +=
            "<li class='lm " +
            smallClass +
            "' ind='" +
            k +
            "'><span>" +
            wordArr[0] +
            "</span></li>";
        } else {
          wbs +=
            "<li class='" +
            smallClass +
            "' ind='" +
            k +
            "'><span>" +
            wordArr[0] +
            "</span></li>";
        }
      }
      $(".btn_wb").find("ul.word").attr("ind", tempID).html(wbs);
      //
      $(".btn_wb")
        .find("ul.word > li")
        .unbind()
        .bind("click", function (e) {
          e.stopPropagation();
          appendWB([widgetWB[$("ul.word").attr("ind")][$(this).attr("ind")]]);
        });
    })
    .eq(0)
    .click();
  $(".btn_wb")
    .find("ul.lesson > li span.all")
    .unbind()
    .bind("click", function (e) {
      e.stopPropagation();
      var tempID = parseInt($(this).parent().attr("ind"));
      //console.log(widgetWB[tempID]);
      appendWB(widgetWB[tempID]);
    });
};

var appendWB = function (data) {
  if ($("#widget").children("#wbcard").length < 1) {
    for (var i = 0; i < data.length; i++) {
      var word = data[i][0].split("^");
      let itemHTML = `<div id='wbcard' class='wbcard noImg autoMoving' voc='${word[0]}'><div><span class="img"></span>`;
      if (!isitEmpty(data[i][1])) {
        itemHTML = `<div id='wbcard' class='wbcard autoMoving' voc='${word[0]}'><div><span class="img"><img src="./DATA/${sid}/BOOK${bid}/IMAGES/${data[i][1]}" /></span>`;
      }

      //define part
      if (sid == "GLD" || sid == "WRYG") {
        itemHTML += `<span class="definition"><span>${data[i][4]}</span></span>`;
      }

      if (word[0].length < 12) {
        itemHTML += `<p>${word[0]}</p>`;
      } else {
        itemHTML += `<p class="multi small">${word[0]}</p>`;
      }

      //type part
      if (sid == "WRYG") {
        itemHTML += `<h3>${data[i][3]}</h3>`;
      }

      itemHTML += `<audio preload="auto" src="./DATA/${sid}/BOOK${bid}/AUDIO/${data[i][2]}" />`;

      if (word[1]) {
        itemHTML += `<span class="lm"></span>`;
      }

      itemHTML += `<span class="voc"></span>`;

      //define part
      if (sid == "GLD" || sid == "WRYG") {
        itemHTML += `<span class="def"></span>`;
      }
      itemHTML += "</div></div>";

      $("#widget").append(itemHTML);

      //lowlag audios
      var tempSound = $("#widget").find("audio");
      if (tempSound.length > 0) {
        tempSound.each(function () {
          if ($SFXNameAr.indexOf($(this).attr("src")) == -1) {
            $SFXNameAr.push($(this).attr("src"));
            $SFXAr.push(new Audio($(this).attr("src")));
          }
        });
      }

      //card
      $("#wbcard")
        .unbind()
        .bind("mousedown", function (ev) {
          click.x = ev.clientX;
          click.y = ev.clientY;
          getHighestDepthWidget($(this));
        })
        .bind("mouseup", function (ev) {
          if (
            Math.abs(click.x - ev.clientX) < click.threshold * stageRatioReal &&
            Math.abs(click.y - ev.clientY) < click.threshold * stageRatioReal
          ) {
            if ($(ev.target).hasClass("voc")) {
              $(this).toggleClass("voced");
              updateVOC2($(this));
            } else if ($(ev.target).hasClass("def")) {
              $(ev.target).toggleClass("active");
              $(this).toggleClass("definition");
            } else {
              playWBAudio2($(this));
              rootSoundEffect($chimes);
            }
          }
        })
        .delay(30)
        .queue(function () {
          $(this)
            .css({
              top: 10 + Math.floor(Math.random() * 80),
              left: 10 + Math.floor(Math.random() * 490),
            })
            .dequeue()
            .delay(1000)
            .queue(function () {
              $(this).removeClass("autoMoving").dequeue();
            });
        });
      makeDraggable($("#wbcard"));
      //
      $(".btn_remove").show();
    }
  }
  //add remove btn
  if ($("#wbcard").length == 0) {
  }
};

var updateVOC2 = function (tar) {
  var voc = tar.attr("voc");
  if (tar.hasClass("voced")) {
    var keepAy = new Array();
    var swapAy = new Array();
    //紀錄要留下的
    for (var i = 0; i < keepString.length; i++) {
      var counter = 0;
      var tempA = voc.split(keepString[i]);
      for (var k = 0; k < tempA.length - 1; k++) {
        counter += tempA[k].length;
        keepAy.push([counter, keepString[i]]);
        counter += keepString[i].length;
      }
    }
    //替換
    var finalStr = "";
    for (var i = 0; i < voc.length; i++) {
      finalStr += "_";
    }
    for (var i = 0; i < keepAy.length; i++) {
      finalStr =
        finalStr.substring(0, keepAy[i][0]) +
        keepAy[i][1] +
        finalStr.substring(keepAy[i][0] + keepAy[i][1].length, finalStr.length);
    }
    tar.find("p").text(finalStr);
  } else {
    tar.find("p").text(voc);
  }
};
var playWBAudio2 = function (tar) {
  lowlagSFX();
  activeSFX();
  rootSoundEffectName(tar.find("audio").attr("src"));
};
//common

var resetPanelBtns = function (classname) {
  $("#main-panel .btn:not(.btn_bulb)").each(function (i) {
    if ($(this).hasClass("active") && !$(this).hasClass(classname)) {
      $(this).click();
    }
  });
};

var clickthen = function () {
  if (
    $(".btn_paletton").hasClass("active") ||
    $(".btn_brush").hasClass("active")
  ) {
    $("#canvas-board > .canvas").addClass("disabled");
    $("#painting").removeClass("disabled");
    if ($(".pen_tool .eraser").hasClass("active")) {
      $("#canvas-board").css("pointer-events", "auto");
    } else {
      $("#canvas-board").css("pointer-events", "none");
    }
  } else {
    $("#canvas-board > .canvas").removeClass("disabled");
    $("#painting").addClass("disabled");
    $("#canvas-board").css("pointer-events", "none");
  }
  //
  /*Dennis update 2022/1/14 start*/
  $("#canvas-board .canvas").removeClass("selected");
  $("#cbg").hide();
  $("#cba").hide();
  /*Dennis update 2022/1/14 end*/
};

var getHMS = function (timeM) {
  var HH = "0" + Math.floor(timeM / (60 * 60 * 1000));
  timeM -= HH * 60 * 60 * 1000;
  var MM = "0" + Math.floor(timeM / (60 * 1000));
  timeM -= MM * 60 * 1000;
  var SS = "0" + Math.floor(timeM / 1000);

  if (HH > 0) {
    return HH.substr(-2, 2) + "：" + MM.substr(-2, 2) + "：" + SS.substr(-2, 2);
  } else {
    return MM.substr(-2, 2) + "：" + SS.substr(-2, 2);
  }
  //return HH+"h:"+MM+"m";
};

var setPen = function () {
  var colour = $(".pen_tool").find("span.colour.active").attr("col");
  var stroke = $(".pen_tool").find("span.size.active").attr("value");
  $("#painting").attr("col", colour).attr("stroke", stroke);
  if ($(".pen_tool").find("span.eraser.active").length > 0) {
    $("#painting").addClass("disabled");
  } else {
    $("#painting").removeClass("disabled");
  }
};
