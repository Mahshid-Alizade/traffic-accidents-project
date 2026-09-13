document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname.split("/").pop();

    document
        .querySelectorAll(".sidebar a[href]")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (
                href &&
                currentPage === href.split("/").pop()
            ) {

                // Activate current page
                link.classList.add("active");

                // If inside a submenu,
                // activate its parent too
                const parentMenu =
                    link
                        .closest(".submenu")
                        ?.querySelector(".disabled");

                if (parentMenu) {
                    parentMenu.classList.add("active");
                }
            }

        });

});