"use strict";

/* =========================================================
   AQUASENTINEL AI — COMMUNITY REPORTING SYSTEM

   Frontend prototype:
   - Four-step reporting form
   - Per-step validation
   - District suggestions
   - Optional geolocation
   - Image validation and preview
   - Anonymous reporting
   - Review summary
   - Browser storage
   - Unique report ID
   - Separate confirmation page
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById(
        "communityReportForm"
    );

    if (!form) {
        console.error(
            "AquaSentinel Report: communityReportForm was not found."
        );
        return;
    }

    const STORAGE_KEY = "aquaSentinelCommunityReports";
    const LATEST_REPORT_KEY = "aquaSentinelLatestReport";

    const TOTAL_STEPS = 4;
    const MAX_REPORTS = 20;
    const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

    let currentStep = 1;
    let selectedPhoto = null;
    let highestVisitedStep = 1;

    const stepSections = Array.from(
        document.querySelectorAll("[data-report-step]")
    );

    const progressSteps = Array.from(
        document.querySelectorAll("[data-step-target]")
    );

    const progressBar = document.getElementById(
        "reportProgressBar"
    );

    const previousButton = document.getElementById(
        "previousReportStep"
    );

    const nextButton = document.getElementById(
        "nextReportStep"
    );

    const submitButton = document.getElementById(
        "submitCommunityReport"
    );

    const formMessage = document.getElementById(
        "reportFormMessage"
    );

    const reviewCard = document.getElementById(
        "reportReviewCard"
    );

    /* =====================================================
       GENERAL HELPERS
       ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }

    function getValue(id, fallback = "") {
        const element = getElement(id);

        if (!element) {
            return fallback;
        }

        return String(element.value || fallback).trim();
    }

    function getNumber(id, fallback = 0) {
        const parsedValue = Number.parseInt(
            getValue(id),
            10
        );

        return Number.isFinite(parsedValue)
            ? parsedValue
            : fallback;
    }

    function getSelectedRadio(name) {
        const selected = form.querySelector(
            `input[name="${name}"]:checked`
        );

        return selected ? selected.value : "";
    }

    function isChecked(id) {
        const element = getElement(id);

        return Boolean(element?.checked);
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
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
        const date = new Date(dateValue);

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function showMessage(message) {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;
        formMessage.hidden = false;

        formMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function clearMessage() {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = "";
        formMessage.hidden = true;
    }

    function markInvalid(element) {
        if (!element) {
            return;
        }

        element.classList.add("invalid");

        const removeInvalidState = () => {
            element.classList.remove("invalid");
        };

        element.addEventListener(
            "input",
            removeInvalidState,
            { once: true }
        );

        element.addEventListener(
            "change",
            removeInvalidState,
            { once: true }
        );
    }

    function focusFirstInvalid(element) {
        if (!element) {
            return;
        }

        element.focus({
            preventScroll: true
        });

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    /* =====================================================
       DEFAULT DATE AND CHARACTER COUNTERS
       ===================================================== */

    function setDefaultObservationDate() {
        const dateInput = getElement("observationDate");

        if (!dateInput || dateInput.value) {
            return;
        }

        const today = new Date();
        const timezoneOffset =
            today.getTimezoneOffset() * 60000;

        dateInput.value = new Date(
            today.getTime() - timezoneOffset
        )
            .toISOString()
            .split("T")[0];

        dateInput.max = dateInput.value;
    }

    function connectCharacterCounter(
        inputId,
        counterId
    ) {
        const input = getElement(inputId);
        const counter = getElement(counterId);

        if (!input || !counter) {
            return;
        }

        function updateCounter() {
            counter.textContent =
                String(input.value.length);
        }

        input.addEventListener(
            "input",
            updateCounter
        );

        updateCounter();
    }

    setDefaultObservationDate();

    connectCharacterCounter(
        "concernSummary",
        "summaryCharacterCount"
    );

    connectCharacterCounter(
        "concernDescription",
        "descriptionCharacterCount"
    );

    /* =====================================================
       DISTRICT SUGGESTIONS
       ===================================================== */

    const districtsByState = {
        "Arunachal Pradesh": [
            "Anjaw",
            "Changlang",
            "Dibang Valley",
            "East Kameng",
            "East Siang",
            "Itanagar",
            "Lower Subansiri",
            "Namsai",
            "Papum Pare",
            "Tawang",
            "West Kameng",
            "West Siang"
        ],

        Assam: [
            "Baksa",
            "Barpeta",
            "Bongaigaon",
            "Cachar",
            "Darrang",
            "Dhemaji",
            "Dhubri",
            "Dibrugarh",
            "Goalpara",
            "Golaghat",
            "Guwahati",
            "Jorhat",
            "Kamrup",
            "Karbi Anglong",
            "Lakhimpur",
            "Nagaon",
            "Nalbari",
            "Sivasagar",
            "Sonitpur",
            "Tinsukia"
        ],

        Manipur: [
            "Bishnupur",
            "Chandel",
            "Churachandpur",
            "Imphal East",
            "Imphal West",
            "Kakching",
            "Senapati",
            "Tamenglong",
            "Thoubal",
            "Ukhrul"
        ],

        Meghalaya: [
            "East Garo Hills",
            "East Jaintia Hills",
            "East Khasi Hills",
            "North Garo Hills",
            "Ri-Bhoi",
            "South Garo Hills",
            "West Garo Hills",
            "West Jaintia Hills",
            "West Khasi Hills"
        ],

        Mizoram: [
            "Aizawl",
            "Champhai",
            "Kolasib",
            "Lawngtlai",
            "Lunglei",
            "Mamit",
            "Saiha",
            "Serchhip"
        ],

        Nagaland: [
            "Dimapur",
            "Kiphire",
            "Kohima",
            "Longleng",
            "Mokokchung",
            "Mon",
            "Peren",
            "Phek",
            "Tuensang",
            "Wokha",
            "Zunheboto"
        ],

        Sikkim: [
            "Gangtok",
            "Gyalshing",
            "Mangan",
            "Namchi",
            "Pakyong",
            "Soreng"
        ],

        Tripura: [
            "Dhalai",
            "Gomati",
            "Khowai",
            "North Tripura",
            "Sepahijala",
            "South Tripura",
            "Unakoti",
            "West Tripura"
        ]
    };

    function updateDistrictSuggestions() {
        const state = getValue("reportState");
        const datalist = getElement(
            "districtSuggestions"
        );
        const districtInput = getElement(
            "reportDistrict"
        );

        if (!datalist) {
            return;
        }

        datalist.innerHTML = "";

        const districts = districtsByState[state] || [];

        districts.forEach((district) => {
            const option = document.createElement("option");

            option.value = district;
            datalist.appendChild(option);
        });

        if (districtInput) {
            districtInput.placeholder = districts.length
                ? `Example: ${districts[0]}`
                : "Enter district";
        }
    }

    getElement("reportState")?.addEventListener(
        "change",
        updateDistrictSuggestions
    );

    updateDistrictSuggestions();

    /* =====================================================
       STEP NAVIGATION
       ===================================================== */

    function updateStepInterface() {
        stepSections.forEach((section) => {
            const sectionStep = Number(
                section.dataset.reportStep
            );

            const isActive =
                sectionStep === currentStep;

            section.hidden = !isActive;
            section.classList.toggle(
                "active",
                isActive
            );
        });

        progressSteps.forEach((button) => {
            const targetStep = Number(
                button.dataset.stepTarget
            );

            button.classList.toggle(
                "active",
                targetStep === currentStep
            );

            button.classList.toggle(
                "completed",
                targetStep < currentStep
            );

            button.setAttribute(
                "aria-current",
                targetStep === currentStep
                    ? "step"
                    : "false"
            );
        });

        if (progressBar) {
            progressBar.style.width =
                `${(currentStep / TOTAL_STEPS) * 100}%`;
        }

        if (previousButton) {
            previousButton.hidden =
                currentStep === 1;
        }

        if (nextButton) {
            nextButton.hidden =
                currentStep === TOTAL_STEPS;
        }

        if (submitButton) {
            submitButton.hidden =
                currentStep !== TOTAL_STEPS;
        }

        if (currentStep === TOTAL_STEPS) {
            buildReviewSummary();
        }

        clearMessage();
    }

    function moveToStep(step, shouldScroll = true) {
        const safeStep = Math.min(
            TOTAL_STEPS,
            Math.max(1, step)
        );

        currentStep = safeStep;
        highestVisitedStep = Math.max(
            highestVisitedStep,
            currentStep
        );

        updateStepInterface();

        if (shouldScroll) {
            form.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    progressSteps.forEach((button) => {
        button.addEventListener("click", () => {
            const targetStep = Number(
                button.dataset.stepTarget
            );

            if (targetStep > highestVisitedStep) {
                return;
            }

            moveToStep(targetStep);
        });
    });

    previousButton?.addEventListener(
        "click",
        () => {
            if (currentStep > 1) {
                moveToStep(currentStep - 1);
            }
        }
    );

    nextButton?.addEventListener("click", () => {
        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < TOTAL_STEPS) {
            moveToStep(currentStep + 1);
        }
    });

    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateRequiredFields(stepNumber) {
        const section = form.querySelector(
            `[data-report-step="${stepNumber}"]`
        );

        if (!section) {
            return true;
        }

        const requiredFields = Array.from(
            section.querySelectorAll(
                "input[required], select[required], textarea[required]"
            )
        );

        for (const field of requiredFields) {
            if (
                field.type === "radio" ||
                field.type === "checkbox"
            ) {
                continue;
            }

            if (!field.checkValidity()) {
                markInvalid(field);
                focusFirstInvalid(field);

                showMessage(
                    "Please complete all required fields before continuing."
                );

                return false;
            }
        }

        return true;
    }

    function validateConcernType() {
        const concernType =
            getSelectedRadio("concernType");

        const errorElement = getElement(
            "concernTypeError"
        );

        if (!concernType) {
            if (errorElement) {
                errorElement.textContent =
                    "Please select a concern category.";
            }

            const firstConcernCard = form.querySelector(
                ".concern-category-card"
            );

            firstConcernCard?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            showMessage(
                "Please select the type of concern you observed."
            );

            return false;
        }

        if (errorElement) {
            errorElement.textContent = "";
        }

        return true;
    }

    function validatePostalCode() {
        const postalCode = getValue(
            "reportPostalCode"
        );

        if (!postalCode) {
            return true;
        }

        if (!/^[0-9]{6}$/.test(postalCode)) {
            const postalInput = getElement(
                "reportPostalCode"
            );

            markInvalid(postalInput);
            focusFirstInvalid(postalInput);

            showMessage(
                "Please enter a valid 6-digit postal code."
            );

            return false;
        }

        return true;
    }

    function validateReporterContact() {
        if (isChecked("anonymousReport")) {
            return true;
        }

        const emailInput = getElement(
            "reporterEmail"
        );

        if (
            emailInput?.value &&
            !emailInput.checkValidity()
        ) {
            markInvalid(emailInput);
            focusFirstInvalid(emailInput);

            showMessage(
                "Please enter a valid email address."
            );

            return false;
        }

        return true;
    }

    function validateConsent() {
        const accuracyConsent = getElement(
            "accuracyConsent"
        );

        const prototypeConsent = getElement(
            "prototypeConsent"
        );

        if (!accuracyConsent?.checked) {
            focusFirstInvalid(accuracyConsent);

            showMessage(
                "Please confirm that the report is accurate to the best of your knowledge."
            );

            return false;
        }

        if (!prototypeConsent?.checked) {
            focusFirstInvalid(prototypeConsent);

            showMessage(
                "Please confirm that you understand this is a prototype platform."
            );

            return false;
        }

        return true;
    }

    function validateStep(stepNumber) {
        clearMessage();

        if (
            stepNumber === 1 &&
            !validateConcernType()
        ) {
            return false;
        }

        if (!validateRequiredFields(stepNumber)) {
            return false;
        }

        if (
            stepNumber === 2 &&
            !validatePostalCode()
        ) {
            return false;
        }

        if (
            stepNumber === 3 &&
            !validateReporterContact()
        ) {
            return false;
        }

        if (
            stepNumber === 4 &&
            !validateConsent()
        ) {
            return false;
        }

        return true;
    }

    form.addEventListener("input", (event) => {
        event.target.classList?.remove("invalid");
        clearMessage();
    });

    form.addEventListener("change", (event) => {
        event.target.classList?.remove("invalid");
        clearMessage();

        if (
            event.target.name === "concernType"
        ) {
            const errorElement = getElement(
                "concernTypeError"
            );

            if (errorElement) {
                errorElement.textContent = "";
            }
        }
    });

    /* =====================================================
       GEOLOCATION
       ===================================================== */

    const captureLocationButton = getElement(
        "captureLocationButton"
    );

    const locationStatus = getElement(
        "locationStatus"
    );

    function setLocationStatus(
        message,
        status = "neutral"
    ) {
        if (!locationStatus) {
            return;
        }

        locationStatus.textContent = message;

        const colors = {
            neutral: "#7a91a7",
            loading: "#2563eb",
            success: "#087a5b",
            error: "#bd3453"
        };

        locationStatus.style.color =
            colors[status] || colors.neutral;
    }

    captureLocationButton?.addEventListener(
        "click",
        () => {
            if (!navigator.geolocation) {
                setLocationStatus(
                    "Geolocation is not supported by this browser.",
                    "error"
                );

                return;
            }

            captureLocationButton.disabled = true;

            setLocationStatus(
                "Requesting location permission...",
                "loading"
            );

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude =
                        position.coords.latitude.toFixed(6);

                    const longitude =
                        position.coords.longitude.toFixed(6);

                    const latitudeInput = getElement(
                        "reportLatitude"
                    );

                    const longitudeInput = getElement(
                        "reportLongitude"
                    );

                    if (latitudeInput) {
                        latitudeInput.value = latitude;
                    }

                    if (longitudeInput) {
                        longitudeInput.value = longitude;
                    }

                    setLocationStatus(
                        `Location added: ${latitude}, ${longitude}`,
                        "success"
                    );

                    captureLocationButton.textContent =
                        "Location Added";

                    captureLocationButton.disabled = false;
                },
                (error) => {
                    const messages = {
                        1: "Location permission was denied.",
                        2: "Location information is unavailable.",
                        3: "The location request timed out."
                    };

                    setLocationStatus(
                        messages[error.code] ||
                            "Unable to capture the location.",
                        "error"
                    );

                    captureLocationButton.disabled = false;
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        }
    );

    /* =====================================================
       PHOTO UPLOAD AND PREVIEW
       ===================================================== */

    const photoInput = getElement("reportPhoto");
    const uploadArea = getElement(
        "reportUploadArea"
    );
    const photoPreview = getElement(
        "reportPhotoPreview"
    );
    const photoPreviewImage = getElement(
        "reportPhotoPreviewImage"
    );
    const photoName = getElement(
        "reportPhotoName"
    );
    const photoSize = getElement(
        "reportPhotoSize"
    );
    const removePhotoButton = getElement(
        "removeReportPhoto"
    );
    const photoUploadError = getElement(
        "photoUploadError"
    );

    const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    }

    function showPhotoError(message) {
        if (photoUploadError) {
            photoUploadError.textContent = message;
        }
    }

    function clearPhotoError() {
        if (photoUploadError) {
            photoUploadError.textContent = "";
        }
    }

    function resetPhoto() {
        selectedPhoto = null;

        if (photoInput) {
            photoInput.value = "";
        }

        if (photoPreviewImage) {
            photoPreviewImage.src = "";
        }

        if (photoPreview) {
            photoPreview.hidden = true;
        }

        if (uploadArea) {
            uploadArea.hidden = false;
        }

        clearPhotoError();
    }

    function handlePhoto(file) {
        clearPhotoError();

        if (!file) {
            resetPhoto();
            return;
        }

        if (!allowedImageTypes.includes(file.type)) {
            showPhotoError(
                "Please choose a JPG, PNG or WEBP image."
            );

            resetPhoto();
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            showPhotoError(
                "The selected image is larger than 4 MB."
            );

            resetPhoto();
            return;
        }

        selectedPhoto = {
            name: file.name,
            type: file.type,
            size: file.size
        };

        const objectURL = URL.createObjectURL(file);

        if (photoPreviewImage) {
            photoPreviewImage.onload = () => {
                URL.revokeObjectURL(objectURL);
            };

            photoPreviewImage.src = objectURL;
        }

        if (photoName) {
            photoName.textContent = file.name;
        }

        if (photoSize) {
            photoSize.textContent =
                `${formatFileSize(file.size)} · ` +
                `${file.type.replace("image/", "").toUpperCase()}`;
        }

        if (uploadArea) {
            uploadArea.hidden = true;
        }

        if (photoPreview) {
            photoPreview.hidden = false;
        }
    }

    photoInput?.addEventListener("change", () => {
        handlePhoto(photoInput.files?.[0]);
    });

    removePhotoButton?.addEventListener(
        "click",
        resetPhoto
    );

    ["dragenter", "dragover"].forEach((eventName) => {
        uploadArea?.addEventListener(
            eventName,
            (event) => {
                event.preventDefault();
                uploadArea.classList.add("dragging");
            }
        );
    });

    ["dragleave", "drop"].forEach((eventName) => {
        uploadArea?.addEventListener(
            eventName,
            (event) => {
                event.preventDefault();
                uploadArea.classList.remove("dragging");
            }
        );
    });

    uploadArea?.addEventListener("drop", (event) => {
        const file = event.dataTransfer?.files?.[0];

        if (file) {
            handlePhoto(file);
        }
    });

    /* =====================================================
       ANONYMOUS REPORTING
       ===================================================== */

    const anonymousCheckbox = getElement(
        "anonymousReport"
    );

    const reporterFields = getElement(
        "reporterFields"
    );

    const reporterFieldIds = [
        "reporterName",
        "reporterRole",
        "reporterPhone",
        "reporterEmail"
    ];

    function updateAnonymousMode() {
        const isAnonymous =
            Boolean(anonymousCheckbox?.checked);

        reporterFields?.classList.toggle(
            "disabled",
            isAnonymous
        );

        reporterFieldIds.forEach((id) => {
            const field = getElement(id);

            if (!field) {
                return;
            }

            field.disabled = isAnonymous;

            if (isAnonymous) {
                field.value = "";
            }
        });
    }

    anonymousCheckbox?.addEventListener(
        "change",
        updateAnonymousMode
    );

    updateAnonymousMode();

    /* =====================================================
       DATA COLLECTION
       ===================================================== */

    function collectReportData() {
        const anonymous =
            isChecked("anonymousReport");

        return {
            concern: {
                type: getSelectedRadio(
                    "concernType"
                ),
                summary: getValue(
                    "concernSummary"
                ),
                observationDate: getValue(
                    "observationDate"
                ),
                observationTime: getValue(
                    "observationTime"
                ),
                description: getValue(
                    "concernDescription"
                ),
                urgency: getValue(
                    "urgencyLevel"
                ),
                symptoms: getValue(
                    "symptomPattern",
                    "No symptoms reported"
                ),
                waterAppearance: getValue(
                    "waterAppearance",
                    "No observation"
                ),
                waterOdour: getValue(
                    "waterOdour",
                    "No observation"
                )
            },

            location: {
                state: getValue("reportState"),
                district: getValue(
                    "reportDistrict"
                ),
                locality: getValue(
                    "reportLocality"
                ),
                postalCode: getValue(
                    "reportPostalCode",
                    "Not provided"
                ),
                landmark: getValue(
                    "reportLandmark"
                ),
                waterSource: getValue(
                    "waterSourceType",
                    "Not specified"
                ),
                peopleAffected: getNumber(
                    "peopleAffected",
                    0
                ),
                latitude: getValue(
                    "reportLatitude"
                ),
                longitude: getValue(
                    "reportLongitude"
                )
            },

            reporter: {
                anonymous,
                name: anonymous
                    ? "Anonymous reporter"
                    : getValue(
                        "reporterName",
                        "Not provided"
                    ),
                role: anonymous
                    ? "Anonymous"
                    : getValue(
                        "reporterRole",
                        "Not provided"
                    ),
                phone: anonymous
                    ? ""
                    : getValue(
                        "reporterPhone"
                    ),
                email: anonymous
                    ? ""
                    : getValue(
                        "reporterEmail"
                    )
            },

            attachment: selectedPhoto
                ? {
                    name: selectedPhoto.name,
                    type: selectedPhoto.type,
                    size: selectedPhoto.size
                }
                : null
        };
    }

    /* =====================================================
       REVIEW SUMMARY
       ===================================================== */

    function getUrgencyClass(urgency) {
        const classes = {
            Low: "report-urgency-low",
            Moderate: "report-urgency-moderate",
            High: "report-urgency-high",
            Critical: "report-urgency-critical"
        };

        return classes[urgency] ||
            "report-urgency-moderate";
    }

    function buildReviewSummary() {
        if (!reviewCard) {
            return;
        }

        const data = collectReportData();

        const attachmentText =
            data.attachment
                ? data.attachment.name
                : "No photograph attached";

        const locationText =
            `${data.location.locality}, ` +
            `${data.location.district}, ` +
            `${data.location.state}`;

        const observationText =
            data.concern.observationTime
                ? `${formatDate(
                    data.concern.observationDate
                )} at ${data.concern.observationTime}`
                : formatDate(
                    data.concern.observationDate
                );

        reviewCard.innerHTML = `
            <div class="report-review-header">
                <div>
                    <h4>
                        ${escapeHTML(data.concern.summary)}
                    </h4>

                    <p>
                        ${escapeHTML(data.concern.type)}
                    </p>
                </div>

                <span class="
                    report-review-urgency
                    ${getUrgencyClass(
                        data.concern.urgency
                    )}
                ">
                    ${escapeHTML(
                        data.concern.urgency
                    )} urgency
                </span>
            </div>

            <div class="report-review-grid">
                <div class="report-review-item">
                    <span>Location</span>

                    <strong>
                        ${escapeHTML(locationText)}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Observed</span>

                    <strong>
                        ${escapeHTML(observationText)}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Nearby water source</span>

                    <strong>
                        ${escapeHTML(
                            data.location.waterSource
                        )}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>People affected</span>

                    <strong>
                        ${
                            data.location.peopleAffected > 0
                                ? escapeHTML(
                                    data.location.peopleAffected
                                )
                                : "Not estimated"
                        }
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Symptoms</span>

                    <strong>
                        ${escapeHTML(
                            data.concern.symptoms
                        )}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Reporter</span>

                    <strong>
                        ${escapeHTML(
                            data.reporter.name
                        )}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Water appearance</span>

                    <strong>
                        ${escapeHTML(
                            data.concern.waterAppearance
                        )}
                    </strong>
                </div>

                <div class="report-review-item">
                    <span>Attachment</span>

                    <strong>
                        ${escapeHTML(attachmentText)}
                    </strong>
                </div>
            </div>

            <div class="report-review-description">
                <span>Detailed observation</span>

                <p>
                    ${escapeHTML(
                        data.concern.description
                    )}
                </p>
            </div>
        `;
    }

    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function readReports() {
        try {
            const storedReports =
                window.localStorage.getItem(
                    STORAGE_KEY
                );

            if (!storedReports) {
                return [];
            }

            const reports =
                JSON.parse(storedReports);

            return Array.isArray(reports)
                ? reports
                : [];
        } catch (error) {
            console.warn(
                "Community reports could not be read:",
                error
            );

            return [];
        }
    }

    function saveReports(reports) {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(reports)
            );

            return true;
        } catch (error) {
            console.error(
                "Community reports could not be saved:",
                error
            );

            return false;
        }
    }

    function generateReportId() {
        const now = new Date();

        const datePart =
            now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0");

        const randomPart = Math.random()
            .toString(36)
            .slice(2, 7)
            .toUpperCase();

        return `AQS-${datePart}-${randomPart}`;
    }

    function calculatePriorityScore(data) {
        const urgencyScores = {
            Low: 20,
            Moderate: 48,
            High: 74,
            Critical: 94
        };

        let score =
            urgencyScores[data.concern.urgency] || 30;

        if (data.location.peopleAffected >= 100) {
            score += 10;
        } else if (
            data.location.peopleAffected >= 25
        ) {
            score += 6;
        }

        if (
            data.concern.symptoms !==
            "No symptoms reported"
        ) {
            score += 7;
        }

        if (
            data.concern.type ===
            "Illness symptoms"
        ) {
            score += 6;
        }

        if (
            data.concern.type === "Flooding" ||
            data.concern.type ===
                "Water quality"
        ) {
            score += 4;
        }

        return Math.min(100, score);
    }

    /* =====================================================
       RECENT REPORT
       ===================================================== */

    function renderRecentReport() {
        const container = getElement(
            "recentReportCard"
        );

        if (!container) {
            return;
        }

        let latestReport = null;

        try {
            latestReport = JSON.parse(
                window.localStorage.getItem(
                    LATEST_REPORT_KEY
                )
            );
        } catch {
            latestReport = null;
        }

        if (!latestReport?.reportId) {
            return;
        }

        const location =
            `${latestReport.location.locality}, ` +
            `${latestReport.location.district}, ` +
            `${latestReport.location.state}`;

        container.innerHTML = `
            <div class="recent-report-content">
                <div class="recent-report-reference">
                    CR
                </div>

                <div>
                    <h3>
                        ${escapeHTML(
                            latestReport.concern.summary
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(location)}
                    </p>

                    <small>
                        Report ID:
                        ${escapeHTML(
                            latestReport.reportId
                        )}
                        · Submitted
                        ${escapeHTML(
                            formatDateTime(
                                latestReport.submittedAt
                            )
                        )}
                    </small>
                </div>

                <a
                    class="recent-report-link"
                    href="report-success.html?id=${
                        encodeURIComponent(
                            latestReport.reportId
                        )
                    }"
                >
                    View Report
                </a>
            </div>
        `;
    }

    /* =====================================================
       FINAL SUBMISSION
       ===================================================== */

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage();

        if (!validateStep(4)) {
            return;
        }

        const data = collectReportData();

        const report = {
            reportId: generateReportId(),
            submittedAt: new Date().toISOString(),
            status: "Submitted for prototype review",
            priorityScore:
                calculatePriorityScore(data),
            ...data
        };

        const reports = readReports();

        reports.unshift(report);

        const saved = saveReports(
            reports.slice(0, MAX_REPORTS)
        );

        if (!saved) {
            showMessage(
                "The report could not be saved in this browser. Please check your browser storage settings."
            );

            return;
        }

        try {
            window.localStorage.setItem(
                LATEST_REPORT_KEY,
                JSON.stringify(report)
            );
        } catch (error) {
            console.warn(
                "Latest report could not be stored:",
                error
            );
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent =
                "Creating Report...";
        }

        console.log(
            "Prototype community report created:",
            report
        );

        window.setTimeout(() => {
            window.location.href =
                `report-success.html?id=${
                    encodeURIComponent(
                        report.reportId
                    )
                }`;
        }, 700);
    });

    /* Initial interface */

    updateStepInterface();
    renderRecentReport();

    console.log(
        "AquaSentinel community reporting system loaded."
    );
});