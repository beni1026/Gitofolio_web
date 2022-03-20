let UserName = document.querySelector(".name"); //유저 이름
let CardNum = document.getElementById("cardnum"); // 카드개수
let VisitNum = document.getElementById("visitnum"); //방문자수
let profileUrl = document.getElementById("pfimg"); //프로필 이미지
let accountDelete = document.querySelector(".active"); //계정삭제문구
let plus = document.querySelector(".plus");

let url = window.location.href;
let User = url.substring(url.lastIndexOf("/") + 1); //파라미터로 유저 가져오기


//유저 받아오기
const getUser = () => {
  const response = fetch("https://api.gitofolio.com/user/" + User, {
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  return response.then((res)=> {
    if (res.status < 400) return res.json();
    else location.href = "/error?code=" + res.status; 
  })
};  

//유저 인포 변경
async function changeUserinfo() {
  let data;
  data = await getUser();
  UserName.innerHTML = data.name; //이름변경
  profileUrl.src = data.profileUrl; //프로필 이미지 변경
}
changeUserinfo();


//로그인 유저 확인
const getLoginUser = () => {
  const response = fetch("https://api.gitofolio.com/user", {
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json",
      Authorization:
        localStorage.getItem("type") + " " + localStorage.getItem("token"),
    }
  });
  return response.then((res) => {
      return res.json();
  });
}


async function loginActive() {
  cardarray = await save_CardId();
  let data = await getLoginUser();
  if (data.name == User) {
    accountDelete.style.display = "block"; //계정삭제 보이게
    plus.style.display = "block"; //plus 카드 보이게
    $(accountDelete).on("click touchstart", (e) => {
      let input = confirm("정말로 삭제하시겠습니까?");
        if (input == true) userDelete(e);
    });
    cardEvents(cardarray);
  }
}


//계정 삭제
function userDelete(e) {
  fetch("https://api.gitofolio.com/user/" + User, {
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json",
      Authorization:
        localStorage.getItem("type") + " " + localStorage.getItem("token"),
    },
    method: "DELETE",
  })
    .then((res) => {
      if (res.status < 400) return res.text();
      else location.href = "/error?code=" + res.status;
    })
    .then((req) => {
      console.log(req);
      alert(User + " 계정이 삭제되었습니다!");
      window.location.href = "/";
    });
}

