let accesskey = 22;

function login() {
  if (
    localStorage.token == null &&
    localStorage.token == undefined &&
    localStorage.type == null &&
    localStorage.type == undefined
  ) {
    if (!location.href.match("cert")) {
      var goUrl =
        "https://api.gitofolio.com/token/personal?accesskey=" + accesskey;
      var nextUrl =
        "https://api.gitofolio.com/oauth?application=github&redirect=" +
        location.origin +
        "/login/token&accesskey=" +
        accesskey;
      fetch(goUrl, {
        method: "HEAD",
        headers: {
          credentials: "omit",
          mode: "cors",
          Vary: "origin",
        },
        redirect: "follow",
      }).then((res) => {
        window.location = nextUrl;
      });
    }
  }
}

var position = document.querySelector(".wrap");
var box = document.querySelector(".box");
//scroll시 항상 맨 위에 고정
window.addEventListener("resize", function () {
  position.scrollIntoView();
  box.scrollIntoView();
  var scrollTop = position.scrollTop;
  // 현재 보이는 영역의 높이(스크롤로 감춰진곳은 계산 X)
  var innerHeight = position.innerHeight;
  // 스크롤 포함 영역의 높이(스크롤로 감춰진곳 계산 O)
  var scrollHeight = position.scrollHeight;
  // 스크롤 맨 아래 일때
  if (scrollTop + innerHeight >= scrollHeight) {
    position.style.overflow = "hidden";
  } else {
    position.style.overflow = "scroll!important;";
  }
});

let policy_display = false;
let click = document.querySelector(".arrow");
let policy_text = document.querySelector(".policy_text");

click.addEventListener("click", function () {
  if (policy_display == false) {
    box.style.opacity = "0";
    setTimeout(() => {
      box.style.display = "none";
      policy_text.style.display = "flex";
    }, 500);

    setTimeout(() => {
      policy_text.style.opacity = "1";
    }, 600);

    policy_display = true;
  } else {
    policy_text.style.opacity = "0";
    setTimeout(() => {
      policy_text.style.display = "none";
      box.style.display = "flex";
    }, 500);

    setTimeout(() => {
      box.style.opacity = "1";
    }, 600);
    policy_display = false;
  }
});
