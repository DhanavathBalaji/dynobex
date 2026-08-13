

/* =====================================================
   DYNOBEX CONTACT FORM
   SUPABASE + WHATSAPP
===================================================== */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                submitButton.innerHTML;


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const business_name =
                document
                    .getElementById("business_name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const service =
                document
                    .getElementById("service")
                    .value;


            const budget =
                document
                    .getElementById("budget")
                    .value;


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            try {

                /* Loading state */

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending...";


                /* =================================================
                   SAVE ENQUIRY TO SUPABASE
                ================================================= */

                const { error } =
                    await supabaseClient
                        .from("project_enquiries")
                        .insert([
                            {
                                name: name,

                                business_name:
                                    business_name || null,

                                phone:
                                    phone || null,

                                email: email,

                                service:
                                    service || null,

                                budget:
                                    budget || null,

                                message: message,

                                status: "New"
                            }
                        ]);


                if (error) {

                    console.error(
                        "Supabase insert error:",
                        error
                    );

                    throw error;

                }


                /* Success */

                submitButton.innerHTML =
                    "✓ Enquiry Sent Successfully";


                /* =================================================
                   WHATSAPP MESSAGE
                ================================================= */

                const whatsappMessage =
`Hello DYNOBEX,

I would like to make an enquiry.

Name: ${name}

Business Name: ${business_name || "Not provided"}

Phone: ${phone || "Not provided"}

Email: ${email}

Service Required: ${service || "Not selected"}

Estimated Budget: ${budget || "Not specified"}

Project Requirement:
${message}`;


                const whatsappURL =
                    `https://wa.me/919059827348?text=${encodeURIComponent(
                        whatsappMessage
                    )}`;


                /* Reset form */

                contactForm.reset();


                /* Open WhatsApp */

                window.open(
                    whatsappURL,
                    "_blank"
                );


                setTimeout(function () {

                    submitButton.innerHTML =
                        originalButtonText;

                }, 3000);


            } catch (error) {

                console.error(
                    "DYNOBEX enquiry error:",
                    error
                );


                submitButton.innerHTML =
                    "Failed. Please Try Again";


                setTimeout(function () {

                    submitButton.innerHTML =
                        originalButtonText;

                }, 3000);

            } finally {

                submitButton.disabled = false;

            }

        }
    );

}



