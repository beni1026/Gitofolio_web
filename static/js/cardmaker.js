var userData = {userName: "", userId: "", userProfileUrl: ""}; //개인 정보
var profileId={id:""}; //현재 생성 중인 profile id
var formData={text:"", url:""}; //입력된 내용
var flag=false;

//user data 불러오기
function getUser(){
  fetch("https://api.gitofolio.com/user", {
    headers: {
      "credentials": "omit",
      "mode": "cors",
      "Vary": "origin",
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("type")+" "+localStorage.getItem("token"),
    },
  })
      .then((res) => {
        if(res.status < 400) return res.json();
        else if(res.status < 500) location.href = "/error?code="+res.status;
      })
      .then((req) => {
        var tmp = document.querySelectorAll(".userName");
        for (var i in tmp) {
          var result = req.name + tmp[i].innerHTML;
          document.querySelectorAll(".userName")[i].innerHTML = result;
        }
        var imgUrl = req.profileUrl;
        document.querySelector(".userImg").src = imgUrl;
        userData.userName = req.name;
        userData.userId = req.id;
        userData.userProfileUrl = req.profileUrl;
        //console.log(userData);
        if(location.search.match("card")) {
          var search = location.search;
          var params = new URLSearchParams(search);
          profileId.id = params.get('card');
          flag = true;
          getCard(params.get('card'));
        }
      })
}
getUser();

//기존에 만들어진 카드 불러오기
function getCard(cardNum){
  var textBox = document.getElementsByClassName("textarea")[0];
  var num = document.getElementsByClassName("num")[0];
  var url = document.getElementsByClassName("urlInput")[0];
  fetch("https://api.gitofolio.com/portfoliocards/"+userData.userName+"?id="+cardNum,
      {
        headers: {
          "credentials": "omit",
          "mode": "cors",
          "Vary": "origin",
          "Content-Type": "application/json;charset=UTF-8",
        }})
      .then((res) => {
        if(res.status < 400) return res.json();
        else if(res.status < 500) location.href = "/error?code="+res.status;
          })
      .then((req) => {
        var text = req.portfolioCards[0].portfolioCardArticle.split('\n');
        var watch = req.portfolioCards[0].portfolioCardWatched;
        console.log(text);
        for(var i = 0; i < text.length-1; i++) {
          textBox.innerHTML += text[i].trim()+"\n";
        }
        textBox.innerHTML += text[text.length-1].trim();
        num.innerHTML = watch;
       /*
        console.log(textBox.innerHTML);
        if(watch < 1000){
          num.innerHTML = watch;
        }
        else if(watch >= 1000 && watch < 10000) {
          watch=parseInt(watch/100);
          num.innerHTML = parseInt(watch/10) + "." + (watch%10) + "K";
        }
        else if(watch >= 10000 && watch < 1000000){
          watch=parseInt(watch/100);
          num.innerHTML = parseInt(watch/10) + "K";
        }
        else if(watch >= 1000000 && watch < 10000000){
          watch=parseInt(watch/100000);
          num.innerHTML = parseInt(watch/10) + "." + (watch%10) + "M";
        }
        else if(watch >= 10000000 && watch < 1000000000){
          watch=parseInt(watch/100000);
          num.innerHTML = parseInt(watch/10) + "M";
        }
        else if(watch >= 1000000000 && watch < 10000000000){
          watch=parseInt(watch/100000000);
          num.innerHTML = parseInt(watch/10) + "." + (watch%10) + "B";
        }
        else if(watch >= 10000000000){
          watch=parseInt(watch/100000000);
          num.innerHTML = parseInt(watch/10) + "B";
        } */
        url.setAttribute("value", req.portfolioCards[0].portfolioUrl);
        resize(textBox);
      })
}

//rgb를 hex로 바꿔주는 함수
function changeHex(string) {
  var rgbString = string; // get this in whatever way.
  var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  // parts now should be ["rgb(0, 70, 255", "0", "70", "255"]
  delete parts[0];
  for (var i = 1; i <= 3; ++i) {
    parts[i] = parseInt(parts[i]).toString(16);
    if (parts[i].length == 1) parts[i] = "0" + parts[i];
  }
  var hexString = "#" + parts.join("").toUpperCase();
  return hexString;
}

