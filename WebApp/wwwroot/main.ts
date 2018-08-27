declare var $;
declare var Highcharts;
declare var d3;

interface lineOptions {
    name: string,
    lineColour: string;
}

interface chartOptions {
    isVertical: boolean;
    isHorizontalGridVisible: boolean;
    isVerticalGridVisible: boolean;
    noOfChannels: number;
    isLogarithmic: boolean;
}
var insights;

module App {

    module Navigator {
        var $topNav: HTMLElement = <HTMLElement>document.getElementsByTagName("topNav")[0];
        var $bottomNav = <HTMLElement>document.getElementsByTagName("bottomNav")[0];

        var $active: HTMLElement = document.getElementById("Home");
        var $active_content: HTMLElement = document.getElementById("Home");

        var active = false;

        var viewPortHeight = document.body.clientHeight - 54 * 2;

        var setUpListeners = (element: Element, callback: Function) => {
            //selectedButton

            for (var i = 0; i < element.children.length; i++) {
                element.children[i].addEventListener("click", (element: any) => {
                    var $target: HTMLElement = element.target;

                    $target.classList.add("selectedButton");
                    if (typeof ($active) == "undefined"
                        || typeof ($active_content) == "undefined"
                        || $active == $target) {

                        return;
                    };

                    $active.classList.remove("selectedButton");
                    $active = $target;
                    $active_content.style.top = -viewPortHeight + "px";
                    $active_content.classList.add("hiddenContent");
                    $active_content.style.transform = "translateY(0px)";
                    $active_content = document.getElementById((() => {
                        var button = $target.id.split("_")[0];
                        console.log("button", button);
                        if (button != "") return button;

                        for (var x = 0; x < $target.children.length; x++) {
                            var a = $target.children[x].id.split("_")[0];
                            console.log("a", a);
                            if (typeof (a) != "undefined") return a;
                        }
                        console.log("$active_content", $active_content);
                        return $active_content.id.split("_")[0];
                    })());
                    $active_content.classList.remove("hiddenContent");
                    $active_content.classList.add("content");
                    callback($active_content.id);

                });
            }
        }
        setUpListeners($topNav, (id: string) => {
            console.log(id, $active_content);
            $active_content.style.position = "relative";
            $active_content.style.top = -document.body.clientHeight + 54 + "px";
            $active_content.style.transitionDuration = " 0.5s";
            $active_content.style.transform = "translateY(" + viewPortHeight + "px)";
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
                active = false;
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
            active = true;
        });

        setUpListeners($bottomNav, () => {
            active = false;
        });

        $(window).resize(() => {
            console.log("resize");
            if (active) {
                $topNav.style.transform = "translateY(" + (document.body.clientHeight - 54) + "px)";
            }
        });
    }

    module Manage {
        var input = <HTMLInputElement>document.getElementById("manageInput");
        document.getElementById("manageButton").addEventListener("click", () => {
            //console.log(input.value);
            API.GetFiles(input.value);
        });

        //FilesController/decompressFiles
        document.getElementById("decompressFiles").addEventListener("click", () => {
            console.log("click", input.value);
            API.Decompress(input.value);
        });

        //FilesController/decompressFiles
        document.getElementById("startStream").addEventListener("click", () => {


            API.StartStream((<HTMLInputElement>document.getElementById("searchTwitter")).value,
                (<HTMLInputElement>document.getElementById("searchTwitterSave")).value);
        });

        function addEntry($element, text) {

        }
    }

    class InitializeChart {
        public chart;

        constructor(id: string, title: string, chartOptions?) {

            chartOptions = chartOptions || {
                title: {
                    text: title,
                    style: {
                        color: '#f9f9f9',
                        fontWeight: 'bold'
                    },
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

        private AppendChart = (elementId: string, chartOptions) => {

            return Highcharts.stockChart(elementId, chartOptions);
        }

        public AddNewSeries = (seriesOptions) => {
            this.chart.addSeries(seriesOptions);
        }

        private UpdateSeries = (index: number, data: Array<Array<number>>, redraw?: boolean) => {
            this.chart.series[index].setData(data, redraw ? true : false);
        }

        public AddDatapoint = () => {

        }

    }

    module ParseReport {


        export var parsedReport = {
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
                    Trump: [],
                    Clinton: [],
                },
            },
            Keywords: {
                Trump2016: [[1454311858666, 100], [1454311859666, 100], [1454311860666, 300], [1454311861666, 200], [1454311862666, 678], [1454311863666, 37], [1454311864666, 800]],
                Clinton2016: [[1454311858666, 23], [1454311859666, 11], [1454311860666, 142], [1454311861666, 145], [1454311862666, 500], [1454311863666, 30], [1454311864666, 400]],
                Tweets: [[1454311858666, 1121], [1454311859666, 121], [1454311860666, 2121], [1454311861666, 1421], [1454311862666, 7121], [1454311863666, 1121], [1454311864666, 6121]],
                MatchedTweets: [[1454311858666, 123], [1454311859666, 111], [1454311860666, 442], [1454311861666, 345], [1454311862666, 1178], [1454311863666, 67], [1454311864666, 1200]],
            }
        };

        var timestamp = 1454311858666;
        for (var i = 0; i < 10000; i++) {
            parsedReport.Tweets.Sentiment.Trump.push([timestamp, Math.random()])
            parsedReport.Tweets.Sentiment.Clinton.push([timestamp, Math.random()])
            timestamp += 1000;
        }

        //Get int total tweets
        console.log("parsedReport.Tweets.totalTweets", parsedReport.Tweets.TotalTweets);
        //Get int total tweets found
        console.log("parsedReport.Tweets.totalTweetsMatched", parsedReport.Tweets.TotalTweetsMatched);

        //Tweets by timestamp
        console.log("parsedReport.Tweets.tweets", parsedReport.Tweets.Tweets);
        //Tweets matched
        console.log("parsedReport.Tweets.matchedTweets", parsedReport.Tweets.MatchedTweets);

        //Tweets matched per category 
        Object.keys(parsedReport.Tweets.Keywords).forEach((categoryName) => {
            console.log("parsedReport.Tweets.categoryTweets", parsedReport.Tweets.Keywords[categoryName]);
        });

        //Sentiment for Each category
        Object.keys(parsedReport.Tweets.Sentiment).forEach((categoryName) => {
            console.log("parsedReport.Tweets.sentiment", parsedReport.Tweets.Sentiment[categoryName]);
        });


        var sampleData: Report = {
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
        }

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
    }