/* =====================================================
   DOM CONTENT LOADED
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       THEME SYSTEM
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    const themeMenu =
        document.getElementById("themeMenu");


    const themeIcon =
        document.getElementById("themeIcon");


    const themeOptions =
        document.querySelectorAll(".theme-option");


    const savedTheme =
        localStorage.getItem("dynobex-theme") || "light";


    applyTheme(savedTheme);


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                if (themeMenu) {

                    themeMenu.classList.toggle(
                        "show"
                    );

                }

            }
        );

    }


    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const selectedTheme =
                    option.dataset.theme;


                applyTheme(
                    selectedTheme
                );


                localStorage.setItem(
                    "dynobex-theme",
                    selectedTheme
                );


                if (themeMenu) {

                    themeMenu.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


    document.addEventListener(
        "click",
        event => {

            if (
                themeMenu &&
                themeToggle &&
                !themeMenu.contains(
                    event.target
                ) &&
                !themeToggle.contains(
                    event.target
                )
            ) {

                themeMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    function applyTheme(theme) {

        document.body.setAttribute(
            "data-theme",
            theme
        );


        if (!themeIcon) {

            return;

        }


        if (theme === "light") {

            themeIcon.textContent =
                "🌤️";

        }

        else if (theme === "dark") {

            themeIcon.textContent =
                "🌙";

        }

        else {

            themeIcon.textContent =
                "✨";

        }


        themeOptions.forEach(option => {

            option.classList.remove(
                "active-theme"
            );


            if (
                option.dataset.theme ===
                theme
            ) {

                option.classList.add(
                    "active-theme"
                );

            }

        });

    }



    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    const navbar =
        document.getElementById(
            "navbar"
        );


    if (
        mobileMenuBtn &&
        navbar
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                navbar.classList.toggle(
                    "show"
                );

            }
        );

    }


    document
        .querySelectorAll("nav a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (navbar) {

                        navbar.classList.remove(
                            "show"
                        );

                    }

                }
            );

        });



    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                function (event) {

                    const href =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    const header =
                        document.getElementById(
                            "header"
                        );


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target
                            .getBoundingClientRect()
                            .top
                        +
                        window.pageYOffset
                        -
                        headerHeight
                        -
                        10;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        });



    /* =====================================================
       HEADER SHADOW
    ===================================================== */

    const header =
        document.getElementById(
            "header"
        );


    if (header) {

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 30
                ) {

                    header.classList.add(
                        "scrolled"
                    );

                }

                else {

                    header.classList.remove(
                        "scrolled"
                    );

                }

            }
        );

    }



    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    if (
        sections.length &&
        navLinks.length
    ) {

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                const id =
                                    entry.target.getAttribute(
                                        "id"
                                    );


                                navLinks.forEach(
                                    link => {

                                        link.classList.remove(
                                            "active"
                                        );


                                        if (
                                            link.getAttribute(
                                                "href"
                                            ) ===
                                            `#${id}`
                                        ) {

                                            link.classList.add(
                                                "active"
                                            );

                                        }

                                    }
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.35
                }

            );


        sections.forEach(
            section => {

                observer.observe(
                    section
                );

            }
        );

    }



    /* =====================================================
       CHAT ASSISTANT
    ===================================================== */

    const chatToggle =
        document.getElementById(
            "chatToggle"
        );


    const chatBox =
        document.getElementById(
            "chatBox"
        );


    const closeChat =
        document.getElementById(
            "closeChat"
        );


    const chatInput =
        document.getElementById(
            "chatInput"
        );


    const sendMessage =
        document.getElementById(
            "sendMessage"
        );


    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    if (
        chatToggle &&
        chatBox
    ) {

        chatToggle.addEventListener(
            "click",
            () => {

                chatBox.classList.toggle(
                    "show"
                );

            }
        );

    }


    if (
        closeChat &&
        chatBox
    ) {

        closeChat.addEventListener(
            "click",
            () => {

                chatBox.classList.remove(
                    "show"
                );

            }
        );

    }



    function addMessage(
        message,
        type
    ) {

        if (!chatMessages) {

            return;

        }


        const messageElement =
            document.createElement(
                "div"
            );


        messageElement.classList.add(

            type === "user"
                ? "user-message"
                : "bot-message"

        );


        messageElement.textContent =
            message;


        chatMessages.appendChild(
            messageElement
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }



    function getBotResponse(
        message
    ) {

        const text =
            message.toLowerCase();


        if (
            text.includes("website") ||
            text.includes("web")
        ) {

            return "DYNOBEX builds modern, responsive and professional websites for businesses, clinics, restaurants, hotels, stores and more.";

        }


        if (
            text.includes("app") ||
            text.includes("mobile")
        ) {

            return "We can build mobile applications based on your business requirements and customer needs.";

        }


        if (
            text.includes("ai") ||
            text.includes("chatbot") ||
            text.includes("agent")
        ) {

            return "We provide AI chatbots, AI assistants and Agentic AI solutions that can automate customer support and business workflows.";

        }


        if (
            text.includes("automation") ||
            text.includes("automate")
        ) {

            return "DYNOBEX helps automate repetitive business processes, notifications, approvals and workflows to save time and improve efficiency.";

        }


        if (
            text.includes("crm") ||
            text.includes("erp") ||
            text.includes("dashboard")
        ) {

            return "We build custom CRM, ERP and dashboard solutions to help businesses manage customers, operations and important business data.";

        }


        if (
            text.includes("price") ||
            text.includes("cost") ||
            text.includes("pricing")
        ) {

            return "Pricing depends on your project requirements and features. Please send us your requirements through the enquiry form or WhatsApp for a customised quote.";

        }


        if (
            text.includes("contact") ||
            text.includes("whatsapp") ||
            text.includes("call")
        ) {

            return "You can contact DYNOBEX directly using the WhatsApp button, phone number or contact form on this website.";

        }


        return "Thank you for contacting DYNOBEX! We provide websites, mobile apps, AI solutions, automation, dashboards, CRM/ERP solutions, cloud integrations and more. Please tell me a little about your business or project.";

    }



    function sendChatMessage() {

        if (!chatInput) {

            return;

        }


        const message =
            chatInput.value.trim();


        if (!message) {

            return;

        }


        addMessage(
            message,
            "user"
        );


        chatInput.value =
            "";


        setTimeout(() => {

            const response =
                getBotResponse(
                    message
                );


            addMessage(
                response,
                "bot"
            );

        }, 500);

    }



    if (sendMessage) {

        sendMessage.addEventListener(
            "click",
            sendChatMessage
        );

    }


    if (chatInput) {

        chatInput.addEventListener(
            "keypress",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    sendChatMessage();

                }

            }
        );

    }


});



