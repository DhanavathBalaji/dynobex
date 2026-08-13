/* =========================================================
   DYNOBEX ADMIN DASHBOARD
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allEnquiries = [];

let filteredEnquiries = [];

let currentPage = 1;

const rowsPerPage = 10;


/* =========================================================
   INITIALIZE DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await checkAdminSession();

        await loadEnquiries();

        initializeDashboardEvents();

    }
);



/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    try {

        if (
            typeof supabaseClient === "undefined"
        ) {

            console.error(
                "Supabase client is not initialized."
            );

            return;

        }


        const {
            data,
            error
        } = await supabaseClient
            .auth
            .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

        }


        const session =
            data?.session;


        if (!session) {

            console.warn(
                "No active session found."
            );

            /*
            If you want strict login protection,
            uncomment this:

            window.location.href = "admin-login.html";
            */

            return;

        }


        const adminEmailDisplay =
            document.getElementById(
                "adminEmailDisplay"
            );


        if (
            adminEmailDisplay &&
            session.user
        ) {

            adminEmailDisplay.textContent =
                session.user.email;

        }

    }

    catch (error) {

        console.error(
            "Admin session check failed:",
            error
        );

    }

}



/* =========================================================
   LOAD ENQUIRIES FROM SUPABASE
========================================================= */

async function loadEnquiries() {

    const tableBody =
        document.querySelector(
            "#enquiriesTable tbody"
        );


    if (tableBody) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="loading-row"
                >

                    Loading enquiries...

                </td>

            </tr>

        `;

    }


    try {

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

            throw error;

        }


        console.log(
            "DYNOBEX enquiries loaded:",
            data
        );


        allEnquiries =
            data || [];


        filteredEnquiries =
            [...allEnquiries];


        currentPage = 1;


        updateDashboardStats();


        renderEnquiries();


        renderPagination();

    }

    catch (error) {

        console.error(
            "Error loading enquiries:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="error-row"
                    >

                        Unable to load enquiries.

                        <br>

                        Check Supabase RLS SELECT policy.

                    </td>

                </tr>

            `;

        }

    }

}



/* =========================================================
   UPDATE DASHBOARD STATISTICS
========================================================= */

function updateDashboardStats() {

    const total =
        allEnquiries.length;


    const newCount =
        allEnquiries.filter(
            enquiry =>
                normalizeStatus(
                    enquiry.status
                ) === "new"
        ).length;


    const contactedCount =
        allEnquiries.filter(
            enquiry =>
                normalizeStatus(
                    enquiry.status
                ) === "contacted"
        ).length;


    const inProgressCount =
        allEnquiries.filter(
            enquiry =>
                normalizeStatus(
                    enquiry.status
                ) === "in progress"
        ).length;


    const completedCount =
        allEnquiries.filter(
            enquiry =>
                normalizeStatus(
                    enquiry.status
                ) === "completed"
        ).length;


    setElementText(
        "totalCount",
        total
    );


    setElementText(
        "newCount",
        newCount
    );


    setElementText(
        "contactedCount",
        contactedCount
    );


    setElementText(
        "inProgressCount",
        inProgressCount
    );


    setElementText(
        "completedCount",
        completedCount
    );

}



/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(status) {

    return String(
        status || "New"
    )
        .trim()
        .toLowerCase();

}



/* =========================================================
   SET ELEMENT TEXT SAFELY
========================================================= */

function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}



/* =========================================================
   RENDER ENQUIRIES TABLE
========================================================= */

