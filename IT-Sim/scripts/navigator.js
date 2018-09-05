//This api will contain navigation logic and page load.
//It will also handle the question navigation if the page is having multiple questions.
var _Navigator = (function () {
    var _currentPageId = "";
    var _currentPageObject = {};
    var progressLevels = [3];
    var totalsimscore = 6;
    var submitCounter = 0;
    var _NData = {
        "p1": {
            pageId: "p1",
            prevPageId: "",
            nextPageId: "p2",
            dataurl: "p1.htm",
            isStartPage: true,
            ansSet: ["Needs access to Office software for presenting reports, presentations, number crunching, and/ or access to databases", "Needs a powerful system for processing data and numbers"],
            isAnswered: true,
        },
        "p2": {
            pageId: "p2",
            prevPageId: "p1",
            nextPageId: "p3",
            dataurl: "p2.htm",
            hinturl: "hintp2.htm",
            hasActivity: true,


        },
        "p3": {
            pageId: "p3",
            prevPageId: "p2",
            nextPageId: "",
            dataurl: "p3.htm",
            hinturl: "hintp3.htm",
            hasActivity: true,
            isLastPage: true

        }
    }
    var _StateData = {}

    function OnPageLoad() {

        $(".hintcontainer").hide()
        $(".hintlink").removeClass("expanded");
        $(".hintlink").attr("aria-expanded", "false")
        $("#header-title h1").show()
        $("#header-title").removeClass("startpage");
        if (_currentPageObject.isStartPage != undefined && _currentPageObject.isStartPage) {
            $("#header-title h1").hide()
            $("#header-title").addClass("startpage");
        }
        _ModuleCommon.OnPageLoad();
        submitCounter = 0;
    }
    return {
        Get: function () {
            return _NData;
        },
        Start: function () {
            this.LoadPage("p1");
        },
        LoadPage: function (pageId, jsonObj) {
            debugger;
            if (jsonObj == undefined) {
                jsonObj = {};
            }
            _currentPageId = pageId;
            this.UpdateProgressBar();
            _currentPageObject = _NData[_currentPageId]
            $("#header-progress").show();
            $("#header-title").show();
            $("footer").show();

            if (_currentPageObject.isStartPage != undefined && _currentPageObject.isStartPage) {
                $("#linkprevious").k_disable();
                $("#linknext").k_enable();
                $("footer").hide();
                $("#header-progress").hide();

            }
            if (_currentPageObject.hasActivity != undefined && _currentPageObject.hasActivity && !this.IsAnswered()) {
                $("#linknext").k_disable();
                $('#submitbtn').k_disable();
            }
            if (this.IsAnswered()) {
                $("#linknext").k_enable();

            }
            if (_currentPageObject.isLastPage != undefined && _currentPageObject.isLastPage) {
                $("#linknext").k_disable();
            }
            
            _currentPageObject.isVisited = true;

            var pageUrl = _Settings.dataRoot + _currentPageObject.dataurl + _Caching.GetUrlExtension();;
            if (_currentPageObject.isStartPage) {
                $(".main-content").load(pageUrl, function () {
                    OnPageLoad();
                    $("h1").focus();
                });
            } else {
                $(".main-content").fadeTo(250, 0.25, function () {
                    $(".main-content").load(pageUrl, function () {
                        $(this).fadeTo(600, 1)
                        OnPageLoad();
                        if (_currentPageObject.hasActivity != undefined && _currentPageObject.hasActivity && !_Navigator.IsAnswered()) {
                            $('#submitbtn').k_disable();
                        }
                        $(".hintcontent").load("pagedata/hintdata/" + _currentPageObject.hinturl, function () { });

                        $("h2.pageheading").focus();
                    });
                })
            }
        },
        LoadDefaultQuestion: function () {
            if (_currentPageObject.questions.length > 0) {
                _questionId = 0;
                _currentPageObject.questions[0].isQuestionVisit = true;
                for (var i = 0; i < _currentPageObject.questions.length; i++) {
                    if (_currentPageObject.questions[i].isCurrent) {
                        _questionId = i;
                    }
                }
                //second parameter is to disable question effect.
                _Question.Load(_currentPageObject.questions[_questionId], {
                    disableEffect: true
                });
            }
        },
        Prev: function () {
            this.LoadPage(_currentPageObject.prevPageId);
        },
        Next: function () {
            $("#linkprevious").k_enable();
            if (_currentPageObject.customNext != undefined && !_currentPageObject.customNext.isComplete) {
                var custFunction = new Function(_currentPageObject.customNext.jsFunction);
                custFunction();
            }
            else {

                this.LoadPage(_currentPageObject.nextPageId);
            }
        },
        GetProgressData: function () {
            var visitpage = 0;
            for (var i in _NData) {
                if (_NData[i].isAnswered != undefined && (_NData[i].isAnswered == true)) {
                    visitpage++;
                }
            }
            return visitpage;
        },
        UpdateProgressBar: function () {
            var progData = this.GetProgressData();
            var lprog_pecent = (progData * 100 / progressLevels[0]).toFixed(0);
            $(".progressDiv").text("Progress: " + lprog_pecent + "%");
            $(".progressFg").css("width", lprog_pecent + "%");

        },
        GetCurrentPage: function () {
            return _currentPageObject;
        },
        CompletePage: function (extendedJson) {
            _currentPageObject.IsComplete = true;
            _currentPageObject = $.extend(true, _currentPageObject, extendedJson)
            _StateData[_currentPageObject.pageId] = $.extend(true, {}, _currentPageObject);
        },
        GetTotalScore: function () {
            var ObtainPoint = 0;

            for (var i in _NData) {
                if (_NData[i].points > 0) {
                    ObtainPoint += _NData[i].points
                }
            }
            var score = (ObtainPoint / totalsimscore) * 100;
            return score.toFixed(0);
        },
        UpdateScore: function () {
            var percScore = this.GetTotalScore()
            $("#scorediv").html("Score: " + percScore + "%");
        },
        SetPageScore: function (points) {
            if (!_currentPageObject.isAnswered) {
                _NData[_currentPageId].points = points;
                this.UpdateScore();
            }
        },
        SetPageStatus: function (isAnswered) {
            if (isAnswered) {
                _NData[_currentPageObject.pageId].isAnswered = true;
                this.UpdateProgressBar();
            }
        },
        IsAnswered: function () {
            if (_currentPageObject.isAnswered != undefined && _currentPageObject.isAnswered)
                return true;

            return false;

        },
        IsLoaded: function () {
            if (_currentPageObject.isLoaded != undefined && _currentPageObject.isLoaded)
                return true;

            return false;

        },
        IncrementCounter: function () {
            submitCounter = submitCounter + 1;
        },
        GetCounter: function () {
            return submitCounter;
        },
    };
})();

$(document).on("click", "#linkprevious", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Prev();
});
$(document).on("click", "#linknext", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});

function setReader(idToStartReading) {
    $('#hiddenAnchor').attr("href", "#" + idToStartReading)
    $('#hiddenAnchor')[0].click()
}