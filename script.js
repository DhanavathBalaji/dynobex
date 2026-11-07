

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



  
function getBotResponse(message) {

    const text = message
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const words = new Set(text.split(" "));

    function hasAny(keywords) {
        return keywords.some(keyword => {
            if (keyword.includes(" ")) {
                return text.includes(keyword);
            }

            return words.has(keyword);
        });
    }

    // Greeting
    if (hasAny(["hi", "hello", "hey", "good morning", "good evening"])) {
        return "Hello! 👋 Welcome to DYNOBEX. We help businesses build websites, mobile applications, AI solutions and automation systems. What would you like to know?";
    }

    // About DYNOBEX
    if (
        hasAny([
            "dynobex",
            "about",
            "who are you",
            "what do you do",
            "company",
            "your business",
            "your services",
            "what is this"
        ]) &&
        !hasAny(["website", "mobile", "chatbot", "automation", "pricing"])
    ) {
        return "DYNOBEX provides intelligent digital solutions that help businesses grow, automate operations and improve customer experiences. Our services include website development, mobile applications, AI chatbots, business automation, CRM/ERP platforms, dashboards, SEO and cloud/API integrations.";
    }

    // Website development
    if (hasAny([
        "website", "websites", "web", "web development",
        "web design", "business site", "online store",
        "ecommerce", "e commerce", "portfolio"
    ])) {
        return "DYNOBEX develops modern, responsive and professional websites for businesses, clinics, restaurants, hotels, stores and other industries. We can help with business websites, service websites, portfolios and e-commerce requirements. Tell us about your business and the features you need so we can suggest a suitable solution.";
    }

    // Mobile applications
    if (hasAny([
        "app", "apps", "application", "applications",
        "mobile", "android", "ios"
    ])) {
        return "DYNOBEX can help develop mobile applications based on your business requirements and customer needs. The features, platform and development approach depend on your project scope.";
    }

    // AI and chatbot solutions
    if (hasAny([
        "ai", "artificial intelligence", "chatbot",
        "chatbots", "ai assistant", "agentic",
        "automation agent", "llm"
    ])) {
        return "DYNOBEX offers AI-related solutions such as chatbots, AI assistants and Agentic AI workflows. These can help businesses handle customer queries, automate repetitive tasks and improve operational workflows. The exact solution depends on your requirements.";
    }

    // Business automation
    if (hasAny([
        "automation", "automate", "workflow",
        "workflows", "approval", "notifications",
        "repetitive tasks", "business process"
    ])) {
        return "DYNOBEX helps businesses automate repetitive processes, notifications, approvals and workflows. Automation can reduce manual work and make business operations more efficient. Tell us which process you want to automate.";
    }

    // CRM, ERP and dashboards
    if (hasAny([
        "crm", "erp", "dashboard", "admin panel",
        "management system", "business software",
        "inventory", "customer management"
    ])) {
        return "DYNOBEX develops custom CRM, ERP and dashboard solutions to help businesses manage customers, operations and business information. Features can be designed around your existing workflow and requirements.";
    }

    // SEO and digital growth
    if (hasAny([
        "seo", "google ranking", "google maps",
        "search engine", "online visibility",
        "digital marketing", "local seo"
    ])) {
        return "DYNOBEX can help improve website visibility through SEO-focused website structure, relevant content, technical optimisation and local SEO guidance. Google search and Maps visibility also depend on competition, business profile quality and ongoing optimisation.";
    }

    // Cloud and integrations
    if (hasAny([
        "cloud", "api", "integration", "integrations",
        "payment gateway", "whatsapp integration",
        "third party", "third-party"
    ])) {
        return "DYNOBEX can help with cloud integrations, API connections and third-party service integrations. Examples include connecting websites with payment services, WhatsApp workflows and other business systems, depending on technical requirements.";
    }

    // Pricing
    if (hasAny([
        "price", "pricing", "cost", "charges",
        "budget", "quotation", "quote",
        "how much", "rate"
    ])) {
        return "DYNOBEX project pricing depends on the type of solution, number of pages or modules, design, functionality, integrations and maintenance requirements. Share your project details through the enquiry form or WhatsApp to receive a customised quotation.";
    }

    // Development process
    if (hasAny([
        "process", "how do you work", "how to start",
        "start project", "development steps",
        "working process", "procedure"
    ])) {
        return "Our project discussion generally starts by understanding your business, target customers and requirements. We then identify the required features, suggest a suitable solution, discuss the scope and quotation, and proceed with development after agreement.";
    }

    // Project timeline
    if (hasAny([
        "timeline", "how long", "delivery time",
        "days", "weeks", "deadline",
        "completion time"
    ])) {
        return "Project timelines depend on the scope, number of features, design complexity and integrations. Once we understand your requirements, DYNOBEX can discuss a realistic delivery estimate.";
    }

    // Domain and hosting
    if (hasAny([
        "domain", "hosting", "server",
        "deploy", "deployment", "publish website",
        "live website"
    ])) {
        return "A domain is your website's address, while hosting is where your website files and services run. DYNOBEX can help you understand domain, hosting and deployment requirements based on your website and expected traffic.";
    }

    // Technologies
    if (hasAny([
        "technology", "technologies", "tech stack",
        "framework", "programming language",
        "react", "javascript", "html", "css",
        "dotnet", "python", "database"
    ])) {
        return "The technology stack depends on the type of project, required features, scalability and integrations. DYNOBEX can discuss suitable frontend, backend, database and cloud technologies after understanding your requirements.";
    }

    // Maintenance and support
    if (hasAny([
        "maintenance", "maintain", "support",
        "updates", "website changes", "bug fixing"
    ])) {
        return "Website maintenance and support requirements depend on the project agreement. They may include content updates, bug fixes, technical improvements and ongoing assistance. Please share what kind of support you need.";
    }

    // Industries served
    if (hasAny([
        "clinic", "hospital", "doctor", "restaurant",
        "hotel", "shop", "store", "manufacturer",
        "small business", "startup", "business"
    ])) {
        return "DYNOBEX works on digital solutions for different business requirements, including clinics, healthcare services, restaurants, hotels, stores, startups and other businesses. We can suggest a website or software solution based on your industry and needs.";
    }

    // Contact
    if (hasAny([
        "contact", "whatsapp", "call",
        "phone", "email", "talk to you",
        "speak to someone", "enquiry"
    ])) {
        return "You can contact DYNOBEX through the WhatsApp button or enquiry form on this website. Share your name, business details and project requirements so the team can understand how to help.";
    }

    // Project enquiry / getting started
    if (hasAny([
        "i need", "i want", "looking for",
        "build for me", "create for me",
        "develop for me", "my business",
        "help me", "requirement"
    ])) {
        return "We can help you explore a suitable solution. Please tell me:\n\n1. What type of business do you have?\n2. What do you want to build — a website, mobile app or business software?\n3. What important features do you need?\n\nI'll help you understand the next steps with DYNOBEX.";
    }

    // Default response
    return "I can help you with DYNOBEX services, website development, mobile apps, AI solutions, automation, CRM/ERP, dashboards, SEO, domain and hosting, integrations and project enquiries.\n\nCould you rephrase your question or tell me a little more about what you want to build? I'll try to guide you.";
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
