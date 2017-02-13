var color = localStorage.getItem("color");
if (color) {
    switch (color) {
        case "blue":
            setSkin("blue");
            break;
        case "pink":
            setSkin("pink");
            break;
        case "yellow":
            setSkin("yellow");
            break;
        default:
            setSkin("green");
            break;
    }

}

function closeTip() {
    document.getElementById("tips").style.display = "none";
}

function setSkin(color) {
    document.getElementById("sethome").className = "sethome bac_" + color;
    document.getElementById("active").className = "active bac_" + color;
    document.getElementById("menus").className = "menus boder_top_" + color;
    document.getElementById("recommend").className = "recommend text_" + color + " g-ib";
    document.getElementById("govsite-top").className = "govsite-top boder_" + color;
    document.getElementById("channelSpan").className = "channelSpan boder_top_" + color + " text_" + color;
    // localStorage.color = color;
    localStorage.setItem("color", color);
}