//card 내의 색을 변경시켜주는 함수
function cardColor(color) {
  var textBox = document.getElementsByClassName("textarea")[0];
  var cardbox = document.getElementsByClassName("cardbox")[0];
  var name = document.getElementsByClassName("userName")[0];
  var personback = document.getElementsByClassName("personback")[0];
  var person = document.querySelectorAll(".person");
  var num = document.getElementsByClassName("num")[0];
  var gitofolio = document.getElementsByClassName("gitofolio")[0];
  var colorArray = document.getElementsByName("color");
  var arrow = document.getElementsByClassName("arrow")[0];
  var eggImg = document.getElementsByClassName("eggImg")[0];

  textBox.classList.remove("changeneon");
  name.classList.remove("changeneon");
  num.classList.remove("changeneon");
  gitofolio.classList.remove("changeneon");
  eggImg.style.display = "none";
  //#FCC400
  if (color == "null") {
    color = "#FFFFFF";
  }
  if (color == "#2D2D2D" || color == "#0D1017") {
    cardbox.style.background = color;
    textBox.style.background = color;
    textBox.style.color = "#FFFFFF";
    name.style.color = "#FFFFFF";
    num.style.color = "#FFFFFF";
    arrow.style.fill = "#FFFFFF";
    personback.style.fill = color;
    for (var i =0; i < person.length; i++) {
      person[i].style.fill = "#FFFFFF";
    }
    if(color == "#2D2D2D"){
      textBox.classList.add("changeplaceholder");;
      gitofolio.style.color = "#C4C4C4";
    }
    if (color == "#0D1017") {
      textBox.classList.remove("changeplaceholder");
      textBox.classList.add("changeneon");
      name.classList.add("changeneon");
      num.classList.add("changeneon");
      gitofolio.classList.add("changeneon")
      gitofolio.style.color = "#FFFFFF";
    }
  }
  else {
    textBox.classList.remove("changeplaceholder");
    textBox.style.color = "#000000";
    name.style.color = "#2D2D2D";
    num.style.color = "#2D2D2D";
    arrow.style.fill = "#2D2D2D";
    cardbox.style.background = "#FFFFFF";
    textBox.style.background = "#FFFFFF";
    personback.style.fill = "#FFFFFF";
    for (var i =0; i < person.length; i++) {
      person[i].style.fill = "#2D2D2D";
    }
    switch (color) {
      case "#FFFFFF":
        gitofolio.style.color = "#C4C4C4";
        break;
      case "#FCC400":
        gitofolio.style.color = "#FCC400";
        eggImg.style.display = "unset";
        break;
    }
  }
  var valueChange;
  for (var i = 0; i < colorArray.length; i++) {
    valueChange = changeHex(
        window.getComputedStyle(colorArray[i]).backgroundColor
    );
    if (valueChange.toUpperCase() == color.toUpperCase()) {
      colorArray[i].value = color;
      console.log(valueChange);
      continue;
    }
    colorArray[i].value = "";
  }
  var value = "";
  switch (color) {
    case "#2D2D2D":
      value = "black";
      break;
    case "#FFFFFF":
      value = "white";
      break;
    case "#0D1017":
      value = "neonpurple"
      break;
    case "#FCC400":
      value = "egg"
      break;
  }
  formData.color = value;
}

//textBox의 크기를 조절하는 함수
function resize(obj) {
  var scrollbox = document.querySelector(".scrollbox");
  var warning = document.getElementsByClassName("overwritten")[0];
  var arrow = document.getElementsByClassName("arrow")[0];

  obj.style.height = "auto";
  obj.style.height = obj.scrollHeight + "px";
  arrow.scrollIntoView(); //textarea 맨 아래 보기

  //사이즈를 화면 크기에 맞춤
  if(document.querySelector("article").clientHeight ==
      document.querySelector(".wrap").clientHeight){
    scrollbox.style = "max-height: "+scrollbox.clientHeight+"px";

  }
  var text = obj.textContent;

  //문자가 1000자 이상일 경우
  if (text.length > 1000) {
    console.log(text.length);
    var child = obj.childNodes[obj.childNodes.length-1];
    var selection = window.getSelection();
    if(child.hasChildNodes){
      child.childNodes[child.childNodes.length-1].blur();
      child.childNodes[child.childNodes.length-1].textContent = child.childNodes[child.childNodes.length-1].textContent.slice(0,-1);
      child.childNodes[child.childNodes.length-1].focus();
      selection.collapse(child.childNodes[child.childNodes.length-1],1);
    }
    else{
      obj.childNodes[obj.childNodes.length-1].blur();
      obj.childNodes[obj.childNodes.length-1].textContent = obj.childNodes[obj.childNodes.length-1].textContent.slice(0, -1);
      obj.childNodes[obj.childNodes.length-1].focus();
      selection.collapse(obj.childNodes[obj.childNodes.length-1],1);
    }
    warning.innerHTML = "글자수 제한. 최대 1000자까지 입력가능합니다.";
  }
  else {
    warning.innerHTML = " * 완성된 카드와 약간의 차이가 있을 수 있습니다.";

  }

}

