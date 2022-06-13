// JavaScript Document

$(document).ready(function () {
  //scroll
  $(window).scroll(function () {
    scrollFn();
  });

  //resize trigger
  $(window).resize(function () {
    resizeScreen();
  });
  // starts with audio1
  //lowLag.changeSoundAudioContext('bgSFX', false);

  //fullscreen
  $("#fullscreen")
    .unbind()
    .bind("click", function () {
      requestFullscreen();
    });

  //power
  $("#power")
    .unbind()
    .bind("click", function () {
      //fullscreen
      $(this).toggleClass("active");
    });

  if (getUrlParameter("tm")) {
    testmode = true;
  }
  if (getUrlParameter("gld")) {
    GLDmode = true;
  }

  //return
  $("#return")
    .unbind()
    .bind("click", function () {
      defaultSizer();
      $("#lines").hide();
      $("#sizer").hide();
      if (uid != null) {
        let elemName = "mainslider";
        let script_arr = [elemName + ".js"];
        let style_arr = [elemName + ".css"];
        $.getComponent(
          "./page/" + elemName + ".html",
          "#main",
          style_arr,
          "./css/",
          script_arr,
          "./js/"
        );

        console.log("load and goto Unit selection");
        //clean widgets
        $("#widget").empty();
        //clean canvas
        $("#canvas-board .canvas").remove();
        $("#cbg").hide();
        $("#cba").hide();
        // pause audio tracker
        if (currentAudioTrack) {
          currentAudioTrack.pause();
        }
        $(".btn_remove").hide();
        $("#main").show();
        if ($("#lines").hasClass("active")) {
          $("#lines").removeClass("active");
          $("#lines_board").hide();
        }
        resetGlock();
      } else if (lid != null) {
        removeUnits();
        console.log("return to Lesson selection");
        $("#return").click();
      } else if (bid != null) {
        closeBook();
        console.log("return to Book selection");
      } else if (sid != null) {
        console.log("return to Series selection");
        createSeries();
        $("#return").hide();
      } else {
        console.log("return to Login");
        createSeries();
        $("#return").hide();
      }
      //resetAudio
      resetAudio();
      resetPanel();
    });

  //painting erasor
  var pe = new Hammer(document.getElementById("canvas-board"));
  pe.get("pan").set({ direction: Hammer.DIRECTION_ALL });
  pe.on("pan", function (ev) {
    //erasor painting
    if ($(".pen_tool .eraser").hasClass("active")) {
      erasorPainting(ev);
    }
  });

  //lines
  $("#lines")
    .unbind()
    .bind("click", function () {
      $(this).toggleClass("active");
      if ($(this).hasClass("active")) {
        $("#lines_board").show();
      } else {
        $("#lines_board").hide();
      }
    });

  $("#backToGEO")
    .unbind()
    .bind("click", function () {
      backToGEO();
    });

  resizeScreen();
  Wow.init();
  //init
  toLogin();
  adjustSizer();

  //是否支援localstorge
  if (typeof Storage !== "undefined") {
    // Code for localStorage/sessionStorage.
    if (isIE()) {
      //checkBrowser
      let alertHint =
        "您的瀏覽器支援度過於老舊。請下載安裝Chrome或Edge等效能較好的瀏覽器，以獲得完整的使用體驗。";
      alert(alertHint);
    } else {
      //使用get
      uToken = getUrlParameter("token");
      //使用localStorage
      if (!uToken) {
        console.log("使用localstorge");
        uToken = window.localStorage.getItem("MemberToken");
        console.log(uToken);
      }
    }
  } else {
    // Sorry! No Web Storage support..
    alert("抱歉，您的瀏覽器不支援此應用程式。");
  }
});

//parameters
let html2canvasScale = 5;
let testmode = false;
let GLDmode = false;
let WRYGmode = false;
let translateCountDown = false; //繁轉簡倒數(勿動)
let uToken = ""; //user token(勿動)
let version = new Date().getDate(); //版本(勿動)
let sid, bid, lid, uid, sectionID;
let gpObj = {}; //for inside GP;
let userID = "-";
let uName = "-";
let dueDate = "-";
let seriesXML;
let wbXML;
var fcXML;
let dialogueXML;
let gpXML;
let contentXML;
let audioPositionSwitch = false;
let keepString = [
  "(n.)",
  "(v.)",
  "(adj.)",
  "(adv.)",
  "=",
  "(s)",
  "(es)",
  " ",
  "(",
  ")",
  "-",
];
let pieceArr = ["red", "green", "blue", "orange", "purple"];
var currentAudio;
var currentAudioTrack;
let countDownDefault = [0, 0, 0, 0];

let getAllXML = function (llid) {
  if (lid != llid) {
    uid = null;
    lid = llid;
    //create
    getWB();
  } else {
    showUnits();
  }
};

let createUnits = function () {
  $("#icon-wrapper").empty();
  //
  let amount = $(contentXML).find("section").length;
  $(contentXML)
    .find("section")
    .each(function (i) {
      let thumb = $(this).attr("image").replace(".swf", ".png");
      thumb = thumb.replace("SWF/", "UNITS/");
      let name = $(this).attr("name");
      let container = $(this).attr("swf").replace(".swf", ".html");
      let id = i + 1;
      let section = $(this).attr("section");
      let iconHTML = `<li onclick="loadContainer(${id},${section})">
                        <img src="./DATA/${thumb}"/>
                        <h3>${name}</h3></li>`;
      $("#icon-wrapper").append(iconHTML);
      if (amount > 5 && i == Math.ceil(amount / 2) - 1) {
        $("#icon-wrapper").append("<br />");
      }
    });
  //
  $("#icon-wrapper")
    .find("li")
    .unbind()
    .bind("click", function () {
      $(this).addClass("visited");
    });
  showUnits();
};

let showUnits = function (checkcheck) {
  $("#units").addClass("active");
  if (checkcheck) {
    doubleCheckin();
  }
};

let hideUnits = function () {
  $("#units").removeClass("active");
};

let removeUnits = function (reset) {
  $("#units").removeClass("active");
  if (reset != 1) {
    lid = null;
  }
};

let toLogin = function () {
  //$('.main_btn.home').click();
  let elemName = "login";
  let script_arr = [elemName + ".js"];
  let style_arr = [elemName + ".css"];
  $.getComponent(
    "./page/" + elemName + ".html",
    "#main",
    style_arr,
    "./css/",
    script_arr,
    "./js/"
  );
};

