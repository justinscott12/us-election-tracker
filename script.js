var demEV = 3;
var repEV = 23;
var EVToPercentage = 100 / 538;

var popupOverlay = document.getElementById('popupOverlay');
var popup = document.getElementById('popup');
var closePopup = document.getElementById('closePopup');

const statusStr = "Status: ";
const tooEarly = "Too Early To Call";
const tooClose = "Too Close To Call";
const demWin = "Called - Harris Win ✔";
const repWin = "Called - Trump Win ✔";
const splitWin = "Called - Split Districts";
var fullStatus = "";

document.getElementById("demScore").innerHTML = demEV;
document.getElementById("repScore").innerHTML = repEV;

document.getElementById("demProgressBar").style.width = (demEV * EVToPercentage) + "%";
document.getElementById("repProgressBar").style.width = (repEV * EVToPercentage) + "%";

// adjust as rep gets more EV
var repProgressBarTranslate = 96;
document.getElementById("repProgressBar").style.transform = "translateX(" + repProgressBarTranslate + "%)";


function openPopup() {
    popupOverlay.style.display = 'block';
}

function closePopupFunc() {
    popupOverlay.style.display = 'none';
}

closePopup.addEventListener('click', closePopupFunc);

popupOverlay.addEventListener('click', function handleOverlayClick(event) {
  if (event.target === popupOverlay) {
    closePopupFunc();
  }
});

function displayStateResults(state, dem, rep, votes, status) {
    if (status == 1) {
        fullStatus = `${statusStr}${tooEarly}`;
    } else if (status == 2) {
        fullStatus = `${statusStr}${tooClose}`;
    } else if (status == 3) {
        fullStatus = `${statusStr}${demWin}`;
        document.getElementById("demPercentage").style.fontWeight = "bolder";
        document.getElementById("demPopupName").style.fontWeight = "bolder";
        document.getElementById("demPopupName").textContent = "Kamala Harris ✔";
    } else if (status == 4) {
        fullStatus = `${statusStr}${repWin}`;
        document.getElementById("repPercentage").style.fontWeight = "bolder"; 
        document.getElementById("repPopupName").style.fontWeight = "bolder";
        document.getElementById("repPopupName").textContent = "Donald Trump ✔";
    } else if (status == 5) {
        fullStatus = `${statusStr}${splitWin}`;
    } else {
        fullStatus = `${statusStr}${tooEarly}`;
    }

    document.getElementById("stateNameResults").textContent = `${state} Results:`;
    document.getElementById("callStatus").textContent = `${fullStatus}`;
    document.getElementById("demPercentage").textContent = `${dem}%`;
    document.getElementById("repPercentage").textContent = `${rep}%`;
    document.getElementById("estVotes").textContent = `EST Votes In: ${votes}%`;

    openPopup();
}

var countDownDate = new Date("Nov 5, 2024 20:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = "Next Polls Close: " + days + "d " + hours + "h " +
        minutes + "m " + seconds + "s ";

    if (distance < 0) {
        clearInterval(intervalId);
        document.getElementById("countdown").innerHTML = "POLLS ARE CLOSING NOW";
    }
}

updateCountdown();

const intervalId = setInterval(updateCountdown, 1000);