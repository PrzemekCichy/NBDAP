var App;
(function (App) {
    var Navigator;
    (function (Navigator) {
        var $topNav = document.getElementsByTagName("topNav")[0];
        var $bottomNav = document.getElementsByTagName("bottomNav")[0];
        var $active = document.getElementById("Home");
        var $active_content = document.getElementById("Home");
        var setUpListeners = function (element, callback) {
            //selectedButton
            element.children.length;
            for (var i = 0; i < element.children.length; i++) {
                element.children[i].addEventListener("click", function (element) {
                    var $target = element.target;
                    $target.classList.add("selectedButton");
                    if (typeof ($active) == "undefined"
                        || typeof ($active_content) == "undefined"
                        || $active == $target) {
                        return;
                    }
                    ;
                    $active.classList.remove("selectedButton");
                    $active = $target;
                    $active_content.style.top = -document.body.clientHeight + "px";
                    $active_content.classList.add("hiddenContent");
                    $active_content.style.transform = "translateY(0px)";
                    $active_content = document.getElementById((function () {
                        var button = $target.id.split("_")[0];
                        console.log("button", button);
                        if (button != "")
                            return button;
                        for (var x = 0; x < $target.children.length; x++) {
                            var a = $target.children[x].id.split("_")[0];
                            console.log("a", a);
                            if (typeof (a) != "undefined")
                                return a;
                        }
                        console.log("$active_content", $active_content);
                        return $active_content.id.split("_")[0];
                    })());
                    $active_content.classList.remove("hiddenContent");
                    $active_content.classList.add("content");
                    callback($active_content.id);
                });
            }
        };
        setUpListeners($topNav, function (id) {
            console.log(id, $active_content);
            $active_content.style.position = "relative";
            $active_content.style.top = -document.body.clientHeight + "px";
            $active_content.style.transitionDuration = " 0.5s";
            $active_content.style.transform = "translateY(" + document.body.clientHeight + "px)";
            if (id == "Home") {
                console.log("home clicked");
                $topNav.style.transform = "translateY(0px)";
                document.getElementById("Home_Button").parentElement.style.display = "none";
                for (var i = 1; i < $topNav.children.length; i++) {
                    $topNav.children[i].classList.remove("smallerNav");
                }
                $topNav.style.borderBottom = "4px solid rgba(255, 255, 255, 0.1)";
                $topNav.style.borderTop = "";
                $bottomNav.style.display = "inline-flex";
                return;
            }
            for (var i = 1; i < $topNav.children.length; i++) {
                $topNav.children[i].classList.add("smallerNav");
            }
            $topNav.style.border = "0px";
            $topNav.style.borderTop = "4px solid rgba(255, 255, 255, 0.1)";
            $topNav.style.transform = "translateY(" + (document.body.clientHeight - 54) + "px)";
            document.getElementById("Home_Button").parentElement.style.display = "inline-block";
            $bottomNav.style.display = "none";
        });
        setUpListeners($bottomNav, function () { });
    })(Navigator || (Navigator = {}));
    var Manage;
    (function (Manage) {
        var input = document.getElementById("manageInput");
        document.getElementById("manageButton").addEventListener("click", function () {
            //console.log(input.value);
            API.GetFiles(input.value);
        });
        //FilesController/decompressFiles
        document.getElementById("decompressFiles").addEventListener("click", function () {
            console.log("click", input.value);
            API.Decompress(input.value);
        });
        function addEntry($element, text) {
        }
    })(Manage || (Manage = {}));
    var Prepare;
    (function (Prepare) {
        var names = ["Text", "Hashtags", "Reply", "User"];
        var Tags = {
            "Text": {},
            "Hashtags": {},
            "Reply": {},
            "User": {}
        };
        var $divArray = document.getElementById("Prepare").getElementsByClassName("textConatiner prepareContainer");
        console.log($divArray);
        //-1 is for the import config container
        for (var i = 0; i < $divArray.length - 1; i++) {
            createDom($divArray[i], names[i]);
        }
        function createDom($container, tag) {
            console.log("button", $container.getElementsByClassName("entryButton"));
            $container.getElementsByClassName("entryButton")[0].addEventListener("click", function () {
                debugger;
                var input = $container.getElementsByClassName("entryInput")[0];
                //if (this.Negative[input.value]) {
                //    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Text already exist.", "error");
                //    return;
                //}            
                if (typeof (Tags[tag][input.value]) != "undefined") {
                    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag already exists.", "warning");
                }
                else if (input.value == "") {
                    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag cannot be empty.", "error");
                }
                else {
                    $container.getElementsByClassName("errorMessage")[0].innerHTML = "";
                    var $element = document.createElement("div");
                    $element.innerHTML = input.value;
                    console.log("input.value", input.value);
                    $container.getElementsByClassName("entries")[0].appendChild($element);
                    Tags[tag][input.value] = true;
                    input.value = "";
                    console.log(Tags);
                }
            });
        }
    })(Prepare || (Prepare = {}));
    var Model;
    (function (Model) {
        Model.Categories = {};
        var $container = document.getElementById("Model");
        document.getElementById("exportConfig").addEventListener("click", Export);
        var Category = /** @class */ (function () {
            function Category(name) {
                var _this = this;
                this.Add = function (str, type) {
                    _this[type][str] = true;
                };
                this.Remove = function (str, type) {
                    delete _this[type][str];
                };
                this.Positive = {};
                this.Negative = {};
                this.Name = name;
                this.createDom(name);
            }
            Category.prototype.createDom = function (name) {
                var _this = this;
                var $div = document.getElementById("defaultCategoryContainer").cloneNode(true);
                $div.id = name + "_category";
                $div.classList.remove("hiddenContent");
                var $names = $div.getElementsByClassName("textHeader");
                $names[0].innerHTML = "Pro " + name;
                $names[1].innerHTML = "Anti " + name;
                //var child: 
                //$div.appendChild();
                $container.insertBefore($div, $container.childNodes[$container.childNodes.length - 2]);
                $div.getElementsByClassName("entryButton")[0]
                    .addEventListener("click", function () {
                    var input = $div.getElementsByClassName("entryInput")[0];
                    if (_this.Positive[input.value]) {
                        Log.logToDiv($div.getElementsByClassName("errorMessage")[0], "Text already exist.", "error");
                        return;
                    }
                    $div.getElementsByClassName("errorMessage")[0].innerHTML = "";
                    var $element = document.createElement("div");
                    $element.innerHTML = input.value;
                    console.log("input.value", input.value);
                    $div.getElementsByClassName("entries")[0].appendChild($element);
                    _this.Add(input.value, "Positive");
                    input.value = "";
                });
                $div.getElementsByClassName("entryButton")[1]
                    .addEventListener("click", function () {
                    var input = $div.getElementsByClassName("entryInput")[1];
                    if (_this.Negative[input.value]) {
                        Log.logToDiv($div.getElementsByClassName("errorMessage")[1], "Text already exist.", "error");
                        return;
                    }
                    $div.getElementsByClassName("errorMessage")[1].innerHTML = "";
                    if (_this.Negative[input.value])
                        return;
                    var $element = document.createElement("div");
                    $element.innerHTML = input.value;
                    console.log("input.value", input.value);
                    $div.getElementsByClassName("entries")[1].appendChild($element);
                    _this.Add(input.value, "Negative");
                    input.value = "";
                });
            };
            Category.prototype.removeDom = function (name) {
                document.getElementById(name + "_category").remove();
            };
            return Category;
        }());
        ;
        document.getElementById("addNewCategory").addEventListener("click", function () {
            var input = document.getElementById("inputCategoryText");
            if (typeof (Model.Categories[input.value]) != "undefined") {
                Log.logToDiv("categoryErrorMessage", "Category already exists. Select a different name.", "warning");
            }
            else if (input.value == "") {
                Log.logToDiv("categoryErrorMessage", "Category name cannot be empty.", "error");
            }
            else {
                Model.Categories[input.value] = new Category(input.value);
                console.log("addNewCategory", Model.Categories);
                input.value = "";
                document.getElementById("categoryErrorMessage").innerHTML = "";
            }
        });
        function Export() {
            var a = document.createElement("a");
            var file = new Blob([JSON.stringify(Model.Categories)], { type: "application/json" });
            a.href = URL.createObjectURL(file);
            a.download = "Model_Export.json";
            a.click();
        }
        Model.Export = Export;
        function Import(category) {
            Model.Categories = JSON.parse(category);
        }
        Model.Import = Import;
    })(Model || (Model = {}));
    var Settings;
    (function (Settings) {
        Settings.Debug = true;
    })(Settings || (Settings = {}));
    var Log = /** @class */ (function () {
        function Log() {
        }
        Log.logToDiv = function (id, message, level) {
            var $element;
            if (typeof (id) == "string") {
                $element = document.getElementById(id);
            }
            else {
                $element = id;
            }
            $element.innerHTML = message;
            if (level == "error") {
                $element.style.color = "#f44336";
            }
            else if (level == "warning") {
                $element.style.color = "#ffd54f";
            }
            else if (level == "info") {
                $element.style.color = "#66bb6a";
            }
            if (Settings.Debug) {
                console.log(message);
            }
        };
        Log.clearDiv = function (id) {
            var $element;
            if (typeof (id) == "string") {
                $element = document.getElementById(id);
            }
            else {
                $element = id;
            }
            $element.innerHTML = "";
        };
        return Log;
    }());
    var API;
    (function (API) {
        var location = window.location.href;
        function GetFiles(path) {
            console.log(GetUrl("FilesController/getFiles"));
            Log.logToDiv("manageErrorMessage", "Retrieving data...", "info");
            document.getElementById("totalFilesFound").innerHTML = "-";
            document.getElementById("standardFilesFound").innerHTML = "-";
            document.getElementById("compressedFilesFound").innerHTML = "-";
            document.getElementById("selectedSource").innerHTML = "-";
            $.ajax({
                url: GetUrl("FilesController/getFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: function () { },
                error: function () { Log.logToDiv("manageErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error"); }
            }).done(function (data) {
                data = JSON.parse(data);
                console.log(data);
                document.getElementById("totalFilesFound").innerHTML = data.Standard + data.Compressed;
                document.getElementById("standardFilesFound").innerHTML = data.Standard;
                document.getElementById("compressedFilesFound").innerHTML = data.Compressed;
                document.getElementById("selectedSource").innerHTML = document.getElementById("manageInput").value;
                Log.logToDiv("manageErrorMessage", "Finished scaning directory for files.", "info");
            });
        }
        API.GetFiles = GetFiles;
        function Decompress(path) {
            Log.logToDiv("decompressErrorMessage", "Decompressing files...", "info");
            $.ajax({
                url: GetUrl("FilesController/decompressFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: function () { },
                error: function () { Log.logToDiv("decompressErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error"); }
            }).done(function (data) {
                Log.logToDiv("decompressErrorMessage", "Finished decompressing.", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
        }
        API.Decompress = Decompress;
        function GetUrl(url) {
            return window.location.href + url;
        }
    })(API = App.API || (App.API = {}));
    var Helper;
    (function (Helper) {
        function appendElement(value, $parent) {
            var $element = document.createElement("div");
            $element.innerHTML = value;
            $parent.appendChild($element);
        }
        Helper.appendElement = appendElement;
    })(Helper || (Helper = {}));
    var InitializeChart = /** @class */ (function () {
        function InitializeChart(id, title, chartOptions) {
            var _this = this;
            this.AppendChart = function (elementId, chartOptions) {
                return Highcharts.stockChart(elementId, chartOptions);
            };
            this.AddNewSeries = function (seriesOptions) {
                _this.chart.addSeries(seriesOptions);
            };
            this.UpdateSeries = function (index, data, redraw) {
                _this.chart.series[index].setData(data, redraw ? true : false);
            };
            this.AddDatapoint = function () {
            };
            chartOptions = chartOptions || {
                title: {
                    text: title
                },
                navigator: {
                    enabled: true,
                    adaptToUpdatedData: true //Wasted 2 h
                },
                chart: {
                    zoomType: 'x'
                },
                rangeSelector: {
                    enabled: false
                },
                animation: false,
                plotOptions: {
                    series: {
                        pointInterval: 1000 // one sec
                    }
                },
                xAxis: {
                    type: 'datetime'
                }
            };
            this.chart = this.AppendChart(id, chartOptions);
            ///*lineOptions ? this.ConfigureLineOptions(lineOptions) :*/ this.ConfigureLineOptions([{ name: "default", lineColour: "red" }]);
            //this.chart.series[0].setData([[1433140253659, 1], [1433140255659, 22], [1433140257659, 1], [1433140258659, 1], [1433140259659, 4], [1433140267659, 8]], true);
            //this.chart.redraw();
        }
        return InitializeChart;
    }());
    var ParseReport;
    (function (ParseReport) {
        ParseReport.parsedReport = {
            Tweets: {
                TotalTweets: 1433140257659,
                TotalTweetsMatched: 3140257659,
                Tweets: [[1454311858666, 1121], [1454311859666, 121], [1454311860666, 2121], [1454311861666, 1421], [1454311862666, 7121], [1454311863666, 1121], [1454311864666, 6121]],
                MatchedTweets: [[1454311858666, 123], [1454311859666, 111], [1454311860666, 442], [1454311861666, 345], [1454311862666, 1178], [1454311863666, 67], [1454311864666, 1200]],
                Keywords: {
                    Trump2016: [[1454311858666, 100], [1454311859666, 100], [1454311860666, 300], [1454311861666, 200], [1454311862666, 678], [1454311863666, 37], [1454311864666, 800]],
                    Clinton2016: [[1454311858666, 23], [1454311859666, 11], [1454311860666, 142], [1454311861666, 145], [1454311862666, 500], [1454311863666, 30], [1454311864666, 400]],
                },
                Sentiment: {
                    Trump: [[1454311858666, 0.65], [1454311859666, 0.43], [1454311860666, 0.23], [1454311861666, 0.64], [1454311862666, 0.34], [1454311863666, 0.76], [1454311864666, 0.45]],
                    Clinton: [[1454311858666, 0.5], [1454311859666, 0.7], [1454311860666, 0.2], [1454311861666, 0.23], [1454311862666, 0.52], [1454311863666, 0.98], [1454311864666, 0.1]],
                },
            },
            Keywords: {
                Trump2016: [[1454311858666, 100], [1454311859666, 100], [1454311860666, 300], [1454311861666, 200], [1454311862666, 678], [1454311863666, 37], [1454311864666, 800]],
                Clinton2016: [[1454311858666, 23], [1454311859666, 11], [1454311860666, 142], [1454311861666, 145], [1454311862666, 500], [1454311863666, 30], [1454311864666, 400]],
                Tweets: [[1454311858666, 1121], [1454311859666, 121], [1454311860666, 2121], [1454311861666, 1421], [1454311862666, 7121], [1454311863666, 1121], [1454311864666, 6121]],
                MatchedTweets: [[1454311858666, 123], [1454311859666, 111], [1454311860666, 442], [1454311861666, 345], [1454311862666, 1178], [1454311863666, 67], [1454311864666, 1200]],
            }
        };
        //Get int total tweets
        console.log("parsedReport.Tweets.totalTweets", ParseReport.parsedReport.Tweets.TotalTweets);
        //Get int total tweets found
        console.log("parsedReport.Tweets.totalTweetsMatched", ParseReport.parsedReport.Tweets.TotalTweetsMatched);
        //Tweets by timestamp
        console.log("parsedReport.Tweets.tweets", ParseReport.parsedReport.Tweets.Tweets);
        //Tweets matched
        console.log("parsedReport.Tweets.matchedTweets", ParseReport.parsedReport.Tweets.MatchedTweets);
        //Tweets matched per category 
        Object.keys(ParseReport.parsedReport.Tweets.Keywords).forEach(function (categoryName) {
            console.log("parsedReport.Tweets.categoryTweets", ParseReport.parsedReport.Tweets.Keywords[categoryName]);
        });
        //Sentiment for Each category
        Object.keys(ParseReport.parsedReport.Tweets.Sentiment).forEach(function (categoryName) {
            console.log("parsedReport.Tweets.sentiment", ParseReport.parsedReport.Tweets.Sentiment[categoryName]);
        });
        var sampleData = {
            "Tweets": {
                "12312312": {
                    "noOfTweets": 1433140257659,
                    "categoryTweets": {
                        "Trump": 1312312,
                        "Clinton": 12312
                    },
                    "noOfMatchedTweets": 132,
                    "sentiment": [
                        {
                            "name": "Trump",
                            "entries": [0.1, 0.5, 1, 0, 1, 0.54, 0.69, 0.71, 0.13],
                            "negative": 45,
                            "positive": 24,
                            "average": 0.3
                        },
                        {
                            "name": "Clinton",
                            "entries": [0.11, 0.15, 1, 0.5, 1, 0.54, 0.97, 0.31, 0.63],
                            "negative": 45,
                            "positive": 24,
                            "average": 0.3
                        }
                    ],
                },
                "1433140258664": {
                    "noOfTweets": 12223,
                    "noOfMatchedTweets": 232,
                    "categoryTweets": {
                        "Trump": 1312312,
                        "Clinton": 12312
                    },
                    "sentiment": [
                        {
                            "name": "Trump",
                            "entries": [0.2, 0.3, 0.7, 0.1, 14, 0.54, 0.69, 0.71, 0.13],
                            "negative": 45,
                            "positive": 24,
                            "average": 0.3
                        },
                        {
                            "name": "Clinton",
                            "entries": [0.41, 0.25, 1, 0.59, 1, 0.94, 0.37, 0.61, 0.43],
                            "negative": 45,
                            "positive": 24,
                            "average": 0.3
                        }
                    ]
                }
            },
            "Keywords": {
                "Trump2016": 21,
                "Clinton2016": 11,
                "ImwithHer": 11,
                "Maga": 33
            }
        };
        Object.keys(sampleData.Tweets).forEach(function (timestamp, index) {
            // key: the name of the object key
            console.log(sampleData.Tweets[timestamp].categoryTweets.Trump);
            console.log(sampleData.Tweets[timestamp].categoryTweets.Clinton);
            console.log(sampleData.Tweets[timestamp].noOfTweets);
            console.log(sampleData.Tweets[timestamp].noOfMatchedTweets);
            console.log(timestamp, sampleData.Tweets[timestamp]);
            console.log(timestamp, index, 'key=${e} value=${obj[e]}');
            // index: the ordinal position of the key within the object
        });
    })(ParseReport || (ParseReport = {}));
    //Export makes this variable visible outside of the module so that it can be used by 
    //signalR methods
    App.matchedTweetsChart = new InitializeChart("tweetsMatchedChart", "Tweets found chart");
    //matchedTweetsChart.chart.
    App.matchedTweetsChart.AddNewSeries({
        name: "Total Tweets Found",
        type: "line",
        showInNavigator: true,
        data: ParseReport.parsedReport.Tweets.Tweets
    });
    App.matchedTweetsChart.AddNewSeries({
        name: "Tweets matching search",
        type: "line",
        showInNavigator: true,
        data: ParseReport.parsedReport.Tweets.MatchedTweets
    });
    //For each category we want to create a chart
    //Tweets matched per category 
    document.getElementById("InsightsCategories").insertAdjacentHTML('beforeend', "<div id='KeywordsInsights'" + " style='height: 450px; width: 100 %; text-shadow:none'></div>");
    App.KeywordsChart = new InitializeChart("KeywordsInsights", "Keywords found chart");
    Object.keys(ParseReport.parsedReport.Tweets.Keywords).forEach(function (categoryName) {
        App.KeywordsChart.AddNewSeries({
            name: categoryName,
            type: "line",
            showInNavigator: true,
            data: ParseReport.parsedReport.Tweets.Keywords[categoryName]
        });
    });
    //Sentiment for Each category
    var SentimentChart = [];
    Object.keys(ParseReport.parsedReport.Tweets.Sentiment).forEach(function (categoryName, index) {
        document.getElementById("InsightsCategories").insertAdjacentHTML('beforeend', "<div id='" + categoryName + "SentimentInsights" + "' style='height: 350px; width: 100 %; text-shadow:none'></div>");
        SentimentChart.push(new InitializeChart(categoryName + "SentimentInsights", "Sentiment for " + categoryName));
        SentimentChart[index].AddNewSeries({
            name: categoryName,
            negativeColor: '#0088FF',
            type: "area",
            showInNavigator: true,
            data: ParseReport.parsedReport.Tweets.Sentiment[categoryName]
        });
    });
    //matchedTweetsChart.AddDataPoints
})(App || (App = {}));
//# sourceMappingURL=main.js.map