let loadContainer = function (id, section) {
  gpObj = {};
  uid = id;
  sectionID = section;
  //
  let unitContainer = $(contentXML)
    .find("section:eq(" + (uid - 1) + ")")
    .attr("swf");
  let htmlPath = unitContainer.replace("SWF/", "HTML/");
  htmlPath = htmlPath.replace(".swf", ".html");
  let jsPath = unitContainer.replace("SWF/", "HTML/");
  jsPath = jsPath.replace(".swf", ".js");
  jsPath = jsPath.split("?")[0];
  let cssPath = unitContainer.replace("SWF/", "HTML/");
  cssPath = cssPath.replace(".swf", ".css");
  cssPath = cssPath.split("?")[0];
  //htmlPath = "GP/BOOK2/HTML/GP-2-15-2.html";

  //for reader
  if (htmlPath.indexOf("READER") != -1) {
    switch (uid) {
      case 1:
        // code block
        htmlPath = "READER/HTML/leadin.html";
        break;
      case 2:
        // code block
        htmlPath = "READER/HTML/storytime.html";
        break;
      case 3:
        // code block
        htmlPath = "READER/HTML/activity.html";
        break;
      default:
      // code block
    }
  }

  //for big picture/dialogur in WLS1 WLS2
  if (htmlPath.indexOf("bp") != -1) {
    htmlPath = sid + "/HTML/bp.html";
  }

  console.log("load:" + htmlPath);
  //console.log(jsPath);
  //console.log(cssPath);

  let script_arr = [
    /*jsPath*/
  ];
  let style_arr = [
    /*cssPath*/
  ];
  $.getComponent(
    "./DATA/" + htmlPath,
    "#main",
    style_arr,
    "./DATA/",
    script_arr,
    "./DATA/"
  );

  resetAudio();
  loadPanel();
  loadGlock();
  hideUnits();
  $("#lines").show();
  $("#main").show();
  defaultSizer();
};

let loadPanel = function () {
  resetPanel();
  $("#root").append("<div id='panel' class='panel wow slideInUp'></div>");

  let elemName = "panel";
  let script_arr = [elemName + ".js"];
  let style_arr = ["panel.css"];
  $.getComponent(
    "./page/" + elemName + ".html",
    "#panel",
    style_arr,
    "./css/",
    script_arr,
    "./js/",
    true
  );
};
let loadGlock = function () {
  if ($("#glock").length < 1) {
    $("#root").append("<div id='glock' class='glock'></div>");

    let elemName = "glock";
    let script_arr = [elemName + ".js"];
    let style_arr = ["glock.css"];
    $.getComponent(
      "./page/" + elemName + ".html",
      "#glock",
      style_arr,
      "./css/",
      script_arr,
      "./js/",
      true
    );
  }
};

let loadPlayer = function () {
  $("#root").append("<div id='player' class='player wow fadeIn'></div>");

  let elemName = "player";
  let script_arr = [elemName + ".js"];
  let style_arr = ["panel.css"];
  $.getComponent(
    "./page/" + elemName + ".html",
    "#player",
    style_arr,
    "./css/",
    script_arr,
    "./js/",
    true
  );
};

let loadMainSlider = function () {
  let elemName = "mainslider";
  let script_arr = [elemName + ".js"];
  let style_arr = [elemName + ".css"];
  $.getComponent(
    "./page/" + elemName + ".html",
    "#main",
    style_arr,
    "./css/",
    script_arr,
    "./js/"
  );
};

let checkLogin = function () {
  $(".error").html("login...");

  if (
    $('input[name="username"]').val() == "" ||
    $('input[name="password"]').val() == ""
  ) {
    $(".error").html("帳號或密碼沒填");
  } else {
    //case insensitive
    let uname = $('input[name="username"]').val().toUpperCase();
    userID = uname;
    let upass = $('input[name="password"]').val().toUpperCase();
    let upassLength = upass.length < 10 ? "0" + upass.length : upass.length;
    let combo = uname + upass + upassLength;
    combo = combo.split("");
    let encodedToken = "";
    for (let i = 0; i < combo.length; i++) {
      encodedToken += combo[i];
      encodedToken += "_";
    }
    encodedToken = btoa(encodedToken);

    $.ajax({
      type: "GET",
      url: "/ws/ws_get.asmx/MemberLogin",
      data: { data: encodedToken, source: "C" },
      async: false,
      contentType: "application/json; charset=utf-8",
      timeout: 10000,
      cache: false,
      dataType: "xml",
      success: function (data) {
        console.log(data);
        let code = $(data).find("code").first().text();
        let msg = $(data).find("msg").first().text();
        let geptExpress = $(data).find("geptExpress").first().text();
        if (code == "0" || code == 0) {
          if (geptExpress == "Y") {
            WRYGmode = true;
          }
          uToken = $(data).find("token").first().text();
          dueDate = $(data).find("ServiceEndDate").first().text();
          uName = $(data).find("name").first().text();
          getSeriesXML();
        } else if (code == "2" || code == 2) {
          $(".error").html("此帳號已在線上");
          let passwordAgain = confirm("此帳號已在線上，是否要取代原登入者?");
          // if (passwordAgain && passwordAgain.toUpperCase() == upass) {
          if (passwordAgain) {
            reCheckLogin(encodedToken);
          } else {
            //alert("密碼錯誤");
          }
        } else {
          $(".error").html(msg);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        $(".error").html(thrownError);
      },
    });
  }
};

let reCheckLogin = function (encodedToken) {
  $.ajax({
    type: "GET",
    url: "/ws/ws_get.asmx/MemberReLogin",
    data: { data: encodedToken, source: "C" },
    async: false,
    contentType: "application/json; charset=utf-8",
    timeout: 10000,
    cache: false,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      let geptExpress = $(data).find("geptExpress").first().text();
      if (code == "0" || code == 0) {
        if (geptExpress == "Y") {
          WRYGmode = true;
        }
        uToken = $(data).find("token").first().text();
        dueDate = $(data).find("ServiceEndDate").first().text();
        uName = $(data).find("name").first().text();
        getSeriesXML();
      } else {
        $(".error").html(msg);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      $(".error").html(thrownError);
    },
  });
};

let doubleCheckin = function () {
  let xpath = "/ws/ws_get.asmx/Series";
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("pass double");
      } else {
        showError(msg);
        if (code == "12" || code == 12) {
          window.location.reload();
        }
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("Series:error");
    },
  });
};

