/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://abolzdxpzgidefurndct.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_EauZQ2ULCQl3QswtgrBioA_1YzlsQ4a";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



    /* =====================================================
   POPULATE SERVICE FILTER
===================================================== */

function populateServiceFilter(enquiries) {

    if (!serviceFilter) {
        return;
    }

    const currentValue =
        serviceFilter.value;


    const services =
        [
            ...new Set(

                enquiries
                    .map(enquiry =>
                        enquiry.service
                    )
                    .filter(service =>
                        service &&
                        service.trim() !== ""
                    )

            )
        ];


    serviceFilter.innerHTML =
        `<option value="">
            All Services
        </option>`;


    services
        .sort()
        .forEach(service => {

            const option =
                document.createElement("option");


            option.value =
                service;


            option.textContent =
                service;


            serviceFilter.appendChild(
                option
            );

        });


    if (
        services.includes(
            currentValue
        )
    ) {

        serviceFilter.value =
            currentValue;

    }

}

/* =========================================================
   DYNOBEX ADMIN DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const totalEnquiriesElement =
        document.getElementById("totalEnquiries");

    const newEnquiriesElement =
        document.getElementById("newEnquiries");

    const contactedEnquiriesElement =
        document.getElementById("contactedEnquiries");

    const inProgressEnquiriesElement =
        document.getElementById("inProgressEnquiries");

    const completedEnquiriesElement =
        document.getElementById("completedEnquiries");


    const enquiriesTableBody =
        document.getElementById("enquiriesTableBody");


    const searchInput =
        document.getElementById("searchInput");


    const statusFilter =
        document.getElementById("statusFilter");


    const serviceFilter =
        document.getElementById("serviceFilter");


    const budgetFilter =
        document.getElementById("budgetFilter");


    const refreshButton =
        document.getElementById("refreshButton");


    const logoutButton =
        document.getElementById("logoutButton");


    /* =====================================================
       GLOBAL DATA
    ===================================================== */

    let allEnquiries = [];


    /* =====================================================
       CHECK ADMIN AUTHENTICATION
    ===================================================== */

    async function checkAuthentication() {

        try {

            const {
                data,
                error
            } = await supabaseClient
                .auth
                .getUser();


            if (error) {

                console.error(
                    "Authentication error:",
                    error
                );

            }


            if (!data.user) {

                window.location.href =
                    "login.html";

                return false;

            }


            return true;

        }

        catch (error) {

            console.error(
                "Unable to verify user:",
                error
            );


            window.location.href =
                "login.html";


            return false;

        }

    }


    /* =====================================================
       LOAD ALL ENQUIRIES
    ===================================================== */

    async function loadEnquiries() {

        try {

            showLoadingState();


            const {
                data,
                error
            } = await supabaseClient
                .from("project_enquiries")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {

                console.error(
                    "Supabase fetch error:",
                    error
                );

                throw error;

            }


            console.log(
                "DYNOBEX Enquiries:",
                data
            );


           allEnquiries =
    data || [];


/* Update dashboard cards */

updateDashboardStatistics(
    allEnquiries
);


/* Populate service dropdown dynamically */

populateServiceFilter(
    allEnquiries
);


/* Populate budget dropdown dynamically */

populateBudgetFilter(
    allEnquiries
);


/* Render enquiry table */

renderEnquiries(
    allEnquiries
);


        }

        catch (error) {

            console.error(
                "Error loading enquiries:",
                error
            );


            showDashboardError(
                error
            );

        }

    }


    /* =====================================================
       UPDATE DASHBOARD STATISTICS
    ===================================================== */

    function updateDashboardStatistics(enquiries) {

        const total =
            enquiries.length;


        const newCount =
            enquiries.filter(enquiry => {

                return normalizeStatus(
                    enquiry.status
                ) === "new";

            }).length;


        const contactedCount =
            enquiries.filter(enquiry => {

                return normalizeStatus(
                    enquiry.status
                ) === "contacted";

            }).length;


        const inProgressCount =
            enquiries.filter(enquiry => {

                return normalizeStatus(
                    enquiry.status
                ) === "inprogress";

            }).length;


        const completedCount =
            enquiries.filter(enquiry => {

                return normalizeStatus(
                    enquiry.status
                ) === "completed";

            }).length;


        if (totalEnquiriesElement) {

            totalEnquiriesElement.textContent =
                total;

        }


        if (newEnquiriesElement) {

            newEnquiriesElement.textContent =
                newCount;

        }


        if (contactedEnquiriesElement) {

            contactedEnquiriesElement.textContent =
                contactedCount;

        }


        if (inProgressEnquiriesElement) {

            inProgressEnquiriesElement.textContent =
                inProgressCount;

        }


        if (completedEnquiriesElement) {

            completedEnquiriesElement.textContent =
                completedCount;

        }


        console.log(
            "Dashboard Statistics:",
            {
                total,
                newCount,
                contactedCount,
                inProgressCount,
                completedCount
            }
        );

    }


    /* =====================================================
       NORMALIZE STATUS

       Handles:
       New
       new
       NEW
       In Progress
       in progress
       IN_PROGRESS
    ===================================================== */

    function normalizeStatus(status) {

        if (!status) {

            return "new";

        }


        return status
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[\s_-]/g, "");

    }


    /* =====================================================
       RENDER ENQUIRIES TABLE
    ===================================================== */

    function renderEnquiries(enquiries) {

        if (!enquiriesTableBody) {

            console.error(
                "enquiriesTableBody not found"
            );

            return;

        }


        enquiriesTableBody.innerHTML = "";


        if (!enquiries.length) {

            enquiriesTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >

                        No enquiries found.

                    </td>

                </tr>

            `;


            return;

        }


        enquiries.forEach(enquiry => {

            const row =
                document.createElement("tr");


            const formattedDate =
                formatDate(
                    enquiry.created_at
                );


            const status =
                enquiry.status || "New";


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(
                            enquiry.name || "-"
                        )}
                    </strong>

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.business_name || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.phone || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.service || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.budget || "-"
                    )}

                </td>


                <td>

                    <span
                        class="
                            status-badge
                            ${getStatusClass(status)}
                        "
                    >

                        ${escapeHtml(status)}

                    </span>

                </td>


                <td>

                    ${formattedDate}

                </td>


                <td class="dashboard-actions">

                    <button
                        class="action-btn view-btn"
                        data-id="${enquiry.id}"
                    >

                        View

                    </button>


                    <button
                        class="action-btn whatsapp-btn"
                        data-id="${enquiry.id}"
                    >

                        WhatsApp

                    </button>


                    <button
                        class="action-btn delete-btn"
                        data-id="${enquiry.id}"
                    >

                        Delete

                    </button>

                </td>

            `;


            enquiriesTableBody.appendChild(
                row
            );

        });


        attachTableActionListeners();

    }


    /* =====================================================
   POPULATE BUDGET FILTER
===================================================== */

