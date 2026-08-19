"use strict";

/* =========================================================
   AQUASENTINEL AI — AQUAAI LAB
   Transparent frontend prototype risk-assessment model

   IMPORTANT:
   This is a demonstration model for interface testing.
   It is not a trained medical model or diagnostic system.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("riskPredictorForm");
    const resetButton = document.getElementById(
        "resetPredictionButton"
    );
    const clearHistoryButton = document.getElementById(
        "clearHistoryButton"
    );

    const resultPanel = document.getElementById("aiResultPanel");
    const resultPlaceholder = document.getElementById(
        "aiResultPlaceholder"
    );
    const resultContent = document.getElementById(
        "aiResultContent"
    );

    const predictionHistory = document.getElementById(
        "predictionHistory"
    );
    const historyEmptyState = document.getElementById(
        "historyEmptyState"
    );
    const historyCount = document.getElementById("historyCount");

    const HISTORY_KEY = "aquaSentinelPredictionHistory";
    const MAX_HISTORY_ITEMS = 6;

    if (!form) {
        console.error(
            "AquaAI Lab: riskPredictorForm was not found."
        );
        return;
    }

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
        const value = Number.parseFloat(getValue(id));

        return Number.isFinite(value) ? value : fallback;
    }

    function clamp(value, minimum = 0, maximum = 100) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .toLowerCase();
    }

    function formatDate(dateValue = new Date()) {
        const date = new Date(dateValue);

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function selectMatches(value, keywords) {
        const normalizedValue = normalizeText(value);

        return keywords.some((keyword) =>
            normalizedValue.includes(keyword)
        );
    }

    /* =====================================================
       RANGE VALUE DISPLAY
       ===================================================== */

    const rangeConfigurations = [
        {
            input: "rainfallInput",
            output: "rainfallValue",
            suffix: " mm"
        },
        {
            input: "temperatureInput",
            output: "temperatureValue",
            suffix: " °C"
        },
        {
            input: "turbidityInput",
            output: "turbidityValue",
            suffix: " NTU"
        },
        {
            input: "phInput",
            output: "phValue",
            suffix: ""
        },
        {
            input: "reportedCasesInput",
            output: "reportedCasesValue",
            suffix: ""
        },
        {
            input: "caseIncreaseInput",
            output: "caseIncreaseValue",
            suffix: "%"
        }
    ];

    function updateRangeOutput(configuration) {
        const input = getElement(configuration.input);
        const output = getElement(configuration.output);

        if (!input || !output) {
            return;
        }

        output.textContent =
            `${input.value}${configuration.suffix}`;
    }

    rangeConfigurations.forEach((configuration) => {
        const input = getElement(configuration.input);

        if (!input) {
            return;
        }

        updateRangeOutput(configuration);

        input.addEventListener("input", () => {
            updateRangeOutput(configuration);
        });
    });

    /* =====================================================
       STATE AND DISTRICT SUPPORT
       ===================================================== */

    const districtSuggestions = {
        Assam: [
            "Guwahati",
            "Dibrugarh",
            "Jorhat",
            "Silchar",
            "Nagaon"
        ],
        "Arunachal Pradesh": [
            "Itanagar",
            "Papum Pare",
            "Tawang",
            "Pasighat",
            "Ziro"
        ],
        Manipur: [
            "Imphal East",
            "Imphal West",
            "Thoubal",
            "Churachandpur",
            "Bishnupur"
        ],
        Meghalaya: [
            "East Khasi Hills",
            "West Garo Hills",
            "Ri-Bhoi",
            "Jaintia Hills",
            "Shillong"
        ],
        Mizoram: [
            "Aizawl",
            "Lunglei",
            "Kolasib",
            "Champhai",
            "Serchhip"
        ],
        Nagaland: [
            "Kohima",
            "Dimapur",
            "Mokokchung",
            "Mon",
            "Wokha"
        ],
        Sikkim: [
            "Gangtok",
            "Namchi",
            "Gyalshing",
            "Mangan",
            "Pakyong"
        ],
        Tripura: [
            "West Tripura",
            "North Tripura",
            "South Tripura",
            "Dhalai",
            "Gomati"
        ]
    };

    function updateDistrictSuggestions() {
        const stateElement = getElement("predictionState");
        const districtElement = getElement(
            "predictionDistrict"
        );

        if (!stateElement || !districtElement) {
            return;
        }

        const state = stateElement.value;
        const districts = districtSuggestions[state] || [];

        if (
            districtElement.tagName.toLowerCase() === "select"
        ) {
            const previousValue = districtElement.value;

            districtElement.innerHTML =
                '<option value="">Select district</option>';

            districts.forEach((district) => {
                const option = document.createElement("option");

                option.value = district;
                option.textContent = district;
                districtElement.appendChild(option);
            });

            if (districts.includes(previousValue)) {
                districtElement.value = previousValue;
            }
        } else {
            districtElement.placeholder = districts.length
                ? `Example: ${districts[0]}`
                : "Enter district";
        }
    }

    const stateElement = getElement("predictionState");

    if (stateElement) {
        stateElement.addEventListener(
            "change",
            updateDistrictSuggestions
        );

        updateDistrictSuggestions();
    }

    /* =====================================================
       B1 ENVIRONMENTAL RISK CALCULATION
       ===================================================== */

    function calculateRainfallRisk(rainfall) {
        if (rainfall >= 350) {
            return 95;
        }

        if (rainfall >= 250) {
            return 82;
        }

        if (rainfall >= 150) {
            return 65;
        }

        if (rainfall >= 80) {
            return 42;
        }

        return 20;
    }

    function calculateTemperatureRisk(temperature) {
        if (temperature >= 30 && temperature <= 38) {
            return 80;
        }

        if (temperature >= 25 && temperature < 30) {
            return 60;
        }

        if (temperature > 38) {
            return 65;
        }

        if (temperature >= 20) {
            return 38;
        }

        return 20;
    }

    function calculateTurbidityRisk(turbidity) {
        return clamp((turbidity / 25) * 100);
    }

    function calculatePHRisk(ph) {
        const deviationFromNeutral = Math.abs(ph - 7);

        return clamp(deviationFromNeutral * 32);
    }

    function calculateWaterSourceRisk(waterSource) {
        if (
            selectMatches(waterSource, [
                "surface",
                "river",
                "pond",
                "stream"
            ])
        ) {
            return 90;
        }

        if (
            selectMatches(waterSource, [
                "unprotected",
                "open well"
            ])
        ) {
            return 82;
        }

        if (
            selectMatches(waterSource, [
                "groundwater",
                "tube",
                "bore",
                "well"
            ])
        ) {
            return 52;
        }

        if (
            selectMatches(waterSource, [
                "mixed",
                "multiple"
            ])
        ) {
            return 62;
        }

        if (
            selectMatches(waterSource, [
                "treated",
                "piped",
                "municipal"
            ])
        ) {
            return 22;
        }

        return 45;
    }

    function calculateSanitationRisk(sanitation) {
        if (
            selectMatches(sanitation, [
                "poor",
                "unsafe",
                "open"
            ])
        ) {
            return 90;
        }

        if (
            selectMatches(sanitation, [
                "limited",
                "moderate",
                "partial"
            ])
        ) {
            return 62;
        }

        if (
            selectMatches(sanitation, [
                "good",
                "improved",
                "safe"
            ])
        ) {
            return 22;
        }

        return 48;
    }

    function calculateBinaryRisk(value, highScore) {
        if (
            selectMatches(value, [
                "yes",
                "present",
                "observed",
                "reported",
                "high"
            ])
        ) {
            return highScore;
        }

        if (
            selectMatches(value, [
                "possible",
                "unknown",
                "moderate"
            ])
        ) {
            return highScore * 0.55;
        }

        return 10;
    }

    function calculateEnvironmentalRisk(data) {
        const rainfallRisk =
            calculateRainfallRisk(data.rainfall);
        const temperatureRisk =
            calculateTemperatureRisk(data.temperature);
        const turbidityRisk =
            calculateTurbidityRisk(data.turbidity);
        const phRisk =
            calculatePHRisk(data.ph);
        const waterSourceRisk =
            calculateWaterSourceRisk(data.waterSource);
        const sanitationRisk =
            calculateSanitationRisk(data.sanitation);
        const floodingRisk =
            calculateBinaryRisk(data.flooding, 95);
        const contaminationRisk =
            calculateBinaryRisk(data.contamination, 100);

        const score =
            rainfallRisk * 0.16 +
            temperatureRisk * 0.08 +
            turbidityRisk * 0.18 +
            phRisk * 0.09 +
            waterSourceRisk * 0.14 +
            sanitationRisk * 0.13 +
            floodingRisk * 0.1 +
            contaminationRisk * 0.12;

        return {
            score: Math.round(clamp(score)),
            factors: {
                rainfall: Math.round(rainfallRisk),
                temperature: Math.round(temperatureRisk),
                turbidity: Math.round(turbidityRisk),
                ph: Math.round(phRisk),
                waterSource: Math.round(waterSourceRisk),
                sanitation: Math.round(sanitationRisk),
                flooding: Math.round(floodingRisk),
                contamination: Math.round(
                    contaminationRisk
                )
            }
        };
    }

    /* =====================================================
       B2 HEALTH-SURVEILLANCE RISK CALCULATION
       ===================================================== */

    function calculateReportedCasesRisk(cases) {
        if (cases >= 100) {
            return 100;
        }

        if (cases >= 60) {
            return 86;
        }

        if (cases >= 30) {
            return 68;
        }

        if (cases >= 10) {
            return 45;
        }

        if (cases > 0) {
            return 24;
        }

        return 5;
    }

    function calculateCaseIncreaseRisk(increase) {
        if (increase >= 100) {
            return 100;
        }

        if (increase >= 60) {
            return 85;
        }

        if (increase >= 30) {
            return 68;
        }

        if (increase >= 10) {
            return 42;
        }

        if (increase > 0) {
            return 22;
        }

        return 5;
    }

    function calculateSymptomRisk(symptom) {
        if (
            selectMatches(symptom, [
                "mixed",
                "severe",
                "cholera"
            ])
        ) {
            return 92;
        }

        if (
            selectMatches(symptom, [
                "diarr",
                "vomit",
                "dehydration"
            ])
        ) {
            return 82;
        }

        if (
            selectMatches(symptom, [
                "jaundice",
                "hepatitis"
            ])
        ) {
            return 75;
        }

        if (
            selectMatches(symptom, [
                "fever",
                "typhoid"
            ])
        ) {
            return 65;
        }

        if (
            selectMatches(symptom, [
                "stomach",
                "abdominal"
            ])
        ) {
            return 52;
        }

        return 32;
    }

    function calculatePopulationRisk(population) {
        if (population >= 100000) {
            return 90;
        }

        if (population >= 50000) {
            return 75;
        }

        if (population >= 20000) {
            return 58;
        }

        if (population >= 5000) {
            return 40;
        }

        return 24;
    }

    function calculateHealthRisk(data) {
        const reportedCasesRisk =
            calculateReportedCasesRisk(
                data.reportedCases
            );

        const caseIncreaseRisk =
            calculateCaseIncreaseRisk(
                data.caseIncrease
            );

        const symptomRisk =
            calculateSymptomRisk(data.symptom);

        const populationRisk =
            calculatePopulationRisk(data.population);

        const clusterRisk =
            calculateBinaryRisk(data.cluster, 96);

        const vulnerableRisk =
            calculateBinaryRisk(data.vulnerable, 88);

        const score =
            reportedCasesRisk * 0.24 +
            caseIncreaseRisk * 0.24 +
            symptomRisk * 0.18 +
            populationRisk * 0.09 +
            clusterRisk * 0.15 +
            vulnerableRisk * 0.1;

        return {
            score: Math.round(clamp(score)),
            factors: {
                reportedCases: Math.round(
                    reportedCasesRisk
                ),
                caseIncrease: Math.round(
                    caseIncreaseRisk
                ),
                symptom: Math.round(symptomRisk),
                population: Math.round(populationRisk),
                cluster: Math.round(clusterRisk),
                vulnerable: Math.round(vulnerableRisk)
            }
        };
    }

    /* =====================================================
       RESULT CLASSIFICATION
       ===================================================== */

    function classifyRisk(score) {
        if (score >= 80) {
            return {
                level: "Critical",
                className: "risk-critical",
                message:
                    "Immediate verification and coordinated response are strongly recommended.",
                priority: "Immediate response"
            };
        }

        if (score >= 60) {
            return {
                level: "High",
                className: "risk-high",
                message:
                    "Elevated environmental and health signals require priority monitoring.",
                priority: "High priority"
            };
        }

        if (score >= 35) {
            return {
                level: "Moderate",
                className: "risk-moderate",
                message:
                    "Several indicators require continued observation and preventive action.",
                priority: "Enhanced monitoring"
            };
        }

        return {
            level: "Low",
            className: "risk-low",
            message:
                "Current inputs indicate comparatively limited risk, but routine monitoring should continue.",
            priority: "Routine monitoring"
        };
    }

    function identifyDisease(data, finalScore) {
        const symptom = normalizeText(data.symptom);

        if (
            symptom.includes("jaundice") ||
            symptom.includes("hepatitis")
        ) {
            return "Possible Hepatitis A signal";
        }

        if (
            symptom.includes("fever") ||
            symptom.includes("typhoid")
        ) {
            return "Possible typhoid signal";
        }

        if (
            symptom.includes("mixed") &&
            finalScore >= 70
        ) {
            return "Possible mixed waterborne outbreak";
        }

        if (
            (
                symptom.includes("vomit") ||
                symptom.includes("diarr")
            ) &&
            finalScore >= 78
        ) {
            return "Possible cholera-like signal";
        }

        if (
            symptom.includes("diarr") ||
            symptom.includes("stomach") ||
            symptom.includes("abdominal")
        ) {
            return "Possible diarrhoeal disease signal";
        }

        return "General waterborne disease signal";
    }

    /* =====================================================
       EXPLANATION AND RECOMMENDATIONS
       ===================================================== */

    const factorLabels = {
        rainfall: "heavy rainfall",
        temperature: "temperature conditions",
        turbidity: "high water turbidity",
        ph: "abnormal water pH",
        waterSource: "water-source vulnerability",
        sanitation: "sanitation conditions",
        flooding: "recent flooding",
        contamination: "reported contamination",
        reportedCases: "reported case count",
        caseIncrease: "recent case increase",
        symptom: "symptom pattern",
        population: "population exposure",
        cluster: "case clustering",
        vulnerable: "vulnerable population exposure"
    };

    function getTopFactors(
        environmentalFactors,
        healthFactors
    ) {
        const combinedFactors = {
            ...environmentalFactors,
            ...healthFactors
        };

        return Object.entries(combinedFactors)
            .sort((first, second) => second[1] - first[1])
            .slice(0, 4)
            .map(([key]) => factorLabels[key] || key);
    }

    function createExplanation(
        data,
        environmentalScore,
        healthScore,
        risk,
        topFactors
    ) {
        const location = data.district
            ? `${data.district}, ${data.state}`
            : data.state;

        const dominantSignal =
            environmentalScore > healthScore
                ? "environmental conditions"
                : healthScore > environmentalScore
                    ? "health-surveillance signals"
                    : "combined environmental and health signals";

        return (
            `The prototype assessment for ${location} indicates ` +
            `${risk.level.toLowerCase()} risk. The result is mainly ` +
            `influenced by ${dominantSignal}. Important contributing ` +
            `factors include ${topFactors.join(", ")}. ` +
            `This score is generated from the submitted demonstration ` +
            `inputs and must be verified using official field and ` +
            `laboratory data.`
        );
    }

    function createRecommendation(riskLevel) {
        const recommendations = {
            Low:
                "Continue routine water-quality monitoring, maintain safe-water communication and review new community reports.",
            Moderate:
                "Increase sampling frequency, inspect vulnerable water sources and communicate preventive guidance to local communities.",
            High:
                "Prioritise field verification, test affected water sources, notify health teams and strengthen active case surveillance.",
            Critical:
                "Initiate urgent field verification, coordinate health and water authorities, provide safe drinking-water guidance and prepare rapid-response resources."
        };

        return recommendations[riskLevel];
    }

    /* =====================================================
       READ FORM DATA
       ===================================================== */

    function collectFormData() {
        return {
            state: getValue(
                "predictionState",
                "Northeast India"
            ),
            district: getValue(
                "predictionDistrict",
                "Selected monitoring area"
            ),
            monitoringPeriod: getValue(
                "monitoringPeriod",
                "Current period"
            ),

            rainfall: getNumber("rainfallInput", 0),
            temperature: getNumber(
                "temperatureInput",
                25
            ),
            turbidity: getNumber("turbidityInput", 0),
            ph: getNumber("phInput", 7),

            waterSource: getValue(
                "waterSourceInput",
                "Unknown"
            ),
            sanitation: getValue(
                "sanitationInput",
                "Unknown"
            ),
            flooding: getValue(
                "floodingInput",
                "No"
            ),
            contamination: getValue(
                "contaminationInput",
                "No"
            ),

            reportedCases: getNumber(
                "reportedCasesInput",
                0
            ),
            caseIncrease: getNumber(
                "caseIncreaseInput",
                0
            ),
            symptom: getValue(
                "symptomInput",
                "General symptoms"
            ),
            population: getNumber(
                "populationInput",
                0
            ),
            cluster: getValue(
                "clusterInput",
                "No"
            ),
            vulnerable: getValue(
                "vulnerableInput",
                "No"
            )
        };
    }

    function validateData(data) {
        if (
            !data.state ||
            normalizeText(data.state).includes("select")
        ) {
            alert("Please select a state.");
            getElement("predictionState")?.focus();
            return false;
        }

        if (!data.district) {
            alert("Please enter or select a district.");
            getElement("predictionDistrict")?.focus();
            return false;
        }

        if (data.ph < 0 || data.ph > 14) {
            alert("The pH value must be between 0 and 14.");
            getElement("phInput")?.focus();
            return false;
        }

        return true;
    }

    /* =====================================================
       UPDATE RESULT PANEL
       ===================================================== */

    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    }

    function updateRiskBadge(risk) {
        const badge = getElement("resultRiskBadge");

        if (!badge) {
            return;
        }

        badge.classList.remove(
            "risk-low",
            "risk-moderate",
            "risk-high",
            "risk-critical"
        );

        badge.classList.add(risk.className);
        badge.textContent = `${risk.level} Risk`;
    }

    function updateProgressBar(id, score) {
        const bar = getElement(id);

        if (!bar) {
            return;
        }

        bar.style.width = "0%";

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                bar.style.width = `${score}%`;
            });
        });
    }

    function updateScoreCircle(score, risk) {
        const scoreElement = getElement("resultRiskScore");

        if (!scoreElement) {
            return;
        }

        const circle =
            scoreElement.closest(".ai-score-circle");

        if (!circle) {
            return;
        }

        const colors = {
            Low: "#10b981",
            Moderate: "#f59e0b",
            High: "#f97360",
            Critical: "#ef476f"
        };

        const angle = Math.round((score / 100) * 360);
        const color = colors[risk.level];

        circle.style.background =
            `conic-gradient(${color} 0deg, ` +
            `${color} ${angle}deg, #dfeaf5 ${angle}deg)`;
    }

    function showResult(result) {
        if (resultPlaceholder) {
            resultPlaceholder.hidden = true;
        }

        if (resultContent) {
            resultContent.hidden = false;
        }

        setText(
            "resultLocation",
            `${result.data.district}, ${result.data.state}`
        );

        setText("resultRiskScore", `${result.finalScore}`);
        setText("resultRiskMessage", result.risk.message);

        setText(
            "resultEnvironmentScore",
            `${result.environmental.score}/100`
        );

        setText(
            "resultHealthScore",
            `${result.health.score}/100`
        );

        setText("resultDisease", result.disease);
        setText("resultPriority", result.risk.priority);

        setText(
            "resultEnvironmentText",
            `${result.environmental.score}%`
        );

        setText(
            "resultHealthText",
            `${result.health.score}%`
        );

        setText(
            "resultExplanation",
            result.explanation
        );

        setText(
            "resultRecommendation",
            result.recommendation
        );

        updateRiskBadge(result.risk);
        updateProgressBar(
            "resultEnvironmentBar",
            result.environmental.score
        );
        updateProgressBar(
            "resultHealthBar",
            result.health.score
        );
        updateScoreCircle(
            result.finalScore,
            result.risk
        );

        if (resultPanel) {
            resultPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    /* =====================================================
       HISTORY
       ===================================================== */

    function readHistory() {
        try {
            const storedHistory =
                window.localStorage.getItem(HISTORY_KEY);

            if (!storedHistory) {
                return [];
            }

            const parsedHistory =
                JSON.parse(storedHistory);

            return Array.isArray(parsedHistory)
                ? parsedHistory
                : [];
        } catch (error) {
            console.warn(
                "AquaAI history could not be read:",
                error
            );

            return [];
        }
    }

    function writeHistory(history) {
        try {
            window.localStorage.setItem(
                HISTORY_KEY,
                JSON.stringify(history)
            );
        } catch (error) {
            console.warn(
                "AquaAI history could not be saved:",
                error
            );
        }
    }

    function addHistoryItem(result) {
        const history = readHistory();

        const historyItem = {
            id: Date.now(),
            state: result.data.state,
            district: result.data.district,
            score: result.finalScore,
            level: result.risk.level,
            disease: result.disease,
            environmentScore:
                result.environmental.score,
            healthScore: result.health.score,
            createdAt: new Date().toISOString()
        };

        history.unshift(historyItem);

        const limitedHistory = history.slice(
            0,
            MAX_HISTORY_ITEMS
        );

        writeHistory(limitedHistory);
        renderHistory();
    }

    function historyRiskClass(level) {
        return {
            Low: "risk-low",
            Moderate: "risk-moderate",
            High: "risk-high",
            Critical: "risk-critical"
        }[level] || "risk-moderate";
    }

    function createHistoryCard(item) {
        const article = document.createElement("article");

        article.className = "ai-history-card";

        article.innerHTML = `
            <div class="ai-history-card-top">
                <div>
                    <h3>
                        ${escapeHTML(item.district)},
                        ${escapeHTML(item.state)}
                    </h3>

                    <p>
                        ${escapeHTML(item.disease)}
                    </p>
                </div>

                <span class="ai-history-score">
                    ${escapeHTML(item.score)}
                </span>
            </div>

            <div class="ai-history-meta">
                <span class="${historyRiskClass(item.level)}">
                    ${escapeHTML(item.level)} risk
                </span>

                <span>
                    B1: ${escapeHTML(item.environmentScore)}
                </span>

                <span>
                    B2: ${escapeHTML(item.healthScore)}
                </span>
            </div>

            <p>
                <small>
                    Assessed ${escapeHTML(formatDate(item.createdAt))}
                </small>
            </p>
        `;

        return article;
    }

    function renderHistory() {
        if (!predictionHistory) {
            return;
        }

        const history = readHistory();

        predictionHistory
            .querySelectorAll(".ai-history-card")
            .forEach((card) => card.remove());

        if (historyCount) {
            historyCount.textContent =
                `${history.length} saved ` +
                `${history.length === 1 ? "assessment" : "assessments"}`;
        }

        if (historyEmptyState) {
            historyEmptyState.hidden = history.length > 0;
        }

        history.forEach((item) => {
            predictionHistory.appendChild(
                createHistoryCard(item)
            );
        });
    }

    if (clearHistoryButton) {
        clearHistoryButton.addEventListener("click", () => {
            const history = readHistory();

            if (history.length === 0) {
                return;
            }

            const shouldClear = window.confirm(
                "Clear all saved prototype assessments?"
            );

            if (!shouldClear) {
                return;
            }

            window.localStorage.removeItem(HISTORY_KEY);
            renderHistory();
        });
    }

    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = collectFormData();

        if (!validateData(data)) {
            return;
        }

        const environmental =
            calculateEnvironmentalRisk(data);

        const health = calculateHealthRisk(data);

        /*
         * Fusion model:
         * B1 environmental conditions = 55%
         * B2 health surveillance = 45%
         */

        const finalScore = Math.round(
            clamp(
                environmental.score * 0.55 +
                health.score * 0.45
            )
        );

        const risk = classifyRisk(finalScore);

        const disease = identifyDisease(
            data,
            finalScore
        );

        const topFactors = getTopFactors(
            environmental.factors,
            health.factors
        );

        const explanation = createExplanation(
            data,
            environmental.score,
            health.score,
            risk,
            topFactors
        );

        const recommendation =
            createRecommendation(risk.level);

        const result = {
            data,
            environmental,
            health,
            finalScore,
            risk,
            disease,
            explanation,
            recommendation
        };

        showResult(result);
        addHistoryItem(result);

        console.log(
            "AquaAI prototype assessment completed:",
            result
        );
    });

    /* =====================================================
       FORM RESET
       ===================================================== */

    function resetResultPanel() {
        if (resultPlaceholder) {
            resultPlaceholder.hidden = false;
        }

        if (resultContent) {
            resultContent.hidden = true;
        }

        const environmentBar = getElement(
            "resultEnvironmentBar"
        );

        const healthBar = getElement(
            "resultHealthBar"
        );

        if (environmentBar) {
            environmentBar.style.width = "0%";
        }

        if (healthBar) {
            healthBar.style.width = "0%";
        }
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            window.setTimeout(() => {
                rangeConfigurations.forEach(
                    updateRangeOutput
                );

                updateDistrictSuggestions();
                resetResultPanel();
            }, 0);
        });
    }

    /* Initial page state */

    resetResultPanel();
    renderHistory();

    console.log(
        "AquaAI Lab prototype model loaded successfully."
    );
});