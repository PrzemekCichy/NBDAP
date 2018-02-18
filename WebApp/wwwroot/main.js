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
            console.log(input.value);
            API.GetFiles(input.value);
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
        return Log;
    }());
    var API;
    (function (API) {
        var location = window.location.href;
        function GetFiles(path) {
            console.log(GetUrl("FilesController/getFiles"));
            $.ajax({
                url: GetUrl("FilesController/getFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: function (data) { console.log(data); },
                error: function () { console.log("rip"); }
            }).done(function (data) {
                data = JSON.parse(data);
                var $standard = document.getElementById("standardFiles");
                var $compressed = document.getElementById("compressedFiles");
                data.Standard.forEach(function (value) {
                    Helper.appendElement(value, $standard);
                });
                data.Compressed.forEach(function (value) {
                    Helper.appendElement(value, $compressed);
                });
            });
        }
        API.GetFiles = GetFiles;
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
})(App || (App = {}));
//# sourceMappingURL=main.js.map