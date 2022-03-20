function isElementUnderBottom(elem, triggerDiff) {
  const { top } = elem.getBoundingClientRect();
  const { innerHeight } = window;
  return top > innerHeight + (triggerDiff || 0);
}

function handleVerticalScroll() {
  const elems = document.querySelectorAll('.fadein');
  elems.forEach(elem => {
    if (isElementUnderBottom(elem, -300)) {
      elem.style.opacity = "0";
      elem.style.transform = 'translateY(-100px)';
    } else {
      elem.style.opacity = "1";
      elem.style.transform = 'translateY(0px)';
    }
  })
}

function handleHorizontalScroll() {
  const elems = document.querySelectorAll('.chart');
  elems.forEach(elem => {
    if (isElementUnderBottom(elem, -200)) {
      elem.style.opacity = "0";
      elem.style.transform = 'translateX(-20px)';
    } else {
      elem.style.opacity = "1";
      elem.style.transform = 'translateX(0px)';
    }
  })
}

let todayVisitors;
let visitors = document.querySelector(".visited_num");
function getVisitors() {
  fetch("https://api.gitofolio.com/todayinteraction", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((req) => {
      todayVisitors = req.info.interact;
      visitors.innerHTML = todayVisitors;
    });
}

function loginCheck(){
  if(localStorage.hasOwnProperty("type") &&
          localStorage.hasOwnProperty("token")){
    window.location.href = "/card/maker";
  }
  else window.location.href = "/login";
}
getVisitors();
window.addEventListener('scroll', handleVerticalScroll);
window.addEventListener('scroll', handleHorizontalScroll);