let getSeriesXML = function () {
  let xpath = "/ws/ws_get.asmx/Series";
  if (testmode) {
    xpath = "./series.xml";
  }
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("Series:got");
        seriesXML = data;
        loadMainSlider();
      } else {
        showError(msg);
        if (code == "12" || code == 12) {
          window.location.reload();
        }
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("Series:error");
    },
  });
};

let getWB = function () {
  let xpath = "/ws/ws_get.asmx/WordBank";
  switch (sid) {
    case "WRYG":
      xpath = "/ws/ws_get.asmx/Info_WRYG";
      break;
    case "GLD":
      xpath = "/ws/ws_get.asmx/GLD_WordBank";
      break;
  }

  if (testmode) {
    xpath = "./wb.xml";
  }

  if (sid == "WRYG") {
    $.ajax({
      type: "GET",
      url: xpath,
      data: { token: uToken, sid: sid, bid: bid, lid: "all" },
      cache: false,
      contentType: "application/json; charset=utf-8",
      async: false,
      timeout: 10000,
      dataType: "xml",
      success: function (data) {
        console.log(data);
        let code = $(data).find("code").first().text();
        let msg = $(data).find("msg").first().text();
        if (code == "0" || code == 0) {
          console.log("WB:Got");
          wbXML = data;
          getDialogue();
        } else {
          showError(msg);
          if (code == "12" || code == 12) {
            window.location.reload();
          }
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        console.log("WB:Error");
      },
    });
  } else if (sid == "WS") {
    $.ajax({
      type: "GET",
      url: xpath,
      data: { token: uToken, sid: sid, bid: bid, lid: "all" },
      cache: false,
      contentType: "application/json; charset=utf-8",
      async: false,
      timeout: 10000,
      dataType: "xml",
      success: function (data) {
        console.log(data);
        let code = $(data).find("code").first().text();
        let msg = $(data).find("msg").first().text();
        if (code == "0" || code == 0) {
          console.log("WB:Got");
          wbXML = data;
          getDialogue();
        } else {
          showError(msg);
          if (code == "12" || code == 12) {
            window.location.reload();
          }
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        console.log("WB:Error");
      },
    });
  } else {
    $.ajax({
      type: "GET",
      url: xpath,
      data: { token: uToken, sid: sid, bid: bid },
      cache: false,
      contentType: "application/json; charset=utf-8",
      async: false,
      timeout: 10000,
      dataType: "xml",
      success: function (data) {
        console.log(data);
        let code = $(data).find("code").first().text();
        let msg = $(data).find("msg").first().text();
        if (code == "0" || code == 0) {
          console.log("WB:Got");
          wbXML = data;
          getDialogue();
        } else {
          showError(msg);
          if (code == "12" || code == 12) {
            window.location.reload();
          }
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        console.log("WB:Error");
      },
    });
  }
};

let getDialogue = function () {
  let xpath = "/ws/ws_get.asmx/Dialogue";
  switch (sid) {
    case "GLD":
      xpath = "/ws/ws_get.asmx/GLD_SBP";
      break;
  }
  if (testmode) {
    xpath = "./dia.xml";
  }
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken, sid: sid, bid: bid },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("Dia:Got");
        dialogueXML = data;
        getGP();
      } else {
        showError(msg);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("Dia:Error");
    },
  });
};

let getGP = function () {
  let mmode = 1;
  let infoPath = "Info_GP";
  let ssid = sid;
  let bbid = bid;
  let llid = lid;
  switch (sid) {
    case "GP":
      infoPath = "Info_GP";
      mmode = 1;
      break;
    case "WLS2":
      infoPath = "Info_Reader";
      mmode = 2;
      break;
    case "READER":
      infoPath = "Info_Reader";
      mmode = 1;
      break;
    case "WLS1":
      infoPath = "Info_GP";
      mmode = 2;
      break;
    case "WS":
      infoPath = "Info_GP";
      mmode = 2;
      break;
    case "Reader":
      let fake_lid = lid;
      let fake_bid = bid * 3;

      if (bid < 5) {
        //Book1-4

        if (lid >= 1 && lid <= 7) {
          fake_bid = fake_bid - 2;
          fake_lid = lid;
        } else if (lid >= 8 && lid <= 14) {
          fake_bid = fake_bid - 1;
          fake_lid = lid - 7;
        } else if (lid >= 15 && lid <= 20) {
          fake_bid = fake_bid;
          fake_lid = lid - 14;
        } else {
          trace("this");
          fake_bid = 0;
          fake_lid = 0;
        }
      } else {
        fake_bid = 0;

        if (bid == 5) {
          //Book5
          fake_lid = lid;
        } else {
          //Book6 以後
          fake_lid = Number(lid) + (bid - 5) * 20;
        }
      }
      infoPath = "Info_Reader";
      mmode = 2;
      ssid = "WLS2";
      bbid = fake_bid;
      llid = fake_lid;
      break;

    case "WRYG":
      infoPath = "Info_WRYG";
      break;

    default:
      //WBS3 & WBS4
      infoPath = "Info_DiaPlus";
      break;
  }
  let xpath = "/ws/ws_get.asmx/" + infoPath;
  if (testmode) {
    xpath = "./gp.xml";
  }
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken, mode: mmode, sid: ssid, bid: bbid, lid: llid },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("GP:Got");
        gpXML = data;
        getContent();
      } else {
        showError(msg);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("GP:Error");
    },
  });
};

let getContent = function () {
  let mmode = 1;
  let infoPath = "Info_GP";
  let ssid = sid;
  let bbid = bid;
  let llid = lid;
  switch (sid) {
    case "GP":
      infoPath = "Info_GP";
      mmode = 1;
      break;
    case "WLS2":
      infoPath = "Info";
      break;
    case "READER":
      infoPath = "Info_Reader";
      mmode = 1;
      break;
    case "WLS1":
      infoPath = "Info";
      break;
    case "WS":
      infoPath = "Info";
      break;
    case "Reader":
      infoPath = "Info";
      break;
    case "WRYG":
      infoPath = "Info_WRYG";
      break;
    case "GLD":
      infoPath = "Info_GLD";
      break;

    default:
      //WBS3 & WBS4
      infoPath = "Info_LV3";
      break;
  }
  let xpath = "/ws/ws_get.asmx/" + infoPath;
  if (testmode) {
    xpath = "./content.xml";
  }
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken, mode: mmode, sid: ssid, bid: bbid, lid: llid },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("content:Got");
        contentXML = data;

        //get flipcard xml
        getFCXML();
      } else {
        showError(msg);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("content:Error");
    },
  });
};

