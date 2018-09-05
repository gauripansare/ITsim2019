jQuery.fn.extend({
    k_enable: function () {
        return this.removeClass('disabled').attr("aria-disabled", "false").removeAttr("disabled");
    },
    k_disable: function () {
        return this.addClass('disabled').attr("aria-disabled", "true").attr("disabled", "disabled");
    },
    k_IsDisabled: function () {
        if (this.hasClass('disabled')) { return true; } else { return false; }
    }
});
var _ModuleCommon = (function () {
    var reviewData = [];
    return {
        EnableNext: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (currentPageData.nextPageId != undefined && currentPageData.nextPageId != "") {
                $("#linknext").k_enable();
            }
        },
        GetPageReviewData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (reviewData != undefined && reviewData.length > 0) {
                for (var i = 0; i < reviewData.length; i++) {
                    if (reviewData[i].pageId == currentPageData.pageId) {
                        return reviewData[i];
                    }
                }
            }

        },
        GetPageDetailData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = _PData[currentPageData.pageId];
            return pageData;
        },
        ShowFeedbackReviewMode: function () {
            var pageData = this.GetPageDetailData();
            var reviewData = this.GetPageReviewData();
            var fdkurl = "";
            if (pageData != undefined && reviewData != undefined) {
                fdkurl = reviewData.fdkurl;
                //if (reviewData.isCorrect == true)
                //    fdkurl = _Settings.dataRoot + "feedbackdata/" + pageData.correctfeedback;
                //else
                //    fdkurl = _Settings.dataRoot + "feedbackdata/" + pageData.incorrectfeedback1;
                $("#div_feedback").show();
                $("#div_feedback").css("display", "inline-block");
                $("#div_feedback .div_fdkcontent").load(fdkurl, function () {
                    this.SetFeedbackTop()
                    $("body").animate({
                        scrollTop: $(document).height()
                    }, 1000);
                });
            }
        },
        DisplayUserReviewMode: function () {
            $("input").k_disable();
            this.DisplayCheckboxCorrectIncorrect();
            this.ShowFeedbackReviewMode();

        },
        DisplayCheckboxCorrectIncorrect: function () {
            var pageDetailData = this.GetPageDetailData();
            var pageReviewData = this.GetPageReviewData();

            if (reviewData != undefined) {
                if (pageDetailData.radio == pageReviewData.radio) {

                    $("#" + pageDetailData.radio).before(' <i class="fa radio-fa-check fa-check" style="font-size:15px;color:green;"></i>');
                    $("#" + pageDetailData.radio).addClass("correct");
                }
                else {
                    $('input[type="radio"]:checked').closest("label").find("span").addClass("without-before")
                    $("#" + pageReviewData.radio).before(' <i class="fa radio-fa-check-incorrect fa-times" style="font-size:20px;color:red"></i>');
                    $("#" + pageReviewData.radio).addClass("incorrect");
                    $("#" + pageDetailData.radio).before(' <i class="fa radio-fa-check fa-check" style="font-size:15px;color:green;"></i>');
                    $("#" + pageDetailData.radio).addClass("correct");
                }

                for (var i = 0; i < pageReviewData.checkbox.length; i++) {
                    if (pageDetailData.checkbox.indexOf(pageReviewData.checkbox[i]) >= 0) {
                        $(".checkmark").hide();
                        $("#" + pageReviewData.checkbox[i]).after(' <i class="fa fa-check" style="font-size:20px;color:green;"></i>');
                        $("#" + pageReviewData.checkbox[i]).addClass("correct");
                        $("#" + pageReviewData.checkbox[i]).closest("label").css({ "font-weight": "bold" })
                    }
                    else {
                        $(".checkmark").hide();
                        $("#" + pageReviewData.checkbox[i]).after(' <i class="fa fa-times" style="font-size:20px;color:red"></i>');
                        $("#" + pageReviewData.checkbox[i]).addClass("incorrect");
                        $("#" + pageReviewData.checkbox[i]).closest("label").css({ "font-weight": "bold" })
                    }
                    $("#" + pageReviewData.checkbox[i]).closest("label").find(".checkmark").removeClass("checkmark");
                }
                for (var i = 0; i < pageDetailData.checkbox.length; i++) {
                    if ($("#" + pageDetailData.checkbox[i]).closest("label").find(".checkmark").length > 0) {
                        $("#" + pageDetailData.checkbox[i]).after(' <i class="fa fa-check" style="font-size:20px;color:green;"></i>');
                        $("#" + pageDetailData.checkbox[i]).closest("label").find(".checkmark").removeClass("checkmark");
                    }
                }
            }
        },
        DisplayChecklistCorrectIncorrect: function () {
            var chkboxarray = $("input[type='checkbox']:checked").map(function () {
                return $(this).attr("id");
            }).get();
            var pageDetailData = this.GetPageDetailData();
            var radio = $("input[type='radio']:checked").attr("id")
            correctcnt = 0;
            if (pageDetailData.radio == radio) {
                $("#" + pageDetailData.radio).before(' <i class="fa radio-fa-check fa-check" style="font-size:15px;color:green;"></i>');
                $("#" + pageDetailData.radio).addClass("correct");
            }
            else {
                $('input[type="radio"]:checked').closest("label").find("span").addClass("without-before")
                $("#" + radio).before(' <i class="fa radio-fa-check-incorrect fa-times" style="font-size:20px;color:red"></i>');
                $("#" + radio).addClass("incorrect");
            }

            for (var i = 0; i < chkboxarray.length; i++) {
                if (pageDetailData.checkbox.indexOf(chkboxarray[i]) >= 0) {
                    $("#" + chkboxarray[i]).after(' <i class="fa fa-check" style="font-size:20px;color:green;"></i>');
                    $("#" + chkboxarray[i]).addClass("correct");
                    correctcnt++;
                }
                else {
                    $("#" + chkboxarray[i]).after(' <i class="fa fa-times" style="font-size:20px;color:red"></i>');
                    $("#" + chkboxarray[i]).addClass("incorrect");
                }

                $("#" + chkboxarray[i]).closest("label").find(".checkmark").removeClass("checkmark");
            }
            
            this.Applycss(); 
        },
        OnPageLoad: function () {

            //this.ApplycontainerWidth();
            $("#div_feedback").hide();
            if (_Navigator.IsAnswered() && !_Navigator.GetCurrentPage().isStartPage) {
                this.DisplayUserReviewMode();
            }
        },
        Applycss: function(){
            debugger
            var isIE11version = !!navigator.userAgent.match(/Trident.*rv\:11\./);
            if (/Edge/.test(navigator.userAgent) || isIE11version ) {   
                $('input[type="radio"]:checked').closest("label").find(".radio-fa-check").css("bottom", "7px")
            }
        },
        EnableSubmit: function () {
            var pageData = this.GetPageDetailData();
            if ($("input[type='checkbox']:checked").length > 0 && $("input[type='checkbox']:checked").length == pageData.checkbox.length && $("input[type='radio']:checked").length) {
                $("#submitbtn").k_enable();
            }
            else {
                $("#submitbtn").k_disable();
            }
        },
        CalculateScore: function () {
            var pageData = this.GetPageDetailData();
            var score = 0;
            if ($("input[type='radio']:checked").attr("id") == pageData.radio) {
                score += 1;
            }
            var chkboxarray = $("input[type='checkbox']:checked").map(function () {
                return $(this).attr("id");
            }).get();

            for (var i = 0; i < chkboxarray.length; i++) {
                if (pageData.checkbox.indexOf(chkboxarray[i]) >= 0) {
                    score += 1;
                }
            }
            return score

        },
        OnSubmit: function () {
            var pageData = this.GetPageDetailData();
            var fdbkUrl = "";
            _Navigator.IncrementCounter();
            if ($("input[type='radio']:checked").attr("id") == pageData.radio) {                
                $('input[type="radio"]:checked').closest("label").find("span").addClass("without-before")
                if (this.CalculateScore() == 3) {
                    fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.correctfeedback;
                }
                else 
                {
                    if (_Navigator.GetCounter() == 1) {
                        fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.partialfeedback1;
                        this.DisplayChecklistCorrectIncorrect();
                    }
                    else {
                        fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.partialfeedback;
                    }
                }
                if (this.CalculateScore() == 3 || _Navigator.GetCounter() > 1) {
                    $("#" + pageData.radio).attr("checked", "checked");
                    this.AddReviewData(true, fdbkUrl);
                    this.DisplayCheckboxCorrectIncorrect();
                    _Navigator.SetPageScore(this.CalculateScore())
                    _Navigator.SetPageStatus(true);
                    this.EnableNext();
                }
               
            }
            else {
                
                if (_Navigator.GetCounter() == 1) {
                    this.AddReviewData(false);
                    this.DisplayChecklistCorrectIncorrect();
                    fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.incorrectfeedback;
                }
                else {
                    fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.incorrectfeedback1;
                    this.AddReviewData(false, fdbkUrl);
                    this.DisplayCheckboxCorrectIncorrect();
                    _Navigator.SetPageScore(this.CalculateScore())
                    _Navigator.SetPageStatus(true);
                    this.EnableNext();
                }
            }
            $("#div_feedback").show();
            $("input").k_disable();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });

        },
        OnContinue: function () {
            $('input[type="checkbox"].incorrect').closest("label").find("span").removeClass("without-before");          
            $('input[type="checkbox"].incorrect').closest("label").css({ "font-weight": "normal" })
            $("input[type='checkbox']:not(.correct)").k_enable();
            $("input[type='checkbox']:not(.correct)").removeAttr("checked");
            $("input[type='checkbox']:not(.correct)").closest("label").find("span").addClass("checkmark")
            $("input[type='checkbox']:not(.correct)").closest("label").find("i").remove();

            if (!$('input[type="radio"]:checked').hasClass("correct")) {
                $('input[type="radio"]:checked').closest("label").find("span").removeClass("without-before")
                $('input[type="radio"]:checked').closest("label").find("i").remove();
                $("input[type='radio']").k_enable();
                $("input[type='radio']").removeAttr("checked");
            }
           
            $("#div_feedback .div_fdkcontent").html("");
            $("#div_feedback").hide();
            $('html,body').animate({ scrollTop: document.body.scrollHeigh }, 500, function () { });
        },
        AddReviewData: function (isCorrect,fdkurl) {
            var pageData = this.GetPageDetailData();
            var currentPageData = _Navigator.GetCurrentPage();
            var found = false;
            var index = 0;
            for (var i = 0; i < reviewData.length; i++) {
                if (currentPageData.pageId == reviewData[i].pageId) {
                    index = i;
                    found = true;
                    break;
                }
            }
            if (found) {
                reviewData[i].radio = $("input[type='radio']:checked").attr("id")
                reviewData[i].checkbox = $("input[type='checkbox']:checked").map(function () {
                    return $(this).attr("id");
                }).get();
                reviewData[i].isCorrect = isCorrect;
                reviewData[i].fdkurl = fdkurl;
            }
            else {
                var obj = {};
                obj.pageId = currentPageData.pageId;
                obj.radio = $("input[type='radio']:checked").attr("id");
                obj.checkbox = $("input[type='checkbox']:checked").map(function () {
                    return $(this).attr("id");
                }).get();
                obj.isCorrect = isCorrect;
                obj.fdkurl = fdkurl;
                reviewData.push(obj)
            }
        },

        ApplycontainerWidth: function () {
            debugger;
            var innerWidth = $(window).width();

            $("#header-title img").attr("src", "assets/images/logo.png")

            if (innerWidth < 850) {
                if ($(".activityContainer").find(".activityimg").length > 0) {
                    var marginleft = $(".intro-content:first").css("margin-left");
                    marginleft = marginleft.substring(0, marginleft.indexOf("px"))

                    var imgcntwidth = innerWidth - (marginleft * 2);
                    $(".activity").css({ "width": imgcntwidth + "px" })
                }
                if (innerWidth <= 500) {
                    $("#header-title img").attr("src", "assets/images/pearson-logo-v1.png")
                }
            }
            else {
                $(".activity").css({ "width": "auto" })
            }

        },
        OrientationChange: function () {
            this.ApplycontainerWidth();
        },
        SetFeedbackTop: function () {
            var ptop = Number($("#div_feedback").position().top);
            var pheight = Number($("#div_feedback").outerHeight());
            var pdiff = (_Settings.minHeight + _Settings.topMargin) - (ptop + pheight);
            if (pdiff > 0) {
                $("#div_feedback").css("margin-top", (pdiff + 35) + "px");
            }
        },

    }
})();
$(document).ready(function () {
    debugger;
    _Navigator.Start();
    $("h1:first").focus();

    //if (_Settings.enableCache) {
    //    _Caching.InitAssetsCaching();
    //    _Caching.InitPageCaching();
    //}
    $('body').attr({ "id": "thebody", "onmousedown": "document.getElementById('thebody').classList.add('no-focus');", "onkeydown": "document.getElementById('thebody').classList.remove('no-focus');" })
});