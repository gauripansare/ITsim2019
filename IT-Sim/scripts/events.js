

$(document).on("mouseover", ".qheight", function (event) {
    $(this).css({
        "font-weight": "bold"
    });
    $(this).children(".question_icon").children("span").css({
        "background-color": "#003058",
        "color": "#F9FF00"
    });

});
$(document).on("mouseout", ".qheight", function (event) {
    $(".qheight").css({
        "background-color": "",
        "font-weight": "normal"
    })
    $(".question_icon").children("span").css({
        "background-color": "",
        "color": ""
    });
    $(this).css({
        "background-color": "#f1f1f1",
        "font-weight": "bold"
    });
    $(this).children(".question_icon").children("span").css({
        "background-color": "#003058",
        "color": "#F9FF00"
    });

});
$(document).on("click", ".qheight", function (event) {
    $(".qheight").removeClass("optionselected");

    $(this).addClass("optionselected");

});
var hotspotclicked = false;;
var hotspot;
$(document).on("click", ".divHotSpot", function (event) {
    debugger;
    if (hotspotclicked || _Navigator.IsAnswered())
        return;
    hotspotclicked = true;
    $(this).addClass("hotspotclicked")
    hotspot = $(this);
    setTimeout(function () {
        hotspotclicked = false;
        _ModuleCommon.HotspotClick(hotspot, event);
       
    },400)
    return;
});

$(document).ready(function () {
    $("*").dblclick(function (e) {
        e.preventDefault();
    });

});
$(document).on("click", ".hintlink", function (event) {
    debugger;
    if ($(this).hasClass("expanded")) {
        $(".hintlink").removeClass("expanded")
        $(".hintlink").attr("aria-expanded", "false")
        $(".hintcontainer").slideUp(100);

    }
    else {
        $(".hintcontainer").slideDown(100, function () {
            $(".hintlink").addClass("expanded");
            $(".hintlink").attr("aria-expanded", "true");
        });
    }

});
$(document).on("click", ".closehintlink", function (event) {

    $(".hintlink").removeClass("expanded")
    $(".hintlink").attr("aria-expanded", "false")
    $(".hintcontainer").slideUp(100);


});
$(document).on("keydown", "input.EmbededElement", function (event) {
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    }
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        _ModuleCommon.InputEnter($(this));
    }
});

$(window).resize(function () {
    _ModuleCommon.OrientationChange();
});

$(window).resize(function () {


});

$(document).on('click', ".activityimg", function (event) {
    _ModuleCommon.AddEditPropertiesClick(event);
});


$(document).on('click', ".start-btn", function (event) {
    _Navigator.Next();
});
$(document).on('click', "#submitbtn", function (event) {
    debugger;
    _ModuleCommon.OnSubmit();
});
$(document).on('click', "#continuebtn", function (event) {
    _ModuleCommon.OnContinue();
});


$(document).on('change', "input[type='checkbox']", function (event) {
    _ModuleCommon.EnableSubmit();
});
$(document).on('change', "input[type='radio']", function (event) {
    _ModuleCommon.EnableSubmit();
});

$(document).on('click', "input[type='radio']", function (event) {
    $('input[type="radio"]:checked').addClass('beforeClass');
});

$(document).on('change', "input[type='checkbox']", function (event) {
    if ($(this).prop("checked") == true) {
        $(this).closest("label").css({ "font-weight": "bold" })
    }
    else
    {
        $(this).closest("label").css({ "font-weight": "normal" })
    }
});