let getFCXML = function () {
  let xpath = "/ws/ws_get.asmx/FlipCard";
  if (testmode) {
    xpath = "./fc.xml";
  }
  //get data
  var bid_gp;
  var lid_gp;
  //transfer to GP
  if (sid == "WLS1") {
    //level1
    bid_gp = $(gpXML).find("lesson:eq(0)").attr("bid");
    lid_gp = $(gpXML).find("lesson:eq(0)").attr("lid");
  } else if (sid == "WRYG") {
    //level1
    bid_gp = 1;
    lid_gp = 1;
  } else {
    bid_gp = bid;
    lid_gp = lid;
  }
  $.ajax({
    type: "GET",
    url: xpath,
    data: { token: uToken, bid: bid_gp, lid: lid_gp },
    cache: false,
    contentType: "application/json; charset=utf-8",
    async: false,
    timeout: 10000,
    dataType: "xml",
    success: function (data) {
      console.log(data);
      let code = $(data).find("code").first().text();
      let msg = $(data).find("msg").first().text();
      if (code == "0" || code == 0) {
        console.log("FC:got");
        fcXML = data;
        //create units
        createUnits();

        //
      } else {
        showError(msg);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log("FC:error");
    },
  });
};

//common funcs
let isitEmpty = function (str) {
  var tempStr = str.replace(/\s+/g, "");
  return !(tempStr.length > 0);
};
// Wow
let Wow = (function () {
  "use strict";

  // Handle Wow
  let handleWow = function () {
    let wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // default
      mobile: true, // trigger animations on mobile devices (true is default)
      tablet: true, // trigger animations on tablet devices (true is default)
      live: true,
    });
    wow.init();
  };

  return {
    init: function () {
      handleWow(); // initial setup for counter
    },
  };
})();

////load component,css,js
$.getMultiScripts = function (arr, path) {
  $.each(arr, function (index, scr) {
    //是否載入過
    if ($.inArray(scr, js_cache_arr) >= 0) {
      //console.log(scr+" exists, remove it.");
      let srcc = (path || "") + scr + "?v=" + version;
      $("script[src='" + srcc + "']").remove();
    } else {
      //cache住
      js_cache_arr.push(scr);
    }
    let sc = document.createElement("script");
    sc.src = (path || "") + scr + "?v=" + version;
    $("body").append(sc);
    //
    //console.log(scr+" is loaded.");
  });
  return {
    done: function (method) {
      if (typeof method == "function") {
        //如果傳入引數為一個方法
        method();
      }
    },
  };
};

$.getMultiStyles = function (arr, path) {
  $.each(arr, function (index, scr) {
    //是否載入過
    if ($.inArray(scr, css_cache_arr) >= 0) {
      //console.log(scr+" exists.");
    } else {
      //cache住
      css_cache_arr.push(scr);
      //
      $("head").append("<link>");
      let css = $("head").children(":last");
      css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: (path || "") + scr + "?v=" + version,
      });
      //console.log(scr+" is loaded.");
    }
  });
};

$.getComponent = function (
  comp,
  comp_holder,
  css_arr,
  css_path,
  js_arr,
  js_path,
  noloading
) {
  let delayTime = 50;
  let chamount = $(comp_holder).length;
  if (noloading) {
  } else {
    activeLoading();
  }
  $(comp_holder)
    .delay(delayTime)
    .queue(function () {
      //先載入樣式
      if (css_arr != "") {
        //console.log("-- css --");
        $.getMultiStyles(css_arr, css_path);
      }

      //載入元件
      //console.log("-- component --");
      $(this).load(comp + "?v=" + version, function () {
        //console.log(comp+" is loaded.");
        chamount -= 1;
        if (chamount == 0) {
          //完成後載入js
          if (js_arr != "") {
            //console.log("-- js --");
            $.getMultiScripts(js_arr, js_path).done(function () {
              // all scripts loaded
              //console.log("Loading Finished.");
            });
          } else {
            //console.log("No js, all loading Finished.");
          }
        }
      });
      $(this).dequeue();
    });
};

let css_cache_arr = [];
let js_cache_arr = [];
let stageRatio = 1; //real ratio = stageRatioMain * stageRatioRoot
let stageRatioReal = 1;
let stageRatioMain = 1; //放大工具
let stageRatioRoot = 1; //調整app尺寸fit screen
let stageRatioMax = 5;
let clientWidth = function () {
  return Math.max(window.innerWidth, document.documentElement.clientWidth);
};
let clientHeight = function () {
  return Math.max(window.innerHeight, document.documentElement.clientHeight);
};

let autofitScreen = function () {
  let clientW = clientWidth();
  let clientH = clientHeight();
  let stageW = 640;
  let stageH = 360;
  if (clientW / clientH > stageW / stageH) {
    stageRatioRoot = clientH / stageH;
  } else {
    stageRatioRoot = clientW / stageW;
  }
  stageRatioRoot = Math.min(stageRatioRoot, stageRatioMax);
  stageRatioReal = stageRatioRoot * stageRatioMain;
  stageRatio = Math.floor(stageRatioReal * 10) / 10;

  $("#root").css("zoom", "1");
  $("#root").css(
    "-ms-transform",
    "translate3d(-50.1%,-50.1%,0) scale(" +
      stageRatioRoot +
      "," +
      stageRatioRoot +
      ")"
  );
  $("#root").css(
    "-webkit-transform",
    "translate3d(-50.1%,-50.1%,0) scale(" +
      stageRatioRoot +
      "," +
      stageRatioRoot +
      ")"
  );
  $("#root").css(
    "transform",
    "translate3d(-50.1%,-50.1%,0) scale(" +
      stageRatioRoot +
      "," +
      stageRatioRoot +
      ")"
  );
};

let shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

let mySort = function (array, tarObj, val) {
  array.sort(function (a, b) {
    let aRV = parseInt(tarObj[a][val]);
    let bRV = parseInt(tarObj[b][val]);
    if (aRV > bRV) return 1;
    if (aRV < bRV) return -1;
    return 0;
  });
};

