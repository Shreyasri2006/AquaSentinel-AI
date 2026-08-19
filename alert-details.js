/* AquaSentinel AI — Alert Details Page */

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
                "A strong prototype environmental signal combined with an unusual increase in community health indicators requires immediate verification.",
            explanation:
                "The prototype alert was generated because the environmental contribution reached 91% while the health-surveillance contribution reached 85%. Together, these signals exceed the critical monitoring threshold.",
            aiExplanation:
                "AquaAI identifies environmental pressure as the strongest contributor, closely followed by an unusual health-surveillance increase. The combined pattern supports immediate verification by authorised teams.",
            action:
                "Initiate priority verification, rapid water-source testing and immediate review by authorised health and response teams."
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
                "Environmental exposure and increasing prototype health-surveillance signals indicate a high regional monitoring priority.",
            explanation:
                "Environmental exposure reached 81% while the prototype health contribution reached 71%. The combined pattern produces a high-priority monitoring classification.",
            aiExplanation:
                "AquaAI identifies water and environmental pressure as the primary driver. Increasing community health indicators strengthen the high-risk classification.",
            action:
                "Prioritise water-source testing, sanitation inspection and verification of community illness reports in vulnerable locations."
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
                "An increasing prototype health signal and environmental vulnerability require closer water and community surveillance.",
            explanation:
                "The prototype health-surveillance contribution is slightly stronger than the environmental contribution, producing an overall high-priority classification.",
            aiExplanation:
                "AquaAI identifies the community health signal as the leading contributor, supported by environmental vulnerability. Continued verification and monitoring are recommended.",
            action:
                "Verify community water sources, strengthen symptom surveillance and review priority reports with authorised health teams."
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
                "Moderately elevated environmental indicators are being monitored alongside stable community health signals.",
            explanation:
                "The environmental contribution is moderately elevated while the prototype health-surveillance contribution remains stable.",
            aiExplanation:
                "AquaAI identifies environmental conditions as the primary monitoring factor. The health signal does not currently indicate a sharp increase.",
            action:
                "Maintain regular water sampling and promptly review new community reports or unusual illness patterns."
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
                "Environmental and health indicators remain within the middle prototype range and require continued observation.",
            explanation:
                "Both signal groups remain within the moderate prototype range without a sharp increasing trend.",
            aiExplanation:
                "AquaAI identifies balanced environmental and health contributions. Continued monitoring is appropriate while the signal remains stable.",
            action:
                "Continue targeted water sampling and maintain community awareness and reporting activities."
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
                "Moderate environmental sensitivity and a stable health signal support continued preventive monitoring.",
            explanation:
                "The environmental contribution remains slightly above the health contribution, placing the signal near the moderate threshold.",
            aiExplanation:
                "AquaAI identifies moderate water-related environmental sensitivity with a stable prototype health-surveillance signal.",
            action:
                "Monitor drinking-water sources and continue preventive health communication in vulnerable communities."
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
                "Prototype environmental and health indicators remain within the low-risk range under routine observation.",
            explanation:
                "Both environmental and health-surveillance contributions remain within the expected low prototype range.",
            aiExplanation:
                "AquaAI does not identify an unusual combined increase. Routine monitoring remains appropriate.",
            action:
                "Continue routine water-quality monitoring, community awareness and regular review of local reports."
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
                "No unusual increase was identified, and the prototype monitoring event has been marked as resolved.",
            explanation:
                "The environmental and health contributions remained below the elevated monitoring threshold.",
            aiExplanation:
                "AquaAI identifies no unusual combined signal. The prototype observation is classified as resolved.",
            action:
                "Continue routine monitoring and reinforce safe-water and hygiene practices."
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
                "The localised prototype signal returned to the expected monitoring range after continued observation.",
            explanation:
                "The environmental and health contributions decreased during the prototype monitoring period.",
            aiExplanation:
                "AquaAI identifies a declining combined signal. The observation has been marked as resolved while routine surveillance continues.",
            action:
                "Resume routine monitoring and continue community awareness and safe-water communication."
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
                "The prototype community health observation was reviewed and marked as resolved with routine monitoring recommended.",
            explanation:
                "Both prototype signal groups remained within the expected low-risk range during review.",
            aiExplanation:
                "AquaAI identifies limited environmental and health pressure. No elevated combined pattern is currently present.",
            action:
                "Continue routine monitoring and maintain safe-water and sanitation awareness."
        }
    ];

    const severityClasses = {
        Critical: "severity-critical",
        High: "severity-high",
        Moderate: "severity-moderate",
        Low: "severity-low"
    };

    const statusClasses = {
        Active: "status-active",
        Monitoring: "status-monitoring",
        Resolved: "status-resolved"
    };

    const scoreColours = {
        Critical:
            "linear-gradient(135deg, #e65d6f, #bf476c)",
        High:
            "linear-gradient(135deg, #f07b4f, #f4a152)",
        Moderate:
            "linear-gradient(135deg, #efb64b, #f4cf64)",
        Low:
            "linear-gradient(135deg, #28a878, #35c995)"
    };

    /* =====================================================
       HELPERS
       ===================================================== */

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function setProgress(id, value) {
        const element = document.getElementById(id);

        if (element) {
            window.setTimeout(() => {
                element.style.width = `${value}%`;
            }, 150);
        }
    }

    function createPageUrl(filename, parameter, value) {
        const destination = new URL(
            filename,
            window.location.href
        );

        destination.searchParams.set(
            parameter,
            value
        );

        return destination.href;
    }

    function getSelectedAlert() {
        const parameters =
            new URLSearchParams(window.location.search);

        const requestedId =
            parameters.get("alert");

        if (!requestedId) {
            return alerts[0];
        }

        return (
            alerts.find(
                (alert) =>
                    alert.id.toLowerCase() ===
                    requestedId.toLowerCase()
            ) || alerts[0]
        );
    }

    function getPriorityMessage(severity) {
        const messages = {
            Critical: "Immediate verification recommended",
            High: "Priority monitoring required",
            Moderate: "Continued monitoring required",
            Low: "Routine monitoring appropriate"
        };

        return messages[severity];
    }

    function getSignalLevel(value) {
        if (value >= 80) {
            return "Very high";
        }

        if (value >= 65) {
            return "High";
        }

        if (value >= 45) {
            return "Moderate";
        }

        return "Low";
    }

    function getPrimaryDriver(alert) {
        if (alert.environmental > alert.health) {
            return "Environmental indicators";
        }

        if (alert.health > alert.environmental) {
            return "Health-surveillance indicators";
        }

        return "Combined indicators";
    }

    function getResponseLevel(alert) {
        const responses = {
            Critical: "Immediate verification",
            High: "Priority review",
            Moderate: "Enhanced monitoring",
            Low: "Routine monitoring"
        };

        return responses[alert.severity];
    }

    /* =====================================================
       BADGES AND SCORE COLOUR
       ===================================================== */

    function updateBadges(alert) {
        const severityBadge =
            document.getElementById(
                "detailSeverityBadge"
            );

        const statusBadge =
            document.getElementById(
                "detailStatusBadge"
            );

        if (severityBadge) {
            severityBadge.className =
                `alert-card-severity ${
                    severityClasses[alert.severity]
                }`;
        }

        if (statusBadge) {
            statusBadge.className =
                `alert-status ${
                    statusClasses[alert.status]
                }`;
        }

        const score =
            document.getElementById(
                "detailPriorityScore"
            );

        if (score) {
            score.style.background =
                scoreColours[alert.severity];
        }
    }

    /* =====================================================
       ALERT SELECTOR
       ===================================================== */

    function createAlertSelector(selectedAlert) {
        const selector =
            document.getElementById(
                "alertPageSelector"
            );

        if (!selector) {
            return;
        }

        selector.innerHTML = alerts
            .map(
                (alert) => `
                    <option value="${alert.id}">
                        ${alert.state} — ${alert.title}
                    </option>
                `
            )
            .join("");

        selector.value = selectedAlert.id;

        selector.addEventListener(
            "change",
            () => {
                window.location.href =
                    createPageUrl(
                        "alert-details.html",
                        "alert",
                        selector.value
                    );
            }
        );
    }

    /* =====================================================
       POPULATE PAGE
       ===================================================== */

    function populateAlertDetails(alert) {
        document.title =
            `${alert.title} | AquaSentinel AI`;

        setText("alertBreadcrumb", alert.id);
        setText("detailAlertTitle", alert.title);
        setText(
            "detailAlertDescription",
            alert.description
        );

        setText(
            "detailLocation",
            `${alert.district}, ${alert.state}`
        );

        setText(
            "detailSeverityBadge",
            alert.severity
        );

        setText(
            "detailStatusBadge",
            alert.status
        );

        setText(
            "detailPriorityScore",
            alert.score
        );

        setText(
            "detailPriorityMessage",
            getPriorityMessage(alert.severity)
        );

        setText("detailAlertId", alert.id);
        setText("detailAlertDate", alert.date);
        setText("detailDisease", alert.disease);
        setText("detailStatusText", alert.status);

        setText(
            "detailEnvironmentScore",
            `${alert.environmental}%`
        );

        setText(
            "detailHealthScore",
            `${alert.health}%`
        );

        setText(
            "detailDiseaseMetric",
            alert.disease
        );

        setText(
            "detailMonitoringStatus",
            alert.status
        );

        setText(
            "detailExplanation",
            alert.explanation
        );

        setText(
            "detailEnvironmentPercentage",
            `${alert.environmental}%`
        );

        setText(
            "detailHealthPercentage",
            `${alert.health}%`
        );

        setText(
            "detailEnvironmentLevel",
            getSignalLevel(alert.environmental)
        );

        setText(
            "detailHealthLevel",
            getSignalLevel(alert.health)
        );

        setText(
            "detailVerificationPriority",
            getResponseLevel(alert)
        );

        setText(
            "detailAIExplanation",
            alert.aiExplanation
        );

        setText(
            "detailPrimaryDriver",
            getPrimaryDriver(alert)
        );

        setText(
            "detailResponseLevel",
            getResponseLevel(alert)
        );

        setText(
            "detailTimelineClassification",
            `The signal received a ${alert.severity.toLowerCase()} prototype severity classification.`
        );

        setText(
            "detailCurrentStage",
            alert.status === "Resolved"
                ? "Monitoring completed"
                : "Monitoring review"
        );

        setText(
            "detailResponseTitle",
            getResponseLevel(alert)
        );

        setText(
            "detailRecommendedAction",
            alert.action
        );

        setText(
            "detailSidebarState",
            alert.state
        );

        setProgress(
            "detailPriorityBar",
            alert.score
        );

        setProgress(
            "detailEnvironmentBar",
            alert.environmental
        );

        setProgress(
            "detailHealthBar",
            alert.health
        );

        updateBadges(alert);

        const riskMapLink =
            document.getElementById(
                "detailRiskMapLink"
            );

        const stateProfileLink =
            document.getElementById(
                "detailStateProfileLink"
            );

        const stateUrl = createPageUrl(
            "state-details.html",
            "state",
            alert.state
        );

        if (riskMapLink) {
            riskMapLink.href = stateUrl;
            riskMapLink.textContent =
                `View ${alert.state} Profile`;
        }

        if (stateProfileLink) {
            stateProfileLink.href = stateUrl;
        }

        createAlertSelector(alert);
    }

    /* =====================================================
       START PAGE
       ===================================================== */

    const selectedAlert = getSelectedAlert();

    populateAlertDetails(selectedAlert);
})();