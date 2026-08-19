"use strict";

/* =========================================================
   AQUASENTINEL AI — AWARENESS CENTRE

   Features:
   - Searchable health-guidance library
   - Category filters
   - Dedicated detail-page links
   - Household safety checklist
   - Browser-based checklist progress storage

   General educational information only.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const CHECKLIST_KEY =
        "aquaSentinelHouseholdSafetyChecklist";

    /* =====================================================
       GUIDANCE TOPICS
       ===================================================== */

    const guidanceTopics = [
        {
            slug: "safe-water",
            title: "Safe Drinking-Water Practices",
            category: "water",
            categoryLabel: "Safe Water",
            description:
                "Learn how to choose, treat, handle and store drinking water when its safety is uncertain.",
            image:
                "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Clean drinking water being poured into a glass",
            tags: [
                "Boiling",
                "Storage",
                "Treatment"
            ],
            keywords: [
                "water",
                "safe water",
                "boiling",
                "storage",
                "contamination",
                "drinking"
            ]
        },
        {
            slug: "hand-hygiene",
            title: "Handwashing and Hygiene",
            category: "hygiene",
            categoryLabel: "Hygiene",
            description:
                "Understand when and how to wash hands to reduce the spread of faecal-oral infections.",
            image:
                "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Hands being washed with soap and clean water",
            tags: [
                "Soap",
                "Handwashing",
                "Prevention"
            ],
            keywords: [
                "hands",
                "handwashing",
                "soap",
                "hygiene",
                "prevention"
            ]
        },
        {
            slug: "diarrhoea",
            title: "Diarrhoeal Illness Guidance",
            category: "disease",
            categoryLabel: "Disease",
            description:
                "Recognise dehydration risks, support fluid replacement and know when professional care is needed.",
            image:
                "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Healthcare professional preparing medical supplies",
            tags: [
                "ORS",
                "Dehydration",
                "Care"
            ],
            keywords: [
                "diarrhoea",
                "diarrhea",
                "dehydration",
                "ors",
                "loose stool",
                "children"
            ]
        },
        {
            slug: "cholera",
            title: "Cholera Awareness",
            category: "disease",
            categoryLabel: "Disease",
            description:
                "Learn about cholera transmission, watery diarrhoea, dehydration, prevention and urgent treatment.",
            image:
                "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Healthcare worker providing patient care",
            tags: [
                "Watery diarrhoea",
                "ORS",
                "Urgent care"
            ],
            keywords: [
                "cholera",
                "watery diarrhoea",
                "vomiting",
                "dehydration",
                "outbreak"
            ]
        },
        {
            slug: "typhoid",
            title: "Typhoid Fever Awareness",
            category: "disease",
            categoryLabel: "Disease",
            description:
                "Review common typhoid concerns, prevention through safer food and water, and the need for diagnosis.",
            image:
                "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Laboratory professional examining health samples",
            tags: [
                "Fever",
                "Food safety",
                "Diagnosis"
            ],
            keywords: [
                "typhoid",
                "fever",
                "salmonella",
                "food",
                "water",
                "diagnosis"
            ]
        },
        {
            slug: "hepatitis-a",
            title: "Hepatitis A Awareness",
            category: "disease",
            categoryLabel: "Disease",
            description:
                "Understand how hepatitis A can spread through contaminated food or water and why medical assessment matters.",
            image:
                "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Modern hospital healthcare environment",
            tags: [
                "Jaundice",
                "Food and water",
                "Medical care"
            ],
            keywords: [
                "hepatitis",
                "hepatitis a",
                "jaundice",
                "liver",
                "food",
                "water"
            ]
        },
        {
            slug: "dysentery",
            title: "Dysentery and Bloody Diarrhoea",
            category: "disease",
            categoryLabel: "Disease",
            description:
                "Recognise concerning symptoms such as blood in stool and understand why prompt medical care is important.",
            image:
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Healthcare professional discussing medical concerns",
            tags: [
                "Blood in stool",
                "Dehydration",
                "Medical care"
            ],
            keywords: [
                "dysentery",
                "blood",
                "stool",
                "diarrhoea",
                "abdominal pain"
            ]
        },
        {
            slug: "flood-safety",
            title: "Water Safety After Flooding",
            category: "emergency",
            categoryLabel: "Emergency",
            description:
                "Protect drinking-water sources after floods and avoid water that may contain sewage or chemicals.",
            image:
                "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Floodwater surrounding homes and roads",
            tags: [
                "Flooding",
                "Contamination",
                "Emergency"
            ],
            keywords: [
                "flood",
                "flooding",
                "rainfall",
                "sewage",
                "contamination",
                "emergency"
            ]
        },
        {
            slug: "sanitation",
            title: "Household Sanitation",
            category: "hygiene",
            categoryLabel: "Hygiene",
            description:
                "Learn how safe toilets, drainage and waste management protect household and community water sources.",
            image:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Clean household sanitation environment",
            tags: [
                "Sanitation",
                "Waste",
                "Drainage"
            ],
            keywords: [
                "sanitation",
                "toilet",
                "sewage",
                "waste",
                "drainage",
                "cleaning"
            ]
        },
        {
            slug: "food-safety",
            title: "Food and Kitchen Safety",
            category: "hygiene",
            categoryLabel: "Hygiene",
            description:
                "Reduce infection risks by using safe water, separating raw and cooked foods and keeping preparation areas clean.",
            image:
                "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Clean household kitchen and food preparation area",
            tags: [
                "Kitchen",
                "Food",
                "Clean water"
            ],
            keywords: [
                "food",
                "kitchen",
                "cooking",
                "clean",
                "storage",
                "vegetables"
            ]
        },
        {
            slug: "emergency-signs",
            title: "Emergency Warning Signs",
            category: "emergency",
            categoryLabel: "Emergency",
            description:
                "Identify signs of severe dehydration or rapidly worsening illness that require urgent professional care.",
            image:
                "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Emergency medical professionals in a hospital",
            tags: [
                "Urgent care",
                "Dehydration",
                "Warning signs"
            ],
            keywords: [
                "emergency",
                "warning",
                "dehydration",
                "vomiting",
                "confusion",
                "hospital"
            ]
        },
        {
            slug: "community-reporting",
            title: "Responsible Community Reporting",
            category: "emergency",
            categoryLabel: "Community Action",
            description:
                "Learn what information makes a useful community report while protecting privacy and avoiding unverified claims.",
            image:
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=82",
            imageAlt:
                "Community members working together",
            tags: [
                "Reporting",
                "Privacy",
                "Verification"
            ],
            keywords: [
                "community",
                "report",
                "reporting",
                "privacy",
                "location",
                "verification"
            ]
        }
    ];

    const guidanceGrid = document.getElementById(
        "guidanceGrid"
    );

    const searchInput = document.getElementById(
        "awarenessSearch"
    );

    const clearSearchButton = document.getElementById(
        "clearAwarenessSearch"
    );

    const filterButtons = Array.from(
        document.querySelectorAll(
            "[data-guidance-category]"
        )
    );

    const resultCount = document.getElementById(
        "guidanceResultCount"
    );

    const noResults = document.getElementById(
        "guidanceNoResults"
    );

    const resetFiltersButton = document.getElementById(
        "resetGuidanceFilters"
    );

    let activeCategory = "all";
    let searchTerm = "";

    /* =====================================================
       GENERAL HELPERS
       ===================================================== */

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .toLowerCase();
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    /* =====================================================
       GUIDANCE CARD RENDERING
       ===================================================== */

    function topicMatchesSearch(topic) {
        if (!searchTerm) {
            return true;
        }

        const searchableText = [
            topic.title,
            topic.categoryLabel,
            topic.description,
            ...topic.tags,
            ...topic.keywords
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm);
    }

    function topicMatchesCategory(topic) {
        if (activeCategory === "all") {
            return true;
        }

        return topic.category === activeCategory;
    }

    function getFilteredTopics() {
        return guidanceTopics.filter(
            (topic) =>
                topicMatchesCategory(topic) &&
                topicMatchesSearch(topic)
        );
    }

    function createTopicCard(topic) {
        const article = document.createElement("article");

        article.className = "guidance-topic-card";
        article.dataset.category = topic.category;
        article.dataset.topic = topic.slug;

        const tags = topic.tags
            .map(
                (tag) =>
                    `<span>${escapeHTML(tag)}</span>`
            )
            .join("");

        article.innerHTML = `
            <div class="guidance-topic-image">
                <img
                    src="${escapeHTML(topic.image)}"
                    alt="${escapeHTML(topic.imageAlt)}"
                    loading="lazy"
                >

                <span class="guidance-topic-category">
                    ${escapeHTML(topic.categoryLabel)}
                </span>
            </div>

            <div class="guidance-topic-content">
                <h3>${escapeHTML(topic.title)}</h3>

                <p>
                    ${escapeHTML(topic.description)}
                </p>

                <div class="guidance-topic-tags">
                    ${tags}
                </div>

                <a
                    class="guidance-topic-link"
                    href="guidance-details.html?topic=${
                        encodeURIComponent(topic.slug)
                    }"
                >
                    <span>Open Complete Guide</span>
                    <span>→</span>
                </a>
            </div>
        `;

        return article;
    }

    function renderTopics() {
        if (!guidanceGrid) {
            return;
        }

        const filteredTopics = getFilteredTopics();

        guidanceGrid.innerHTML = "";

        filteredTopics.forEach((topic) => {
            guidanceGrid.appendChild(
                createTopicCard(topic)
            );
        });

        if (resultCount) {
            resultCount.textContent =
                String(filteredTopics.length);
        }

        if (noResults) {
            noResults.hidden =
                filteredTopics.length > 0;
        }

        guidanceGrid.hidden =
            filteredTopics.length === 0;
    }

    /* =====================================================
       SEARCH
       ===================================================== */

    function updateSearch() {
        searchTerm = normalizeText(
            searchInput?.value
        );

        if (clearSearchButton) {
            clearSearchButton.hidden =
                searchTerm.length === 0;
        }

        renderTopics();
    }

    searchInput?.addEventListener(
        "input",
        updateSearch
    );

    clearSearchButton?.addEventListener(
        "click",
        () => {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            searchTerm = "";
            clearSearchButton.hidden = true;
            renderTopics();
        }
    );

    /* =====================================================
       CATEGORY FILTERS
       ===================================================== */

    function setActiveCategory(category) {
        activeCategory = category;

        filterButtons.forEach((button) => {
            const isActive =
                button.dataset.guidanceCategory ===
                activeCategory;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderTopics();
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveCategory(
                button.dataset.guidanceCategory ||
                    "all"
            );
        });
    });

    function resetFilters() {
        activeCategory = "all";
        searchTerm = "";

        if (searchInput) {
            searchInput.value = "";
        }

        if (clearSearchButton) {
            clearSearchButton.hidden = true;
        }

        setActiveCategory("all");
    }

    resetFiltersButton?.addEventListener(
        "click",
        resetFilters
    );

    /* =====================================================
       HOUSEHOLD SAFETY CHECKLIST
       ===================================================== */

    const safetyChecklist = document.getElementById(
        "safetyChecklist"
    );

    const checklistInputs = Array.from(
        safetyChecklist?.querySelectorAll(
            'input[type="checkbox"]'
        ) || []
    );

    const checklistProgressText =
        document.getElementById(
            "checklistProgressText"
        );

    const checklistPercentage =
        document.getElementById(
            "checklistPercentage"
        );

    const checklistProgressBar =
        document.getElementById(
            "checklistProgressBar"
        );

    const resetChecklistButton =
        document.getElementById(
            "resetSafetyChecklist"
        );

    function readChecklist() {
        try {
            const savedChecklist =
                window.localStorage.getItem(
                    CHECKLIST_KEY
                );

            if (!savedChecklist) {
                return [];
            }

            const parsedChecklist =
                JSON.parse(savedChecklist);

            return Array.isArray(parsedChecklist)
                ? parsedChecklist
                : [];
        } catch (error) {
            console.warn(
                "Safety checklist could not be read:",
                error
            );

            return [];
        }
    }

    function saveChecklist(completedItems) {
        try {
            window.localStorage.setItem(
                CHECKLIST_KEY,
                JSON.stringify(completedItems)
            );
        } catch (error) {
            console.warn(
                "Safety checklist could not be saved:",
                error
            );
        }
    }

    function getCompletedChecklistItems() {
        return checklistInputs
            .filter((input) => input.checked)
            .map((input) => input.value);
    }

    function updateChecklistProgress(
        shouldSave = true
    ) {
        const completedItems =
            getCompletedChecklistItems();

        const totalItems =
            checklistInputs.length;

        const completedCount =
            completedItems.length;

        const percentage =
            totalItems > 0
                ? Math.round(
                    (completedCount / totalItems) *
                        100
                )
                : 0;

        if (checklistProgressText) {
            checklistProgressText.textContent =
                `${completedCount} of ${totalItems} ` +
                `${totalItems === 1 ? "action" : "actions"} ` +
                "complete";
        }

        if (checklistPercentage) {
            checklistPercentage.textContent =
                `${percentage}%`;
        }

        if (checklistProgressBar) {
            checklistProgressBar.style.width =
                `${percentage}%`;
        }

        if (shouldSave) {
            saveChecklist(completedItems);
        }
    }

    function restoreChecklist() {
        const completedItems =
            readChecklist();

        checklistInputs.forEach((input) => {
            input.checked =
                completedItems.includes(
                    input.value
                );
        });

        updateChecklistProgress(false);
    }

    checklistInputs.forEach((input) => {
        input.addEventListener(
            "change",
            () => {
                updateChecklistProgress(true);
            }
        );
    });

    resetChecklistButton?.addEventListener(
        "click",
        () => {
            const completedItems =
                getCompletedChecklistItems();

            if (completedItems.length === 0) {
                return;
            }

            const confirmed = window.confirm(
                "Reset every item in the household safety checklist?"
            );

            if (!confirmed) {
                return;
            }

            checklistInputs.forEach((input) => {
                input.checked = false;
            });

            window.localStorage.removeItem(
                CHECKLIST_KEY
            );

            updateChecklistProgress(false);
        }
    );

    /* =====================================================
       INITIALISE
       ===================================================== */

    setActiveCategory("all");
    restoreChecklist();

    console.log(
        "AquaSentinel awareness centre loaded:",
        `${guidanceTopics.length} guidance topics`
    );
});