//Stat 가져오는 함수
function getStat() {
  fetch("https://api.gitofolio.com//user/stat/" + User, {
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((req) => {
      VisitNum.innerHTML = req.userStat.totalVisitors; //총 방문자수 표시
    });
}

//카드 가져오는 함수
let i;
let cardarray;
const getCard = () => {
  let response = fetch("https://api.gitofolio.com/portfoliocards/" + User, {
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  return response.then((res) => {
      if (res.status < 400) return res.json();
  });
}

async function save_CardId(){
  let data = await getCard();
  //카드의 id들을 저장하는 배열 만듬
  cardarray = data.portfolioCards.map((obj) => {
    let newarr = obj.id;
    return newarr;
  });

  //포트폴리오 카드 개수 글자 변경
  CardNum.innerHTML = cardarray.length;

  //포트폴리오 카드, 말풍선 만듬
  for (i = 0; i < cardarray.length; i++) {
    makeCard(cardarray[i]);
    cardBalloon(cardarray[i]);
  }

  return cardarray;
}


const card = document.getElementById("card"); //카드 생기는 부분
const content = document.querySelector(".main-content-left"); //말풍선 생기는 부분
const makeCard = (cardid) => {
  let svg = "https://api.gitofolio.com/portfoliocard/svg/" + cardid;
  const newcard = document.createElement("img");
  newcard.src = svg;
  newcard.className = "card_" + cardid;
  newcard.style.cursor = "pointer";
  card.prepend(newcard); //새로운 카드를 만든다
}

//카드 hover시 나타나는 말풍선
const cardBalloon = (cardid) => {
  const hoverdiv = document.createElement("div");
  hoverdiv.className = "balloon_" + cardid;
  hoverdiv.style.position = "absolute";
  hoverdiv.style.zIndex = "1";
  hoverdiv.style.left = "330px";
  hoverdiv.style.width = "230px";
  hoverdiv.style.height = "155px";
  hoverdiv.style.backgroundImage = "url(/img/balloon.png)";

  const hoverText_1 = document.createElement("div");
  hoverText_1.innerHTML = "Card Manager";
  hoverText_1.width = "230px";
  hoverText_1.height = "20px";
  hoverText_1.style.fontWeight = "900";
  hoverText_1.style.fontSize = "16px";
  hoverText_1.style.position = "absolute";
  hoverText_1.style.left = "35px";
  hoverText_1.style.top = "10px";
  hoverdiv.appendChild(hoverText_1);

  const hoverText_2 = document.createElement("div");
  hoverText_2.innerHTML = "Edit";
  hoverText_2.width = "230px";
  hoverText_2.height = "20px";
  hoverText_2.style.color = "#626262";
  hoverText_2.style.fontWeight = "400";
  hoverText_2.style.fontSize = "16px";
  hoverText_2.style.position = "absolute";
  hoverText_2.style.left = "35px";
  hoverText_2.style.top = "50px";
  hoverText_2.style.cursor = "pointer";
  hoverdiv.appendChild(hoverText_2);

  const hoverText_3 = document.createElement("div");
  hoverText_3.innerHTML = "Copy portfolio card link";
  hoverText_3.width = "230px";
  hoverText_3.height = "20px";
  hoverText_3.style.color = "#626262";
  hoverText_3.style.fontWeight = "400";
  hoverText_3.style.fontSize = "16px";
  hoverText_3.style.position = "absolute";
  hoverText_3.style.left = "35px";
  hoverText_3.style.top = "80px";
  hoverText_3.style.cursor = "pointer";
  hoverdiv.appendChild(hoverText_3);

  const hoverText_4 = document.createElement("div");
  hoverText_4.innerHTML = "Delete";
  hoverText_4.width = "230px";
  hoverText_4.height = "20px";
  hoverText_4.style.color = "#626262";
  hoverText_4.style.fontWeight = "400";
  hoverText_4.style.fontSize = "16px";
  hoverText_4.style.position = "absolute";
  hoverText_4.style.left = "35px";
  hoverText_4.style.top = "120px";
  hoverText_4.style.cursor = "pointer";
  hoverdiv.appendChild(hoverText_4);

  hoverdiv.style.display = "none";

  content.appendChild(hoverdiv);
}

const cardEvents = (cardarray) => {
  for (i = 0; i < cardarray.length; i++) {
    let cardid = cardarray[i];
    const card = document.querySelector(".card_" + cardid);
    const balloon = document.querySelector(".balloon_" + cardid);

    card.addEventListener("mouseenter", (e) => {
      cardHover(e, balloon);
    });

    card.addEventListener("mouseout", (e) => {
      balloon.style.display = "none";
    });

    card.addEventListener(
      "mouseleave",
      (e) => {
        cardOut(balloon, cardid);
      },
      { once: true }
    );
  }
};


//카드 hover시 말풍선 생기는 위치지정
function cardHover(e, balloon) {
  let imgY =
    window.pageYOffset +
    e.target.getBoundingClientRect().top -
    400 +
    e.target.clientHeight / 2;

  balloon.style.top = imgY + "px";
  balloon.style.display = "block";
}

//카드 mouseout
function cardOut(balloon, cardid) {
  console.log(cardid);
  balloon.addEventListener("mouseenter", (e) => {
    e.stopPropagation();
    balloon.style.display = "block";
  });

  balloon.addEventListener("mouseleave", (e) => {
    e.stopPropagation();
    balloon.style.display = "none";
  });

  //EDIT
  $(balloon.childNodes[1]).on("click touchstart", function () {
    cardEdit(cardid);
  });

  //COPY
  $(balloon.childNodes[2]).on("click touchstart", function () {
    cardCopy(cardid);
  });

  //DELETE
  $(balloon.childNodes[3]).on("click touchstart", (e) => {
    e.stopPropagation();
    let input = confirm("정말로 삭제하시겠습니까?");
    if (input == true) cardDelete(cardid);
  });
}

function cardEdit(cardid) {
  window.location.href = "/card/maker?card=" + cardid;
}

function cardCopy(cardid) {
  window.location.href = "/card/copy?card=" + cardid;
}

function cardDelete(cardid) {
  fetch("https://api.gitofolio.com/portfoliocards/" + User + "?id=" + cardid, {
    method: "DELETE",
    headers: {
      credentials: "omit",
      mode: "cors",
      Vary: "origin",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization:
        localStorage.getItem("type") + " " + localStorage.getItem("token"),
    },
  })
    .then((res) => {
      if (res.status < 400) return res.text();
      else location.href = "/error?code=" + res.status;
    })
    .then((req) => {
      if (req == User) {
        alert("카드를 삭제했습니다."), window.location.reload();
      }
    });
}


// 통계랑 ref 만드는 함수
let daysStat;
let bar = document.getElementsByClassName("bar");
let day = document.getElementsByClassName("day");
let barNum = document.getElementsByClassName("barNum");

const getDailystat = () => {
  const response = fetch("https://api.gitofolio.com/user/dailystat/" + User);
  return response.then((res) => {
      return res.json();
  });
}

async function makeChart(){
  let data = await getDailystat();
  daysStat = data.userDailyStat.visitorStatistics;

  let today = new Date();
  today.setDate(today.getDate() + 1);

  let days = [];
  for (j = 0; j < 7; j++) {
    let newdate = new Date(today.setDate(today.getDate() - 1));
    let tmonth = newdate.getMonth() + 1; // 월
    let tdate = newdate.getDate(); //날짜

    if (tmonth < 10) tmonth = "0" + tmonth;
    if (tdate < 10) tdate = "0" + tdate;
    let date = tmonth + "-" + tdate;

    day[6 - j].innerHTML = date;
    days.push(getVisitorArray(date));
  }

  var maxVisitor = Math.max.apply(null, days); //최대값

  for (j = 0; j < 7; j++) {
    barNum[6 - j].innerHTML = days[j]; //막대 숫자 변경
    bar[6 - j].style.height = (days[j] / maxVisitor) * 300 + "px"; //차트 높이 변경
  }
}

const getVisitorArray= (date) => {
  for (i = 0; i < daysStat.length; i++) {
    let arrdate = daysStat[i].visitDate + "";
    if (arrdate.substring(5, 10) == date) {
      let chartHeight = daysStat[i].visitorCount;
      return chartHeight;
    }
  }
  return 0;
}

makeChart();

async function makeRef(){
  let data = await getDailystat();
  refSite = data.userDailyStat.refferingSites;
  
  for (j = 0; j < refSite.length; j++) {
    let site = document.createElement("div");
    site.textContent = refSite[j].refferingSiteName;
    document.getElementsByClassName("sites")[0].appendChild(site);
    site.style.marginBottom = "10px";
  }
}
makeRef();


loginActive();
getStat();
getDailystat();