let requestFullscreen = function () {
  /*if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }*/
  var isInFullScreen =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
      document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);

  var docElm = document.documentElement;
  if (!isInFullScreen) {
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

//draggable
let defineElem = function (ev) {
  firstElem = ev.target;
  var attr = $(firstElem).attr("mt");
  if (typeof attr !== "undefined" && attr !== false) {
    var loop = parseInt(attr);
    for (var n = 0; n < loop; n++) {
      firstElem = $(firstElem).parent().get(0);
    }
    console.log("got firstelem");
  }
};
let define$Elem = function (ev) {
  $elem = ev.target;
  var attr = $($elem).attr("mt");
  if (typeof attr !== "undefined" && attr !== false) {
    var loop = parseInt(attr);
    for (var n = 0; n < loop; n++) {
      $elem = $($elem).parent().get(0);
    }
  }
};
var paintVar;
var paintPauseDuration = 1500;
var groupID = new Date().getTime();
var firstElem = null;
var click = {
  x: 0,
  y: 0,
  threshold: 8,
};
let makeDraggable = function (tar, stay, resizeTar) {
  var audioTrackerDragger = new Hammer(tar.get(0));
  var isATDrag = false;
  tar.addClass("dragger");
  var lastATPosX, lastATPosY, lastRTX, lastRTY;
  var newRatio = stageRatio;
  audioTrackerDragger
    .get("pan")
    .set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });
  audioTrackerDragger.get("press").set({ time: 1 });
  audioTrackerDragger.on("press", function (ev) {
    defineElem(ev);
  });
  audioTrackerDragger.on("pressup", function (ev) {
    firstElem = null;
  });
  audioTrackerDragger.on("pan", function (ev) {
    if (firstElem == null) {
      console.log("no elem");
      defineElem(ev);
    }
    var elem = ev.target;
    if ($(elem).hasClass("dragger") && firstElem == null) {
      firstElem = elem;
    }

    //移動的本體
    if (
      firstElem &&
      $(firstElem).hasClass("dragger") &&
      !$(firstElem).hasClass("disable")
    ) {
      if (
        $(firstElem).parent().hasClass("widget") ||
        $(firstElem).parent().hasClass("canvas-board")
      ) {
        newRatio = stageRatio / stageRatioMain;
      } else {
        newRatio = stageRatio;
      }
      if (!isATDrag) {
        isATDrag = true;
        lastATPosX = firstElem.offsetLeft;
        lastATPosY = firstElem.offsetTop;
      }

      var posX = ev.deltaX / newRatio + lastATPosX;
      var posY = ev.deltaY / newRatio + lastATPosY;
      var dx = posX - parseFloat(firstElem.style.left);
      var dy = posY - parseFloat(firstElem.style.top);

      if (isATDrag) {
        firstElem.style.left = posX + "px";
        firstElem.style.top = posY + "px";
        //move as a group with same gid
        if ($(firstElem).hasClass("canvas")) {
          var dPos = [dx, dy];
          groupMoving($(firstElem), dPos);
        }
      }
    }
    //resizer
    if ($(firstElem).hasClass("resizer")) {
      if (!isATDrag) {
        newRatio = stageRatio / stageRatioMain;

        isATDrag = true;
        lastRTX = resizeTar.get(0).offsetLeft;
        lastRTY = resizeTar.get(0).offsetTop;
        lastRTW = resizeTar.width() / newRatio;
        lastRTH = resizeTar.height() / newRatio;
      }

      if (isATDrag) {
        if ($(firstElem).hasClass("rb")) {
          var ww = lastRTW + ev.deltaX / newRatio;
          var hh = lastRTH + ev.deltaY / newRatio;
        } else if ($(firstElem).hasClass("rt")) {
          var ww = lastRTW + ev.deltaX / newRatio;
          var hh = lastRTH - ev.deltaY / newRatio;
          resizeTar.css("top", lastRTY + ev.deltaY / newRatio);
        } else if ($(firstElem).hasClass("lb")) {
          var ww = lastRTW - ev.deltaX / newRatio;
          var hh = lastRTH + ev.deltaY / newRatio;
          resizeTar.css("left", lastRTX + ev.deltaX / newRatio);
        } else if ($(firstElem).hasClass("lt")) {
          var ww = lastRTW - ev.deltaX / newRatio;
          var hh = lastRTH - ev.deltaY / newRatio;
          resizeTar.css("left", lastRTX + ev.deltaX / newRatio);
          resizeTar.css("top", lastRTY + ev.deltaY / newRatio);
        }
        resizeTar.width(ww + "px");
        resizeTar.height(hh + "px");
      }
    }
    //ending
    if (ev.isFinal) {
      $(".resizer").removeAttr("style");
      //
      if ($(firstElem).hasClass("canvas")) {
        groupDeleting($(firstElem));
      } else {
        if (
          posX < 0 - ($(firstElem).width() / stageRatio) * 0.7 ||
          posX > 640 - ($(firstElem).width() / stageRatio) * 0.3 ||
          posY < 0 - ($(firstElem).height() / stageRatio) * 0.6 ||
          posY > 280 - ($(firstElem).height() / stageRatio) * 0.4
        ) {
          if (stay || !$(firstElem).hasClass("dragger")) {
          } else {
            if (
              $(firstElem).hasClass("audioTrack") &&
              $(firstElem).hasClass("active")
            ) {
              if (currentAudioTrack) {
                currentAudioTrack.pause();
              }
            }
            $(firstElem).remove();
          }
        }
      }

      isATDrag = false;
      firstElem = null;
    }
  });

  tar.removeAttr("id");
};

//canvas painting erasor
var pRatio = 4;
let erasorPainting = function (ev) {
  var _eraserWidth = 40;
  if (ev.isFinal) {
    $("#canvas-board .canvas").each(function (index) {
      if (isCanvasBlank($(this).find("canvas").get(0))) {
        $(this).remove();
      }
    });
  } else {
    $("#canvas-board .canvas").each(function (index) {
      var canv = $(this).find("canvas").get(0);
      var newPos = [
        ev.center.x - parseInt($(this).offset().left),
        ev.center.y - parseInt($(this).offset().top),
      ];
      var ctxx = canv.getContext("2d");
      var newZoomRatio = stageRatioReal / stageRatioMain;
      ctxx.clearRect(
        (newPos[0] * pRatio) / newZoomRatio - _eraserWidth / 2,
        (newPos[1] * pRatio) / newZoomRatio - _eraserWidth / 2,
        _eraserWidth,
        _eraserWidth
      );
    });
  }
};
/*Dennis update 2022/1/14 start*/
let groupMoving = function (tar, arrPos) {
  var tempGIDArr = tar.attr("gid").split(",");
  var tempGID = tempGIDArr[tempGIDArr.length - 1];
  var tarUID = tar.attr("uid");
  $("#canvas-board .canvas").each(function (index) {
    var tempGIDArrMe = $(this).attr("gid").split(",");
    var tempGIDMe = tempGIDArrMe[tempGIDArrMe.length - 1];
    if (tempGIDMe == tempGID && $(this).attr("uid") != tarUID) {
      $(this).get(0).style.left =
        parseFloat($(this).get(0).style.left) + arrPos[0] + "px";
      $(this).get(0).style.top =
        parseFloat($(this).get(0).style.top) + arrPos[1] + "px";
    }
  });
};