//카드를 img로 불러오기
function callImg(cardNum){
  console.log("callImg");
  var profileImg = document.getElementsByClassName("profileImg")[0];
  var tmp = document.querySelectorAll(".userName");
  var cardshow = document.querySelector(".cardshow")[0];

  for (var i = 0; i<tmp.length; i++) {
    var result = userData.name + tmp[i].innerHTML;
    tmp[i].innerHTML = result;
  }

  profileImg.src = "https://api.gitofolio.com/portfoliocard/svg/"+cardNum;
  console.log(profileImg.src);

}

// Change the words' color in the card
function textcolor(val) {
  var color = val.toUpperCase();
  var editorbox = document.querySelector(".color-picker");
  var colorLabel = document.querySelector(".colorLabel");
  editorbox.style.backgroundColor = color;
  colorLabel.innerHTML = color;

  document.execCommand('foreColor', false, color);
}

function extractColor() {
  var textBox = document.getElementsByClassName("textarea")[0];
  var text = textBox.childNodes;
  var context = "";
  for(var i = 0; i < text.length; i++) {
    var nodename = text[i].nodeName;
    if("#text" == nodename){

      context+="#[2D2D2D] "+text[i].textContent+ " ";

    }
    else if("FONT"== nodename){

      context+="#["+text[i].color.toUpperCase().slice(1)+"] "+text[i].textContent+" ";

    }
    else if("DIV" == nodename){

      context+="\n";
      var child = text[i].childNodes;
      for(var j = 0; j < child.length; j++){
        if("#text" == child[j].nodeName){
          context+="#[2D2D2D] "+child[j].textContent+" ";
        }
        else if("FONT" == child[j].nodeName){
          context+="#["+child[j].color.toUpperCase().slice(1)+"] "+child[j].textContent+" ";
        }
      }
    }
  }
  formData.text = context;
  console.log(formData.text);
}

function goToComplete() {
  extractColor();
  var num = document.getElementsByClassName("num")[0];
  //form에 해당하는 값들 배열형식으로 가져오기
  var x = document.getElementById("form");

  //x내의 value값을 뽑아내서 저장
  for (var i = 0; i < x.length; i++) {
    var name = x.elements[i].name;
    var value = x.elements[i].value;
    if (name == "url") formData.url = value;

  }
  if (formData.url == "" || formData.url.search("http") == -1) {

    document.querySelector(".wrongurl").style.display = "block";
  }
  else {
    if (flag == false && formData.url != "") {
      console.log("post");
      //console.log(formData.text + "<br>" + formData.url + "<br>" + formData.color);
      fetch("https://api.gitofolio.com/portfoliocards", {
        method: "POST",
        headers: {
          "credentials": "omit",
          "mode": "cors",
          "Vary": "origin",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": localStorage.getItem("type") + " " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: userData.userId,
          name: userData.userName,
          profileUrl: userData.userProfileUrl,
          portfolioCards:
              [{
                portfolioCardArticle: formData.text,
                portfolioCardWatched: 0,
                portfolioUrl: formData.url
              }],
        }),
      })
          .then((res) => {
            if (res.status < 400) return res.json();
            else if(res.status < 500) location.href = "/error?code="+res.status;
          })
          .then((data) => {
            profileId.id = data.portfolioCards[data.portfolioCards.length - 1].id + "";
            console.log(profileId.id);
            console.log(data);
            console.log(data.portfolioCards[data.portfolioCards.length - 1].id);
          })

    } else if (flag == true && formData.url != "") {
      //console.log("put");
      fetch("https://api.gitofolio.com/portfoliocards", {
        method: "PUT",
        headers: {
          "credentials": "omit",
          "mode": "cors",
          "Vary": "origin",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": localStorage.getItem("type") + " " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: userData.userId,
          name: userData.userName,
          profileUrl: userData.userProfileUrl,
          portfolioCards:
              [{
                id: profileId.id,
                portfolioCardArticle: formData.text,
                portfolioUrl: formData.url
              }],
        }),
      })
          .then((res) => {
            if(res.status >= 400 && res.status < 500) location.href = "/error?code="+res.status;
          })
    }
    var form = document.querySelector("form");
    form.className = "getout";
    setTimeout(function() {
      var card = document.querySelector(".cardcomplete");
      form.style.display = "none";
      card.style.display = "unset";
      form.className = "";
      console.log(profileId.id)
      callImg(profileId.id);
    }, 300);
  }

}

// personal page
function completeLink() {
  location.href="/user/"+userData.userName;
}
// edit page
function editLink() {
  var card = document.querySelector(".cardcomplete");
  card.className = " getout";
  setTimeout(function() {
    card.className = "cardcomplete";
    location.href="/card/maker?card=" + profileId.id;
  }, 300);
}
//copy page
function copyLink() {
  location.href="/card/copy?card="+profileId.id;
}