function populateBudgetFilter(enquiries) {

    if (!budgetFilter) {
        return;
    }

    const currentValue =
        budgetFilter.value;


    const budgets =
        [
            ...new Set(

                enquiries
                    .map(enquiry =>
                        enquiry.budget
                    )
                    .filter(budget =>
                        budget &&
                        budget.trim() !== ""
                    )

            )
        ];


    budgetFilter.innerHTML =
        `<option value="">
            All Budgets
        </option>`;


    budgets
        .forEach(budget => {

            const option =
                document.createElement("option");


            option.value =
                budget;


            option.textContent =
                budget;


            budgetFilter.appendChild(
                option
            );

        });


    if (
        budgets.includes(
            currentValue
        )
    ) {

        budgetFilter.value =
            currentValue;

    }

}

    /* =====================================================
       TABLE ACTIONS
    ===================================================== */

    function attachTableActionListeners() {

        document
            .querySelectorAll(".view-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const enquiryId =
                            button.dataset.id;


                        viewEnquiry(
                            enquiryId
                        );

                    }
                );

            });


        document
            .querySelectorAll(".whatsapp-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const enquiryId =
                            button.dataset.id;


                        openWhatsApp(
                            enquiryId
                        );

                    }
                );

            });


        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const enquiryId =
                            button.dataset.id;


                        deleteEnquiry(
                            enquiryId
                        );

                    }
                );

            });

    }


    /* =====================================================
       VIEW ENQUIRY
    ===================================================== */

    function viewEnquiry(enquiryId) {

        const enquiry =
            allEnquiries.find(

                item =>
                    String(item.id) ===
                    String(enquiryId)

            );


        if (!enquiry) {

            return;

        }


        openEnquiryModal(
            enquiry
        );

    }


    /* =====================================================
       ENQUIRY MODAL
    ===================================================== */

    /* =====================================================
   OPEN ENQUIRY MODAL
===================================================== */

