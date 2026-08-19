"use strict";

/* =========================================================
   AQUASENTINEL AI — REPORT CONFIRMATION PAGE

   Reads a submitted prototype report from localStorage,
   displays its information and provides basic management
   controls.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "aquaSentinelCommunityReports";
    const LATEST_REPORT_KEY = "aquaSentinelLatestReport";

    const loadingSection = document.getElementById(
        "reportSuccessLoading"
    );

    const notFoundSection = document.getElementById(
        "reportNotFound"
    );

    const successContent = document.getElementById(
        "reportSuccessContent"
    );

    let currentReport = null;

    /* =====================================================
       GENERAL HELPERS
       ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }

    function setText(id, value, fallback = "Not provided") {
        const element = getElement(id);

        if (!element) {
            return;
        }

        const safeValue =
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
                ? String(value)
                : fallback;

        element.textContent = safeValue;
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "Not provided";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function formatDateTime(dateValue) {
        if (!dateValue) {
            return "Not provided";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function readReports() {
        try {
            const savedReports =
                window.localStorage.getItem(
                    STORAGE_KEY
                );

            if (!savedReports) {
                return [];
            }

            const parsedReports =
                JSON.parse(savedReports);

            return Array.isArray(parsedReports)
                ? parsedReports
                : [];
        } catch (error) {
            console.warn(
                "AquaSentinel reports could not be read:",
                error
            );

            return [];
        }
    }

    function readLatestReport() {
        try {
            const latestReport =
                window.localStorage.getItem(
                    LATEST_REPORT_KEY
                );

            return latestReport
                ? JSON.parse(latestReport)
                : null;
        } catch (error) {
            console.warn(
                "Latest prototype report could not be read:",
                error
            );

            return null;
        }
    }

    function getRequestedReportId() {
        const parameters =
            new URLSearchParams(
                window.location.search
            );

        return parameters.get("id")?.trim() || "";
    }

    function findReport() {
        const requestedId =
            getRequestedReportId();

        const reports = readReports();

        if (requestedId) {
            const matchingReport = reports.find(
                (report) =>
                    report.reportId === requestedId
            );

            if (matchingReport) {
                return matchingReport;
            }

            const latestReport =
                readLatestReport();

            if (
                latestReport?.reportId ===
                requestedId
            ) {
                return latestReport;
            }

            return null;
        }

        return readLatestReport() ||
            reports[0] ||
            null;
    }

    /* =====================================================
       PAGE STATES
       ===================================================== */

    function showLoading() {
        if (loadingSection) {
            loadingSection.hidden = false;
        }

        if (notFoundSection) {
            notFoundSection.hidden = true;
        }

        if (successContent) {
            successContent.hidden = true;
        }
    }

    function showNotFound() {
        if (loadingSection) {
            loadingSection.hidden = true;
        }

        if (notFoundSection) {
            notFoundSection.hidden = false;
        }

        if (successContent) {
            successContent.hidden = true;
        }
    }

    function showSuccess() {
        if (loadingSection) {
            loadingSection.hidden = true;
        }

        if (notFoundSection) {
            notFoundSection.hidden = true;
        }

        if (successContent) {
            successContent.hidden = false;
        }
    }

    /* =====================================================
       URGENCY DISPLAY
       ===================================================== */

    function urgencyClass(urgency) {
        const classes = {
            Low: "report-urgency-low",
            Moderate: "report-urgency-moderate",
            High: "report-urgency-high",
            Critical: "report-urgency-critical"
        };

        return classes[urgency] ||
            "report-urgency-moderate";
    }

    function updateUrgencyBadge(urgency) {
        const badge = getElement(
            "confirmationUrgency"
        );

        if (!badge) {
            return;
        }

        badge.classList.remove(
            "report-urgency-low",
            "report-urgency-moderate",
            "report-urgency-high",
            "report-urgency-critical"
        );

        badge.classList.add(
            urgencyClass(urgency)
        );

        badge.textContent =
            `${urgency || "Moderate"} urgency`;
    }

    /* =====================================================
       INTERPRETATION
       ===================================================== */

    function createInterpretation(report) {
        const concern =
            report.concern || {};

        const location =
            report.location || {};

        const concernType =
            concern.type || "community concern";

        const urgency =
            concern.urgency || "Moderate";

        const affected =
            Number(location.peopleAffected) || 0;

        const symptoms =
            concern.symptoms ||
            "No symptoms reported";

        let explanation =
            `This prototype report records a ` +
            `${urgency.toLowerCase()}-urgency ` +
            `${concernType.toLowerCase()} observation`;

        if (location.locality) {
            explanation +=
                ` in ${location.locality}`;
        }

        if (location.district) {
            explanation +=
                `, ${location.district}`;
        }

        explanation += ".";

        if (affected > 0) {
            explanation +=
                ` The reporter estimated that approximately ` +
                `${affected} ${
                    affected === 1
                        ? "person may be"
                        : "people may be"
                } affected.`;
        }

        if (
            symptoms !== "No symptoms reported" &&
            symptoms !== "Not provided"
        ) {
            explanation +=
                ` The submitted symptom pattern was ` +
                `${symptoms.toLowerCase()}.`;
        }

        explanation +=
            " These details represent an unverified community " +
            "signal and require professional field assessment " +
            "before any public-health conclusion is made.";

        return explanation;
    }

    /* =====================================================
       RECOMMENDATIONS
       ===================================================== */

    function getRecommendations(report) {
        const urgency =
            report.concern?.urgency || "Moderate";

        const recommendations = {
            Low: {
                title: "Continue routine monitoring",
                description:
                    "The submitted observation indicates lower perceived urgency, but changes should still be monitored.",
                items: [
                    "Continue observing the affected water source.",
                    "Follow safe water-storage and hygiene practices.",
                    "Submit another report if conditions worsen.",
                    "Seek medical advice if illness symptoms appear."
                ]
            },

            Moderate: {
                title: "Request local verification",
                description:
                    "The concern should be checked through community monitoring or local field verification.",
                items: [
                    "Avoid using visibly unsafe water without treatment.",
                    "Inform a local health worker or responsible community official.",
                    "Monitor whether additional people develop symptoms.",
                    "Record any major change in water colour, smell or condition."
                ]
            },

            High: {
                title: "Prioritise prompt field review",
                description:
                    "The submitted signals indicate a concern that may require timely professional verification.",
                items: [
                    "Notify the nearest health worker or local authority.",
                    "Consider an alternative safe water source.",
                    "Request water-quality testing where available.",
                    "Monitor affected people for worsening symptoms."
                ]
            },

            Critical: {
                title: "Seek urgent official assistance",
                description:
                    "The reporter selected critical urgency. Immediate contact with appropriate local services is recommended.",
                items: [
                    "Contact the nearest hospital or health authority immediately.",
                    "Do not wait for a response from this prototype.",
                    "Prevent use of the suspected water source where safely possible.",
                    "Provide safe drinking-water guidance to affected households."
                ]
            }
        };

        return recommendations[urgency] ||
            recommendations.Moderate;
    }

    function renderRecommendations(report) {
        const recommendations =
            getRecommendations(report);

        setText(
            "confirmationNextStepTitle",
            recommendations.title
        );

        setText(
            "confirmationNextStepText",
            recommendations.description
        );

        const list = getElement(
            "confirmationRecommendations"
        );

        if (!list) {
            return;
        }

        list.innerHTML = "";

        recommendations.items.forEach((item) => {
            const listItem =
                document.createElement("li");

            listItem.textContent = item;
            list.appendChild(listItem);
        });
    }

    /* =====================================================
       POPULATE REPORT DETAILS
       ===================================================== */

    function populateReport(report) {
        const concern = report.concern || {};
        const location = report.location || {};
        const reporter = report.reporter || {};

        const fullLocation = [
            location.locality,
            location.district,
            location.state
        ]
            .filter(Boolean)
            .join(", ");

        const peopleAffected =
            Number(location.peopleAffected) > 0
                ? String(location.peopleAffected)
                : "Not estimated";

        const reporterText =
            reporter.anonymous
                ? "Anonymous reporter"
                : reporter.name ||
                  "Not provided";

        setText(
            "successReportId",
            report.reportId
        );

        setText(
            "successReportStatus",
            report.status,
            "Submitted for prototype review"
        );

        setText(
            "confirmationConcernType",
            concern.type,
            "Community concern"
        );

        setText(
            "confirmationSummary",
            concern.summary,
            "Community observation"
        );

        setText(
            "confirmationLocation",
            fullLocation,
            "Location not provided"
        );

        updateUrgencyBadge(
            concern.urgency || "Moderate"
        );

        setText(
            "confirmationSubmittedAt",
            formatDateTime(report.submittedAt)
        );

        setText(
            "confirmationObservationDate",
            formatDate(concern.observationDate)
        );

        setText(
            "confirmationPriorityScore",
            `${report.priorityScore ?? 0}/100`
        );

        setText(
            "confirmationPeopleAffected",
            peopleAffected
        );

        setText(
            "confirmationWaterSource",
            location.waterSource,
            "Not specified"
        );

        setText(
            "confirmationReporter",
            reporterText
        );

        setText(
            "confirmationDescription",
            concern.description,
            "No description provided"
        );

        setText(
            "confirmationInterpretation",
            createInterpretation(report)
        );

        setText(
            "signalConcernType",
            concern.type,
            "Not specified"
        );

        setText(
            "signalSymptoms",
            concern.symptoms,
            "No symptoms reported"
        );

        setText(
            "signalWaterAppearance",
            concern.waterAppearance,
            "No observation"
        );

        setText(
            "signalWaterOdour",
            concern.waterOdour,
            "No observation"
        );

        renderRecommendations(report);

        document.title =
            `${report.reportId} | AquaSentinel AI`;
    }

    /* =====================================================
       COPY REPORT ID
       ===================================================== */

    const copyButton = getElement(
        "copyReportIdButton"
    );

    async function copyText(text) {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );

            return;
        }

        const textArea =
            document.createElement("textarea");

        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.select();

        document.execCommand("copy");
        textArea.remove();
    }

    copyButton?.addEventListener(
        "click",
        async () => {
            if (!currentReport?.reportId) {
                return;
            }

            const originalText =
                copyButton.textContent;

            try {
                await copyText(
                    currentReport.reportId
                );

                copyButton.textContent = "Copied ✓";

                window.setTimeout(() => {
                    copyButton.textContent =
                        originalText;
                }, 1800);
            } catch (error) {
                console.error(
                    "Unable to copy report ID:",
                    error
                );

                copyButton.textContent =
                    "Copy failed";

                window.setTimeout(() => {
                    copyButton.textContent =
                        originalText;
                }, 1800);
            }
        }
    );

    /* =====================================================
       DELETE PROTOTYPE REPORT
       ===================================================== */

    const deleteButton = getElement(
        "deletePrototypeReport"
    );

    deleteButton?.addEventListener(
        "click",
        () => {
            if (!currentReport?.reportId) {
                return;
            }

            const confirmed = window.confirm(
                `Delete prototype report ${currentReport.reportId}? ` +
                "This action cannot be undone."
            );

            if (!confirmed) {
                return;
            }

            const remainingReports =
                readReports().filter(
                    (report) =>
                        report.reportId !==
                        currentReport.reportId
                );

            try {
                window.localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        remainingReports
                    )
                );

                const latestReport =
                    readLatestReport();

                if (
                    latestReport?.reportId ===
                    currentReport.reportId
                ) {
                    if (remainingReports.length > 0) {
                        window.localStorage.setItem(
                            LATEST_REPORT_KEY,
                            JSON.stringify(
                                remainingReports[0]
                            )
                        );
                    } else {
                        window.localStorage.removeItem(
                            LATEST_REPORT_KEY
                        );
                    }
                }

                deleteButton.disabled = true;
                deleteButton.textContent =
                    "Report Deleted";

                window.setTimeout(() => {
                    window.location.href =
                        "report.html?deleted=1";
                }, 700);
            } catch (error) {
                console.error(
                    "Unable to delete prototype report:",
                    error
                );

                window.alert(
                    "The report could not be deleted from this browser."
                );
            }
        }
    );

    /* =====================================================
       INITIALISE PAGE
       ===================================================== */

    function initialisePage() {
        showLoading();

        window.setTimeout(() => {
            currentReport = findReport();

            if (!currentReport) {
                showNotFound();

                console.warn(
                    "No matching prototype report was found."
                );

                return;
            }

            populateReport(currentReport);
            showSuccess();

            console.log(
                "Prototype report confirmation loaded:",
                currentReport
            );
        }, 450);
    }

    initialisePage();
});