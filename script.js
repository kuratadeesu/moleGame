let score = 0;
let gameInterval;
let time = 10;
let timeInterval;
let moleTimer;
let gameRunning = false;
let lastIndex = -1; // 同じ穴連続防止用（任意）

// 難易度設定
const difficulties = {
    easy:   { appear: 900, stay: 700 },
    normal: { appear: 750, stay: 500 },
    hard:   { appear: 550, stay: 350 }
};

$(function () {

    $("#startBtn").on("click", function () {
        if (!gameRunning) startGame();
    });

    $("#restartBtn").on("click", function () {
        $("#resultPopup").addClass("hidden");
        startGame();
    });

    // イベントを1回だけバインド（動的にdata-typeを書き換えてもOK）
    $(".mole").on("click touchstart", function (e) {
        e.preventDefault(); // touchstart の遅延や二重発火を防ぐ

        const hole = $(this).parent();
        if (!hole.hasClass("active")) return;

        const type = $(this).attr("data-type");

        let add = 0;
        if (type === "normal") add = 1;
        else if (type === "rare") add = 3;
        else if (type === "bad") add = -5;

        score += add;
        $("#score").text("Score: " + score);

        // 座標取得（タッチ対応）
        let pageX = e.pageX;
        let pageY = e.pageY;
        if (pageX === undefined || pageY === undefined) {
            // タッチイベントや何かで取得できない場合、穴の中心を採る
            const rect = hole[0].getBoundingClientRect();
            pageX = rect.left + rect.width / 2 + window.scrollX;
            pageY = rect.top + rect.height / 2 + window.scrollY;
        }

        // 浮き文字を表示（ページ座標）
        showFloatingText(pageX, pageY, add);

        hole.removeClass("active");
    });
});

function startGame() {
    gameRunning = true;
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

    // 選択中の難易度を取得（fallback は normal）
    const diff = $('input[name="diff"]:checked').val() || "normal";
    const appearInterval = (difficulties[diff] && difficulties[diff].appear) ? difficulties[diff].appear : difficulties.normal.appear;
    const stayTime = (difficulties[diff] && difficulties[diff].stay) ? difficulties[diff].stay : difficulties.normal.stay;

    gameInterval = setInterval(() => {
        showRandomMole(stayTime);
    }, appearInterval);

    timeInterval = setInterval(() => {
        time--;
        $("#time").text("Time: " + time);

        if (time <= 0) endGame();
    }, 1000);
}

function showRandomMole(stayTime) {
    // まず全ての穴から active を外す（単純実装）
    $(".hole").removeClass("active");

    // index をランダムに選ぶが、直前と同じ穴は避ける（簡易的）
    let index;
    do {
        index = Math.floor(Math.random() * 9);
    } while (index === lastIndex && Math.random() < 0.8); // 80%の確率で連続回避（完全禁止しない）

    lastIndex = index;

    const hole = $(".hole").eq(index);
    const mole = hole.find(".mole");

    const type = getRandomMoleType();
    mole.attr("data-type", type);

    hole.addClass("active");

    clearTimeout(moleTimer);
    moleTimer = setTimeout(() => {
        hole.removeClass("active");
    }, stayTime);
}

// モグラ確率
function getRandomMoleType() {
    const r = Math.random();
    if (r < 0.70) return "normal"; // 70%
    if (r < 0.95) return "rare";   // 25%
    return "bad";                  // 5%
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    clearTimeout(moleTimer);
    $(".hole").removeClass("active");

    gameRunning = false;
    $("#startBtn").prop("disabled", false);

    $("#finalScore").text("あなたのスコアは " + score + " 点！");
    $("#resultPopup").removeClass("hidden");
}

// ★ 浮き文字エフェクト
function showFloatingText(pageX, pageY, value) {
    const text = $("<div class='floating-text'></div>");

    if (value > 0) {
        text.text("+" + value);
        text.css("color", value === 3 ? "#ffd700" : "#00cc66");
    } else {
        text.text(value); // 例: -5
        text.css("color", "#ff3333");
    }

    $("body").append(text);

    // テキスト幅の半分を引いて中央寄せ
    const offsetX = text.width() / 2;
    const offsetY = text.height() / 2;

    text.css({
        left: pageX - offsetX + "px",
        top: pageY - offsetY + "px",
        position: "absolute"
    });

    // アニメーション後に削除
    setTimeout(() => { text.remove(); }, 900);
}
