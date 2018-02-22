declare var $;

module App {

    module Navigator {
        var $topNav: HTMLElement = <HTMLElement>document.getElementsByTagName("topNav")[0];
        var $bottomNav = <HTMLElement>document.getElementsByTagName("bottomNav")[0];

        var $active: HTMLElement = document.getElementById("Home");
        var $active_content: HTMLElement = document.getElementById("Home");

        var setUpListeners = (element: Element, callback: Function) => {
            //selectedButton
            element.children.length;

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
                    $active_content.style.top = -document.body.clientHeight + "px";
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

        setUpListeners($bottomNav, () => { });
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

        function addEntry($element, text) {

        }
    }

    module Insights {

    }

    module Prepare {
        var names = ["Text", "Hashtags", "Reply", "User"]
        var Tags =
            {
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

            $container.getElementsByClassName("entryButton")[0].addEventListener("click", () => {
                debugger;
                var input = <HTMLInputElement>$container.getElementsByClassName("entryInput")[0];
                //if (this.Negative[input.value]) {
                //    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Text already exist.", "error");
                //    return;
                //}            
                if (typeof (Tags[tag][input.value]) != "undefined") {
                    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag already exists.", "warning");
                } else if (input.value == "") {
                    Log.logToDiv($container.getElementsByClassName("errorMessage")[0], "Tag cannot be empty.", "error");
                } else {
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
    }

    module Model {

        export var Categories: Object = {};

        var $container = document.getElementById("Model");
        document.getElementById("exportConfig").addEventListener("click", Export);

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
                        var $element = document.createElement("div");
                        $element.innerHTML = input.value;
                        console.log("input.value", input.value);
                        $div.getElementsByClassName("entries")[0].appendChild($element);
                        this.Add(input.value, "Positive");
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
                        if (this.Negative[input.value]) return;
                        var $element = document.createElement("div");
                        $element.innerHTML = input.value;
                        console.log("input.value", input.value);
                        $div.getElementsByClassName("entries")[1].appendChild($element);
                        this.Add(input.value, "Negative");
                        input.value = "";
                    });
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

        export function Import(category: string) {
            Categories = JSON.parse(category);
        }

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

        export function GetFiles(path: string) {
            console.log(GetUrl("FilesController/getFiles"));
            Log.logToDiv("manageErrorMessage", "Retrieving data", "info");
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
                success: () => { },
                error: () => { Log.logToDiv("manageErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error") }
            }).done(function (data) {
                data = JSON.parse(data);
                console.log(data);
                document.getElementById("totalFilesFound").innerHTML = data.Standard + data.Compressed;
                document.getElementById("standardFilesFound").innerHTML = data.Standard;
                document.getElementById("compressedFilesFound").innerHTML = data.Compressed;
                document.getElementById("selectedSource").innerHTML = (<HTMLInputElement>document.getElementById("manageInput")).value;
                Log.logToDiv("manageErrorMessage", "Finished scaning directory for files.", "info");
            });
        }

        export function Decompress(path: string) {
            Log.logToDiv("decompressErrorMessage", "Decompressing files", "info");

            $.ajax({
                url: GetUrl("FilesController/decompressFiles"),
                type: "GET",
                dataType: "text",
                data: path,
                processData: false,
                contentType: "text/xml; charset=\"utf-8\"",
                success: () => { },
                error: () => { Log.logToDiv("decompressErrorMessage", "Error occured while trying to retrieve directories from the selected location.", "error") }
            }).done(function (data) {
                Log.logToDiv("decompressErrorMessage", "Finished decompressing.", "info");
                //Log.clearDiv("decompressErrorMessage");
            });
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
}
