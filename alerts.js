/* AquaSentinel AI — Professional Alerts Page */

(() => {
    "use strict";

    /* =====================================================
       PROTOTYPE ALERT DATA
       ===================================================== */

    const alerts = [
        {
            id: "TR-CHOLERA-001",
            title: "Priority Cholera Surveillance Signal",
            state: "Tripura",
            district: "West Tripura",
            severity: "Critical",
            status: "Active",
            disease: "Cholera",
            score: 88,
            date: "18 Aug 2026",
            environmental: 91,
            health: 85,
            description:
                "A strong prototype environmental signal combined with an unusual increase in community health indicators requires immediate verification."
        },
        {
            id: "AS-DIARRHOEA-002",
            title: "Elevated Diarrhoeal Disease Risk",
            state: "Assam",
            district: "Kamrup Metropolitan",
            severity: "High",
            status: "Active",
            disease: "Diarrhoeal disease",
            score: 76,
            date: "18 Aug 2026",
            environmental: 81,
            health: 71,
            description:
                "Environmental exposure and increasing prototype health-surveillance signals indicate a high regional monitoring priority."
        },
        {
            id: "MN-DYSENTERY-003",
            title: "Increasing Dysentery Monitoring Signal",
            state: "Manipur",
            district: "Imphal West",
            severity: "High",
            status: "Monitoring",
            disease: "Dysentery",
            score: 72,
            date: "17 Aug 2026",
            environmental: 70,
            health: 74,
            description:
                "An increasing prototype health signal and environmental vulnerability require closer water and community surveillance."
        },
        {
            id: "ML-TYPHOID-004",
            title: "Typhoid Environmental Watch",
            state: "Meghalaya",
            district: "East Khasi Hills",
            severity: "Moderate",
            status: "Monitoring",
            disease: "Typhoid",
            score: 57,
            date: "17 Aug 2026",
            environmental: 61,
            health: 53,
            description:
                "Moderately elevated environmental indicators are being monitored alongside stable community health signals."
        },
        {
            id: "NL-TYPHOID-005",
            title: "Community Typhoid Monitoring Notice",
            state: "Nagaland",
            district: "Kohima",
            severity: "Moderate",
            status: "Monitoring",
            disease: "Typhoid",
            score: 52,
            date: "16 Aug 2026",
            environmental: 55,
            health: 49,
            description:
                "Environmental and health indicators remain within the middle prototype range and require continued observation."
        },
        {
            id: "SK-HEPATITIS-006",
            title: "Hepatitis A Water-Quality Watch",
            state: "Sikkim",
            district: "Gangtok",
            severity: "Moderate",
            status: "Monitoring",
            disease: "Hepatitis A",
            score: 48,
            date: "16 Aug 2026",
            environmental: 51,
            health: 45,
            description:
                "Moderate environmental sensitivity and a stable health signal support continued preventive monitoring."
        },
        {
            id: "AR-DIARRHOEA-007",
            title: "Routine Diarrhoeal Disease Observation",
            state: "Arunachal Pradesh",
            district: "Papum Pare",
            severity: "Low",
            status: "Monitoring",
            disease: "Diarrhoeal disease",
            score: 29,
            date: "15 Aug 2026",
            environmental: 32,
            health: 26,
            description:
                "Prototype environmental and health indicators remain within the low-risk range under routine observation."
        },
        {
            id: "MZ-GIARDIASIS-008",
            title: "Routine Giardiasis Monitoring",
            state: "Mizoram",
            district: "Aizawl",
            severity: "Low",
            status: "Resolved",
            disease: "Giardiasis",
            score: 31,
            date: "14 Aug 2026",
            environmental: 34,
            health: 28,
            description:
                "No unusual increase was identified, and the prototype monitoring event has been marked as resolved."
        },
        {
            id: "AS-TYPHOID-009",
            title: "Localised Typhoid Surveillance Watch",
            state: "Assam",
            district: "Dibrugarh",
            severity: "Moderate",
            status: "Resolved",
            disease: "Typhoid",
            score: 46,
            date: "13 Aug 2026",
            environmental: 49,
            health: 43,
            description:
                "The localised prototype signal returned to the expected monitoring range after continued observation."
        },
        {
            id: "ML-DIARRHOEA-010",
            title: "Community Water Safety Observation",
            state: "Meghalaya",
            district: "West Garo Hills",
            severity: "Low",
            status: "Resolved",
            disease: "Diarrhoeal disease",
            score: 27,
            date: "12 Aug 2026",
            environmental: 30,
            health: 24,
            description:
                "The prototype community health observation was reviewed and marked as resolved with routine monitoring recommended."
        }
    ];

    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const alertsGrid =
        document.getElementById("alertsGrid");

    const alertEmptyState =
        document.getElementById("alertEmptyState");

    const alertSearch =
        document.getElementById("alertSearch");

    const alertStateFilter =
        document.getElementById("alertStateFilter");

    const alertSeverityFilter =
        document.getElementById("alertSeverityFilter");

    const alertStatusFilter =
        document.getElementById("alertStatusFilter");

    const resetAlertFilters =
        document.getElementById("resetAlertFilters");

    const emptyResetButton =
        document.getElementById("emptyResetButton");

    const alertGridView =
        document.getElementById("alertGridView");

    const alertListView =
        document.getElementById("alertListView");

    let currentView = "grid";

    /* =====================================================
       HELPERS
       ===================================================== */

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function getSeverityClass(severity) {
        const classes = {
            Critical: "severity-critical",
            High: "severity-high",
            Moderate: "severity-moderate",
            Low: "severity-low"
        };

        return classes[severity] || "severity-low";
    }

    function getStatusClass(status) {
        const classes = {
            Active: "status-active",
            Monitoring: "status-monitoring",
            Resolved: "status-resolved"
        };

        return classes[status] || "status-monitoring";
    }

    function createAlertDetailsUrl(alert) {
        const destination = new URL(
            "alert-details.html",
            window.location.href
        );

        destination.searchParams.set(
            "alert",
            alert.id
        );

        return destination.href;
    }

    /* =====================================================
       SUMMARY COUNTERS
       ===================================================== */

    function updateSummaryCounters() {
        const criticalCount = alerts.filter(
            (alert) => alert.severity === "Critical"
        ).length;

        const highCount = alerts.filter(
            (alert) => alert.severity === "High"
        ).length;

        const resolvedCount = alerts.filter(
            (alert) => alert.status === "Resolved"
        ).length;

        setText(
            "totalAlertCount",
            String(alerts.length).padStart(2, "0")
        );

        setText(
            "criticalAlertCount",
            String(criticalCount).padStart(2, "0")
        );

        setText(
            "highAlertCount",
            String(highCount).padStart(2, "0")
        );

        setText(
            "resolvedAlertCount",
            String(resolvedCount).padStart(2, "0")
        );

        setText(
            "heroCriticalCount",
            `${String(criticalCount).padStart(2, "0")} priority`
        );
    }

    /* =====================================================
       FEATURED ALERT
       ===================================================== */

    function updateFeaturedAlert() {
        const featuredAlert =
            alerts
                .slice()
                .sort(
                    (first, second) =>
                        second.score - first.score
                )[0];

        if (!featuredAlert) {
            return;
        }

        setText(
            "featuredAlertTitle",
            featuredAlert.title
        );

        setText(
            "featuredAlertDescription",
            featuredAlert.description
        );

        setText(
            "featuredAlertState",
            `${featuredAlert.district}, ${featuredAlert.state}`
        );

        setText(
            "featuredAlertDisease",
            featuredAlert.disease
        );

        setText(
            "featuredAlertSeverity",
            featuredAlert.severity
        );

        setText(
            "featuredAlertStatus",
            featuredAlert.status
        );

        setText(
            "featuredPriorityScore",
            featuredAlert.score
        );

        const featuredLink =
            document.getElementById("featuredAlertLink");

        if (featuredLink) {
            featuredLink.href =
                createAlertDetailsUrl(featuredAlert);
        }
    }

    /* =====================================================
       ALERT CARD
       ===================================================== */

    function createAlertCard(alert) {
        const card = document.createElement("article");

        card.className = "alert-card";
        card.dataset.alertId = alert.id;

        card.innerHTML = `
            <div class="alert-card-top">
                <span
                    class="alert-card-severity
                    ${getSeverityClass(alert.severity)}"
                >
                    ${alert.severity}
                </span>

                <span class="alert-card-id">
                    ${alert.id}
                </span>
            </div>

            <div class="alert-card-main">
                <h3>${alert.title}</h3>

                <p class="alert-card-location">
                    ${alert.district}, ${alert.state}
                </p>

                <p class="alert-card-description">
                    ${alert.description}
                </p>
            </div>

            <div class="alert-card-information">
                <div class="alert-card-meta">
                    <span>
                        Disease signal
                        <strong>${alert.disease}</strong>
                    </span>

                    <span>
                        Risk score
                        <strong>${alert.score}/100</strong>
                    </span>

                    <span>
                        Environmental
                        <strong>${alert.environment}%</strong>
                    </span>

                    <span>
                        Health signal
                        <strong>${alert.health}%</strong>
                    </span>
                </div>

                <span
                    class="alert-status
                    ${getStatusClass(alert.status)}"
                >
                    ${alert.status}
                </span>

                <a
                    href="${createAlertDetailsUrl(alert)}"
                    class="alert-card-link"
                >
                    View Full Alert →
                </a>
            </div>
        `;

        return card;
    }

    /* =====================================================
       FILTERING
       ===================================================== */

    function getFilteredAlerts() {
        const searchTerm =
            alertSearch
                ? alertSearch.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedState =
            alertStateFilter
                ? alertStateFilter.value
                : "all";

        const selectedSeverity =
            alertSeverityFilter
                ? alertSeverityFilter.value
                : "all";

        const selectedStatus =
            alertStatusFilter
                ? alertStatusFilter.value
                : "all";

        return alerts.filter((alert) => {
            const searchableContent = [
                alert.id,
                alert.title,
                alert.state,
                alert.district,
                alert.severity,
                alert.status,
                alert.disease,
                alert.description
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchTerm ||
                searchableContent.includes(searchTerm);

            const matchesState =
                selectedState === "all" ||
                alert.state === selectedState;

            const matchesSeverity =
                selectedSeverity === "all" ||
                alert.severity === selectedSeverity;

            const matchesStatus =
                selectedStatus === "all" ||
                alert.status === selectedStatus;

            return (
                matchesSearch &&
                matchesState &&
                matchesSeverity &&
                matchesStatus
            );
        });
    }

    /* =====================================================
       RENDER ALERTS
       ===================================================== */

    function renderAlerts() {
        if (!alertsGrid) {
            return;
        }

        const filteredAlerts = getFilteredAlerts();

        alertsGrid.innerHTML = "";

        filteredAlerts.forEach((alert) => {
            alertsGrid.appendChild(
                createAlertCard(alert)
            );
        });

        setText(
            "visibleAlertCount",
            filteredAlerts.length
        );

        if (alertEmptyState) {
            alertEmptyState.hidden =
                filteredAlerts.length !== 0;
        }

        alertsGrid.hidden =
            filteredAlerts.length === 0;
    }

    /* =====================================================
       RESET FILTERS
       ===================================================== */

    function clearFilters() {
        if (alertSearch) {
            alertSearch.value = "";
        }

        if (alertStateFilter) {
            alertStateFilter.value = "all";
        }

        if (alertSeverityFilter) {
            alertSeverityFilter.value = "all";
        }

        if (alertStatusFilter) {
            alertStatusFilter.value = "all";
        }

        renderAlerts();
    }

    /* =====================================================
       GRID AND LIST VIEW
       ===================================================== */

    function setAlertView(view) {
        if (!alertsGrid) {
            return;
        }

        currentView = view;

        alertsGrid.classList.toggle(
            "list-view",
            currentView === "list"
        );

        if (alertGridView) {
            alertGridView.classList.toggle(
                "active",
                currentView === "grid"
            );
        }

        if (alertListView) {
            alertListView.classList.toggle(
                "active",
                currentView === "list"
            );
        }
    }

    /* =====================================================
       LAST UPDATED TIME
       ===================================================== */

    function updateAlertTime() {
        const now = new Date();

        const formattedTime = now.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        setText(
            "alertsLastUpdated",
            formattedTime
        );
    }

    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    alertSearch?.addEventListener(
        "input",
        renderAlerts
    );

    alertStateFilter?.addEventListener(
        "change",
        renderAlerts
    );

    alertSeverityFilter?.addEventListener(
        "change",
        renderAlerts
    );

    alertStatusFilter?.addEventListener(
        "change",
        renderAlerts
    );

    resetAlertFilters?.addEventListener(
        "click",
        clearFilters
    );

    emptyResetButton?.addEventListener(
        "click",
        clearFilters
    );

    alertGridView?.addEventListener(
        "click",
        () => {
            setAlertView("grid");
        }
    );

    alertListView?.addEventListener(
        "click",
        () => {
            setAlertView("list");
        }
    );

    /* =====================================================
       START ALERT PAGE
       ===================================================== */

    updateSummaryCounters();
    updateFeaturedAlert();
    updateAlertTime();
    setAlertView("grid");
    renderAlerts();
})();