function renderEnquiries() {

    const tableBody =
        document.querySelector(
            "#enquiriesTable tbody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    const startIndex =
        (currentPage - 1) *
        rowsPerPage;


    const endIndex =
        startIndex +
        rowsPerPage;


    const enquiriesToShow =
        filteredEnquiries.slice(
            startIndex,
            endIndex
        );


    if (
        enquiriesToShow.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty-row"
                >

                    No enquiries found.

                </td>

            </tr>

        `;

        return;

    }


    enquiriesToShow.forEach(
        enquiry => {

            const row =
                document.createElement(
                    "tr"
                );


            const createdDate =
                formatDate(
                    enquiry.created_at
                );


            const status =
                enquiry.status ||
                "New";


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(
                            enquiry.name
                        )}
                    </strong>

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.business_name
                    )}

                </td>


                <td>

                    <div class="contact-details">

                        <div>

                            📞
                            ${escapeHtml(
                                enquiry.phone
                            )}

                        </div>


                        <div>

                            ✉️
                            ${escapeHtml(
                                enquiry.email
                            )}

                        </div>

                    </div>

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.service
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        enquiry.budget
                    )}

                </td>


                <td
                    class="message-cell"
                    title="${escapeAttribute(
                        enquiry.message
                    )}"
                >

                    ${truncateText(
                        enquiry.message,
                        70
                    )}

                </td>


                <td>

                    <select
                        class="status-select ${getStatusClass(
                            status
                        )}"
                        onchange="updateEnquiryStatus(
                            '${enquiry.id}',
                            this.value
                        )"
                    >

                        <option
                            value="New"
                            ${status === "New"
                                ? "selected"
                                : ""
                            }
                        >
                            New
                        </option>


                        <option
                            value="Contacted"
                            ${status === "Contacted"
                                ? "selected"
                                : ""
                            }
                        >
                            Contacted
                        </option>


                        <option
                            value="In Progress"
                            ${status === "In Progress"
                                ? "selected"
                                : ""
                            }
                        >
                            In Progress
                        </option>


                        <option
                            value="Completed"
                            ${status === "Completed"
                                ? "selected"
                                : ""
                            }
                        >
                            Completed
                        </option>

                    </select>

                </td>


                <td>

                    ${createdDate}

                </td>


                <td>

                    <div class="action-buttons">


                        ${
                            enquiry.phone
                            ? `

                                <a
                                    href="https://wa.me/${formatPhoneForWhatsApp(
                                        enquiry.phone
                                    )}"
                                    target="_blank"
                                    class="whatsapp-action"
                                    title="Contact on WhatsApp"
                                >

                                    💬

                                </a>

                            `
                            : ""
                        }


                        <button
                            type="button"
                            class="delete-action"
                            title="Delete enquiry"
                            onclick="deleteEnquiry(
                                '${enquiry.id}'
                            )"
                        >

                            🗑

                        </button>


                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}



/* =========================================================
   INITIALIZE EVENTS
========================================================= */

function initializeDashboardEvents() {

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const refreshButton =
        document.getElementById(
            "refreshButton"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadEnquiries
        );

    }

}



/* =========================================================
   FILTER + SEARCH
========================================================= */

function applyFilters() {

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    filteredEnquiries =
        allEnquiries.filter(
            enquiry => {

                const enquiryStatus =
                    enquiry.status ||
                    "New";


                const matchesStatus =
                    selectedStatus === "All" ||
                    enquiryStatus === selectedStatus;


                const searchableText =

                    `${enquiry.name || ""}
                    ${enquiry.business_name || ""}
                    ${enquiry.email || ""}
                    ${enquiry.phone || ""}
                    ${enquiry.service || ""}
                    ${enquiry.message || ""}`

                    .toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        searchTerm
                    );


                return (
                    matchesStatus &&
                    matchesSearch
                );

            }
        );


    currentPage = 1;


    renderEnquiries();


    renderPagination();

}



/* =========================================================
   UPDATE ENQUIRY STATUS
========================================================= */

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
                status: newStatus
            })
            .eq(
                "id",
                enquiryId
            );


        if (error) {

            throw error;

        }


        const enquiry =
            allEnquiries.find(
                item =>
                    String(item.id) ===
                    String(enquiryId)
            );


        if (enquiry) {

            enquiry.status =
                newStatus;

        }


        filteredEnquiries =
            filteredEnquiries.map(
                item => {

                    if (
                        String(item.id) ===
                        String(enquiryId)
                    ) {

                        return {
                            ...item,
                            status: newStatus
                        };

                    }


                    return item;

                }
            );


        updateDashboardStats();


        renderEnquiries();


        renderPagination();

    }

    catch (error) {

        console.error(
            "Error updating enquiry status:",
            error
        );


        alert(
            "Unable to update status. " +
            "Please check the Supabase UPDATE policy."
        );


        await loadEnquiries();

    }

}



/* =========================================================
   DELETE ENQUIRY
========================================================= */

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


        allEnquiries =
            allEnquiries.filter(
                enquiry =>
                    String(enquiry.id) !==
                    String(enquiryId)
            );


        applyFilters();


        updateDashboardStats();

    }

    catch (error) {

        console.error(
            "Error deleting enquiry:",
            error
        );


        alert(
            "Unable to delete enquiry. " +
            "Please check the Supabase DELETE policy."
        );

    }

}



/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {

        return;

    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredEnquiries.length /
            rowsPerPage
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "←";


    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        () => {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderEnquiries();

                renderPagination();

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "button"
            );


        pageButton.textContent =
            page;


        if (
            page === currentPage
        ) {

            pageButton.classList.add(
                "active-page"
            );

        }


        pageButton.addEventListener(
            "click",
            () => {

                currentPage =
                    page;


                renderEnquiries();


                renderPagination();

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "→";


    nextButton.disabled =
        currentPage ===
        totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderEnquiries();

                renderPagination();

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}



/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "-";

    }


    try {

        return new Date(
            dateValue
        ).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    catch {

        return dateValue;

    }

}



/* =========================================================
   FORMAT PHONE FOR WHATSAPP
========================================================= */

function formatPhoneForWhatsApp(
    phone
) {

    if (!phone) {

        return "";

    }


    let cleaned =
        String(phone)
            .replace(
                /\D/g,
                ""
            );


    if (
        cleaned.length === 10
    ) {

        cleaned =
            "91" +
            cleaned;

    }


    return cleaned;

}



/* =========================================================
   GET STATUS CLASS
========================================================= */

function getStatusClass(
    status
) {

    const normalized =
        normalizeStatus(
            status
        );


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
        normalized === "in progress"
    ) {

        return "status-progress";

    }


    if (
        normalized === "completed"
    ) {

        return "status-completed";

    }


    return "";

}



/* =========================================================
   TRUNCATE TEXT
========================================================= */

function truncateText(
    text,
    maxLength
) {

    if (!text) {

        return "-";

    }


    const value =
        String(text);


    if (
        value.length <=
        maxLength
    ) {

        return escapeHtml(
            value
        );

    }


    return (
        escapeHtml(
            value.substring(
                0,
                maxLength
            )
        ) +
        "..."
    );

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}



/* =========================================================
   ESCAPE HTML ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
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



/* =========================================================
   LOGOUT
========================================================= */

async function logoutAdmin() {

    try {

        await supabaseClient
            .auth
            .signOut();


        window.location.href =
            "admin-login.html";

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}