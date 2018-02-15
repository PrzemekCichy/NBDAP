var Buttons = {
    topNav: ["Manage", "Prepare", "Model", "Get Insights"],
    bottomNav: ["Help", "About", "Settings", "Logs"],
    sideNav: ["Add", "Remove", " "]
};


var buttons = ["Manage", "Prepare", "Model", "Get Insights"];
var bottomButtons = ["Help", "About", "Settings", "Logs"];
var sideButtons = [];

var $topNav: HTMLElement = <HTMLElement>document.getElementsByTagName("topNav")[0];
var width = 100 / buttons.length;

buttons.forEach((name) => {
    //create outer element
    var $outerDiv = $topNav.appendChild(document.createElement("div"));

    $outerDiv.style.width = width + "%";
    $outerDiv.style.display = "inline-block";

    //Create inner element
    var $div = $outerDiv.appendChild(document.createElement("h6"));
    $div.appendChild(document.createTextNode(name));
    $div.id = name;
    $div.className = "navButton";
});

var $active = document.getElementById("Manage");
$active.style.color = "#dc322f";

$active.addEventListener("click", () => {
    console.log("click");
    if ($topNav.className != "bottomNav") {
        $topNav.className = "bottomNav";
        console.log("window.innerHeight", document.body.clientHeight);
        var body = document.body,
            html = document.documentElement;
        $topNav.style.transform = " translateY(" + (document.body.clientHeight - 54) + "px)";

    } else {
        $topNav.className = "";
        $topNav.style.transform = " translate(0, 0)";
    }
});

var $bottomNav = document.getElementsByTagName("bottomNav")[0];
var bottomWidth = 100 / bottomButtons.length;

bottomButtons.forEach((name) => {
    //create outer element
    var $outerDiv = $bottomNav.appendChild(document.createElement("div"));

    $outerDiv.style.width = bottomWidth + "%";
    $outerDiv.style.display = "inline-block";

    //Create inner element
    var $div = $outerDiv.appendChild(document.createElement("span"));
    $div.appendChild(document.createTextNode(name));
    $div.id = name;
    $div.className = "navButton bottomNavButton";
});

var content = ["Twitter Data Analysis Platform"];

var topNav = document.getElementsByTagName("topNav")[0];