    module Insights {
        var fileInput = <HTMLInputElement>document.getElementById('importInsightsConfig');

        //Export makes this variable visible outside of the module so that it can be used by 
        //signalR methods
        export var matchedTweetsChart = new InitializeChart("tweetsMatchedChart", "Tweets found chart");

        //matchedTweetsChart.chart.
        matchedTweetsChart.AddNewSeries({
            name: "Total Tweets Found",
            type: "line",
            showInNavigator: true,
            data: ParseReport.parsedReport.Tweets.Tweets
        });


        matchedTweetsChart.AddNewSeries({
            name: "Tweets matching search",
            type: "line",
            color: "#F24738",
            showInNavigator: true,
            data: ParseReport.parsedReport.Tweets.MatchedTweets
        });

        matchedTweetsChart.chart.redraw();

        matchedTweetsChart.chart.update({
            chart: {
                backgroundColor: null
            }
        });

        //For each category we want to create a chart
        //Tweets matched per category 
        document.getElementById("InsightsCategories").insertAdjacentHTML('beforeend',
            "<div id='KeywordsInsights'" + " style='height: 350px; width: 100%; text-shadow:none'></div>");

        //Sentiment for Each category
        export var SentimentChart = [];

        var m = [30, 160, 0, 160], // top right bottom left
            w = 1280 - m[1] - m[3], // width
            h = 4200 - m[0] - m[2], // height
            x = d3.scale.pow().range([0, w]),
            y = 15, // bar height
            z = d3.scale.ordinal().range(["#F24738"]); // bar color

        var hierarchy = d3.layout.partition()
            .value(function (d) {
                return d.value;
            });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var svg = d3.select("#KeywordsContainer").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        svg.append("svg:rect")
            .attr("class", "background")
            .attr("width", w)
            .attr("height", h);

        svg.append("svg:g")
            .attr("class", "x axis")
            .style("fill", "white");

        svg.append("svg:g")
            .attr("class", "y axis")
            .append("svg:line")
            .attr("y1", "100%")
            .style("fill", "white");

        var root: any = getJson();

        function down(d, i) {
            if (!d.children || this.__transition__) return;
            var duration = d3.event && d3.event.altKey ? 7500 : 750,
                delay = duration / d.children.length;

            // Mark any currently-displayed bars as exiting.
            var exit = svg.selectAll(".enter").attr("class", "exit");

            // Entering nodes immediately obscure the clicked-on bar, so hide it.
            exit.selectAll("rect").filter(function (p) {
                return p === d;
            })
                .style("fill-opacity", 1e-6);

            // Enter the new bars for the clicked-on data.
            // Per above, entering bars are immediately visible.
            console.log(d);
            var enter = bar(d)
                .attr("transform", stack(i))
                .style("opacity", 1);

            // Have the text fade-in, even though the bars are visible.
            // Color the bars as parents; they will fade to children if appropriate.
            enter.select("text").style("fill", "white");
            enter.select("rect").style("fill", z(true));

            // Update the x-scale domain.
            x.domain([1, d3.max(d.children, function (d) {
                return d.value;
            })]).nice();

            // Update the x-axis.
            svg.selectAll(".x.axis").transition()
                .duration(duration)
                .call(xAxis);

            // Transition entering bars to their new position.
            var enterTransition = enter.transition()
                .duration(duration)
                .delay(function (d, i) {
                    return i * delay;
                })
                .attr("transform", function (d, i) {
                    return "translate(0," + y * i * 1.2 + ")";
                });

            // Transition entering text.
            enterTransition.select("text").style("fill-opacity", 1);

            // Transition entering rects to the new x-scale.
            enterTransition.select("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .style("fill", function (d) {
                    return z(!!d.children);
                });

            // Transition exiting bars to fade out.
            var exitTransition = exit.transition()
                .duration(duration)
                .style("opacity", 1e-6)
                .remove();

            // Transition exiting bars to the new x-scale.
            exitTransition.selectAll("rect").attr("width", function (d) {
                return x(d.value);
            });

            // Rebind the current node to the background.
            svg.select(".background").data([d]).transition().duration(duration * 2);
            d.index = i;
        }

        // Creates a set of bars for the given data node, at the specified index.
        function bar(d) {
            var bar = svg.insert("svg:g", ".y.axis")
                .attr("class", "enter")
                .attr("transform", "translate(0,5)")
                .selectAll("g")
                .data(d.children)
                .enter().append("svg:g")
                .style("cursor", function (d) {
                    return !d.children ? null : "pointer";
                })
                .on("click", down);

            bar.append("svg:text")
                .attr("x", -6)
                .attr("y", y / 2)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function (d) {
                    return d.name;
                });

            bar.append("svg:rect")
                .attr("width", function (d) {
                    console.log(d);
                    return x(d.value);
                })
                .attr("height", y);

