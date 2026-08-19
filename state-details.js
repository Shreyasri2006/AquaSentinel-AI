/* AquaSentinel AI — State Details Page */

(() => {
    "use strict";

    const stateData = [
        {
            name: "Arunachal Pradesh",
            capital: "Itanagar",
            risk: "Low",
            score: 29,
            environment: 32,
            health: 26,
            healthSignal: "Normal",
            disease: "Diarrhoeal disease",
            trend: "Routine monitoring",
            waterPressure: "Low",
            communitySignal: "Normal",
            priority: "Routine",
            introduction:
                "A prototype regional profile combining environmental conditions and community health-surveillance signals for Arunachal Pradesh.",
            explanation:
                "AquaAI identifies relatively limited environmental pressure and no unusual increase in the available prototype health indicators. The combined signal remains within the low-risk category.",
            action:
                "Continue routine water-quality monitoring, community awareness activities and regular review of local health reports."
        },
        {
            name: "Assam",
            capital: "Dispur",
            risk: "High",
            score: 76,
            environment: 81,
            health: 71,
            healthSignal: "Elevated",
            disease: "Diarrhoeal disease",
            trend: "Increasing",
            waterPressure: "High",
            communitySignal: "Elevated",
            priority: "Priority",
            introduction:
                "A prototype regional profile combining water-related environmental exposure and community health-surveillance signals for Assam.",
            explanation:
                "AquaAI identifies elevated environmental exposure together with an increasing prototype community health signal. The combined contribution produces a high-risk classification requiring priority verification.",
            action:
                "Prioritise water-source testing, sanitation inspection and verification of community illness reports in vulnerable locations."
        },
        {
            name: "Manipur",
            capital: "Imphal",
            risk: "High",
            score: 72,
            environment: 70,
            health: 74,
            healthSignal: "Elevated",
            disease: "Dysentery",
            trend: "Increasing",
            waterPressure: "High",
            communitySignal: "Elevated",
            priority: "Priority",
            introduction:
                "A prototype regional profile combining environmental vulnerability and current health-surveillance patterns for Manipur.",
            explanation:
                "AquaAI identifies both environmental vulnerability and an increasing prototype health signal. The health contribution is slightly stronger, placing the overall profile in the high-risk category.",
            action:
                "Verify community water sources, strengthen symptom surveillance and review priority reports with authorised health teams."
        },
        {
            name: "Meghalaya",
            capital: "Shillong",
            risk: "Moderate",
            score: 57,
            environment: 61,
            health: 53,
            healthSignal: "Watch",
            disease: "Typhoid",
            trend: "Stable",
            waterPressure: "Moderate",
            communitySignal: "Stable",
            priority: "Enhanced monitoring",
            introduction:
                "A prototype regional profile combining environmental and community health information for Meghalaya.",
            explanation:
                "AquaAI identifies moderately elevated environmental indicators while the prototype health-surveillance signal remains stable. The combined profile requires continued observation.",
            action:
                "Maintain regular water sampling and promptly review any new community reports or unusual illness patterns."
        },
        {
            name: "Mizoram",
            capital: "Aizawl",
            risk: "Low",
            score: 31,
            environment: 34,
            health: 28,
            healthSignal: "Normal",
            disease: "Giardiasis",
            trend: "Normal",
            waterPressure: "Low",
            communitySignal: "Normal",
            priority: "Routine",
            introduction:
                "A prototype regional profile combining environmental and community health-surveillance information for Mizoram.",
            explanation:
                "AquaAI identifies limited environmental pressure and no unusual increase in the prototype health signal. The combined profile remains within the low-risk category.",
            action:
                "Continue routine monitoring and reinforce safe drinking-water, hygiene and sanitation practices."
        },
        {
            name: "Nagaland",
            capital: "Kohima",
            risk: "Moderate",
            score: 52,
            environment: 55,
            health: 49,
            healthSignal: "Watch",
            disease: "Typhoid",
            trend: "Stable",
            waterPressure: "Moderate",
            communitySignal: "Stable",
            priority: "Enhanced monitoring",
            introduction:
                "A prototype regional profile combining environmental conditions and community health signals for Nagaland.",
            explanation:
                "AquaAI places both environmental and health indicators within the middle prototype range. No sharp increase is detected, but continued monitoring is recommended.",
            action:
                "Continue targeted water sampling and maintain community awareness and reporting activities."
        },
        {
            name: "Sikkim",
            capital: "Gangtok",
            risk: "Moderate",
            score: 48,
            environment: 51,
            health: 45,
            healthSignal: "Watch",
            disease: "Hepatitis A",
            trend: "Stable",
            waterPressure: "Moderate",
            communitySignal: "Stable",
            priority: "Enhanced monitoring",
            introduction:
                "A prototype regional profile combining water-related environmental indicators and health-surveillance information for Sikkim.",
            explanation:
                "AquaAI identifies moderate environmental sensitivity with a stable prototype health signal. The overall profile remains near the moderate-risk threshold.",
            action:
                "Monitor drinking-water sources and continue preventive health communication in vulnerable communities."
        },
        {
            name: "Tripura",
            capital: "Agartala",
            risk: "Critical",
            score: 88,
            environment: 91,
            health: 85,
            healthSignal: "Priority",
            disease: "Cholera",
            trend: "Unusual increase",
            waterPressure: "Critical",
            communitySignal: "Unusual increase",
            priority: "Immediate verification",
            introduction:
                "A priority prototype regional profile combining strong environmental and community health-surveillance signals for Tripura.",
            explanation:
                "AquaAI identifies a strong environmental risk contribution combined with an unusual increase in the prototype health-surveillance signal. Together, these indicators produce the highest regional risk category.",
            action:
                "Initiate priority verification, rapid water-source testing and immediate review by authorised health and response teams."
        }
    ];

    const riskClasses = {
        Low: "risk-low",
        Moderate: "risk-moderate",
        High: "risk-high",
        Critical: "risk-critical"
    };

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

    function getRequestedState() {
        const parameters = new URLSearchParams(window.location.search);
        const requestedName = parameters.get("state");

        if (!requestedName) {
            return stateData.find((state) => state.name === "Assam");
        }

        const decodedName = decodeURIComponent(requestedName);

        return (
            stateData.find(
                (state) =>
                    state.name.toLowerCase() ===
                    decodedName.toLowerCase()
            ) ||
            stateData.find((state) => state.name === "Assam")
        );
    }

    function getScoreMessage(risk) {
        const messages = {
            Low: "Routine monitoring appropriate",
            Moderate: "Moderate attention required",
            High: "Priority monitoring required",
            Critical: "Immediate verification recommended"
        };

        return messages[risk];
    }

    function getInfluenceLabel(value) {
        if (value >= 80) {
            return "Very strong";
        }

        if (value >= 65) {
            return "Strong";
        }

        if (value >= 45) {
            return "Moderate";
        }

        return "Limited";
    }

    function updateRiskColours(state) {
        const badge = document.getElementById(
            "statePageRiskBadge"
        );

        if (badge) {
            badge.className =
                `state-risk-badge ${riskClasses[state.risk]}`;
        }

        const score = document.getElementById("statePageScore");

        if (!score) {
            return;
        }

        const scoreColours = {
            Low: "linear-gradient(135deg, #28a878, #35c995)",
            Moderate:
                "linear-gradient(135deg, #efb64b, #f4cf64)",
            High:
                "linear-gradient(135deg, #f07b4f, #f4a152)",
            Critical:
                "linear-gradient(135deg, #e65d6f, #bf476c)"
        };

        score.style.background = scoreColours[state.risk];
    }

    function updateStatePage(state) {
        document.title =
            `${state.name} Risk Profile | AquaSentinel AI`;

        setText("breadcrumbState", state.name);
        setText("statePageName", state.name);
        setText("stateCapital", state.capital);
        setText("statePageIntroduction", state.introduction);

        setText("statePageRiskBadge", state.risk);
        setText("statePageScore", state.score);
        setText("stateScoreMessage", getScoreMessage(state.risk));

        setText(
            "stateEnvironmentScore",
            `${state.environment}%`
        );

        setText(
            "stateHealthScore",
            `${state.health}%`
        );

        setText("stateHealthSignal", state.healthSignal);
        setText("statePrimaryDisease", state.disease);
        setText("stateRiskTrend", state.trend);

        setText(
            "environmentDetailPercentage",
            `${state.environment}%`
        );

        setText(
            "healthDetailPercentage",
            `${state.health}%`
        );

        setText("waterPressure", state.waterPressure);
        setText("communitySignal", state.communitySignal);
        setText("monitoringPriority", state.priority);

        setText("stateFullExplanation", state.explanation);
        setText(
            "environmentInfluence",
            getInfluenceLabel(state.environment)
        );

        setText(
            "healthInfluence",
            getInfluenceLabel(state.health)
        );

        setText("stateRecommendedAction", state.action);

        setProgress("overallRiskProgress", state.score);
        setProgress("environmentDetailBar", state.environment);
        setProgress("healthDetailBar", state.health);

        updateRiskColours(state);

        const selector = document.getElementById(
            "statePageSelector"
        );

        if (selector) {
            selector.value = state.name;
        }
    }

    function updatePageTime() {
        const now = new Date();

        const formattedTime = now.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        setText("stateLastUpdated", formattedTime);
    }

    const stateSelector = document.getElementById(
        "statePageSelector"
    );

    if (stateSelector) {
        stateSelector.addEventListener("change", () => {
            const selectedState = stateSelector.value;
            const encodedState = encodeURIComponent(selectedState);

            window.location.href =
                `state-details.html?state=${encodedState}`;
        });
    }

    const selectedState = getRequestedState();

    updateStatePage(selectedState);
    updatePageTime();
})();