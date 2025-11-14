let score = 0;
let gameInterval;
let time = 10;
let timeInterval;
let moleTimer;

$(function () {

    $("#startBtn").on("click", function () {
        startGame();
    });

    $(".mole").on("click touchstart", function () {
        if ($(this).parent().hasClass("active")) {
            score++;
            $("#score").text("Score: " + score);
            $(this).parent().removeClass("active");
        }
    });

});

function startGame() {
    // スコア＆時間初期化
    score = 0;
    time = 10;

    $("#score").text("Score: " + score);
    $("#time").text("Time: " + time);

    // いったん全て停止
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    clearTimeout(moleTimer);
    $(".hole").removeClass("active");

    // モグラ出現開始
    gameInterval = setInterval(showRandomMole, 900);

    // 10 秒カウント開始
    timeInterval = setInterval(() => {
        time--;
        $("#time").text("Time: " + time);

        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

function showRandomMole() {
    $(".hole").removeClass("active");

    const index = Math.floor(Math.random() * 9);
    const hole = $(".hole").eq(index);
    hole.addClass("active");

    // モグラが出てる時間を制御
    clearTimeout(moleTimer);
    moleTimer = setTimeout(() => {
        hole.removeClass("active");
    }, 500);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    clearTimeout(moleTimer);
    $(".hole").removeClass("active");

    alert("終了！あなたのスコアは " + score + " 点です！");
}