function openEnquiryModal(enquiry) {

    console.log(
        "Opening enquiry:",
        enquiry
    );


    /* Remove existing modal if present */

    const existingModal =
        document.getElementById(
            "enquiryModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    /* Create modal */

    const modal =
        document.createElement("div");


    modal.id =
        "enquiryModal";


    modal.className =
        "enquiry-modal";


    /* Format enquiry data safely */

    const name =
        enquiry.name || "Not provided";


    const businessName =
        enquiry.business_name || "Not provided";


    const phone =
        enquiry.phone || "Not provided";


    const email =
        enquiry.email || "Not provided";


    const service =
        enquiry.service || "Not selected";


    const budget =
        enquiry.budget || "Not specified";


    const message =
        enquiry.message || "No project details provided";


    const status =
        enquiry.status || "New";


    /* Create modal content */

    modal.innerHTML = `

        <div class="modal-content">

            <div class="modal-header">

                <div>

                    <h2>
                        Enquiry Details
                    </h2>

                    <p>
                        Complete project enquiry information
                    </p>

                </div>


                <button
                    type="button"
                    class="close-modal"
                    id="closeEnquiryModal"
                    aria-label="Close"
                >
                    ×
                </button>

            </div>



            <div class="enquiry-details">


                <!-- Customer Details -->

                <div class="detail-section">

                    <h3>
                        👤 Customer Details
                    </h3>

                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>

                    <p>
                        <strong>Business:</strong>
                        ${businessName}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${phone}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>

                </div>



                <!-- Project Details -->

                <div class="detail-section">

                    <h3>
                        💼 Project Details
                    </h3>

                    <p>
                        <strong>Service:</strong>
                        ${service}
                    </p>

                    <p>
                        <strong>Budget:</strong>
                        ${budget}
                    </p>

                    <p>
                        <strong>Current Status:</strong>
                        ${status}
                    </p>

                </div>



                <!-- Project Requirement -->

                <div class="detail-section">

                    <h3>
                        📋 Project Requirement
                    </h3>

                    <div class="project-message">

                        ${message}

                    </div>

                </div>



                <!-- Update Status -->

                <div class="detail-section">

                    <h3>
                        🔄 Update Enquiry Status
                    </h3>


                    <select id="modalStatusSelect">

                        <option
                            value="New"
                            ${status === "New" ? "selected" : ""}
                        >
                            New
                        </option>


                        <option
                            value="Contacted"
                            ${status === "Contacted" ? "selected" : ""}
                        >
                            Contacted
                        </option>


                        <option
                            value="In Progress"
                            ${status === "In Progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>


                        <option
                            value="Completed"
                            ${status === "Completed" ? "selected" : ""}
                        >
                            Completed
                        </option>

                    </select>


                    <button
                        type="button"
                        class="save-status-btn"
                        id="saveModalStatus"
                    >
                        Update Status
                    </button>

                </div>


            </div>



            <!-- Contact Actions -->

            <div class="modal-contact-actions">

                <button
                    type="button"
                    id="modalWhatsAppButton"
                >
                    💬 WhatsApp
                </button>


                <button
                    type="button"
                    id="modalCallButton"
                >
                    📞 Call
                </button>


                <button
                    type="button"
                    id="modalEmailButton"
                >
                    ✉ Email
                </button>

            </div>


        </div>

    `;


    /* Add modal to page */

    document.body.appendChild(
        modal
    );


    /* Show modal */

    setTimeout(() => {

        modal.classList.add(
            "show"
        );

    }, 10);



    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const closeButton =
        document.getElementById(
            "closeEnquiryModal"
        );


    closeButton.addEventListener(
        "click",
        () => {

            modal.remove();

        }
    );


    /* Close when clicking outside */

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );



    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsappButton =
        document.getElementById(
            "modalWhatsAppButton"
        );


    whatsappButton.addEventListener(
        "click",
        () => {

            if (
                !enquiry.phone
            ) {

                alert(
                    "Phone number is not available."
                );

                return;

            }


            const cleanPhone =
                enquiry.phone
                    .replace(/\D/g, "");


            const whatsappMessage =
                `Hello ${name},

Thank you for contacting DYNOBEX.

We received your enquiry regarding:

Service: ${service}
Business: ${businessName}

Our team will get back to you shortly.

— DYNOBEX`;


            const whatsappURL =
                `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                    whatsappMessage
                )}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );



    /* =====================================================
       CALL CUSTOMER
    ===================================================== */

    const callButton =
        document.getElementById(
            "modalCallButton"
        );


    callButton.addEventListener(
        "click",
        () => {

            if (
                !enquiry.phone
            ) {

                alert(
                    "Phone number is not available."
                );

                return;

            }


            window.location.href =
                `tel:${enquiry.phone}`;

        }
    );



    /* =====================================================
       EMAIL CUSTOMER
    ===================================================== */

    const emailButton =
        document.getElementById(
            "modalEmailButton"
        );


    emailButton.addEventListener(
        "click",
        () => {

            if (
                !enquiry.email
            ) {

                alert(
                    "Email address is not available."
                );

                return;

            }


            const subject =
                `Regarding Your DYNOBEX Enquiry`;


            const emailBody =
                `Hello ${name},

Thank you for contacting DYNOBEX.

We received your enquiry for:

Service: ${service}
Business: ${businessName}

We would like to discuss your project requirements further.

Regards,
DYNOBEX`;


            window.location.href =
                `mailto:${enquiry.email}?subject=${encodeURIComponent(
                    subject
                )}&body=${encodeURIComponent(
                    emailBody
                )}`;

        }
    );



    /* =====================================================
       UPDATE STATUS
    ===================================================== */

    const saveStatusButton =
        document.getElementById(
            "saveModalStatus"
        );


    saveStatusButton.addEventListener(
        "click",
        async () => {

            const newStatus =
                document.getElementById(
                    "modalStatusSelect"
                ).value;


            saveStatusButton.disabled =
                true;


            saveStatusButton.textContent =
                "Updating...";


            try {

                const { error } =
                    await supabaseClient
                        .from(
                            "project_enquiries"
                        )
                        .update({

                            status:
                                newStatus

                        })
                        .eq(
                            "id",
                            enquiry.id
                        );


                if (error) {

                    throw error;

                }


                enquiry.status =
                    newStatus;


                saveStatusButton.textContent =
                    "✓ Status Updated";


                /* Reload dashboard data */

                if (
                    typeof loadEnquiries ===
                    "function"
                ) {

                    await loadEnquiries();

                }


                setTimeout(() => {

                    modal.remove();

                }, 800);


            } catch (error) {

                console.error(
                    "Status update error:",
                    error
                );


                saveStatusButton.textContent =
                    "Failed to Update";


                setTimeout(() => {

                    saveStatusButton.textContent =
                        "Update Status";


                    saveStatusButton.disabled =
                        false;

                }, 2000);

            }

        }
    );

}


    /* =====================================================
       CREATE MODAL
    ===================================================== */

    function createEnquiryModal() {

        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "enquiryModal";


        modal.className =
            "enquiry-modal";


        modal.innerHTML = `

            <div class="modal-overlay"></div>


            <div class="modal-content">

                <button
                    class="modal-close"
                    id="closeModal"
                >

                    ×

                </button>


                <div class="modal-body">

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        document
            .getElementById("closeModal")
            .addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "show"
                    );

                }
            );


        modal
            .querySelector(
                ".modal-overlay"
            )
            .addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "show"
                    );

                }
            );


        return modal;

    }


    /* =====================================================
       GENERATE STATUS OPTIONS
    ===================================================== */

    function generateStatusOptions(
        currentStatus
    ) {

        const statuses = [

            "New",

            "Contacted",

            "In Progress",

            "Completed",

            "Closed"

        ];


        return statuses
            .map(status => `

                <option
                    value="${status}"
                    ${
                        normalizeStatus(status) ===
                        normalizeStatus(currentStatus)

                            ? "selected"

                            : ""
                    }
                >

                    ${status}

                </option>

            `)
            .join("");

    }


    /* =====================================================
       UPDATE ENQUIRY STATUS
    ===================================================== */

    async function updateEnquiryStatus(
        enquiryId,
        newStatus
    ) {

        try {

            const {
                error
            } = await supabaseClient
                .from("project_enquiries")
                .update({

                    status:
                        newStatus

                })
                .eq(
                    "id",
                    enquiryId
                );


            if (error) {

                throw error;

            }


            const modal =
                document.getElementById(
                    "enquiryModal"
                );


            if (modal) {

                modal.classList.remove(
                    "show"
                );

            }


            await loadEnquiries();


            alert(
                "Status updated successfully."
            );

        }

        catch (error) {

            console.error(
                "Status update error:",
                error
            );


            alert(
                "Unable to update status."
            );

        }

    }


    /* =====================================================
       WHATSAPP CUSTOMER
    ===================================================== */

    function openWhatsApp(enquiryId) {

        const enquiry =
            allEnquiries.find(

                item =>
                    String(item.id) ===
                    String(enquiryId)

            );


        if (
            !enquiry ||
            !enquiry.phone
        ) {

            alert(
                "Customer phone number is not available."
            );

            return;

        }


        let phone =
            enquiry.phone
                .replace(/\D/g, "");


        if (
            phone.length === 10
        ) {

            phone =
                "91" + phone;

        }


        const message =

`Hello ${enquiry.name},

Thank you for contacting DYNOBEX.

We received your enquiry regarding:

Service: ${enquiry.service || "Not specified"}

Budget: ${enquiry.budget || "Not specified"}

Our team will get back to you shortly.

Regards,
DYNOBEX`;


        const whatsappURL =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }


    /* =====================================================
       DELETE ENQUIRY
    ===================================================== */

    async function deleteEnquiry(
        enquiryId
    ) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this enquiry?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const {
                error
            } = await supabaseClient
                .from("project_enquiries")
                .delete()
                .eq(
                    "id",
                    enquiryId
                );


            if (error) {

                throw error;

            }


            await loadEnquiries();


            alert(
                "Enquiry deleted successfully."
            );

        }

        catch (error) {

            console.error(
                "Delete error:",
                error
            );


            alert(
                "Unable to delete enquiry."
            );

        }

    }


    /* =====================================================
       SEARCH AND FILTERS
    ===================================================== */

    function applyFilters() {

        let filtered =
            [...allEnquiries];


        const searchTerm =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "";


        const selectedService =
            serviceFilter
                ? serviceFilter.value
                : "";


        const selectedBudget =
            budgetFilter
                ? budgetFilter.value
                : "";


        if (searchTerm) {

            filtered =
                filtered.filter(enquiry => {

                    const searchableText =

                        `${enquiry.name || ""}
                        ${enquiry.business_name || ""}
                        ${enquiry.email || ""}
                        ${enquiry.phone || ""}
                        ${enquiry.service || ""}`

                            .toLowerCase();


                    return searchableText.includes(
                        searchTerm
                    );

                });

        }


        if (selectedStatus) {

            filtered =
                filtered.filter(enquiry =>

                    normalizeStatus(
                        enquiry.status
                    ) ===

                    normalizeStatus(
                        selectedStatus
                    )

                );

        }


        if (selectedService) {

            filtered =
                filtered.filter(enquiry =>

                    enquiry.service ===
                    selectedService

                );

        }


        if (selectedBudget) {

            filtered =
                filtered.filter(enquiry =>

                    enquiry.budget ===
                    selectedBudget

                );

        }


        renderEnquiries(
            filtered
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (serviceFilter) {

        serviceFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (budgetFilter) {

        budgetFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    /* =====================================================
       REFRESH BUTTON
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                refreshButton.disabled =
                    true;


                const originalText =
                    refreshButton.innerHTML;


                refreshButton.innerHTML =
                    "Refreshing...";


                await loadEnquiries();


                setTimeout(() => {

                    refreshButton.disabled =
                        false;


                    refreshButton.innerHTML =
                        originalText;

                }, 500);

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                try {

                    const {
                        error
                    } = await supabaseClient
                        .auth
                        .signOut();


                    if (error) {

                        throw error;

                    }


                    window.location.href =
                        "login.html";

                }

                catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    alert(
                        "Unable to logout."
                    );

                }

            }
        );

    }


    /* =====================================================
       LOADING STATE
    ===================================================== */

    function showLoadingState() {

        if (!enquiriesTableBody) {

            return;

        }


        enquiriesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    Loading enquiries...

                </td>

            </tr>

        `;

    }


    /* =====================================================
       ERROR STATE
    ===================================================== */

    function showDashboardError(error) {

        if (enquiriesTableBody) {

            enquiriesTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        style="
                            text-align:center;
                            padding:30px;
                            color:red;
                        "
                    >

                        Unable to load enquiries.

                        <br>

                        <small>

                            ${escapeHtml(
                                error.message ||
                                "Unknown error"
                            )}

                        </small>

                    </td>

                </tr>

            `;

        }


        console.error(
            "Full Dashboard Error:",
            error
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "-";

        }


        try {

            const date =
                new Date(
                    dateValue
                );


            return date.toLocaleDateString(
                "en-IN",
                {

                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }
            );

        }

        catch {

            return dateValue;

        }

    }


    /* =====================================================
       STATUS CSS CLASS
    ===================================================== */

    function getStatusClass(status) {

        const normalized =
            normalizeStatus(status);


        if (
            normalized === "new"
        ) {

            return "status-new";

        }


        if (
            normalized === "contacted"
        ) {

            return "status-contacted";

        }


        if (
            normalized === "inprogress"
        ) {

            return "status-in-progress";

        }


        if (
            normalized === "completed"
        ) {

            return "status-completed";

        }


        if (
            normalized === "closed"
        ) {

            return "status-closed";

        }


        return "";

    }


    /* =====================================================
       HTML ESCAPE

       Prevents data from breaking dashboard HTML.
    ===================================================== */

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       INITIALIZE DASHBOARD
    ===================================================== */

    const authenticated =
        await checkAuthentication();


    if (!authenticated) {

        return;

    }


    await loadEnquiries();


});