            bar.append("svg:text")
                .attr("x", w)
                .attr("y", y / 2)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function (d) {
                    return d.value;
                }).style("fill", "#fff");
            return bar;
        }

        // A stateful closure for stacking bars horizontally.
        function stack(i) {
            var x0 = 0;
            return function (d) {
                var tx = "translate(" + x0 + "," + y * i * 1.2 + ")";
                x0 += x(d.value);
                return tx;
            };
        }

        function getJson() {
            return {
                "name": "flare",
                "children": [{
                    "name": "alwaystrump",
                    "value": 13678
                }, {
                    "name": "babesfortrump",
                    "value": 631
                }, {
                    "name": "bikers4trump",
                    "value": 10196
                }, {
                    "name": "bikersfortrump",
                    "value": 988
                }, {
                    "name": "blacks4trump",
                    "value": 1644
                }, {
                    "name": "buildthatwall",
                    "value": 1326
                }, {
                    "name": "buildthewall",
                    "value": 6503
                }, {
                    "name": "cafortrump",
                    "value": 596
                }, {
                    "name": "democrats4trump",
                    "value": 192
                }, {
                    "name": "donuldtrumpforpresident",
                    "value": 1
                }, {
                    "name": "feelthetrump",
                    "value": 368
                }, {
                    "name": "femineamerica4trump",
                    "value": 1
                }, {
                    "name": "gays4trump",
                    "value": 576
                }, {
                    "name": "gaysfortrump",
                    "value": 1883
                }, {
                    "name": "gotrump",
                    "value": 1003
                }, {
                    "name": "heswithus",
                    "value": 723
                }, {
                    "name": "imwithhim",
                    "value": 1041
                }, {
                    "name": "imwithyou",
                    "value": 12096
                }, {
                    "name": "latinos4trump",
                    "value": 813
                }, {
                    "name": "latinosfortrump",
                    "value": 4936
                }, {
                    "name": "maga",
                    "value": 236222
                }, {
                    "name": "makeamericagreat",
                    "value": 878
                }, {
                    "name": "makeamericagreatagain",
                    "value": 94674
                }, {
                    "name": "makeamericasafeagain",
                    "value": 2888
                }, {
                    "name": "makeamericaworkagain",
                    "value": 455
                }, {
                    "name": "onlytrump",
                    "value": 3817
                }, {
                    "name": "presienttrump",
                    "value": 1
                }, {
                    "name": "rednationrising",
                    "value": 35965
                }, {
                    "name": "trump16",
                    "value": 2566
                }, {
                    "name": "trump2016",
                    "value": 221675
                }, {
                    "name": "trumpcares",
                    "value": 138
                }, {
                    "name": "trumpforpresident",
                    "value": 2769
                }, {
                    "name": "trumpiswithyou",
                    "value": 1128
                }, {
                    "name": "trumppence2016",
                    "value": 5039
                }, {
                    "name": "trumpstrong",
                    "value": 1615
                }, {
                    "name": "trumptrain",
                    "value": 118679
                }, {
                    "name": "veteransfortrump",
                    "value": 550
                }, {
                    "name": "vets4trump",
                    "value": 648
                }, {
                    "name": "votegop",
                    "value": 1005
                }, {
                    "name": "votetrump",
                    "value": 43403
                }, {
                    "name": "votetrump2016",
                    "value": 11874
                }, {
                    "name": "votetrumppence2016",
                    "value": 231
                }, {
                    "name": "woman4trump",
                    "value": 2311
                }, {
                    "name": "women4trump",
                    "value": 7935
                }, {
                    "name": "womenfortrump",
                    "value": 6806
                }, {
                    "name": "antitrump",
                    "value": 2482
                }, {
                    "name": "anyonebuttrump",
                    "value": 626
                }, {
                    "name": "boycotttrump",
                    "value": 712
                }, {
                    "name": "chickentrump",
                    "value": 3468
                }, {
                    "name": "clowntrain",
                    "value": 293
                }, {
                    "name": "crookeddonald",
                    "value": 678
                }, {
                    "name": "crookeddrumpf",
                    "value": 122
                }, {
                    "name": "crookedtrump",
                    "value": 607
                }, {
                    "name": "crybabytrump",
                    "value": 79
                }, {
                    "name": "defeattrump",
                    "value": 151
                }, {
                    "name": "dirtydonald",
                    "value": 1255
                }, {
                    "name": "donthecon",
                    "value": 4267
                }, {
                    "name": "drumpf",
                    "value": 10445
                }, {
                    "name": "dumbdonald",
                    "value": 467
                }, {
                    "name": "dumpthetrump",
                    "value": 769
                }, {
                    "name": "dumptrump",
                    "value": 20371
                }, {
                    "name": "freethedelegates",
                    "value": 1029
                }, {
                    "name": "lgbthatestrumpparty",
                    "value": 18
                }, {
                    "name": "loserdonald",
                    "value": 673
                }, {
                    "name": "losertrump",
                    "value": 341
                }, {
                    "name": "lovetrumpshate",
                    "value": 7122
                }, {
                    "name": "lovetrumpshates",
                    "value": 65
                }, {
                    "name": "lyindonald",
                    "value": 235
                }, {
                    "name": "lyingdonald",
                    "value": 190
                }, {
                    "name": "lyingtrump",
                    "value": 465
                }, {
                    "name": "lyintrump",
                    "value": 492
                }, {
                    "name": "makedonalddrumpfagain",
                    "value": 2804
                }, {
                    "name": "nevergop",
                    "value": 530
                }, {
                    "name": "nevertrump",
                    "value": 86762
                }, {
                    "name": "nevertrumppence",
                    "value": 157
                }, {
                    "name": "nodonaldtrump",
                    "value": 232
                }, {
                    "name": "notrump",
                    "value": 1310
                }, {
                    "name": "notrumpanytime",
                    "value": 111
                }, {
                    "name": "poordonald",
                    "value": 59
                }, {
                    "name": "racisttrump",
                    "value": 389
                }, {
                    "name": "releasethereturns",
                    "value": 1342
                }, {
                    "name": "releaseyourtaxes",
                    "value": 385
                }, {
                    "name": "ripgop",
                    "value": 607
                }, {
                    "name": "showusyourtaxes",
                    "value": 96
                }, {
                    "name": "sleazydonald",
                    "value": 1560
                }, {
                    "name": "stoptrump",
                    "value": 2889
                }, {
                    "name": "stupidtrump",
                    "value": 80
                }, {
                    "name": "traitortrump",
                    "value": 643
                }, {
                    "name": "treasonoustrump",
                    "value": 485
                }, {
                    "name": "trump20never",
                    "value": 844
                }, {
                    "name": "trumplies",
                    "value": 1616
                }, {
                    "name": "trumpliesmatter",
                    "value": 179
                }, {
                    "name": "trumpsopoor",
                    "value": 987
                }, {
                    "name": "trumpthefraud",
                    "value": 106
                }, {
                    "name": "trumptrainwreck",
                    "value": 478
                }, {
                    "name": "trumptreason",
                    "value": 772
                }, {
                    "name": "unfittrump",
                    "value": 62
                }, {
                    "name": "weakdonald",
                    "value": 550
                }, {
                    "name": "wherertrumpstaxes",
                    "value": 45
                }, {
                    "name": "wheresyourtaxes",
                    "value": 409
                }, {
                    "name": "whinylittlebitch",
                    "value": 1055
                }, {
                    "name": "womentrumpdonald",
                    "value": 196
                }, {
                    "name": "bernwithher",
                    "value": 26
                }, {
                    "name": "bluewave2016",
                    "value": 1260
                }, {
                    "name": "clintonkaine2016",
                    "value": 1435
                }, {
                    "name": "estoyconella",
                    "value": 526
                }, {
                    "name": "herstory",
                    "value": 2518
                }, {
                    "name": "heswithher",
                    "value": 413
                }, {
                    "name": "hillafornia",
                    "value": 13
                }, {
                    "name": "hillary2016",
                    "value": 31148
                }, {
                    "name": "hillaryforamerica",
                    "value": 481
                }, {
                    "name": "hillaryforpr",
                    "value": 47
                }, {
                    "name": "hillaryforpresident",
                    "value": 505
                }, {
                    "name": "hillarysopresidential",
                    "value": 24
                }, {
                    "name": "hillarysoqualified",
                    "value": 3809
                }, {
                    "name": "hillarystrong",
                    "value": 1091
                }, {
                    "name": "hillstorm2016",
                    "value": 93
                }, {
                    "name": "hillyes",
                    "value": 6846
                }, {
                    "name": "hrc2016",
                    "value": 412
                }, {
                    "name": "hrcisournominee",
                    "value": 359
                }, {
                    "name": "iamwithher",
                    "value": 1413
                }, {
                    "name": "imwither",
                    "value": 2274
                }, {
                    "name": "imwithher",
                    "value": 138723
                }, {
                    "name": "imwithher2016",
                    "value": 1827
                }, {
                    "name": "imwhithhillary",
                    "value": 1
                }, {
                    "name": "imwiththem",
                    "value": 992
                }, {
                    "name": "itrusther",
                    "value": 102
                }, {
                    "name": "itrusthillary",
                    "value": 1088
                }, {
                    "name": "madamepresident",
                    "value": 483
                }, {
                    "name": "madampresident",
                    "value": 1138
                }, {
                    "name": "momsdemandhillary",
                    "value": 240
                }, {
                    "name": "ohhillyes",
                    "value": 1536
                }, {
                    "name": "readyforhillary",
                    "value": 966
                }, {
                    "name": "republicans4hillary",
                    "value": 127
                }, {
                    "name": "republicansforhillary",
                    "value": 1092
                }, {
                    "name": "sheswithus",
                    "value": 3612
                }, {
                    "name": "standwithmadampotus",
                    "value": 345
                }, {
                    "name": "strongertogether",
                    "value": 22285
                }, {
                    "name": "uniteblue",
                    "value": 70719
                }, {
                    "name": "vote4hillary",
                    "value": 1501
                }, {
                    "name": "voteblue",
                    "value": 7251
                }, {
                    "name": "voteblue2016",
                    "value": 734
                }, {
                    "name": "votehillary",
                    "value": 4595
                }, {
                    "name": "welovehillary",
                    "value": 172
                }, {
                    "name": "yeswekaine",
                    "value": 127
                }, {
                    "name": "clintoncorruption",
                    "value": 1255
                }, {
                    "name": "clintoncrime",
                    "value": 189
                }, {
                    "name": "clintoncrimefamily",
                    "value": 1926
                }, {
                    "name": "clintoncrimefoundation",
                    "value": 753
                }, {
                    "name": "corrupthillary",
                    "value": 1961
                }, {
                    "name": "criminalhillary",
                    "value": 263
                }, {
                    "name": "crookedclinton",
                    "value": 1070
                }, {
                    "name": "crookedclintons",
                    "value": 384
                }, {
                    "name": "crookedhilary",
                    "value": 613
                }, {
                    "name": "crookedhiliary",
                    "value": 297
                }, {
                    "name": "crookedhillary",
                    "value": 53952
                }, {
                    "name": "crookedhillaryclinton",
                    "value": 191
                }, {
                    "name": "deletehillary",
                    "value": 146
                }, {
                    "name": "dropouthillary",
                    "value": 13876
                }, {
                    "name": "fbimwithher",
                    "value": 1005
                }, {
                    "name": "handcuffhillary",
                    "value": 872
                }, {
                    "name": "heartlesshillary",
                    "value": 415
                }, {
                    "name": "hillary2jail",
                    "value": 162
                }, {
                    "name": "hillary4jail",
                    "value": 200
                }, {
                    "name": "hillary4prison",
                    "value": 4088
                }, {
                    "name": "hillary4prison2016",
                    "value": 529
                }, {
                    "name": "hillaryforprison",
                    "value": 16689
                }, {
                    "name": "hillaryforprison2016",
                    "value": 5007
                }, {
                    "name": "hillaryliedpeopledied",
                    "value": 151
                }, {
                    "name": "hillarylies",
                    "value": 1471
                }, {
                    "name": "hillaryliesmatter",
                    "value": 1911
                }, {
                    "name": "hillarylosttome",
                    "value": 1
                }, {
                    "name": "hillaryrottenclinton",
                    "value": 1419
                }, {
                    "name": "hillarysolympics",
                    "value": 1017
                }, {
                    "name": "hillno",
                    "value": 4610
                }, {
                    "name": "hypocritehillary",
                    "value": 257
                }, {
                    "name": "imnotwithher",
                    "value": 1284
                }, {
                    "name": "indicthillary",
                    "value": 3014
                }, {
                    "name": "iwillneverstandwithher",
                    "value": 335
                }, {
                    "name": "killary",
                    "value": 14542
                }, {
                    "name": "lockherup",
                    "value": 13918
                }, {
                    "name": "lyingcrookedhillary",
                    "value": 470
                }, {
                    "name": "lyinghillary",
                    "value": 908
                }, {
                    "name": "lyinhillary",
                    "value": 146
                }, {
                    "name": "moretrustedthanhillary",
                    "value": 1211
                }, {
                    "name": "neverclinton",
                    "value": 1191
                }, {
                    "name": "nevereverhillary",
                    "value": 515
                }, {
                    "name": "neverhillary",
                    "value": 72852
                }, {
                    "name": "neverhilllary",
                    "value": 72
                }, {
                    "name": "nohillary2016",
                    "value": 919
                }, {
                    "name": "nomoreclintons",
                    "value": 599
                }, {
                    "name": "notwithher",
                    "value": 1006
                }, {
                    "name": "ohhillno",
                    "value": 5946
                }, {
                    "name": "releasethetranscripts",
                    "value": 3548
                }, {
                    "name": "riskyhillary",
                    "value": 155
                }, {
                    "name": "shelies",
                    "value": 1504
                }, {
                    "name": "sickhillary",
                    "value": 3710
                }, {
                    "name": "stophillary",
                    "value": 4411
                }, {
                    "name": "stophillary2016",
                    "value": 1100
                }, {
                    "name": "theclintoncontamination",
                    "value": 51
                }, {
                    "name": "wehatehillary",
                    "value": 528
                }, {
                    "name": "whatmakeshillaryshortcircuit",
                    "value": 1460
                }
                ]
            };
        }
        //matchedTweetsChart.AddDataPoints

        fileInput.addEventListener('change', function (e) {
            var file = fileInput.files[0];
            var textType = /json.*/;

            try {
                console.log("Reading file");
                var reader = new FileReader();

                reader.onload = function (e) {
                    insights = JSON.parse(reader.result);
                    console.log("File loaded");

                    //Parse hashtag occurence
                    parseHashtags(insights);
                    parseModel(insights);
                }

                reader.readAsText(file);
            } catch (ex) {
                console.log("File could not be loaded. Error: " + ex);
            }



            console.log("reflow");
            Insights.matchedTweetsChart.chart.reflow();
            Insights.SentimentChart.forEach((chart) => {
                chart.chart.reflow();
            });
        });

        var parseHashtags = (insights) => {

            checkData(["Found", "Matched", "Results"], insights);

            if (!checkData) return;

            var formated = {
                "name": "flare",
                "children": []
            }

            for (var i in insights["Results"]) {
                formated["children"].push({
                    "name": i,
                    "value": insights["Results"][i]
                });
            }

            //Update stats
            document.getElementById("matchTweets").innerHTML = insights.Matched;
            document.getElementById("searchTweets").innerHTML = insights.Found;

            hierarchy.nodes(formated);
            x.domain([0, 10000]).nice();
            down(formated, 0);
        }

        var parseModel = (insights) => {

            var SimilaritySentiment = {
                "Occurences": []
            }

            var VaderSentiment = {
                "Occurences": [],
                "Negative": [],
                "Neutral": [],
                "Positive": [],
                "Compound": [],
            }

            var isVader;
            for (var prop in insights) {
                isVader = checkData(["Occurences", "Negative", "Neutral", "Positive", "Compound"], insights[prop]);
                if (!isVader) {
                    Object.keys(insights[prop]).forEach((key) => {
                        SimilaritySentiment[key] = [];
                    });
                }
                break;
            }

            var ordered = {};
            Object.keys(insights).sort().forEach(function (key) {
                ordered[key] = insights[key];
            });
            insights = ordered;

            isVader && Object.keys(insights).forEach((timestamp) => {
                Object.keys(insights[timestamp]).forEach((category) => {
                    VaderSentiment[category].push([Number(timestamp), insights[timestamp][category]]);
                });
            });

            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            var createSentimentChart = (categoryName, index, plotOptions?) => {
                document.getElementById("InsightsCategories").insertAdjacentHTML('beforeend',
                    "<div id='" + categoryName + "SentimentInsights" + "' style='height: 550px; width: 100%; text-shadow:none'></div><br/>");
                SentimentChart.push(new InitializeChart(categoryName + "SentimentInsights", "Sentiment for " + categoryName));
                SentimentChart[index].chart.update({
                    chart: {
                        backgroundColor: null,
                        renderTo: 'container',
                        zoomType: 'x',
                        spacingRight: 20,
                        ///type: 'column'
                    },
                    legend: {
                        enabled: true
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 3600 * 1000,
                        minTickInterval: 1000
                    },
                    plotOptions: {
                        //column: {
                        //    boostThreshold: 0,
                        //    turboThreshold: 0
                        //}
                    },
                    series: {
                        dataGrouping: {
                            enabled: true
                        }
                    }
                });


                if (isVader) {
                    for (var sentimentName in VaderSentiment) {
                        SentimentChart[index].AddNewSeries({
                            name: sentimentName,
                            //color: "red",rgb(124, 181, 236);
                            showInNavigator: true,
                            data: VaderSentiment[sentimentName]
                        }, false);

                        console.log(VaderSentiment["Occurences"][0], VaderSentiment["Occurences"][VaderSentiment["Occurences"].length - 1])
                    }
                } else {
                    for (var sentimentName in SimilaritySentiment) {
                        SentimentChart[index].AddNewSeries({
                            name: sentimentName,
                            //color: "red",rgb(124, 181, 236);
                            showInNavigator: true,
                            data: SimilaritySentiment[sentimentName]
                        }, false);

                    }
                }

                SentimentChart[index].chart.redraw();
                console.log("redraw chart");
            }


            isVader && createSentimentChart("Vader Analysis", 0);

            !isVader && Object.keys(insights).forEach((timestamp) => {
                SimilaritySentiment["Occurences"].push([Number(timestamp), 1]);
                Object.keys(insights[timestamp]).forEach((category) => {
                    SimilaritySentiment[category].push([Number(timestamp), insights[timestamp][category]]);
                });
            });

            !isVader && createSentimentChart("Sentiment Proximity", SentimentChart.length);
        }

        var checkData = (keys, data) => {
            console.log(Object.keys(data));

            var hasAllKeys = keys.every(function (item) {
                return data.hasOwnProperty(item);
            });

        }
    }

    module Prepare {
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
            createDom(<HTMLElement>$divArray[i], names[i]);
        }

        function createDom($container: HTMLElement, tag: string) {

            console.log("button", $container.getElementsByClassName("entryButton"));
            $container.id = tag + "_Prepare";
            $container.getElementsByClassName("entryButton")[0].addEventListener("click", () => {
                addText($container, tag);
            });
        }

        function addText($container, tag, input?) {
            input = input || <HTMLInputElement>$container.getElementsByClassName("entryInput")[0].value;
            //if (this.Negative[input.value]) {
            //    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Text already exist.", "error");
            //    return;
            //}    
            console.log("input", input);
            if (typeof (Tags[tag][input]) != "undefined") {
                Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag already exists.", "warning");
            } else if (input == "") {
                Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag cannot be empty.", "error");
            } else {
                $container.getElementsByClassName("errorMessage")[0].innerHTML = "";
                var $element = document.createElement("div");
                $element.innerHTML = input;
                console.log("input", input);
                $container.getElementsByClassName("entries")[0].appendChild($element);
                Tags[tag][input] = true;
                $container.getElementsByClassName("entryInput")[0].value = "";
                console.log(Tags);
            }
        }


        var input = <HTMLInputElement>document.getElementById("searchPath");
        document.getElementById("searchButton").addEventListener("click", () => {
            API.Search(input.value, Tags)
        });

        document.getElementById("exportPrepareConfig").addEventListener("click", () => {
            Export();
        });

        export function Export() {
            var a = document.createElement("a");
            var file = new Blob([JSON.stringify(Tags)], { type: "application/json" });
            a.href = URL.createObjectURL(file);
            a.download = "Prepare_Export.json";
            a.click();
        }

        var errorMessage = document.getElementById("prepareErrorMessage");

        var fileInput = <HTMLInputElement>document.getElementById('importPrepare');

        fileInput.addEventListener('change', function (e) {
            console.log("File Opened");
            var file = fileInput.files[0];
            var textType = /json.*/;

            try {
                errorMessage.innerText = "Reading file";
                var reader = new FileReader();

                reader.onload = function (e) {
                    Import(JSON.parse(reader.result));
                    errorMessage.innerText = "";
                }

                reader.readAsText(file);
            } catch (ex) {
                errorMessage.innerText = "File could not be loaded. Error: " + ex;
            }
        });


        export function Import(input: string) {
            var data = input;//JSON.parse(input);
            console.log(data);

            Object.keys(Tags).forEach((tag) => {
                var $container = document.getElementById(tag + "_Prepare");

                data[tag] && Object.keys(data[tag]).forEach((keyword) => {
                    console.log("tag", keyword);
                    addText($container, tag, keyword);
                })
            });

            //Object.keys(input).forEach((categoryName, index) => {
            //    console.log("input", input, "cat", categoryName, "i", index);
            //    Categories[categoryName] = new Category(categoryName);
            //    var $div = document.getElementById(categoryName + "_category");
            //    Object.keys(input[categoryName]["Negative"]).forEach((tag, index1) => {
            //        Categories[categoryName].AddEntry($div, tag, 1);

            //    });

            //    Object.keys(input[categoryName]["Positive"]).forEach((tag, index1) => {
            //        Categories[categoryName].AddEntry($div, tag, 0);

            //    });
            //})

        }
    }

    module Model {

        export var Categories: Object = {};

        var $container = document.getElementById("Model");
        document.getElementById("exportModelConfig").addEventListener("click", Export);
        var errorMessage = document.getElementById("categoryErrorMessage");

        var fileInput = <HTMLInputElement>document.getElementById('importModelConfig');
        fileInput.addEventListener('change', function (e) {
            var file = fileInput.files[0];
            var textType = /json.*/;

            try {
                errorMessage.innerText = "Reading file";
                var reader = new FileReader();

                reader.onload = function (e) {
                    Import(JSON.parse(reader.result));
                    errorMessage.innerText = "";
                }

                reader.readAsText(file);
            } catch (ex) {
                errorMessage.innerText = "File could not be loaded. Error: " + ex;
            }
        });

        class Category {
            public Name;

            public Positive: Object;
            public Negative: Object;

            constructor(name: string) {
                this.Positive = {};
                this.Negative = {};
                this.Name = name;
                this.createDom(name);
            }

            public Add = (str: string, type: string) => {
                this[type][str] = true;
            }

            public Remove = (str: string, type: string) => {
                delete this[type][str];
            }

            private createDom(name: string) {
                var $div = <HTMLElement>document.getElementById("defaultCategoryContainer").cloneNode(true);
                $div.id = name + "_category";
                $div.classList.remove("hiddenContent");
                var $names = $div.getElementsByClassName("textHeader");
                $names[0].innerHTML = "Pro " + name;
                $names[1].innerHTML = "Anti " + name;

                //var child: 
                //$div.appendChild();

                $container.insertBefore($div, $container.childNodes[$container.childNodes.length - 2]);
                $div.getElementsByClassName("entryButton")[0]
                    .addEventListener("click", () => {
                        var input = <HTMLInputElement>$div.getElementsByClassName("entryInput")[0];
                        if (this.Positive[input.value]) {
                            Log.logToDiv($div.getElementsByClassName("errorMessage")[0], "Text already exist.", "error");
                            return;
                        }
                        $div.getElementsByClassName("errorMessage")[0].innerHTML = "";
                        this.AddEntry($div, input.value, 0);
                        input.value = "";
                    });

                $div.getElementsByClassName("entryButton")[1]
                    .addEventListener("click", () => {
                        var input = <HTMLInputElement>$div.getElementsByClassName("entryInput")[1];
                        if (this.Negative[input.value]) {
                            Log.logToDiv($div.getElementsByClassName("errorMessage")[1], "Text already exist.", "error");
                            return;
                        }
                        $div.getElementsByClassName("errorMessage")[1].innerHTML = "";
                        this.AddEntry($div, input.value, 1);
                        input.value = "";
                    });
            }

            public AddEntry($div, text, type) {

                $div.getElementsByClassName("errorMessage")[type].innerHTML = "";
                var $element = document.createElement("div");
                $element.innerHTML = text;
                console.log("input.value", text);
                $div.getElementsByClassName("entries")[type].appendChild($element);
                this.Add(text, type == 0 ? "Positive" : "Negative");
            }

            private removeDom(name: string) {
                document.getElementById(name + "_category").remove();
            }
        };

        document.getElementById("addNewCategory").addEventListener("click", () => {
            var input = <HTMLInputElement>document.getElementById("inputCategoryText");
            if (typeof (Categories[input.value]) != "undefined") {
                Log.logToDiv("categoryErrorMessage", "Category already exists. Select a different name.", "warning");
            } else if (input.value == "") {
                Log.logToDiv("categoryErrorMessage", "Category name cannot be empty.", "error");
            } else {
                Categories[input.value] = new Category(input.value);
                console.log("addNewCategory", Categories);
                input.value = "";
                document.getElementById("categoryErrorMessage").innerHTML = "";
            }
        });

        export function Export() {
            var a = document.createElement("a");
            var file = new Blob([JSON.stringify(Categories)], { type: "application/json" });
            a.href = URL.createObjectURL(file);
            a.download = "Model_Export.json";
            a.click();
        }

        export function Import(input: string) {
            Object.keys(input).forEach((categoryName, index) => {
                console.log("input", input, "cat", categoryName, "i", index);
                Categories[categoryName] = new Category(categoryName);
                var $div = document.getElementById(categoryName + "_category");
                Object.keys(input[categoryName]["Negative"]).forEach((tag, index1) => {
                    Categories[categoryName].AddEntry($div, tag, 1);

                });

                Object.keys(input[categoryName]["Positive"]).forEach((tag, index1) => {
                    Categories[categoryName].AddEntry($div, tag, 0);

                });
            })

        }

        document.getElementById("modelVaderButton").addEventListener("click", () => {
            API.StartVader((<HTMLInputElement>document.getElementById("modelDirectoryInput")).value);
        });

        document.getElementById("customScriptButton").addEventListener("click", () => {
            API.StartPython((<HTMLInputElement>document.getElementById("modelDirectoryInput")).value);
        });

        document.getElementById("modelSimilarityButton").addEventListener("click", () => {
            API.StartSimilarity((<HTMLInputElement>document.getElementById("modelDirectoryInput")).value);
        });

    }

    module Settings {
        export var Debug = true;

    }

    class Log {
        public static logToDiv(id: string | Element, message: string, level: string) {
            var $element: HTMLElement;
            if (typeof (id) == "string") {
                $element = document.getElementById(id);
            } else {
                $element = <HTMLElement>id;
            }
            $element.innerHTML = message;
            if (level == "error") {
                $element.style.color = "#f44336";
            } else if (level == "warning") {
                $element.style.color = "#ffd54f";
            } else if (level == "info") {
                $element.style.color = "#66bb6a";
            }
            if (Settings.Debug) {
                console.log(message);
            }
        }

        public static clearDiv(id: string | Element) {
            var $element: HTMLElement;
            if (typeof (id) == "string") {
                $element = document.getElementById(id);
            } else {
                $element = <HTMLElement>id;
            }
            $element.innerHTML = "";
        }

    }

    export module API {
        var location = window.location.href;

        export function StartVader(path: string) {
            Log.logToDiv("modelErrorMessage", "Starting VADER analysis...", "info");

            $.ajax({
                url: GetUrl("ModelController/StartVader"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("modelErrorMessage", "Error occured while trying to start VADER analysis", "error") }
            }).done(function (data) {
                Log.logToDiv("modelErrorMessage", "Finished running VADER analysis.", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
        }

        export function StartSimilarity(path: string) {
            Log.logToDiv("modelErrorMessage", "Starting Similarity analysis...", "info");

            $.ajax({
                url: GetUrl("ModelController/StartModeling"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("modelErrorMessage", "Error occured while running similarity analysis", "error") }
            }).done(function (data) {
                Log.logToDiv("modelErrorMessage", "Finished running similarity analysis.", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
        }

        export function StartPython(path: string) {
            Log.logToDiv("modelErrorMessage", "Starting python script...", "info");

            $.ajax({
                url: GetUrl("ModelController/StartPythonScript"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("modelErrorMessage", "Error running python script...", "error") }
            }).done(function (data) {
                Log.logToDiv("modelErrorMessage", "Finished running python script...", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
        }



        export function GetFiles(path: string) {
            console.log(GetUrl("FilesController/getFiles"));
            Log.logToDiv("manageErrorMessage", "Retrieving data...", "info");
            document.getElementById("standardFilesFound").innerHTML = "-";
            document.getElementById("compressedFilesFound").innerHTML = "-";
            document.getElementById("filteredFilesFound").innerHTML = "-";
            document.getElementById("APIFilesFound").innerHTML = "-";
            document.getElementById("StatsFilesFound").innerHTML = "-";
            document.getElementById("totalFilesFound").innerHTML = "-";
            document.getElementById("selectedSource").innerHTML = "-";

            $.ajax({
                url: GetUrl("FilesController/getFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("manageErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error") }
            }).done(function (data) {
                data = JSON.parse(data);
                console.log(data);
                document.getElementById("totalFilesFound").innerHTML = data.Standard + data.Compressed + data.Filtered + data.API + data.Stats;
                document.getElementById("standardFilesFound").innerHTML = data.Standard;
                document.getElementById("compressedFilesFound").innerHTML = data.Compressed;
                document.getElementById("filteredFilesFound").innerHTML = data.Filtered;
                document.getElementById("APIFilesFound").innerHTML = data.API;
                document.getElementById("StatsFilesFound").innerHTML = data.Stats;
                document.getElementById("selectedSource").innerHTML = (<HTMLInputElement>document.getElementById("manageInput")).value;
                Log.logToDiv("manageErrorMessage", "Finished scaning directory for files.", "info");
            });
        }

        export function Decompress(path: string) {
            Log.logToDiv("decompressErrorMessage", "Decompressing files...", "info");

            $.ajax({
                url: GetUrl("FilesController/decompressFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("decompressErrorMessage", "Error occured while trying to decompress", "error") }
            }).done(function (data) {
                Log.logToDiv("decompressErrorMessage", "Finished decompressing.", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
        }

        export function Search(path: string, _tags: Object) {
            Log.logToDiv("decompressErrorMessage", "Searching files...", "info");
            var tags = {};
            tags["Text"] = Object.keys(_tags["Text"]);
            debugger;
            $.ajax({
                url: GetUrl("SearchController/search"),
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ "Path": path, "Tags": tags }),
                success: function (data) {
                    console.log("success ajax")
                    if (data.state == 0) {
                        document.location.reload();
                    }
                }
            });

            //$.post(GetUrl("SearchController/search"), { "": JSON.stringify([path, tags]) }, function (data, status) {
            //    debugger;
            //    data.success == false && Log.logToDiv("decompressErrorMessage", data.responseText, "error");
            //    data.success == true && Log.logToDiv("decompressErrorMessage", data.responseText, "info");
            //    console.log("Some callback", data, status)
            //}).done(function (data) {
            //    console.log("Done", data);
            //}).fail(function (data) {
            //    console.log("Error", data);
            //});

            //$.ajax({
            //    url: GetUrl("SearchController/search"),
            //    type: "GET",
            //    dataType: "text",
            //    data: path,
            //    processData: false,
            //    contentType: "text/xml; charset=\"utf-8\"",
            //    success: () => { },
            //    error: () => { Log.logToDiv("decompressErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error") }
            //}).done(function (data) {
            //    Log.logToDiv("decompressErrorMessage", "Finished decompressing.", "info");
            //    //Log.clearDiv("decompressErrorMessage");
            //});
        }

        export function StartStream(keyword: string, path: string) {
            Log.logToDiv("streamErrorMessage", "Starting stream...", "info");
            $.post(GetUrl("FilesController/startStream"), { "": [keyword, path] }, function (data, status) {
                debugger;
                data.success == false && Log.logToDiv("streamErrorMessage", data.responseText, "error");
                data.success == true && Log.logToDiv("streamErrorMessage", data.responseText, "info");
                console.log("Some callback", data, status)
            }).done(function (data) {
                console.log("Done", data);
            }).fail(function (data) {
                console.log("Error", data);
            });




            //$.ajax({
            //    url: GetUrl("FilesController/startStream"),
            //    type: "POST",
            //    dataType: "json",
            //    data: JSON.stringify({ list: [keyword, path] }),
            //    processData: false,
            //    contentType: "application/json; charset=utf-8", 
            //    success: () => { },
            //    error: () => {  }
            //}).done(function (data) {
            //    data.success == "False" && Log.logToDiv("streamErrorMessage", data.responseText, "error");
            //    data.success == "True" && Log.logToDiv("streamErrorMessage", "Steam started.", "info");
            //    //Log.clearDiv("decompressErrorMessage");
            //});
        }

        function GetUrl(url: string) {
            return window.location.href + url;
        }

    }

    module Helper {
        export function appendElement(value: string, $parent) {
            var $element = document.createElement("div");
            $element.innerHTML = value;
            $parent.appendChild($element);
        }
    }

    //totalSearched
    //totalMatched
    //Total_Cat
    /**
    * Interface describing the data coming from the report file
    * Although this is a good interface for adding data, it should be precompiled before displaying for best loading times!
    */
    interface Report {
        "Tweets": {
            [x: string]: {
                "noOfTweets": number,
                "categoryTweets": {
                    [x: string]: number
                },
                "noOfMatchedTweets": number,
                "sentiment": Array<{
                    "name": string,
                    "entries": Array<number>,
                    "negative": number,
                    "positive": number,
                    "average": number
                }>,
            }
        },
        "Keywords": {
            [x: string]: number
        }

    }

}
