
var profile={id: "",
  userId: "",
  name: "",
  color: "white",
  size: 100 };

//주소창에서 아이디 찾기
function idSearch(){
  if (location.search.match("card")) {
    var search = location.search;
    var params = new URLSearchParams(search);
    profile.id = params.get('card');
    callImg(params.get('card'));
  }
}
idSearch();

//카드를 img로 불러오기
function callImg(cardNum){
  fetch("https://api.gitofolio.com/user", {
    headers: {
      "credentials": "omit",
      "mode": "cors",
      "Vary": "origin",
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("type")+" "+localStorage.getItem("token"),
    },
  })
      .then((res) =>  {
        if(res.status < 400){
			return res.json();
		}
        else if(res.status < 500) location.href = "/error?code="+res.status;
       })
      .then((jsondata) => {
	  profile.userId = jsondata.id;
  	});
	
  setTimeout(function() {
  var profileImg = document.getElementsByClassName("profileImg")[0];
  var tmp = document.querySelectorAll(".userName");
  var cardshow = document.querySelector(".cardshow")[0];
  for (var i = 0; i<tmp.length; i++) {
    var result = profile.name + " " + tmp[i].innerHTML;
    tmp[i].innerHTML = result;
  }

  profileImg.src = "https://api.gitofolio.com/portfoliocard/svg/"+cardNum;
  console.log(profileImg.src);

  }, 500);
}


function cardColor(color) {
  var profileImg = document.getElementsByClassName("profileImg")[0];
  profile.color = color;
  profileImg.src = "https://api.gitofolio.com/portfoliocard/svg/"+profile.id+"?color="+color;
}

//사이즈 조절 함수
let elmnt = document.getElementsByClassName("moveBar")[0];
dragElement(elmnt);

function dragElement(elmnt) {
  let clientX_gab = 0, clientX = 0;
  //대상을 클릭 시 실행
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    clientX = e.clientX; //마우스 위치 확인
    document.onmouseup = closeDragElement; //마우스 클릭이 끝났을 때 종료
    document.onmousemove = elementDrag; //여전히 마우스 이동 시 실행 
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    clientX_gab = e.clientX - clientX; //마우스 이전 위치에서 현재위치까지를 뺀 결과
    clientX = e.clientX; //현재 마우스 위치
    let leftVal = 0;
    let parentElmnt = elmnt.parentNode; //부모노드
    if ( //너무 왼쪽으로 가지 못하게
        (elmnt.offsetLeft + clientX_gab) < 0 ||
        clientX < parentElmnt.offsetLeft)
    {
      leftVal = 0;
    } else if( //너무 오른쪽으로 가지 못하게
        (elmnt.offsetLeft + clientX_gab) > parentElmnt.clientWidth ||
        clientX > (parentElmnt.offsetLeft+parentElmnt.clientWidth))
    {
      leftVal = parentElmnt.clientWidth;
    } else {
      leftVal = (elmnt.offsetLeft + clientX_gab);
    }
    elmnt.style.left = leftVal + "px";
    percentChange(leftVal);
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.addEventListener('click',function(e){
  //클릭할 대상을 class로 확인
  if(e.target.className == "sizeBar"){
    let clientX = e.clientX; //마우스의 X 좌표
    let offsetLeft = e.target.offsetLeft; //클릭한 대상의 왼쪽 좌표
    let position = clientX-offsetLeft;
    let leftVal = 0;
    if (clientX < offsetLeft) //너무 왼쪽으로 가지 못하게 설정
    {
      leftVal = 0;
    }
    else if(clientX > offsetLeft + e.target.clientWidth) //너무 오른쪽으로 가지 못하게 설정
    {
      leftVal = e.target.clientWidth;
    }
    else //둘 다 아니면 자유롭게 움직임
    {
      leftVal = position;
    }
    elmnt.style.left = leftVal + "px";
    percentChange(leftVal);
  }
})

function percentChange(leftVal){
  var percent = document.getElementsByClassName("percent")[0];
  var result = 100 + Math.round((parseInt(elmnt.style.left) /elmnt.parentNode.clientWidth)*200);
  percent.innerText = result + "%";
  percent.style.left = leftVal - 3 + "px";
  profile.size = result + "";
}

// 클립보드로 복사하는 함수
function copyToClipboard() {
  // 글을 쓸 수 있는 란 생성
  var textarea = document.createElement("textarea");
  textarea.textContent = "<a href = "
      +"\"https://api.gitofolio.com/portfolio/"+profile.userId+"/"+profile.id+"\""
      +"><img src = "
      +"\"https://api.gitofolio.com/portfoliocard/svg/"+profile.id+"?color="+profile.color+"\" "
      +"style=\"width:"+(profile.size/100*353)+"px; height:auto; \""
      +"/></a>";


  // body에 추가
  document.body.append(textarea);

  // 지정된 내용을 강조
  textarea.select();

  // 텍스트를 카피 하는 변수를 생성
  document.execCommand("copy");

  // body 로 부터 다시 반환
  textarea.remove();
  var whitebutton = document.querySelectorAll(".whiteButton");
  for(var i = 0; i<whitebutton.length; i++){
    whitebutton[i].innerText = "Success!";
    whitebutton[i].style = "color: #E9E9E9; cursor: unset; pointer-event: none; animation: unset;"
  }

}

var movearrow = document.getElementsByClassName("movearrow")[0];
movearrow.addEventListener(('click'), e => {
  var child = document.getElementsByClassName("movearrow")[0].childNodes[1];
  var cardcopy =  document.getElementsByClassName("cardcopy")[0];
  var howto = document.getElementsByClassName("how_to_use")[0];
  var copybox = document.getElementsByClassName("cardcopybox")[0];

  copybox.className += " getout";
  if(child.innerHTML == 'How To Use'){
    child.innerHTML = "Back";
    cardcopy.className += " getout";
    cardcopy.style.display = "none";
    howto.style.display = "flex";
  }
  else {
    child.innerHTML = "How To Use";
    howto.className += " getout";
    howto.style.display = "none";
    cardcopy.style.display = "unset";
  }
  setTimeout(function(){
    copybox.className = "cardcopybox";
    howto.className = " how_to_use";
    cardcopy.className = "cardcopy";
  },300);
})
// personal page
function completeLink() {
  location.href="/user/"+profile.name;
}