/* =========================================================
   DYNOBEX PROJECT SELECTOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const projectButtons =
        document.querySelectorAll(
            ".project-select-btn"
        );


    const projectDisplays =
        document.querySelectorAll(
            ".project-display"
        );


    projectButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedProject =
                button.dataset.project;


            /* Remove active state from buttons */

            projectButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            /* Activate selected button */

            button.classList.add("active");


            /* Hide all project displays */

            projectDisplays.forEach(display => {

                display.classList.remove("active");

            });


            /* Show selected project */

            const targetProject =
                document.getElementById(
                    selectedProject
                );


            if (targetProject) {

                targetProject.classList.add(
                    "active"
                );


                /* Scroll slightly into view on mobile */

                if (window.innerWidth <= 900) {

                    setTimeout(() => {

                        targetProject.scrollIntoView({

                            behavior: "smooth",

                            block: "nearest"

                        });

                    }, 100);

                }

            }

        });

    });


});



/* =========================================================
   DYNOBEX PROJECT IMAGE SLIDERS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const projectSliders =
        document.querySelectorAll(
            ".project-slider"
        );


    projectSliders.forEach(slider => {

        const slides =
            slider.querySelectorAll(
                ".project-slide"
            );


        const dots =
            slider.querySelectorAll(
                ".dot"
            );


        const prevButton =
            slider.querySelector(
                ".prev"
            );


        const nextButton =
            slider.querySelector(
                ".next"
            );


        /* Safety check */

        if (!slides.length) {

            return;

        }


        let currentSlide = 0;

        let autoSlide = null;


        /* =================================================
           SHOW SLIDE
        ================================================= */

        function showSlide(index) {

            /*
               Prevent undefined slide error
            */

            if (
                index < 0 ||
                index >= slides.length
            ) {

                return;

            }


            slides.forEach(slide => {

                slide.classList.remove(
                    "active"
                );

            });


            dots.forEach(dot => {

                dot.classList.remove(
                    "active"
                );

            });


            /*
               Only activate slide if it exists
            */

            if (slides[index]) {

                slides[index].classList.add(
                    "active"
                );

            }


            /*
               Only activate dot if it exists
            */

            if (dots[index]) {

                dots[index].classList.add(
                    "active"
                );

            }


            currentSlide = index;

        }


        /* =================================================
           NEXT SLIDE
        ================================================= */

        function nextSlide() {

            const newIndex =
                (currentSlide + 1) %
                slides.length;


            showSlide(
                newIndex
            );

        }


        /* =================================================
           PREVIOUS SLIDE
        ================================================= */

        function previousSlide() {

            const newIndex =
                (
                    currentSlide - 1 +
                    slides.length
                )
                %
                slides.length;


            showSlide(
                newIndex
            );

        }


        /* =================================================
           AUTO SLIDE
        ================================================= */

        function startAutoSlide() {

            /*
               Clear existing interval first
               to prevent multiple intervals
            */

            stopAutoSlide();


            /*
               No need for auto slide
               if only one image exists
            */

            if (slides.length <= 1) {

                return;

            }


            autoSlide =
                setInterval(() => {

                    nextSlide();

                }, 5000);

        }


        function stopAutoSlide() {

            if (autoSlide) {

                clearInterval(
                    autoSlide
                );

                autoSlide = null;

            }

        }


        function resetAutoSlide() {

            stopAutoSlide();

            startAutoSlide();

        }


        /* =================================================
           PREVIOUS BUTTON
        ================================================= */

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    previousSlide();

                    resetAutoSlide();

                }
            );

        }


        /* =================================================
           NEXT BUTTON
        ================================================= */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    nextSlide();

                    resetAutoSlide();

                }
            );

        }


        /* =================================================
           DOT NAVIGATION
        ================================================= */

        dots.forEach(
            (dot, index) => {

                dot.addEventListener(
                    "click",
                    () => {

                        /*
                           Only allow valid slides
                        */

                        if (
                            slides[index]
                        ) {

                            showSlide(
                                index
                            );

                            resetAutoSlide();

                        }

                    }
                );

            }
        );


        /* =================================================
           PAUSE ON HOVER
        ================================================= */

        slider.addEventListener(
            "mouseenter",
            () => {

                stopAutoSlide();

            }
        );


        slider.addEventListener(
            "mouseleave",
            () => {

                startAutoSlide();

            }
        );


        /* =================================================
           MOBILE SWIPE SUPPORT
        ================================================= */

        let startX = 0;

        let endX = 0;


        slider.addEventListener(
            "touchstart",
            event => {

                startX =
                    event.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        slider.addEventListener(
            "touchend",
            event => {

                endX =
                    event.changedTouches[0]
                        .clientX;


                const difference =
                    startX - endX;


                /*
                   Swipe left
                */

                if (
                    difference > 50
                ) {

                    nextSlide();

                    resetAutoSlide();

                }


                /*
                   Swipe right
                */

                else if (
                    difference < -50
                ) {

                    previousSlide();

                    resetAutoSlide();

                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           INITIALIZE SLIDER
        ================================================= */

        /*
           Make sure first slide is valid
        */

        showSlide(0);


        startAutoSlide();

    });


});