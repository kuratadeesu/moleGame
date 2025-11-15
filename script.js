let score = 0;
let gameInterval;
let time = 10;
let timeInterval;
let moleTimer;
let gameRunning = false; // ← ① ゲーム中の連打防止

$(function () {

    $("#startBtn").on("click", function () {
        if (!gameRunning) {
            startGame();
        }
    });

    $("#restartBtn").on("click", function () {
        $("#resultPopup").addClass("hidden");
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
    gameRunning = true; // ← スタートボタン無効化
    $("#startBtn").prop("disabled", true);

    score = 0;
    time = 10;

    $("#score").text("Score: " + score);
    $("#time").text("Time: " + time);
    $("#resultPopup").addClass("hidden");

    clearInterval(gameInterval);
    clearInterval(timeInterval);
    clearTimeout(moleTimer);
    $(".hole").removeClass("active");

    // ② モグラの動きを少し高速化（難易度UP）
    const appearInterval = 750; // 出現間隔（900→750）
    const stayTime = 700; 

    gameInterval = setInterval(() => {
        showRandomMole(stayTime);
    }, appearInterval);

    timeInterval = setInterval(() => {
        time--;
        $("#time").text("Time: " + time);

        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

function showRandomMole(stayTime) {
    $(".hole").removeClass("active");

    const index = Math.floor(Math.random() * 9);
    const hole = $(".hole").eq(index);
    hole.addClass("active");

    clearTimeout(moleTimer);
    moleTimer = setTimeout(() => {
        hole.removeClass("active");
    }, stayTime);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    clearTimeout(moleTimer);
    $(".hole").removeClass("active");

    gameRunning = false;
    $("#startBtn").prop("disabled", false);

    // ⑤ alert の代わりにポップアップ表示
    $("#finalScore").text("あなたのスコアは " + score + " 点！");
    $("#resultPopup").removeClass("hidden");
}