let groupDeleting = function (tar) {
  var groupMinX = 640;
  var groupMaxX = 0;
  var groupMinY = 320;
  var groupMaxY = 0;
  var tempGIDArr = tar.attr("gid").split(",");
  var tempGID = tempGIDArr[tempGIDArr.length - 1];
  console.log(tempGID);

  $("#canvas-board .canvas").each(function (index) {
    var tempGIDArrMe = $(this).attr("gid").split(",");
    var tempGIDMe = tempGIDArrMe[tempGIDArrMe.length - 1];
    if (tempGIDMe == tempGID) {
      var tx = parseInt($(this).get(0).style.left);
      var ty = parseInt($(this).get(0).style.top);
      var tw = parseInt($(this).get(0).style.width);
      var th = parseInt($(this).get(0).style.height);
      groupMinX = Math.min(tx, groupMinX);
      groupMaxX = Math.max(tx + tw, groupMaxX);
      groupMinY = Math.min(ty, groupMinY);
      groupMaxY = Math.max(ty + th, groupMaxY);
    }
  });
  //
  var groupW = parseInt(groupMaxX - groupMinX) / pRatio;
  var groupH = parseInt(groupMaxY - groupMinY) / pRatio;

  if (
    groupMinX < 0 - groupW * 0.2 ||
    groupMinX > 640 - groupW * 0.8 ||
    groupMinY < 0 - groupH * 0.2 ||
    groupMinY > 320 - groupH * 0.8
  ) {
    $("#canvas-board .canvas").each(function (index) {
      var tempGIDArrMe = $(this).attr("gid").split(",");
      var tempGIDMe = tempGIDArrMe[tempGIDArrMe.length - 1];
      if (tempGIDMe == tempGID) {
        $(this).remove();
      }
    });
    if ($("#canvas-board .canvas.selected").length > 0) {
      $("#cbg").fadeIn();
      $("#cba").fadeIn();
    } else {
      $("#cbg").hide();
      $("#cba").hide();
    }
  }
};

let groupSelect = function (tar) {
  var tempGIDArr = tar.attr("gid").split(",");
  var tempGID = tempGIDArr[tempGIDArr.length - 1];
  $("#canvas-board .canvas").each(function (index) {
    var tempGIDArrMe = $(this).attr("gid").split(",");
    var tempGIDMe = tempGIDArrMe[tempGIDArrMe.length - 1];
    if (tempGIDMe == tempGID) {
      $(this).toggleClass("selected");
      getHighestDepthCanvas($(this));
    }
  });

  if ($("#canvas-board .canvas.selected").length > 0) {
    $("#cbg").fadeIn();
    $("#cba").fadeIn();
  } else {
    $("#cbg").hide();
    $("#cba").hide();
  }
};

let groupCanvas = function () {
  var newGid = new Date().getTime();
  $("#canvas-board .canvas").each(function (index) {
    if ($(this).hasClass("selected")) {
      var tempGIDArrMe = $(this).attr("gid").split(",");
      tempGIDArrMe.push(newGid);
      $(this).attr("gid", tempGIDArrMe.join(",")).removeClass("selected");
    }
  });
  $("#cbg").hide();
  $("#cba").hide();
};
let apartCanvas = function () {
  $("#canvas-board .canvas").each(function (index) {
    if ($(this).hasClass("selected")) {
      var tempGIDArrMe = $(this).attr("gid").split(",");
      tempGIDArrMe.pop();
      if (tempGIDArrMe.length < 1) {
        var newGid = new Date().getTime();
        $(this)
          .attr("gid", newGid + index)
          .removeClass("selected");
      } else {
        $(this).attr("gid", tempGIDArrMe.join(",")).removeClass("selected");
      }
    }
  });
  $("#cbg").hide();
  $("#cba").hide();
};
/*Dennis update 2022/1/14 end*/

let isCanvasBlank = function (canvas) {
  var context = canvas.getContext("2d");
  var pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );

  return !pixelBuffer.some((color) => color !== 0);
};

//sizer
var firstSizerElem = null;
let adjustSizer = function () {
  var sizerElement = new Hammer($("#root").get(0));
  var isMainDrag = false;
  var lastMainPosX, lastMainPosY, lastWidgetPosX, lastWidgetPosY;
  sizerElement
    .get("pan")
    .set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });
  sizerElement.get("press").set({ time: 2 });
  sizerElement.on("press", function (ev) {
    firstSizerElem = ev.target;
  });
  sizerElement.on("pressup", function (ev) {
    firstSizerElem = null;
  });

  sizerElement.on("pan", function (ev) {
    var elem;
    //移動的本體

    if (
      ($(firstSizerElem).parent().hasClass("main") ||
        $(firstSizerElem).parent().parent().hasClass("main") ||
        $(firstSizerElem).hasClass("main") ||
        $(firstSizerElem).hasClass("root")) &&
      !$("#sizer").hasClass("lock")
    ) {
      elem = $("#main").get(0);
      if (!isMainDrag) {
        isMainDrag = true;
        lastMainPosX = elem.offsetLeft;
        lastMainPosY = elem.offsetTop;
      }
      var posX = (ev.deltaX / stageRatio) * stageRatioMain + lastMainPosX;
      var posY = (ev.deltaY / stageRatio) * stageRatioMain + lastMainPosY;
      var rangeX = Math.abs((640 * (stageRatioMain - 1)) / 2);
      var rangeY = Math.abs((360 * (stageRatioMain - 1)) / 2);
      if (posX > rangeX) {
        posX = rangeX;
      } else if (posX < rangeX * -1) {
        posX = rangeX * -1;
      }
      if (posY > rangeY) {
        posY = rangeY;
      } else if (posY < rangeY * -1) {
        posY = rangeY * -1;
      }

      elem.style.left = posX + "px";
      elem.style.top = posY + "px";
    } else if ($(firstSizerElem).hasClass("sizer_dragger")) {
      if (!isMainDrag) {
        isMainDrag = true;
        lastMainPosY = firstSizerElem.offsetTop;
        $("#sizer").removeClass("lock");
      }
      var posY = (ev.deltaY / stageRatio) * stageRatioMain + lastMainPosY;
      posY = Math.min(40, posY);
      posY = Math.max(0, posY);
      firstSizerElem.style.top = posY + "px";
      //sizing
      stageRatioMain = 1 * (posY / 40) + 1;
      stageRatioReal = stageRatioRoot * stageRatioMain;
      stageRatio = Math.floor(stageRatioReal * 10) / 10;

      $("#sizer_dragger").text("x " + Math.round(stageRatioMain * 10) / 10);

      //
      $("#main").css(
        "-ms-transform",
        "scale(" + stageRatioMain + "," + stageRatioMain + ")"
      );
      $("#main").css(
        "-webkit-transform",
        "scale(" + stageRatioMain + "," + stageRatioMain + ")"
      );
      $("#main").css(
        "transform",
        "scale(" + stageRatioMain + "," + stageRatioMain + ")"
      );

      var rangeX = Math.abs((640 * (stageRatioMain - 1)) / 2);
      var rangeY = Math.abs((360 * (stageRatioMain - 1)) / 2);
      var sX = parseInt($("#main").get(0).style.left);
      var sY = parseInt($("#main").get(0).style.top);
      if (sX > rangeX) {
        $("#main").get(0).style.left = rangeX + "px";
      } else if (sX < rangeX * -1) {
        $("#main").get(0).style.left = rangeX * -1 + "px";
      }
      if (sY > rangeY) {
        $("#main").get(0).style.top = rangeY + "px";
      } else if (sY < rangeY * -1) {
        $("#main").get(0).style.top = rangeY * -1 + "px";
      }
    }

    //ending
    if (ev.isFinal) {
      isMainDrag = false;
      firstSizerElem = null;
      if (
        $("#sizer_dragger").text() == "x 1" &&
        !$("#sizer").hasClass("lock")
      ) {
        defaultSizer();
      }
    }
  });
};

