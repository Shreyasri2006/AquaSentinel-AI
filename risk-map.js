/* AquaSentinel AI — Northeast India Professional Risk Map */

(() => {
    "use strict";
    console.log("NEW RISK MAP VERSION 4 LOADED");

    /* =====================================================
       PROTOTYPE STATE DATA
       ===================================================== */

    const states = [
        {
            name: "Arunachal Pradesh",
            code: "AR",
            capital: "Itanagar",
            coordinates: [27.0844, 93.6053],
            boundaryFile: "arunachal-pradesh.geojson",
            risk: "Low",
            score: 29,
            environment: 32,
            health: 26,
            disease: "Diarrhoeal disease",
            trend: "Routine monitoring",
            signal: "Normal"
        },
        {
            name: "Assam",
            code: "AS",
            capital: "Dispur",
            coordinates: [26.1433, 91.7898],
            boundaryFile: "assam.geojson",
            risk: "High",
            score: 76,
            environment: 81,
            health: 71,
            disease: "Diarrhoeal disease",
            trend: "Increasing",
            signal: "Elevated"
        },
        {
            name: "Manipur",
            code: "MN",
            capital: "Imphal",
            coordinates: [24.817, 93.9368],
            boundaryFile: "manipur.geojson",
            risk: "High",
            score: 72,
            environment: 70,
            health: 74,
            disease: "Dysentery",
            trend: "Increasing",
            signal: "Elevated"
        },
        {
            name: "Meghalaya",
            code: "ML",
            capital: "Shillong",
            coordinates: [25.5788, 91.8933],
            boundaryFile: "meghalaya.geojson",
            risk: "Moderate",
            score: 57,
            environment: 61,
            health: 53,
            disease: "Typhoid",
            trend: "Stable",
            signal: "Watch"
        },
        {
            name: "Mizoram",
            code: "MZ",
            capital: "Aizawl",
            coordinates: [23.7271, 92.7176],
            boundaryFile: "mizoram.geojson",
            risk: "Low",
            score: 31,
            environment: 34,
            health: 28,
            disease: "Giardiasis",
            trend: "Normal",
            signal: "Normal"
        },
        {
            name: "Nagaland",
            code: "NL",
            capital: "Kohima",
            coordinates: [25.6751, 94.1086],
            boundaryFile: "nagaland.geojson",
            risk: "Moderate",
            score: 52,
            environment: 55,
            health: 49,
            disease: "Typhoid",
            trend: "Stable",
            signal: "Watch"
        },
        {
            name: "Sikkim",
            code: "SK",
            capital: "Gangtok",
            coordinates: [27.3389, 88.6065],
            boundaryFile: "sikkim.geojson",
            risk: "Moderate",
            score: 48,
            environment: 51,
            health: 45,
            disease: "Hepatitis A",
            trend: "Stable",
            signal: "Watch"
        },
        {
            name: "Tripura",
            code: "TR",
            capital: "Agartala",
            coordinates: [23.8315, 91.2868],
            boundaryFile: "tripura.geojson",
            risk: "Critical",
            score: 88,
            environment: 91,
            health: 85,
            disease: "Cholera",
            trend: "Unusual increase",
            signal: "Priority"
        }
    ];

    const riskColors = {
        Low: "#28a878",
        Moderate: "#efb64b",
        High: "#f07b4f",
        Critical: "#e65d6f"
    };

    const riskClasses = {
        Low: "risk-low",
        Moderate: "risk-moderate",
        High: "risk-high",
        Critical: "risk-critical"
    };

    const boundaryBaseUrl =
        "https://cdn.jsdelivr.net/gh/udit-001/" +
        "india-maps-data@2884453/geojson/states/";

    /* =====================================================
       PAGE ELEMENTS
       ===================================================== */

    const mapElement = document.getElementById("map");

    const mapLoading =
        document.getElementById("mapLoading");

    const stateFilter =
        document.getElementById("stateFilter");

    const resetMapButton =
        document.getElementById("resetMapButton");

    const stateCardGrid =
        document.getElementById("stateCardGrid");

    const statePlaceholder =
        document.getElementById("statePlaceholder");

    let map = null;
    let stateLayerGroup = null;
    let markerLayerGroup = null;

    const loadedBoundaryLayers = [];

    /* =====================================================
       PAGE NAVIGATION
       ===================================================== */

    function openStateDetails(state) {
        if (!state || !state.name) {
            return;
        }

        const destination = new URL(
            "state-details.html",
            window.location.href
        );

        destination.searchParams.set(
            "state",
            state.name
        );

        window.location.href = destination.href;
    }

    /* =====================================================
       MAP APPEARANCE
       ===================================================== */

    function getBoundaryStyle(state) {
        return {
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillColor: riskColors[state.risk],
            fillOpacity: 0.78,
            interactive: true
        };
    }

    function getHoverStyle(state) {
        return {
            color: "#17324d",
            weight: 4,
            opacity: 1,
            fillColor: riskColors[state.risk],
            fillOpacity: 0.94
        };
    }

    function createStateTooltip(state) {
        return `
            <div class="map-popup">
                <h3>${state.name}</h3>

                <p>
                    Capital:
                    <strong>${state.capital}</strong>
                </p>

                <p>
                    Risk:
                    <strong>${state.risk}</strong>
                </p>

                <p>
                    Score:
                    <strong>${state.score}/100</strong>
                </p>

                <p>
                    Click to open the full state profile.
                </p>
            </div>
        `;
    }

    function hideLoadingIndicator() {
        if (mapLoading) {
            mapLoading.hidden = true;
        }
    }

    function showMapError(message) {
        if (!mapElement) {
            return;
        }

        mapElement.innerHTML = `
            <div class="map-loading">
                <strong>Unable to prepare the map</strong>
                <small>${message}</small>
            </div>
        `;
    }

    /* =====================================================
       ENGLISH STATE LABELS
       ===================================================== */

    function addEnglishStateLabel(state) {
    const stateLabel = L.tooltip({
        permanent: true,
        direction: "center",
        className: "state-name-tooltip",
        interactive: false,
        opacity: 1
    });

    stateLabel.setLatLng(state.coordinates);
    stateLabel.setContent(state.name);
    stateLabel.addTo(map);
}

    /* =====================================================
       FALLBACK MARKERS
       ===================================================== */

    function addFallbackMarker(state) {
        const marker = L.circleMarker(
            state.coordinates,
            {
                radius:
                    state.risk === "Critical"
                        ? 13
                        : 10,

                color: "#ffffff",
                weight: 3,
                fillColor: riskColors[state.risk],
                fillOpacity: 0.98,
                interactive: true
            }
        );

        marker.bindTooltip(
    state.name,
    {
        permanent: true,
        direction: "top",
        offset: [0, -8],
        className: "state-name-tooltip",
        opacity: 1
    }
);

        marker.on("click", (event) => {
            L.DomEvent.stopPropagation(event);
            openStateDetails(state);
        });

        marker.addTo(markerLayerGroup);

        addEnglishStateLabel(state);
    }

    /* =====================================================
       GEOJSON STATE BOUNDARIES
       ===================================================== */

    async function loadStateBoundary(state) {
        try {
            const boundaryUrl =
                `${boundaryBaseUrl}${state.boundaryFile}`;

            const response = await fetch(boundaryUrl);

            if (!response.ok) {
                throw new Error(
                    `Boundary request returned ${response.status}`
                );
            }

            const geojson = await response.json();

            const stateBoundaryLayer = L.geoJSON(
                geojson,
                {
                    style: () =>
                        getBoundaryStyle(state),

                    interactive: true,

                    onEachFeature: (
                        _feature,
                        featureLayer
                    ) => {
                        featureLayer.bindTooltip(
                            createStateTooltip(state),
                            {
                                sticky: true,
                                direction: "top",
                                opacity: 1
                            }
                        );

                        featureLayer.on(
                            "mouseover",
                            () => {
                                featureLayer.setStyle(
                                    getHoverStyle(state)
                                );

                                featureLayer.bringToFront();
                            }
                        );

                        featureLayer.on(
                            "mouseout",
                            () => {
                                featureLayer.setStyle(
                                    getBoundaryStyle(state)
                                );
                            }
                        );

                        featureLayer.on(
                            "click",
                            (event) => {
                                L.DomEvent.stopPropagation(
                                    event
                                );

                                openStateDetails(state);
                            }
                        );
                    }
                }
            );

            stateBoundaryLayer.addTo(
                stateLayerGroup
            );

            loadedBoundaryLayers.push(
                stateBoundaryLayer
            );

            const stateMarker = L.circleMarker(
                state.coordinates,
                {
                    radius: 7,
                    color: "#ffffff",
                    weight: 2,
                    fillColor: riskColors[state.risk],
                    fillOpacity: 1,
                    interactive: true
                }
            );

            stateMarker.bindTooltip(
    state.name,
    {
        permanent: true,
        direction: "top",
        offset: [0, -8],
        className: "state-name-tooltip",
        opacity: 1
    }
);

            stateMarker.on(
                "click",
                (event) => {
                    L.DomEvent.stopPropagation(event);
                    openStateDetails(state);
                }
            );

            stateMarker.addTo(markerLayerGroup);

            addEnglishStateLabel(state);

            return stateBoundaryLayer;
        } catch (error) {
            console.warn(
                `Boundary unavailable for ${state.name}:`,
                error
            );

            addFallbackMarker(state);

            return null;
        }
    }

    /* =====================================================
       STATE CARDS
       ===================================================== */

    function createStateCards() {
        if (!stateCardGrid) {
            return;
        }

        stateCardGrid.innerHTML = states
            .map(
                (state) => `
                    <article
                        class="state-risk-card"
                        data-state="${state.name}"
                        tabindex="0"
                        role="link"
                        aria-label="Open ${state.name} risk profile"
                    >
                        <div class="state-card-top">
                            <span class="state-card-code">
                                ${state.code}
                            </span>

                            <span
                                class="state-card-risk
                                ${riskClasses[state.risk]}"
                            >
                                ${state.risk}
                            </span>
                        </div>

                        <h3>${state.name}</h3>

                        <p>
                            Capital: ${state.capital}
                        </p>

                        <div class="state-card-score">
                            <span>Prototype risk score</span>
                            <strong>${state.score}/100</strong>
                        </div>
                    </article>
                `
            )
            .join("");

        const stateCards =
            stateCardGrid.querySelectorAll(
                ".state-risk-card"
            );

        stateCards.forEach((card) => {
            function activateCard() {
                const selectedState =
                    states.find(
                        (state) =>
                            state.name ===
                            card.dataset.state
                    );

                if (selectedState) {
                    openStateDetails(selectedState);
                }
            }

            card.addEventListener(
                "click",
                activateCard
            );

            card.addEventListener(
                "keydown",
                (event) => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        activateCard();
                    }
                }
            );
        });
    }

    /* =====================================================
       MAP VIEW
       ===================================================== */

    function fitRegionalView() {
        if (!map) {
            return;
        }

        if (loadedBoundaryLayers.length > 0) {
            const regionalGroup =
                L.featureGroup(
                    loadedBoundaryLayers
                );

            map.fitBounds(
                regionalGroup.getBounds(),
                {
                    padding: [30, 30]
                }
            );
        } else {
            map.setView(
                [25.8, 92.8],
                6
            );
        }
    }

    /* =====================================================
       MAP INITIALIZATION
       ===================================================== */

    async function initializeMap() {
        if (!mapElement) {
            return;
        }

        if (typeof L === "undefined") {
            showMapError(
                "The Leaflet map library could not load. Check your internet connection and refresh."
            );

            return;
        }

        map = L.map(
            "map",
            {
                center: [25.8, 92.8],
                zoom: 6,
                minZoom: 5,
                maxZoom: 10,
                zoomControl: true,
                scrollWheelZoom: false,
                attributionControl: false,

                maxBounds: [
                    [20.2, 86],
                    [29.8, 98.2]
                ],

                maxBoundsViscosity: 0.8
            }
        );

        stateLayerGroup =
            L.featureGroup().addTo(map);

        markerLayerGroup =
            L.layerGroup().addTo(map);

        await Promise.all(
            states.map(loadStateBoundary)
        );

        fitRegionalView();
        hideLoadingIndicator();

        window.setTimeout(
            () => {
                map.invalidateSize();
            },
            250
        );
    }

    /* =====================================================
       STATE DROPDOWN
       ===================================================== */

    if (stateFilter) {
        stateFilter.addEventListener(
            "change",
            () => {
                if (
                    stateFilter.value === "all"
                ) {
                    fitRegionalView();
                    return;
                }

                const selectedState =
                    states.find(
                        (state) =>
                            state.name ===
                            stateFilter.value
                    );

                if (selectedState) {
                    openStateDetails(
                        selectedState
                    );
                }
            }
        );
    }

    /* =====================================================
       RESET MAP
       ===================================================== */

    if (resetMapButton) {
        resetMapButton.addEventListener(
            "click",
            () => {
                if (stateFilter) {
                    stateFilter.value = "all";
                }

                if (statePlaceholder) {
                    statePlaceholder.hidden = false;
                }

                map?.closeTooltip();
                map?.closePopup();

                fitRegionalView();
            }
        );
    }

    /* =====================================================
       RESPONSIVE MAP
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {
            map?.invalidateSize();
        }
    );

    /* =====================================================
       START PAGE
       ===================================================== */

    createStateCards();
    initializeMap();
})();