const accidentLink =
    document.getElementById("accidents-link");

const submenu =
    document.querySelector(".submenu");

accidentLink.addEventListener("click", (e) => {

    e.preventDefault();

    submenu.style.display =
        submenu.style.display === "block"
            ? "none"
            : "block";

});