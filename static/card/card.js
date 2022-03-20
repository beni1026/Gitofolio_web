let gitName = document.getElementById("name");
let mainText = document.getElementById("maintext");
let starNum = document.getElementById("star");



gitName.textContent = 'java';

//http://api.gitofolio.com/user/dummy
fetch('https://api.github.com/users/devxb')
  .then(res => res.json())
  .then(res => {
    //console.log(`${res.name}` + "님 환영합니다");
    gitName.textContent = `${res.name}`;
  });

  const gitofolio = fetch('http://api.gitofolio.com/user')
  .then(res => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("error:", error));


  fetch('http://api.gitofolio.com/portfoliocards/dummy')
  .then(res => res.json())
  .then(res => {
    let num = 0;
    mainText.textContent = `${res.portfolioCards[num].portfolioCardArticle}`;
    starNum.textContent = `${res.portfolioCards[num].portfolioCardStars}`;
  });


