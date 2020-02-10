(function() {

    // fetch links
    var linksTopArr;
    var linksBottomArr;
    var $headlinesTop = $("#headlinesTop");
    var $headlinesBottom = $("#headlinesBottom");

    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function(data) {
            linksTopArr = data;
            linksBottomArr = data;

            var linksTopText = "";
            var linksBottomText = "";

            for (var i = 0; i < linksTopArr.length; i++) {
                linksTopText += `<a class="top" href="${linksTopArr[i]["url"]}">${linksTopArr[i]["headline"]}</a>`;
                linksBottomText += `<a class="bottom" href="${linksBottomArr[i]["url"]}">${linksBottomArr[i]["headline"]}</a>`;
            }

            $headlinesTop.html(linksTopText);
            $headlinesBottom.html(linksBottomText);

        },
        error: function(err) {
            console.log("this didn't work :(", err );
        }

    });


    // Code for top and bottom tickers

    var myReqTop;
    var myReqBottom;

    $(document).on("mouseover", "A", function(event) {
        $(this).css({
            color: "blue",
            textDecorationLine: "underline"
        });

        if (event.target.parentNode.id == "headlinesTop") {
            cancelAnimationFrame(myReqTop);
        } else {
            cancelAnimationFrame(myReqBottom);
        }
    }).on("mouseout", "A", function(event) {
        $(this).css({
            color: "black",
            textDecorationLine: "none"
        });

        if (event.target.parentNode.id == "headlinesTop") {
            myReqTop = requestAnimationFrame(animeTop);
        } else {
            myReqBottom = requestAnimationFrame(animeBottom);
        }
    });

    // code for top ticker

    var leftTop = $("#headlinesTop").offset().left;

    function animeTop() {

        leftTop--;
        var width = $("a.top").eq(0).outerWidth();

        if (leftTop <= -width) {
            leftTop += width;
            $("#headlinesTop").append($("a.top").eq(0));
        }

        $("#headlinesTop").css({
            left: leftTop + "px"
        });

        myReqTop = requestAnimationFrame(animeTop);
    }

    myReqTop = requestAnimationFrame(animeTop);


    //code for bottom ticker

    var linksBottom = $("a.bottom");
    var last = linksBottom.length - 1;


    var rightBottom = $(document.body).outerWidth();

    function animeBottom() {

        rightBottom--;

        var width = $("a.bottom").eq(last).outerWidth();

        if (rightBottom <= -width) {
            rightBottom += width;
            $("#headlinesBottom").prepend($("a.bottom").eq(last));
        }

        $("#headlinesBottom").css({
            right: rightBottom + "px"
        });

        myReqBottom = requestAnimationFrame(animeBottom);
    }

    myReqBottom = requestAnimationFrame(animeBottom);

})();