let defaultSizer = function () {
  //reset sizer
  $("#sizer").show().addClass("lock");
  $("#sizer_dragger").text("x 1");
  $("#sizer_dragger").get(0).style.top = 0;
  stageRatioMain = 1;
  stageRatioReal = stageRatioRoot * stageRatioMain;
  stageRatio = Math.floor(stageRatioReal * 10) / 10;
  $("#main")
    .addClass("autoMoving")
    .css("-ms-transform", "scale(1,1)")
    .css("top", 0)
    .css("left", 0);
  $("#main")
    .addClass("autoMoving")
    .css("-webkit-transform", "scale(1,1)")
    .css("top", 0)
    .css("left", 0);
  $("#main")
    .addClass("autoMoving")
    .css("transform", "scale(1,1)")
    .css("top", 0)
    .css("left", 0);
  $("#main")
    .delay(600)
    .queue(function () {
      $(this).removeClass("autoMoving").dequeue();
    });
};

//共用音效控制
let $chimes = new Audio("./sfx/chimes.mp3");
let $tryagain = new Audio("./sfx/tryagain.mp3");
let $stupid = new Audio("./sfx/stupid.mp3");
let $show = new Audio("./sfx/show.mp3");
let $bouncing = new Audio("./sfx/bouncing.mp3");
let $help = new Audio("./sfx/help.mp3");
let $pop = new Audio("./sfx/pop.mp3");
let $click = new Audio("./sfx/click.mp3");
let $surprise = new Audio("./sfx/surprise.mp3");
let $water = new Audio("./sfx/water.mp3");
let $good = new Audio("./sfx/good.mp3");

//combine
var sfxLowLagged = 0;
let $SFXAr = [
  $chimes,
  $tryagain,
  $stupid,
  $show,
  $bouncing,
  $help,
  $pop,
  $click,
  $surprise,
  $water,
  $good,
];
let $SFXNameAr = [
  "chimes",
  "tryagain",
  "stupid",
  "show",
  "bouncing",
  "help",
  "pop",
  "click",
  "surprise",
  "water",
  "good",
];
for (let k = 0; k < $SFXAr.length; k++) {
  $SFXAr[k].preload = "auto";
}
function lowlagSFX() {
  console.log("lowlagSFX start");
  for (let k = sfxLowLagged; k < $SFXAr.length; k++) {
    lowLag.load([$SFXAr[k].src], $SFXNameAr[k]);
  }
  console.log("lowlagSFX end");
}
//需用開始紐觸發
function activeSFX() {
  if (!isIE()) {
    for (let k = sfxLowLagged; k < $SFXAr.length; k++) {
      $SFXAr[k].play();
      $SFXAr[k].pause();
      sfxLowLagged += 1;
    }
  } else {
    for (let k = sfxLowLagged; k < $SFXAr.length; k++) {
      sfxLowLagged += 1;
    }
  }
  console.log("lowlag end at:" + sfxLowLagged);
}

function rootSoundEffectName($name, $showplayer, st, et) {
  resetAudio();
  //
  var aID = -1;
  var gotAudio = false;
  for (let k = 0; k < $SFXNameAr.length; k++) {
    if ($name == $SFXNameAr[k]) {
      currentAudio = $SFXAr[k];
      aID = k;
      gotAudio = true;
    }
  }
  if (!gotAudio) {
    console.log("沒有音檔:" + $name);
  }

  currentAudio.pause();
  currentAudio.currentTime = 0;
  if (st) {
    currentAudio.currentTime = st;
  }
  console.log("play:" + aID);

  if (isNaN(currentAudio.duration)) {
    console.log("Error:no internet or no audio file loaded.");
    console.log("Process:reload audio");
    var tempAudio = new Audio($SFXNameAr[aID]);
    $SFXAr[aID] = tempAudio;
    lowLag.load([tempAudio.src], $SFXNameAr[aID]);
    currentAudio = tempAudio;
  } else {
    console.log("audio duration:" + currentAudio.duration);
  }
  currentAudio.play();
  console.log("ie");

  if ($showplayer) {
    loadPlayer();
    $(currentAudio)
      .unbind()
      .on("timeupdate", function () {
        playerGotoPosition();
      })
      .on("ended", function () {
        playerAudioEnd();
      });
  } else {
    if (et) {
      $(currentAudio)
        .unbind()
        .on("timeupdate", function () {
          if (currentAudio.currentTime >= et) {
            currentAudio.pause();
          }
        })
        .on("ended", function () {
          console.log("force end");
        });
    }
  }
}

function rootSoundEffect($tar) {
  for (let k = 0; k < $SFXAr.length; k++) {
    if ($tar == $SFXAr[k]) {
      if (isNaN($tar.duration)) {
        console.log("Error:no internet or no audio file loaded.");
        console.log("Process:reload audio");
        var tempAudio = new Audio($SFXNameAr[k]);
        $SFXAr[k] = tempAudio;
        lowLag.load([tempAudio.src], $SFXNameAr[k]);
        $tar = tempAudio;
      } else {
        console.log("audio duration:" + $tar.duration);
      }
      if (isIE()) {
        $tar.pause();
        $tar.currentTime = 0;
        $tar.play();
        console.log("ie");
      } else {
        lowLag.change($SFXNameAr[k], false);
        lowLag.stop();
        lowLag.play();
        console.log("non-ie");
      }
    }
  }
}

function resetPanel() {
  $("#masker").remove();
  $("#panel").remove();
  $("#zoomSensor").remove();
  $("#painting").remove();
}
function resetGlock() {
  $("#glock").remove();
}
function resetAudio() {
  $("#player").remove();
  lowLag.stop();
  if (currentAudio) {
    currentAudio.pause();
  }
}

// system funcs
let isIE = function () {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
};

let is_iPhone_or_iPad = function () {
  return (
    navigator.platform.indexOf("iPhone") != -1 ||
    navigator.platform.indexOf("iPad") != -1
  );
};

var isMobile = function () {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

let getUrlParameter = function getUrlParameter(sParam) {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

let resizeScreen = function () {
  let keying = false;
  $("input").each(function (index) {
    if ($(this).is(":focus")) {
      keying = true;
    }
  });

  if (!keying) {
    autofitScreen();
    setTimeout(function () {
      autofitScreen();
    }, 500);
    setTimeout(function () {
      autofitScreen();
    }, 1500);
  }

  //
  if ($(".btn_brush").hasClass("active")) {
    $(".btn_brush").click();
  }
};

let counter = 20;
let checkCompLoading = function (elem) {
  counter -= 1;
  let total = $(elem).find("> .assetsPreload").find("img").length;
  let imgGot = 0;
  console.log(counter);
  $(elem)
    .find("> .assetsPreload")
    .find("img")
    .each(function (index) {
      //console.log("w:"+$(this).width());
      if ($(this).width() * $(this).height() > 0) {
        imgGot += 1;
      }
    });
  //console.log("perc:"+imgGot/total);
  if (imgGot / total >= 1 || counter < 0 || total == 0) {
    counter = 20;
    $("#loading p").text("Ready");

    //是否有loading effect
    if ($loadType != "") {
      $(elem)
        .delay(1000)
        .queue(function () {
          activeLoading();
          $(elem).dequeue();
          //
          $(elem).trigger("compLoaded");
        });
    } else {
      $(elem).trigger("compLoaded");
    }
  } else {
    setTimeout(function () {
      checkCompLoading(elem);
    }, 100);
    $("#loading p").text(Math.ceil((100 * imgGot) / total) + "%");
  }
};

//等待載入
$loadType = "";
let activeLoading = function () {
  $("#loading p").text("");
  let typeString = "spinIn";
  $("#loading")
    .removeClass()
    .addClass("loading " + typeString);
  $("#loading")
    .unbind()
    .bind("dblclick", function () {
      deactiveLoading();
    });
};
/*Dennis update 2022/1/14 start*/
let removeBR = function (str) {
  console.log(str);
  var arr = str.split(/<br\s*\/?>/);
  if (isitEmpty(arr[0])) {
    res = arr[0] + arr.slice(1).join("<br>");
  } else {
    res = str;
  }

  return res;
};
/*Dennis update 2022/1/14 end*/

let deactiveLoading = function () {
  $("#loading").dequeue();
  $("#loading").clearQueue();
  $("#loading").removeClass().addClass("loading");
};

let formatIOSDate = function (str) {
  let iosDate = str.toString();
  iosDate = iosDate.replace("-", "/");
  iosDate = iosDate.replace("-", "/");
  //console.log("xxx:"+iosDate);
  return iosDate;
};

let openNewWindow = function (url) {
  //var a = $('a')[0];
  let a = $("<a href='" + url + "' target='_blank'>geo</a>").get(0);
  let e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  a.dispatchEvent(e);
};

let backToGEO = function () {
  let logoutConfirm = confirm("Log out now？");

  if (logoutConfirm) {
    $.ajax({
      type: "GET",
      url: "/ws/ws_get.asmx/MemberLogout",
      data: { token: uToken },
      async: false,
      contentType: "application/json; charset=utf-8",
      timeout: 10000,
      cache: false,
      dataType: "xml",
      success: function (data) {
        console.log(data);
        let code = $(data).find("code").first().text();
        let msg = $(data).find("msg").first().text();
        if (code == "0" || code == 0) {
          window.location.reload();
        } else {
          alert(msg);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        alert(thrownError);
      },
    });
  }
};

var getHighestDepthWidget = function (tar) {
  var nextZIndex = parseInt($("#widget").attr("zindex"));
  var curZIndex = parseInt(tar.css("z-index"));
  if (curZIndex != nextZIndex) {
    nextZIndex += 1;
    tar.css("z-index", nextZIndex);
    $("#widget").attr("zindex", nextZIndex);
    $("#canvas-board").attr("zindex", nextZIndex);
  }
};

/*Dennis update 2022/1/14 start*/
var getHighestDepthCanvas = function (tar) {
  var nextZIndex = parseInt($("#canvas-board").attr("zindex"));
  var curZIndex = parseInt(tar.css("z-index"));
  if (curZIndex != nextZIndex) {
    nextZIndex += 1;
    var tempGIDArr = tar.attr("gid").split(",");
    var tempGID = tempGIDArr[tempGIDArr.length - 1];
    $("#canvas-board .canvas").each(function (index) {
      var tempGIDArrMe = $(this).attr("gid").split(",");
      var tempGIDMe = tempGIDArrMe[tempGIDArrMe.length - 1];
      if (tempGIDMe == tempGID) {
        $(this).css("z-index", nextZIndex);
      }
    });
    $("#canvas-board").attr("zindex", nextZIndex);
  }
};
/*Dennis update 2022/1/14 end*/
let showError = function (msg) {
  alert(msg);
};

//
window.onload = function () {
  //
  if (!isIE()) {
    lowLag.init();
    lowlagSFX();
    activeSFX();
  }
  resizeScreen();
};
