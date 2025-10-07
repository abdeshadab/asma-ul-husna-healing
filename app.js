// App State
let currentPage = 'home';
let favorites = JSON.parse(localStorage.getItem('asma-favorites') || '[]');
let meditationTimer = null;
let meditationStartTime = 0;
let meditationElapsed = 0;
let isMediating = false;
let audioContext = null;
let audioSource = null;
let gainNode = null;
let currentAudioType = 'none';

// Name recitation state
let nameAudio = null;
let currentNameId = null;
let nameRepeatMode = false;
let isNamePlaying = false;

// Initialize app - Simplified
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    console.log('asmaUlHusna available:', typeof asmaUlHusna !== 'undefined');
    console.log('asmaUlHusna length:', typeof asmaUlHusna !== 'undefined' ? asmaUlHusna.length : 'undefined');
    
    initializeTheme();
    updateFavoritesCount();
    initializeAudio();
    initializeNameRecitation();
    initializeAppleStyleInteractions();
    initializeStyleSelector();
    
    // Add modal close functionality
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            hideFavorites();
        }
    });
    
    // Add scroll-to-top functionality
    addScrollToTop();
});

// New Navigation Functions
function showHealingSearch() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.innerHTML = `
        <div class="healing-search-container">
            <div class="page-header">
                <div class="page-title">
                    <h2>🌿 Find Your Healing</h2>
                    <p>Tell us what you need healing for and we'll find the perfect names</p>
                </div>
            </div>
            
            <div class="healing-search-box">
                <input type="text" id="healing-search-input" placeholder="What do you need healing for? (e.g., anxiety, depression, anger, fear...)" class="healing-search-input">
                <button class="healing-search-btn" onclick="searchByHealing()">
                    <span>🔍</span>
                    <span>Find Healing Names</span>
                </button>
            </div>
            
            <div class="healing-categories">
                <h3>Quick Categories</h3>
                <div class="category-buttons">
                    <button class="category-btn" onclick="searchHealingCategory('anxiety')">😰 Anxiety & Fear</button>
                    <button class="category-btn" onclick="searchHealingCategory('depression')">😔 Depression & Sadness</button>
                    <button class="category-btn" onclick="searchHealingCategory('anger')">😡 Anger & Rage</button>
                    <button class="category-btn" onclick="searchHealingCategory('guilt')">😞 Guilt & Shame</button>
                    <button class="category-btn" onclick="searchHealingCategory('confusion')">🤔 Confusion & Doubt</button>
                    <button class="category-btn" onclick="searchHealingCategory('loneliness')">😢 Loneliness & Isolation</button>
                    <button class="category-btn" onclick="searchHealingCategory('pride')">😤 Pride & Arrogance</button>
                    <button class="category-btn" onclick="searchHealingCategory('weakness')">😩 Weakness & Powerlessness</button>
                    <button class="category-btn" onclick="searchHealingCategory('spiritual')">🙏 Spiritual Emptiness</button>
                    <button class="category-btn" onclick="searchHealingCategory('relationships')">💔 Relationship Issues</button>
                    <button class="category-btn" onclick="searchHealingCategory('financial')">💰 Financial Worries</button>
                    <button class="category-btn" onclick="searchHealingCategory('health')">🏥 Health Concerns</button>
                </div>
            </div>
            
            <div class="healing-results" id="healing-results">
                <!-- Results will be populated by JavaScript -->
            </div>
        </div>
    `;
    
    showContentArea();
    scrollToTop();
}

function showHealingJourney() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.innerHTML = `
        <div class="healing-journey-container">
            <div class="page-header">
                <div class="page-title">
                    <h2>🌙 Your Complete Healing Journey</h2>
                    <p>A holistic approach to wellness through Allah's names and Islamic self-care practices</p>
                </div>
            </div>
            
            <!-- Navigation breadcrumb -->
            <div class="journey-breadcrumb" id="journey-breadcrumb">
                <button class="breadcrumb-item active" onclick="showJourneyStep('needs')">
                    <span class="breadcrumb-number">1</span>
                    <span>Select Need</span>
                </button>
                <span class="breadcrumb-arrow">→</span>
                <button class="breadcrumb-item disabled" onclick="showJourneyStep('names')">
                    <span class="breadcrumb-number">2</span>
                    <span>Healing Names</span>
                </button>
                <span class="breadcrumb-arrow">→</span>
                <button class="breadcrumb-item disabled" onclick="showJourneyStep('selfcare')">
                    <span class="breadcrumb-number">3</span>
                    <span>Self-Care</span>
                </button>
                <span class="breadcrumb-arrow">→</span>
                <button class="breadcrumb-item disabled" onclick="showJourneyStep('routine')">
                    <span class="breadcrumb-number">4</span>
                    <span>Daily Routine</span>
                </button>
            </div>
            
            <!-- Step 1: Need Selection -->
            <div class="journey-content" id="journey-content">
                <div class="journey-section active" id="needs-section">
                    <div class="section-header">
                        <h3>What do you need healing for?</h3>
                        <p>Choose from common needs or describe your specific situation</p>
                    </div>
                    
                    <div class="needs-list">
                        <div class="need-item" onclick="selectNeedFromList('anxiety', 'Anxiety & Fear', '😰')">
                            <div class="need-emoji">😰</div>
                            <div class="need-info">
                                <h4>Anxiety & Fear</h4>
                                <p>Feeling worried, nervous, or afraid about the future</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item" onclick="selectNeedFromList('depression', 'Sadness & Depression', '😔')">
                            <div class="need-emoji">😔</div>
                            <div class="need-info">
                                <h4>Sadness & Depression</h4>
                                <p>Feeling down, hopeless, or emotionally heavy</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item" onclick="selectNeedFromList('anger', 'Anger & Rage', '😡')">
                            <div class="need-emoji">😡</div>
                            <div class="need-info">
                                <h4>Anger & Rage</h4>
                                <p>Struggling with anger, irritation, or resentment</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item" onclick="selectNeedFromList('spiritual', 'Spiritual Emptiness', '🙏')">
                            <div class="need-emoji">🙏</div>
                            <div class="need-info">
                                <h4>Spiritual Emptiness</h4>
                                <p>Feeling disconnected from Allah or lacking faith</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item" onclick="selectNeedFromList('stress', 'Stress & Overwhelm', '😩')">
                            <div class="need-emoji">😩</div>
                            <div class="need-info">
                                <h4>Stress & Overwhelm</h4>
                                <p>Feeling overwhelmed by life's pressures and responsibilities</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item" onclick="selectNeedFromList('relationships', 'Relationship Issues', '💔')">
                            <div class="need-emoji">💔</div>
                            <div class="need-info">
                                <h4>Relationship Issues</h4>
                                <p>Problems with family, friends, or marriage</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                        
                        <div class="need-item custom" onclick="showCustomNeedInput()">
                            <div class="need-emoji">✏️</div>
                            <div class="need-info">
                                <h4>Something Else</h4>
                                <p>Describe your specific healing need</p>
                            </div>
                            <div class="need-arrow">→</div>
                        </div>
                    </div>
                    
                    <div class="custom-input-section hidden" id="custom-input-section">
                        <div class="custom-input-container">
                            <h4>Tell us what you need healing for:</h4>
                            <input type="text" id="custom-healing-input" placeholder="e.g., loneliness, guilt, financial worries..." class="custom-input">
                            <div class="custom-input-actions">
                                <button class="custom-submit-btn" onclick="submitCustomNeed()">Continue →</button>
                                <button class="custom-cancel-btn" onclick="hideCustomNeedInput()">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Step 2: Healing Names (Hidden initially) -->
                <div class="journey-section hidden" id="names-section">
                    <div class="section-header">
                        <button class="back-btn" onclick="showJourneyStep('needs')">← Back to Needs</button>
                        <h3>Healing Names for <span id="selected-need-title"></span></h3>
                        <p>These names of Allah can provide healing for your specific need</p>
                    </div>
                    
                    <div class="names-list" id="healing-names-list">
                        <!-- Names will be populated here -->
                    </div>
                    
                    <div class="section-actions">
                        <button class="continue-btn" onclick="showJourneyStep('selfcare')">Continue to Self-Care →</button>
                    </div>
                </div>
                
                <!-- Step 3: Self-Care (Hidden initially) -->
                <div class="journey-section hidden" id="selfcare-section">
                    <div class="section-header">
                        <button class="back-btn" onclick="showJourneyStep('names')">← Back to Names</button>
                        <h3>Islamic Self-Care for <span id="selfcare-need-title"></span></h3>
                        <p>Complement your spiritual healing with these prophetic practices</p>
                    </div>
                    
                    <div class="selfcare-list" id="selfcare-practices-list">
                        <!-- Self-care practices will be populated here -->
                    </div>
                    
                    <div class="section-actions">
                        <button class="continue-btn" onclick="showJourneyStep('routine')">Create Daily Routine →</button>
                    </div>
                </div>
                
                <!-- Step 4: Daily Routine (Hidden initially) -->
                <div class="journey-section hidden" id="routine-section">
                    <div class="section-header">
                        <button class="back-btn" onclick="showJourneyStep('selfcare')">← Back to Self-Care</button>
                        <h3>Your Personalized Daily Routine</h3>
                        <p>A complete healing plan combining names and self-care</p>
                    </div>
                    
                    <div class="routine-list" id="daily-routine-list">
                        <!-- Routine will be populated here -->
                    </div>
                    
                    <div class="journey-completion">
                        <div class="completion-card">
                            <h4>🌟 Your Healing Journey is Ready!</h4>
                            <p>Start implementing this routine today and trust in Allah's healing power.</p>
                            <div class="completion-actions">
                                <button class="action-btn primary" onclick="saveHealingPlan()">
                                    💾 Save My Healing Plan
                                </button>
                                <button class="action-btn secondary" onclick="showDuas()">
                                    🤲 View Healing Duas
                                </button>
                                <button class="restart-btn" onclick="showHealingJourney()">
                                    🔄 Start New Journey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showContentArea();
    // Don't scroll to top to avoid jumpiness
}

let journeyState = {
    currentStep: 'needs',
    selectedNeed: '',
    selectedNeedLabel: '',
    selectedNeedEmoji: '',
    healingNames: [],
    selfCarePractices: []
};

function selectNeedFromList(needType, needLabel, emoji) {
    journeyState.selectedNeed = needType;
    journeyState.selectedNeedLabel = needLabel;
    journeyState.selectedNeedEmoji = emoji;
    
    // Find healing names
    const healingResults = findHealingNames(needType);
    journeyState.healingNames = healingResults.slice(0, 3);
    
    // Show names step
    showJourneyStep('names');
}

function showCustomNeedInput() {
    document.getElementById('custom-input-section').classList.remove('hidden');
    document.getElementById('custom-healing-input').focus();
}

function hideCustomNeedInput() {
    document.getElementById('custom-input-section').classList.add('hidden');
    document.getElementById('custom-healing-input').value = '';
}

function submitCustomNeed() {
    const customNeed = document.getElementById('custom-healing-input').value.trim();
    if (!customNeed) {
        alert('Please enter what you need healing for');
        return;
    }
    
    selectNeedFromList(customNeed, customNeed, '🤲');
}

function showJourneyStep(stepName) {
    // Update current step
    journeyState.currentStep = stepName;
    
    // Hide all sections
    document.querySelectorAll('.journey-section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${stepName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        
        // Populate content based on step
        if (stepName === 'names') {
            populateHealingNamesList();
            updateBreadcrumb(['needs', 'names']);
        } else if (stepName === 'selfcare') {
            populateSelfCareList(); 
            updateBreadcrumb(['needs', 'names', 'selfcare']);
        } else if (stepName === 'routine') {
            populateRoutineList();
            updateBreadcrumb(['needs', 'names', 'selfcare', 'routine']);
        } else if (stepName === 'needs') {
            updateBreadcrumb(['needs']);
        }
    }
}

function updateBreadcrumb(activeSteps) {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    const stepMapping = {
        'needs': 0,
        'names': 1, 
        'selfcare': 2,
        'routine': 3
    };
    
    breadcrumbItems.forEach((item, index) => {
        const stepNames = ['needs', 'names', 'selfcare', 'routine'];
        const stepName = stepNames[index];
        
        item.classList.remove('active', 'completed', 'disabled');
        
        if (activeSteps.includes(stepName)) {
            if (stepName === journeyState.currentStep) {
                item.classList.add('active');
            } else {
                item.classList.add('completed');
            }
        } else {
            item.classList.add('disabled');
        }
    });
}

function populateHealingNamesList() {
    const container = document.getElementById('healing-names-list');
    const needTitle = document.getElementById('selected-need-title');
    
    needTitle.textContent = journeyState.selectedNeedLabel;
    
    if (journeyState.healingNames.length === 0) {
        container.innerHTML = `
            <div class="no-results-message">
                <h4>🌿 General Healing Names</h4>
                <p>While we couldn't find specific matches, these powerful names can bring comfort to any situation:</p>
            </div>
            <div class="name-item" onclick="showNameDetail(1)">
                <div class="name-main">
                    <div class="name-arabic">الرَّحْمَنُ</div>
                    <div class="name-transliteration">Ar-Rahman</div>
                    <div class="name-meaning">The Compassionate</div>
                </div>
                <div class="name-actions">
                    <button class="add-name-btn" onclick="event.stopPropagation(); addToFavorites(1)">❤️</button>
                </div>
            </div>
            <div class="name-item" onclick="showNameDetail(14)">
                <div class="name-main">
                    <div class="name-arabic">الْغَفُورُ</div>
                    <div class="name-transliteration">Al-Ghafur</div>
                    <div class="name-meaning">The Forgiving</div>
                </div>
                <div class="name-actions">
                    <button class="add-name-btn" onclick="event.stopPropagation(); addToFavorites(14)">❤️</button>
                </div>
            </div>
            <div class="name-item" onclick="showNameDetail(85)">
                <div class="name-main">
                    <div class="name-arabic">الصَّبُورُ</div>
                    <div class="name-transliteration">As-Sabur</div>
                    <div class="name-meaning">The Patient</div>
                </div>
                <div class="name-actions">
                    <button class="add-name-btn" onclick="event.stopPropagation(); addToFavorites(85)">❤️</button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = journeyState.healingNames.map(result => `
        <div class="name-item" onclick="showNameDetail(${result.name.id})">
            <div class="match-indicator">${Math.min(Math.round((result.score / 10) * 100), 100)}% match</div>
            <div class="name-main">
                <div class="name-arabic">${result.name.arabic}</div>
                <div class="name-transliteration">${result.name.transliteration}</div>
                <div class="name-meaning">${result.name.meaning}</div>
                ${result.name.healingProperties ? `
                    <div class="healing-note">
                        <strong>Healing:</strong> ${result.name.healingProperties}
                    </div>
                ` : ''}
            </div>
            <div class="name-actions">
                <button class="add-name-btn ${favorites.includes(result.name.id) ? 'active' : ''}" 
                        onclick="event.stopPropagation(); addToFavorites(${result.name.id})">
                    ${favorites.includes(result.name.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    `).join('');
}

function populateSelfCareList() {
    const container = document.getElementById('selfcare-practices-list');
    const needTitle = document.getElementById('selfcare-need-title');
    
    needTitle.textContent = journeyState.selectedNeedLabel;
    
    const selfCareMapping = {
        'anxiety': {
            spiritual: ['Regular dhikr and remembrance of Allah', 'Recite Ayat al-Kursi for protection', 'Practice istighfar to calm the heart'],
            physical: ['Deep breathing exercises', 'Gentle walking in nature', 'Herbal teas like chamomile'],
            mental: ['Trust in Allah (Tawakkul)', 'Remember that Allah tests those He loves', 'Focus on present moment, not future worries']
        },
        'depression': {
            spiritual: ['Increase salah frequency', 'Read Quran daily for spiritual nourishment', 'Make dua during difficult times'],
            physical: ['Maintain regular sleep schedule', 'Get sunlight exposure', 'Eat nutritious, halal foods'],
            mental: ['Practice gratitude for Allah\'s blessings', 'Seek knowledge to engage the mind', 'Connect with righteous community']
        },
        'anger': {
            spiritual: ['Seek refuge in Allah from Shaytan', 'Practice patience (sabr)', 'Remember Allah\'s mercy and forgiveness'],
            physical: ['Perform wudu to cool down', 'Change positions (sit if standing)', 'Take slow, deep breaths'],
            mental: ['Count to 10 before responding', 'Think of consequences before acting', 'Remember Prophet\'s ﷺ gentleness']
        },
        'spiritual': {
            spiritual: ['Return to five daily prayers', 'Increase Quran recitation', 'Attend mosque regularly'],
            physical: ['Purify body through proper hygiene', 'Fast voluntarily to purify soul', 'Eat halal and pure foods'],
            mental: ['Seek Islamic knowledge', 'Reflect on death and afterlife', 'Surround yourself with righteous company']
        }
    };
    
    const practices = selfCareMapping[journeyState.selectedNeed] || {
        spiritual: ['Regular dhikr and prayer', 'Quran recitation', 'Seeking Allah\'s guidance'],
        physical: ['Balanced diet', 'Regular exercise', 'Proper sleep'],
        mental: ['Positive thinking', 'Gratitude practice', 'Mindfulness']
    };
    
    journeyState.selfCarePractices = practices;
    
    container.innerHTML = `
        <div class="practice-category">
            <div class="category-header">
                <div class="category-icon">🤲</div>
                <h4>Spiritual Practices</h4>
            </div>
            <div class="practice-list">
                ${practices.spiritual.map(practice => `
                    <div class="practice-item">
                        <div class="practice-text">${practice}</div>
                        <button class="practice-check" onclick="togglePractice(this)">✓</button>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="practice-category">
            <div class="category-header">
                <div class="category-icon">🌱</div>
                <h4>Physical Care</h4>
            </div>
            <div class="practice-list">
                ${practices.physical.map(practice => `
                    <div class="practice-item">
                        <div class="practice-text">${practice}</div>
                        <button class="practice-check" onclick="togglePractice(this)">✓</button>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="practice-category">
            <div class="category-header">
                <div class="category-icon">🧘‍♂️</div>
                <h4>Mental & Emotional</h4>
            </div>
            <div class="practice-list">
                ${practices.mental.map(practice => `
                    <div class="practice-item">
                        <div class="practice-text">${practice}</div>
                        <button class="practice-check" onclick="togglePractice(this)">✓</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function togglePractice(button) {
    const practiceItem = button.parentElement;
    practiceItem.classList.toggle('selected');
    
    if (practiceItem.classList.contains('selected')) {
        button.style.background = 'var(--islamic-green)';
        button.style.color = 'white';
    } else {
        button.style.background = '';
        button.style.color = '';
    }
}

function populateRoutineList() {
    const container = document.getElementById('daily-routine-list');
    
    const routineActivities = {
        'anxiety': {
            fajr: 'Fajr prayer + recite Ar-Rahman 33 times + gratitude reflection',
            morning: 'Healthy breakfast + light exercise + read Quran',
            midday: 'Zuhr prayer + dhikr break + mindful eating',
            afternoon: 'Asr prayer + nature walk + practice tawakkul',
            evening: 'Maghrib prayer + family time + recite Al-Mu\'min',
            night: 'Isha prayer + istighfar + prepare for peaceful sleep'
        },
        'depression': {
            fajr: 'Fajr prayer + recite An-Nur 33 times + morning gratitude',
            morning: 'Nutritious breakfast + sunlight + Quran study',
            midday: 'Zuhr prayer + community connection + balanced meal',
            afternoon: 'Asr prayer + productive activity + recite Ar-Rahman',
            evening: 'Maghrib prayer + family support + evening reflection',
            night: 'Isha prayer + read uplifting Islamic content + early sleep'
        }
    };
    
    const routine = routineActivities[journeyState.selectedNeed] || {
        fajr: 'Fajr prayer + morning dhikr + reflection',
        morning: 'Healthy breakfast + Quran reading + productive work',
        midday: 'Zuhr prayer + mindful break + balanced meal',
        afternoon: 'Asr prayer + family time + light exercise',
        evening: 'Maghrib prayer + dinner + evening dhikr',
        night: 'Isha prayer + light reading + early sleep preparation'
    };
    
    container.innerHTML = `
        <div class="routine-summary-card">
            <h4>📋 Your Healing Focus</h4>
            <div class="summary-details">
                <p><strong>Need:</strong> ${journeyState.selectedNeedLabel}</p>
                <p><strong>Healing Names:</strong> ${journeyState.healingNames.map(r => r.name.transliteration).join(', ')}</p>
                <p><strong>Daily Goal:</strong> Recite healing names 33 times after Fajr and Maghrib</p>
            </div>
        </div>
        
        <div class="routine-schedule">
            <div class="routine-time-item">
                <div class="time-icon">🌅</div>
                <div class="time-info">
                    <div class="time-label">Fajr</div>
                    <div class="time-activity">${routine.fajr}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
            
            <div class="routine-time-item">
                <div class="time-icon">🌄</div>
                <div class="time-info">
                    <div class="time-label">Morning</div>
                    <div class="time-activity">${routine.morning}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
            
            <div class="routine-time-item">
                <div class="time-icon">☀️</div>
                <div class="time-info">
                    <div class="time-label">Midday</div>
                    <div class="time-activity">${routine.midday}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
            
            <div class="routine-time-item">
                <div class="time-icon">🌤️</div>
                <div class="time-info">
                    <div class="time-label">Afternoon</div>
                    <div class="time-activity">${routine.afternoon}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
            
            <div class="routine-time-item">
                <div class="time-icon">🌆</div>
                <div class="time-info">
                    <div class="time-label">Evening</div>
                    <div class="time-activity">${routine.evening}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
            
            <div class="routine-time-item">
                <div class="time-icon">🌙</div>
                <div class="time-info">
                    <div class="time-label">Night</div>
                    <div class="time-activity">${routine.night}</div>
                </div>
                <button class="routine-check" onclick="toggleRoutineItem(this)">✓</button>
            </div>
        </div>
    `;
}

function toggleRoutineItem(button) {
    const routineItem = button.parentElement;
    routineItem.classList.toggle('completed');
    
    if (routineItem.classList.contains('completed')) {
        button.style.background = 'var(--islamic-green)';
        button.style.color = 'white';
        button.textContent = '✓';
    } else {
        button.style.background = '';
        button.style.color = '';
        button.textContent = '✓';
    }
}

function addToFavorites(nameId) {
    if (!favorites.includes(nameId)) {
        toggleFavorite(nameId);
    }
    
    // Update button appearance
    const button = event.target;
    button.textContent = '❤️';
    button.classList.add('active');
    
    // Show feedback
    if (window.showFloatingNotification) {
        showFloatingNotification('Added to favorites!', 'success');
    }
}

function saveHealingPlan() {
    // Save all healing names to favorites
    journeyState.healingNames.forEach(result => {
        if (!favorites.includes(result.name.id)) {
            toggleFavorite(result.name.id);
        }
    });
    
    // Show success message
    if (window.showFloatingNotification) {
        showFloatingNotification('Your healing plan has been saved!', 'success');
    }
    
    // Update favorites count
    updateFavoritesCount();
}

function showAllNames() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.innerHTML = `
        <div class="names-browser-container">
            <div class="page-header">
                <div class="page-title">
                    <h2>📜 The 99 Healing Names</h2>
                    <p>Explore Allah's names with their healing properties and spiritual guidance</p>
                </div>
            </div>

            <!-- Enhanced Search -->
            <div class="search-section">
                <div class="search-container enhanced">
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="Search by name, meaning, or healing properties..." class="search-input">
                        <button class="search-btn" onclick="performAdvancedSearch()">
                            <span>🔍</span>
                        </button>
                    </div>
                    
                    <div class="search-filters">
                        <div class="filter-group">
                            <label>Sort by:</label>
                            <select id="sort-select" class="filter-select">
                                <option value="id">Order (1-99)</option>
                                <option value="arabic">Arabic (A-Z)</option>
                                <option value="transliteration">English (A-Z)</option>
                                <option value="enhanced">Enhanced First</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Category:</label>
                            <select id="category-filter" class="filter-select">
                                <option value="all">All Names</option>
                                <option value="enhanced">Enhanced Only</option>
                                <option value="mercy">Mercy & Compassion</option>
                                <option value="power">Power & Strength</option>
                                <option value="knowledge">Knowledge & Wisdom</option>
                                <option value="forgiveness">Forgiveness</option>
                                <option value="guidance">Guidance</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>View:</label>
                            <div class="view-toggle">
                                <button class="view-btn active" data-view="grid">⊞</button>
                                <button class="view-btn" data-view="list">☰</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="names-container">
                <div class="names-grid" id="names-grid">
                    <!-- Names will be populated by JavaScript -->
                </div>
            </div>
        </div>
    `;
    
    showContentArea();
    populateNamesList();
    scrollToTop();
}

function showDuas() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.innerHTML = `
        <div class="duas-browser-container">
            <div class="page-header">
                <div class="page-title">
                    <h2>🤲 Healing Duas & Supplications</h2>
                    <p>Powerful healing prayers incorporating Allah's beautiful names for restoration and peace</p>
                </div>
            </div>

            <div class="duas-container" id="duas-container">
                <div class="duas-collection">
                    <div class="dua-card featured">
                        <div class="dua-category">Complete Healing Prayer</div>
                        <div class="dua-content">
                            <p class="dua-arabic">اللَّهُمَّ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمَاً</p>
                            <p class="dua-translation">"O Allah, You are The Healer, there is no healing except Your healing, a healing that leaves no illness."</p>
                        </div>
                        <div class="dua-names">
                            <span class="name-tag">Ash-Shafi (The Healer)</span>
                            <span class="name-tag">Ar-Rahman (The Compassionate)</span>
                        </div>
                    </div>
                    
                    <div class="dua-card">
                        <div class="dua-category">For Inner Peace</div>
                        <div class="dua-content">
                            <p class="dua-arabic">اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، بَارَكْتَ رَبَّنَا ذَا الْجَلَالِ وَالْإِكْرَامِ</p>
                            <p class="dua-translation">"O Allah, You are Peace and from You comes peace. Blessed are You, our Lord, Owner of Majesty and Honor."</p>
                        </div>
                        <div class="dua-names">
                            <span class="name-tag">As-Salaam (The Peace)</span>
                            <span class="name-tag">Al-Barr (The Beneficent)</span>
                        </div>
                    </div>
                    
                    <div class="dua-card">
                        <div class="dua-category">For Forgiveness & Healing</div>
                        <div class="dua-content">
                            <p class="dua-arabic">رَبِّ اغْفِرْ لِي ذَنْبِي وَخَطَئِي وَجَهْلِي، وَأَنْتَ خَيْرُ الْغَافِرِينَ</p>
                            <p class="dua-translation">"My Lord, forgive me my sin, my error, and my ignorance, for You are the best of forgivers."</p>
                        </div>
                        <div class="dua-names">
                            <span class="name-tag">Al-Ghafur (The Forgiving)</span>
                            <span class="name-tag">At-Tawwab (The Accepter of Repentance)</span>
                        </div>
                    </div>

                    <div class="dua-card">
                        <div class="dua-category">For Guidance & Light</div>
                        <div class="dua-content">
                            <p class="dua-arabic">اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ</p>
                            <p class="dua-translation">"O Allah, guide me among those You have guided, and heal me among those You have healed."</p>
                        </div>
                        <div class="dua-names">
                            <span class="name-tag">Al-Hadi (The Guide)</span>
                            <span class="name-tag">Al-Mu'afi (The Healer)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showContentArea();
    scrollToTop();
}

// Utility Functions
function showContentArea() {
    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('hidden');
    contentArea.classList.add('visible');
}

function hideContentArea() {
    const contentArea = document.getElementById('content-area');
    contentArea.classList.add('hidden');
    contentArea.classList.remove('visible');
}

function toggleFavorites() {
    const sidebar = document.getElementById('favorites-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('visible')) {
        hideFavorites();
    } else {
        showFavorites();
    }
}

function showFavorites() {
    const sidebar = document.getElementById('favorites-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const content = document.getElementById('favorites-content');
    
    // Update favorites content
    if (favorites.length === 0) {
        content.innerHTML = '<p class="empty-state">No healing names saved yet. Add names to your healing collection by clicking the heart icon.</p>';
    } else {
        content.innerHTML = favorites.map(id => {
            const name = asmaUlHusna.find(n => n.id === id);
            return `
                <div class="sidebar-name-card" onclick="showNameDetail(${name.id})">
                    <div class="sidebar-name-number">${name.id}</div>
                    <div class="sidebar-name-info">
                        <div class="sidebar-name-arabic">${name.arabic}</div>
                        <div class="sidebar-name-transliteration">${name.transliteration}</div>
                        <div class="sidebar-name-meaning">${name.meaning}</div>
                    </div>
                    <button class="remove-favorite" onclick="event.stopPropagation(); toggleFavorite(${name.id})">×</button>
                </div>
            `;
        }).join('');
    }
    
    sidebar.classList.add('visible');
    overlay.classList.add('visible');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideFavorites() {
    const sidebar = document.getElementById('favorites-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('visible');
    overlay.classList.remove('visible');
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function updateFavoritesCount() {
    const count = favorites.length;
    const countDisplay = document.getElementById('header-favorites-count');
    if (countDisplay) {
        countDisplay.textContent = count;
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addScrollToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.onclick = scrollToTop;
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Override the original showPage function
function showPage(pageName) {
    // For compatibility with old code
    if (pageName === 'names') {
        showAllNames();
    } else if (pageName === 'healing') {
        showHealingSearch();
    } else if (pageName === 'duas') {
        showDuas();
    } else if (pageName === 'selfcare') {
        showIslamicSelfCare();
    } else if (pageName === 'favorites') {
        showFavorites();
    }
}

// Override navigation setup
function setupNavigation() {
    // No longer needed with simplified structure
}

// Update toggle favorite to refresh count
const originalToggleFavorite = toggleFavorite;
function toggleFavorite(id) {
    originalToggleFavorite(id);
    updateFavoritesCount();
    
    // Update sidebar if open
    const sidebar = document.getElementById('favorites-sidebar');
    if (sidebar.classList.contains('visible')) {
        showFavorites();
    }
}

// Names List
function populateNamesList() {
    console.log('populateNamesList called');
    const grid = document.getElementById('names-grid');
    console.log('Grid element found:', !!grid);
    
    if (!grid) {
        console.error('names-grid element not found');
        return;
    }
    
    if (typeof asmaUlHusna === 'undefined') {
        console.error('asmaUlHusna data not available');
        grid.innerHTML = '<p style="text-align: center; color: red;">Error: Names data not loaded</p>';
        return;
    }
    
    console.log('Creating cards for', asmaUlHusna.length, 'names');
    grid.innerHTML = '';
    
    asmaUlHusna.forEach((name, index) => {
        console.log('Creating card for name', index + 1, name.transliteration);
        const nameCard = createNameCard(name);
        grid.appendChild(nameCard);
    });
    
    console.log('Cards created, setting up search');
    setupSearch();
}

function createNameCard(name) {
    const card = document.createElement('div');
    card.className = 'name-card';
    card.innerHTML = `
        <div class="name-number">${name.id}</div>
        <div class="name-arabic">${name.arabic}</div>
        <div class="name-transliteration">${name.transliteration}</div>
        <div class="name-meaning">${name.meaning}</div>
        <div class="card-actions">
            <button class="favorite-btn ${favorites.includes(name.id) ? 'active' : ''}" 
                    onclick="toggleFavorite(${name.id})">
                ❤️
            </button>
            <button class="detail-btn" onclick="showNameDetail(${name.id})">
                View Details
            </button>
            <button class="meditate-btn" onclick="startMeditationSession(${name.id})">
                🧘‍♂️ Meditate
            </button>
        </div>
    `;
    return card;
}

// Enhanced Search and Filter
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoryFilter = document.getElementById('category-filter');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (searchInput) searchInput.addEventListener('input', performAdvancedSearch);
    if (sortSelect) sortSelect.addEventListener('change', performAdvancedSearch);
    if (categoryFilter) categoryFilter.addEventListener('change', performAdvancedSearch);
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active view button
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            toggleView(view);
        });
    });
}

// Enhanced search function
function performAdvancedSearch() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!searchInput || !sortSelect || !categoryFilter) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const sortBy = sortSelect.value;
    const category = categoryFilter.value;
    
    let filteredNames = [...asmaUlHusna];
    
    // Apply search filter
    if (query) {
        filteredNames = filteredNames.filter(name => {
            const searchText = `${name.arabic} ${name.transliteration} ${name.meaning} ${name.description || ''} ${name.healingProperties || ''}`.toLowerCase();
            return searchText.includes(query);
        });
    }
    
    // Apply category filter
    if (category !== 'all') {
        filteredNames = filteredNames.filter(name => {
            switch(category) {
                case 'enhanced':
                    return name.healingProperties || name.deeperMeaning || name.meditationPractice;
                case 'mercy':
                    return ['Ar-Rahman', 'Ar-Raheem', 'Al-Ghafur', 'Al-Ghaffar', 'Al-Halim', 'As-Sabur', 'Al-Wadud'].includes(name.transliteration);
                case 'power':
                    return ['Al-Aziz', 'Al-Qawi', 'Al-Matin', 'Al-Qadir', 'Al-Muqtadir', 'Al-Malik', 'Al-Hakam'].includes(name.transliteration);
                case 'knowledge':
                    return ['Al-Aleem', 'Al-Hakim', 'Al-Khabir', 'Ar-Rashid', 'Al-Hadi', 'An-Nur'].includes(name.transliteration);
                case 'forgiveness':
                    return ['Al-Ghafur', 'Al-Ghaffar', 'At-Tawwab', 'Al-Afuww', 'As-Sattir'].includes(name.transliteration);
                case 'guidance':
                    return ['Al-Hadi', 'An-Nur', 'Ar-Rashid', 'Al-Hakim', 'Al-Aleem'].includes(name.transliteration);
                default:
                    return true;
            }
        });
    }
    
    // Apply sorting
    filteredNames.sort((a, b) => {
        switch(sortBy) {
            case 'arabic':
                return a.arabic.localeCompare(b.arabic);
            case 'transliteration':
                return a.transliteration.localeCompare(b.transliteration);
            case 'enhanced':
                const aEnhanced = (a.healingProperties ? 1 : 0) + (a.deeperMeaning ? 1 : 0) + (a.meditationPractice ? 1 : 0);
                const bEnhanced = (b.healingProperties ? 1 : 0) + (b.deeperMeaning ? 1 : 0) + (b.meditationPractice ? 1 : 0);
                return bEnhanced - aEnhanced || a.id - b.id;
            default:
                return a.id - b.id;
        }
    });
    
    // Update the display
    updateNamesDisplay(filteredNames);
}

function updateNamesDisplay(names) {
    const grid = document.getElementById('names-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (names.length === 0) {
        grid.innerHTML = '<div class="no-results"><p>No names found matching your criteria.</p></div>';
        return;
    }
    
    names.forEach(name => {
        const card = createNameCard(name);
        grid.appendChild(card);
    });
    
    // Show results count
    const resultsCount = names.length;
    const searchSection = document.querySelector('.search-section');
    let countDisplay = searchSection.querySelector('.results-count');
    
    if (!countDisplay) {
        countDisplay = document.createElement('p');
        countDisplay.className = 'results-count';
        searchSection.appendChild(countDisplay);
    }
    
    countDisplay.textContent = `Showing ${resultsCount} of ${asmaUlHusna.length} names`;
}

function toggleView(viewType) {
    const grid = document.getElementById('names-grid');
    if (!grid) return;
    
    if (viewType === 'list') {
        grid.classList.add('list-view');
        grid.classList.remove('grid-view');
    } else {
        grid.classList.add('grid-view');
        grid.classList.remove('list-view');
    }
}

// Name Details Modal
function showNameDetail(id) {
    const name = asmaUlHusna.find(n => n.id === id);
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `${name.transliteration} - ${name.meaning}`;
    
    modalBody.innerHTML = `
        <div class="modal-name-header">
            <div class="modal-name-number">${name.id}</div>
            <div class="modal-name-main">
                <div class="modal-name-arabic">${name.arabic}</div>
                <div class="modal-name-transliteration">${name.transliteration}</div>
                <div class="modal-name-meaning">${name.meaning}</div>
            </div>
            <button class="favorite-btn ${favorites.includes(name.id) ? 'active' : ''}" 
                    onclick="toggleFavorite(${name.id})">
                ❤️
            </button>
        </div>
        
        <div class="modal-content-sections">
            <div class="description-section">
                <h4>📖 Description</h4>
                <p>${name.description}</p>
            </div>
            
            ${name.deeperMeaning ? `
            <div class="deeper-meaning-section">
                <h4>🌟 Deeper Spiritual Meaning</h4>
                <p>${name.deeperMeaning}</p>
            </div>
            ` : ''}
            
            ${name.quranicReferences ? `
            <div class="quranic-references-section">
                <h4>📜 Quranic References</h4>
                <ul class="quranic-list">
                    ${name.quranicReferences.map(ref => `<li>${formatQuranReference(ref)}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="circumstances-section">
                <h4>🤲 When to Call Upon This Name</h4>
                <p>${name.circumstances}</p>
            </div>
            
            ${name.healingProperties ? `
            <div class="healing-properties-section">
                <h4>🌿 Healing Properties</h4>
                <p>${name.healingProperties}</p>
            </div>
            ` : ''}
            
            ${name.meditationPractice ? `
            <div class="meditation-practice-section">
                <h4>🧘‍♂️ Traditional Meditation Practice</h4>
                <p>${name.meditationPractice}</p>
            </div>
            ` : ''}
            
            ${name.dailyApplication ? `
            <div class="daily-application-section">
                <h4>🌅 Daily Application</h4>
                <p>${name.dailyApplication}</p>
            </div>
            ` : ''}
            
            <div class="modal-actions">
                <button class="action-btn primary" onclick="startMeditationSession(${name.id}); closeModal();">
                    📿 Start Reflection Session
                </button>
                <button class="action-btn secondary" onclick="closeModal()">
                    ← Close
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Theme and Audio Toggle Functions
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle button
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Show notification if available
    if (window.showFloatingNotification) {
        showFloatingNotification(`Switched to ${newTheme} theme`, 'success');
    }
}

function toggleGlobalAudio() {
    const audioBtn = document.querySelector('.audio-toggle');
    const isEnabled = localStorage.getItem('audioEnabled') !== 'false';
    
    localStorage.setItem('audioEnabled', !isEnabled);
    
    if (audioBtn) {
        audioBtn.textContent = isEnabled ? '🔇' : '🔊';
    }
    
    // Show notification if available
    if (window.showFloatingNotification) {
        showFloatingNotification(`Audio ${isEnabled ? 'disabled' : 'enabled'}`, 'audio');
    }
}

// Helper function to format Quranic references as hyperlinks
function formatQuranReference(reference) {
    // Handle multiple patterns:
    // "Quran 1:3", "Qur'an 2:255", "Al-Quran 7:180", "The Quran 4:36"
    // "Surah 1:3", "Chapter 2:255", "Verse 7:180"
    // Also handles ranges like "Quran 2:255-256"
    
    const patterns = [
        // Primary Quran patterns
        /((?:Quran|Qur'an|Al-Quran|The Quran)\s+)(\d+):(\d+)(?:-(\d+))?/gi,
        // Surah/Chapter patterns
        /((?:Surah|Chapter)\s+)(\d+):(\d+)(?:-(\d+))?/gi,
        // Simple number patterns (e.g., "7:180")
        /(?:^|\s)(\d+):(\d+)(?:-(\d+))?(?=\s|$)/g
    ];
    
    let formattedReference = reference;
    
    patterns.forEach(pattern => {
        formattedReference = formattedReference.replace(pattern, (match, prefix, surah, startVerse, endVerse) => {
            // Handle simple number pattern (no prefix)
            if (!prefix && typeof prefix === 'string') {
                prefix = '';
                surah = arguments[1];
                startVerse = arguments[2];
                endVerse = arguments[3];
            }
            
            const baseUrl = `https://quran.com/${surah}/${startVerse}`;
            const url = endVerse ? `${baseUrl}-${endVerse}` : baseUrl;
            const linkText = endVerse ? `${surah}:${startVerse}-${endVerse}` : `${surah}:${startVerse}`;
            
            return `${prefix || ''}<a href="${url}" target="_blank" rel="noopener noreferrer" class="quran-link">${linkText}</a>`;
        });
    });
    
    return formattedReference;
}

// Initialize theme on load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
    
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update buttons
    const themeBtn = document.querySelector('.theme-toggle');
    const audioBtn = document.querySelector('.audio-toggle');
    
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    if (audioBtn) {
        audioBtn.textContent = audioEnabled ? '🔊' : '🔇';
    }
}

// Random Name
function showRandomName() {
    const randomIndex = Math.floor(Math.random() * asmaUlHusna.length);
    const name = asmaUlHusna[randomIndex];
    const container = document.getElementById('random-name-display');
    
    container.innerHTML = `
        <div class="random-name-card">
            <div class="random-number">${name.id}</div>
            <div class="random-arabic">${name.arabic}</div>
            <div class="random-transliteration">${name.transliteration}</div>
            <div class="random-meaning">${name.meaning}</div>
            <div class="random-description">${name.description}</div>
            <div class="random-circumstances">
                <h4>Perfect for when:</h4>
                <p>${name.circumstances}</p>
            </div>
            <div class="random-actions">
                <button class="action-btn primary" onclick="startMeditationSession(${name.id})">
                    🧘‍♂️ Meditate on This Name
                </button>
                <button class="action-btn secondary" onclick="showNameDetail(${name.id})">
                    📖 Learn More
                </button>
                <button class="favorite-btn ${favorites.includes(name.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${name.id})">
                    ❤️ ${favorites.includes(name.id) ? 'Remove from' : 'Add to'} Favorites
                </button>
            </div>
        </div>
    `;
}

// Favorites
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('asma-favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
    
    if (currentPage === 'favorites') {
        updateFavorites();
    }
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn, .favorite-btn-large').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const id = parseInt(onclick.match(/\d+/)[0]);
        
        if (favorites.includes(id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateFavorites() {
    const grid = document.getElementById('favorites-grid');
    
    if (favorites.length === 0) {
        grid.innerHTML = '<p class="empty-state">No healing names saved yet. Add names to your healing collection by clicking the heart icon.</p>';
        return;
    }
    
    grid.innerHTML = '';
    favorites.forEach(id => {
        const name = asmaUlHusna.find(n => n.id === id);
        const card = createNameCard(name);
        grid.appendChild(card);
    });
}

// Meditation Session
function startMeditationSession(id) {
    const name = asmaUlHusna.find(n => n.id === id);
    const modal = document.getElementById('meditation-modal');
    const display = document.getElementById('meditation-display');
    
    // Store current name ID for audio
    currentNameId = id;
    
    display.innerHTML = `
        <div class="meditation-name">
            <div class="meditation-arabic">${name.arabic}</div>
            <div class="meditation-transliteration">${name.transliteration}</div>
            <div class="meditation-meaning">${name.meaning}</div>
        </div>
        
        ${name.deeperMeaning ? `
        <div class="meditation-deeper-meaning">
            <h4>Spiritual Significance:</h4>
            <p>${name.deeperMeaning}</p>
        </div>
        ` : ''}
        
        <div class="meditation-guide">
            <h4>Meditation Focus:</h4>
            <p>Breathe deeply and repeat "<em>${name.transliteration}</em>" with each breath.</p>
            <p>Contemplate: ${name.description}</p>
            <p>Reflect on: ${name.circumstances}</p>
        </div>
        
        ${name.meditationPractice ? `
        <div class="traditional-practice">
            <h4>Traditional Practice:</h4>
            <p>${name.meditationPractice}</p>
        </div>
        ` : ''}
        
        ${name.healingProperties ? `
        <div class="healing-focus">
            <h4>Healing Focus:</h4>
            <p>${name.healingProperties}</p>
        </div>
        ` : ''}
        
        <div class="meditation-instructions">
            <p><strong>Instructions:</strong></p>
            <ol>
                <li>Find a quiet, comfortable position</li>
                <li>Close your eyes and take deep breaths</li>
                <li>With each inhale, silently say "${name.transliteration}"</li>
                <li>With each exhale, reflect on "${name.meaning}"</li>
                <li>Let the meaning fill your heart with peace</li>
                ${name.dailyApplication ? `<li>Remember: ${name.dailyApplication}</li>` : ''}
            </ol>
        </div>
    `;
    
    modal.classList.remove('hidden');
    resetMeditation();
    setupNameRecitation(name);
}

function closeMeditationModal() {
    document.getElementById('meditation-modal').classList.add('hidden');
    if (isMediating) {
        pauseMeditation();
    }
    stopMeditationAudio();
    stopNameRecitation();
}

function startMeditation() {
    if (!isMediating) {
        isMediating = true;
        meditationStartTime = Date.now() - meditationElapsed;
        meditationTimer = setInterval(updateMeditationTimer, 1000);
        
        document.querySelector('.meditation-btn').textContent = 'Pause';
        document.querySelector('.meditation-btn').onclick = pauseMeditation;
        
        // Start audio if selected
        startMeditationAudio();
    }
}

function pauseMeditation() {
    if (isMediating) {
        isMediating = false;
        clearInterval(meditationTimer);
        meditationElapsed = Date.now() - meditationStartTime;
        
        document.querySelector('.meditation-btn').textContent = 'Resume';
        document.querySelector('.meditation-btn').onclick = startMeditation;
        
        // Pause audio
        pauseMeditationAudio();
    }
}

function resetMeditation() {
    isMediating = false;
    clearInterval(meditationTimer);
    meditationElapsed = 0;
    document.getElementById('meditation-time').textContent = '00:00';
    
    document.querySelector('.meditation-btn').textContent = 'Start Meditation';
    document.querySelector('.meditation-btn').onclick = startMeditation;
    
    // Stop audio
    stopMeditationAudio();
}

function updateMeditationTimer() {
    const elapsed = Date.now() - meditationStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    document.getElementById('meditation-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Close modal when clicking outside
document.getElementById('meditation-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMeditationModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMeditationModal();
    } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        showRandomName();
    }
});

// Audio Functions
function initializeAudio() {
    // Setup audio option change listeners
    document.querySelectorAll('input[name="meditation-audio"]').forEach(radio => {
        radio.addEventListener('change', handleAudioSelection);
    });
    
    // Setup volume control
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDisplay = document.getElementById('volume-display');
    
    if (volumeSlider && volumeDisplay) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value;
            volumeDisplay.textContent = volume + '%';
            if (gainNode) {
                gainNode.gain.value = volume / 100;
            }
        });
    }
    
    // Initialize Web Audio Context on first user interaction
    document.addEventListener('click', initializeWebAudio, { once: true });
}

function initializeWebAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.5; // 50% volume
        console.log('Web Audio Context initialized');
    } catch (error) {
        console.error('Web Audio not supported:', error);
    }
}

function handleAudioSelection(event) {
    const selectedAudio = event.target.value;
    currentAudioType = selectedAudio;
    
    const audioControls = document.getElementById('audio-controls');
    const audioStatus = document.getElementById('audio-status');
    const audioIndicator = audioStatus.querySelector('.audio-indicator');
    
    if (selectedAudio === 'none') {
        audioControls.style.display = 'none';
        stopMeditationAudio();
    } else {
        audioControls.style.display = 'block';
        audioIndicator.textContent = '🎵 ' + getAudioName(selectedAudio) + ' Ready';
        audioIndicator.classList.remove('playing');
    }
}

function getAudioName(audioType) {
    const names = {
        nature: 'Nature Sounds',
        rain: 'Rain Sounds', 
        ocean: 'Ocean Waves',
        wind: 'Gentle Wind'
    };
    return names[audioType] || 'Unknown';
}

function createNatureSounds() {
    if (!audioContext) return null;
    
    // Create a simple nature-like sound using filtered noise
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate filtered noise for nature sounds
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.01);
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Add a filter for more natural sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    source.connect(filter);
    filter.connect(gainNode);
    
    return source;
}

function createRainSounds() {
    if (!audioContext) return null;
    
    // Create rain-like sound using white noise
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Filter for rain-like sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 300;
    
    source.connect(filter);
    filter.connect(gainNode);
    
    return source;
}

function createOceanSounds() {
    if (!audioContext) return null;
    
    // Create ocean wave sound using oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 0.5; // Very low frequency for wave effect
    
    const oscillator2 = audioContext.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.value = 100;
    
    // Create LFO for wave modulation
    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;
    
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 50;
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator2.frequency);
    
    // Mix oscillators
    const mixer = audioContext.createGain();
    mixer.gain.value = 0.1;
    
    oscillator.connect(mixer);
    oscillator2.connect(mixer);
    mixer.connect(gainNode);
    
    oscillator.start();
    oscillator2.start();
    lfo.start();
    
    return { stop: () => {
        oscillator.stop();
        oscillator2.stop();
        lfo.stop();
    }};
}

function createWindSounds() {
    if (!audioContext) return null;
    
    // Create wind sound using filtered noise
    const bufferSize = audioContext.sampleRate * 3;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08 * (1 + Math.sin(i * 0.001));
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Filter for wind-like sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    
    source.connect(filter);
    filter.connect(gainNode);
    
    return source;
}

function startMeditationAudio() {
    if (currentAudioType === 'none' || !audioContext) return;
    
    // Initialize audio context if needed
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Stop any existing audio
    stopMeditationAudio();
    
    const audioIndicator = document.querySelector('.audio-indicator');
    
    try {
        // Create the appropriate audio source
        switch(currentAudioType) {
            case 'nature':
                audioSource = createNatureSounds();
                break;
            case 'rain':
                audioSource = createRainSounds();
                break;
            case 'ocean':
                audioSource = createOceanSounds();
                break;
            case 'wind':
                audioSource = createWindSounds();
                break;
        }
        
        if (audioSource) {
            if (audioSource.start) {
                audioSource.start();
            }
            
            if (audioIndicator) {
                audioIndicator.textContent = '🎵 Playing ' + getAudioName(currentAudioType);
                audioIndicator.classList.add('playing');
            }
            
            console.log('Starting meditation audio:', currentAudioType);
        }
        
    } catch (error) {
        console.error('Error starting audio:', error);
        if (audioIndicator) {
            audioIndicator.textContent = '🎵 Audio Error';
            audioIndicator.classList.remove('playing');
        }
    }
}

function pauseMeditationAudio() {
    if (!audioContext) return;
    
    if (audioContext.state === 'running') {
        audioContext.suspend();
        
        const audioIndicator = document.querySelector('.audio-indicator');
        if (audioIndicator) {
            audioIndicator.textContent = '🎵 ' + getAudioName(currentAudioType) + ' Paused';
            audioIndicator.classList.remove('playing');
        }
        
        console.log('Pausing meditation audio');
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
        
        const audioIndicator = document.querySelector('.audio-indicator');
        if (audioIndicator) {
            audioIndicator.textContent = '🎵 Playing ' + getAudioName(currentAudioType);
            audioIndicator.classList.add('playing');
        }
        
        console.log('Resuming meditation audio');
    }
}

function stopMeditationAudio() {
    if (audioSource) {
        try {
            if (audioSource.stop) {
                audioSource.stop();
            } else if (audioSource.stop) {
                audioSource.stop();
            }
        } catch (error) {
            console.log('Audio source already stopped');
        }
        audioSource = null;
    }
    
    const audioIndicator = document.querySelector('.audio-indicator');
    if (audioIndicator && currentAudioType !== 'none') {
        audioIndicator.textContent = '🎵 ' + getAudioName(currentAudioType) + ' Ready';
        audioIndicator.classList.remove('playing');
    }
    
    console.log('Stopping meditation audio');
}

// Name Recitation Functions
function initializeNameRecitation() {
    nameAudio = document.getElementById('name-recitation-audio');
    
    // Setup name volume control
    const nameVolume = document.getElementById('name-volume-slider');
    const nameVolumeDisplay = document.getElementById('name-volume-display');
    
    if (nameVolume && nameVolumeDisplay) {
        nameVolume.addEventListener('input', function() {
            const volume = this.value;
            nameVolumeDisplay.textContent = volume + '%';
            if (nameAudio) {
                nameAudio.volume = volume / 100;
            }
        });
        
        // Set initial volume
        if (nameAudio) {
            nameAudio.volume = 0.7; // 70%
        }
    }
    
    // Setup audio event listeners
    if (nameAudio) {
        nameAudio.addEventListener('ended', function() {
            if (nameRepeatMode) {
                // Restart the audio if repeat is enabled
                setTimeout(() => {
                    if (nameRepeatMode && nameAudio) {
                        nameAudio.currentTime = 0;
                        nameAudio.play().catch(console.error);
                    }
                }, 500); // Small pause between repeats
            } else {
                // Audio finished, reset UI
                isNamePlaying = false;
                updateNameRecitationUI();
            }
        });
        
        nameAudio.addEventListener('loadstart', function() {
            updateRecitationStatus('🔄 Loading audio...', 'loading');
        });
        
        nameAudio.addEventListener('canplay', function() {
            updateRecitationStatus('🎤 Name Audio Ready', '');
        });
        
        nameAudio.addEventListener('error', function() {
            updateRecitationStatus('❌ Audio not available', 'error');
        });
    }
}

function setupNameRecitation(name) {
    currentNameId = name.id;
    
    // Setup the audio source
    if (nameAudio && name.audioPath) {
        const audioSource = document.getElementById('name-audio-source');
        audioSource.src = name.audioPath;
        nameAudio.load();
        
        updateRecitationStatus(`🎤 ${name.transliteration} Ready`, '');
    } else {
        updateRecitationStatus('❌ Audio not available', 'error');
    }
    
    // Reset states
    isNamePlaying = false;
    nameRepeatMode = false;
    updateNameRecitationUI();
}

function playNameRecitation() {
    if (!nameAudio || !currentNameId) return;
    
    if (isNamePlaying) {
        // Pause the audio
        nameAudio.pause();
        isNamePlaying = false;
    } else {
        // Play the audio
        nameAudio.play().then(() => {
            isNamePlaying = true;
            updateNameRecitationUI();
            
            const name = asmaUlHusna.find(n => n.id === currentNameId);
            updateRecitationStatus(`🎵 Playing ${name ? name.transliteration : 'Name'}`, 'playing');
        }).catch(error => {
            console.error('Error playing name audio:', error);
            updateRecitationStatus('❌ Playback failed', 'error');
        });
    }
    
    updateNameRecitationUI();
}

function toggleNameRepeat() {
    nameRepeatMode = !nameRepeatMode;
    updateNameRecitationUI();
    
    const name = asmaUlHusna.find(n => n.id === currentNameId);
    if (nameRepeatMode) {
        updateRecitationStatus(`🔁 Repeat enabled for ${name ? name.transliteration : 'Name'}`, '');
    } else {
        updateRecitationStatus(`🎤 ${name ? name.transliteration : 'Name'} Ready`, '');
    }
}

function stopNameRecitation() {
    if (nameAudio) {
        nameAudio.pause();
        nameAudio.currentTime = 0;
    }
    
    isNamePlaying = false;
    nameRepeatMode = false;
    updateNameRecitationUI();
    
    if (currentNameId) {
        const name = asmaUlHusna.find(n => n.id === currentNameId);
        updateRecitationStatus(`🎤 ${name ? name.transliteration : 'Name'} Ready`, '');
    }
}

function updateNameRecitationUI() {
    const playBtn = document.getElementById('play-name-btn');
    const repeatBtn = document.getElementById('repeat-name-btn');
    const repeatIcon = document.getElementById('repeat-icon');
    const repeatText = document.getElementById('repeat-text');
    
    if (playBtn) {
        if (isNamePlaying) {
            playBtn.innerHTML = '<span>⏸️</span><span>Pause</span>';
            playBtn.classList.add('playing');
        } else {
            playBtn.innerHTML = '<span>🎵</span><span>Play Name</span>';
            playBtn.classList.remove('playing');
        }
    }
    
    if (repeatBtn) {
        if (nameRepeatMode) {
            repeatBtn.classList.add('active');
            repeatIcon.textContent = '🔁';
            repeatText.textContent = 'Repeat ON';
        } else {
            repeatBtn.classList.remove('active');
            repeatIcon.textContent = '🔁';
            repeatText.textContent = 'Repeat';
        }
    }
}

function updateRecitationStatus(message, className = '') {
    const indicator = document.querySelector('.recitation-indicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.className = 'recitation-indicator ' + className;
    }
}

// Apple-Style Interactions and Enhanced Features
function initializeAppleStyleInteractions() {
    // Add haptic feedback simulation for supported devices
    addHapticFeedback();
    
    // Initialize gesture interactions
    initializeGestureInteractions();
    
    // Add interactive animations
    initializeInteractiveAnimations();
    
    // Initialize Dynamic Island interactions (for option 2)
    initializeDynamicIslandInteractions();
    
    // Initialize iOS 17 widget-like behaviors (for option 3)
    initializeiOS17Interactions();
    
    console.log('Apple-style interactions initialized');
}

function addHapticFeedback() {
    // Simulate haptic feedback for supported devices
    const addHaptic = (element, intensity = 'light') => {
        element.addEventListener('click', () => {
            if (navigator.vibrate) {
                const patterns = {
                    light: [10],
                    medium: [20],
                    heavy: [30, 10, 30]
                };
                navigator.vibrate(patterns[intensity] || patterns.light);
            }
        });
    };
    
    // Add haptic feedback to buttons
    document.querySelectorAll('.nav-btn, .action-btn, .meditation-btn, .detail-btn').forEach(btn => {
        addHaptic(btn, 'light');
    });
    
    document.querySelectorAll('.name-card').forEach(card => {
        addHaptic(card, 'medium');
    });
}

function initializeGestureInteractions() {
    // Add swipe gestures for navigation
    let startX = 0;
    let startY = 0;
    let isSwipeEnabled = true;
    
    document.addEventListener('touchstart', (e) => {
        if (!isSwipeEnabled) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!isSwipeEnabled) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next page
                navigatePages('next');
            } else {
                // Swipe right - previous page
                navigatePages('prev');
            }
        }
    });
    
    // Disable swipe in modal
    document.addEventListener('modalOpen', () => isSwipeEnabled = false);
    document.addEventListener('modalClose', () => isSwipeEnabled = true);
}

function navigatePages(direction) {
    const pages = ['home', 'names', 'favorites', 'random'];
    const currentIndex = pages.indexOf(currentPage);
    let newIndex;
    
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % pages.length;
    } else {
        newIndex = (currentIndex - 1 + pages.length) % pages.length;
    }
    
    showPage(pages[newIndex]);
    document.querySelector(`[data-page="${pages[newIndex]}"]`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.page !== pages[newIndex]) {
            btn.classList.remove('active');
        }
    });
}

function initializeInteractiveAnimations() {
    // Add stagger animations for name cards
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Add parallax scroll effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.verse-container');
        
        parallax.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Observe name cards for stagger animation
    document.querySelectorAll('.name-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
}

function initializeDynamicIslandInteractions() {
    // Create floating notification system (Dynamic Island style)
    const createFloatingNotification = (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `floating-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles for the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: rgba(28, 28, 30, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 50px;
            padding: 12px 24px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    };
    
    // Override existing notification functions
    window.showFloatingNotification = createFloatingNotification;
    
    // Enhanced name card interactions
    document.querySelectorAll('.name-card').forEach(card => {
        let longPressTimer;
        
        card.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                if (navigator.vibrate) navigator.vibrate([50]);
                showFloatingNotification('Long press detected', 'success', 2000);
            }, 500);
        });
        
        card.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            card.style.transform = '';
        });
    });
}

function initializeiOS17Interactions() {
    // Add Live Activity-style updates
    const createLiveActivity = (title, content, actions = []) => {
        const activity = document.createElement('div');
        activity.className = 'live-activity';
        activity.innerHTML = `
            <div class="activity-header">
                <span class="activity-title">${title}</span>
                <span class="activity-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="activity-content">${content}</div>
            ${actions.length > 0 ? `
                <div class="activity-actions">
                    ${actions.map(action => `<button class="activity-btn" onclick="${action.callback}">${action.label}</button>`).join('')}
                </div>
            ` : ''}
        `;
        
        // Style the live activity
        activity.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 320px;
            background: var(--ios17-bg-secondary, white);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            border: 0.5px solid var(--ios17-bg-quaternary, #e5e5ea);
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(activity);
        
        // Animate in
        requestAnimationFrame(() => {
            activity.style.transform = 'translateX(0)';
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            activity.style.transform = 'translateX(400px)';
            setTimeout(() => activity.remove(), 400);
        }, 5000);
        
        return activity;
    };
    
    // Add interactive widgets behavior
    document.querySelectorAll('.verse-container').forEach(container => {
        container.addEventListener('click', () => {
            container.style.transform = 'scale(1.02)';
            setTimeout(() => {
                container.style.transform = '';
            }, 150);
        });
    });
    
    // Enhanced meditation timer with iOS 17 styling
    const enhanceMeditationTimer = () => {
        const timer = document.querySelector('.meditation-timer');
        if (timer) {
            timer.style.fontVariantNumeric = 'tabular-nums';
            timer.style.letterSpacing = '2px';
        }
    };
    
    // Call enhancement when meditation starts
    document.addEventListener('meditationStart', enhanceMeditationTimer);
    
    window.createLiveActivity = createLiveActivity;
}

function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        meditation: '🧘‍♂️',
        audio: '🎵'
    };
    return icons[type] || icons.info;
}

// Style Selector System
function initializeStyleSelector() {
    createStyleSelector();
    loadSelectedStyle();
}

function createStyleSelector() {
    // Create style selector if it doesn't exist
    if (document.getElementById('style-selector')) return;
    
    const selector = document.createElement('div');
    selector.id = 'style-selector';
    selector.innerHTML = `
        <div class="style-selector-toggle" onclick="toggleStyleSelector()">
            🎨 Style
        </div>
        <div class="style-selector-panel hidden">
            <h3>Choose Your Style</h3>
            <div class="style-options">
                <div class="style-option" data-style="default">
                    <div class="style-preview modern"></div>
                    <span>Modern Glassmorphism</span>
                </div>
                <div class="style-option" data-style="apple1">
                    <div class="style-preview clean"></div>
                    <span>Clean Apple Minimalist</span>
                </div>
                <div class="style-option" data-style="apple2">
                    <div class="style-preview dynamic"></div>
                    <span>Dynamic Island</span>
                </div>
                <div class="style-option" data-style="apple3">
                    <div class="style-preview ios17"></div>
                    <span>iOS 17 Modern</span>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for the selector
    const selectorStyles = document.createElement('style');
    selectorStyles.textContent = `
        #style-selector {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
        }
        
        .style-selector-toggle {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .style-selector-panel {
            position: absolute;
            top: 50px;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 20px;
            min-width: 250px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .style-selector-panel h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .style-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .style-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .style-option:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        
        .style-option.active {
            background: rgba(52, 199, 89, 0.1);
        }
        
        .style-preview {
            width: 30px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .style-preview.modern { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .style-preview.clean { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
        .style-preview.dynamic { background: linear-gradient(135deg, #000000 0%, #1c1c1e 100%); }
        .style-preview.ios17 { background: linear-gradient(135deg, #34c759 0%, #007aff 100%); }
        
        .style-option span {
            font-size: 14px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(selectorStyles);
    document.body.appendChild(selector);
    
    // Add click handlers
    document.querySelectorAll('.style-option').forEach(option => {
        option.addEventListener('click', () => {
            const style = option.dataset.style;
            changeStyle(style);
            
            // Update active state
            document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Hide selector
            toggleStyleSelector();
        });
    });
}

function toggleStyleSelector() {
    const panel = document.querySelector('.style-selector-panel');
    panel.classList.toggle('hidden');
}

function changeStyle(styleName) {
    // Remove existing style links
    document.querySelectorAll('link[data-style]').forEach(link => link.remove());
    
    // Add new style
    if (styleName !== 'default') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `apple-style-option${styleName.slice(-1)}.css`;
        link.setAttribute('data-style', styleName);
        document.head.appendChild(link);
    }
    
    // Save preference
    localStorage.setItem('selected-style', styleName);
    
    // Show notification
    if (window.showFloatingNotification) {
        const styleNames = {
            default: 'Modern Glassmorphism',
            apple1: 'Clean Apple Minimalist', 
            apple2: 'Dynamic Island',
            apple3: 'iOS 17 Modern'
        };
        showFloatingNotification(`Switched to ${styleNames[styleName]}`, 'success');
    }
}

function loadSelectedStyle() {
    const savedStyle = localStorage.getItem('selected-style') || 'default';
    changeStyle(savedStyle);
    
    // Update active state in selector
    setTimeout(() => {
        const option = document.querySelector(`[data-style="${savedStyle}"]`);
        if (option) option.classList.add('active');
    }, 100);
}

// Healing Properties Search System
function searchByHealing() {
    const query = document.getElementById('healing-search-input').value.trim().toLowerCase();
    if (!query) {
        alert('Please enter what you need healing for');
        return;
    }
    
    performHealingSearch(query);
}

function searchHealingCategory(category) {
    const categoryQueries = {
        anxiety: 'anxiety fear worry stress nervous tension panic',
        depression: 'depression sadness grief sorrow despair hopelessness melancholy',
        anger: 'anger rage fury irritation wrath resentment hostility',
        guilt: 'guilt shame regret remorse self-blame unworthiness',
        confusion: 'confusion doubt uncertainty indecisiveness perplexity bewilderment',
        loneliness: 'loneliness isolation abandonment separation solitude rejection',
        pride: 'pride arrogance ego vanity conceit superiority narcissism',
        weakness: 'weakness powerlessness helplessness vulnerability frailty impotence',
        spiritual: 'spiritual emptiness void disconnection faithlessness religious crisis',
        relationships: 'relationship marriage family friendship love conflict broken heart',
        financial: 'financial money poverty debt wealth provision sustenance livelihood',
        health: 'health illness disease healing physical mental wellness recovery'
    };
    
    const query = categoryQueries[category] || category;
    document.getElementById('healing-search-input').value = query.split(' ')[0];
    performHealingSearch(query);
}

function performHealingSearch(query) {
    const results = findHealingNames(query);
    displayHealingResults(results, query);
    
    // Show notification
    if (window.showFloatingNotification) {
        showFloatingNotification(`Found ${results.length} healing names`, 'success');
    }
}

function findHealingNames(query) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const healingMatches = [];
    
    asmaUlHusna.forEach(name => {
        let matchScore = 0;
        let matchedReasons = [];
        
        // Check healing properties
        if (name.healingProperties) {
            const healingText = name.healingProperties.toLowerCase();
            queryWords.forEach(word => {
                if (healingText.includes(word)) {
                    matchScore += 3;
                    if (!matchedReasons.includes('healing')) matchedReasons.push('healing');
                }
            });
        }
        
        // Check deeper meaning
        if (name.deeperMeaning) {
            const meaningText = name.deeperMeaning.toLowerCase();
            queryWords.forEach(word => {
                if (meaningText.includes(word)) {
                    matchScore += 2;
                    if (!matchedReasons.includes('meaning')) matchedReasons.push('meaning');
                }
            });
        }
        
        // Check daily application
        if (name.dailyApplication) {
            const applicationText = name.dailyApplication.toLowerCase();
            queryWords.forEach(word => {
                if (applicationText.includes(word)) {
                    matchScore += 2;
                    if (!matchedReasons.includes('application')) matchedReasons.push('application');
                }
            });
        }
        
        // Check circumstances
        if (name.circumstances) {
            const circumstancesText = name.circumstances.toLowerCase();
            queryWords.forEach(word => {
                if (circumstancesText.includes(word)) {
                    matchScore += 2;
                    if (!matchedReasons.includes('circumstances')) matchedReasons.push('circumstances');
                }
            });
        }
        
        // Check meaning and description for broader matches
        const basicText = `${name.meaning} ${name.description || ''}`.toLowerCase();
        queryWords.forEach(word => {
            if (basicText.includes(word)) {
                matchScore += 1;
                if (!matchedReasons.includes('basic')) matchedReasons.push('basic');
            }
        });
        
        // Add special keyword matches
        const specialMatches = getSpecialKeywordMatches(query, name);
        matchScore += specialMatches.score;
        matchedReasons = [...matchedReasons, ...specialMatches.reasons];
        
        if (matchScore > 0) {
            healingMatches.push({
                name,
                score: matchScore,
                reasons: matchedReasons,
                relevance: calculateRelevance(matchScore, matchedReasons.length)
            });
        }
    });
    
    // Sort by score and relevance
    return healingMatches
        .sort((a, b) => b.score - a.score || b.relevance - a.relevance)
        .slice(0, 12); // Limit to top 12 results
}

function getSpecialKeywordMatches(query, name) {
    const specialKeywords = {
        // Emotional states
        'anxiety': ['As-Salaam', 'Al-Mu\'min', 'Al-Hafiz', 'Al-Wali', 'Al-Latif'],
        'fear': ['As-Salaam', 'Al-Mu\'min', 'Al-Qawi', 'Al-Aziz', 'Al-Hafiz'],
        'depression': ['Ar-Rahman', 'Ar-Raheem', 'An-Nur', 'Al-Hadi', 'Al-Sabur'],
        'anger': ['As-Sabur', 'Al-Halim', 'Al-Latif', 'Ar-Rahman', 'Al-Ghafur'],
        'sadness': ['Ar-Rahman', 'Ar-Raheem', 'Al-Wadud', 'An-Nur', 'As-Sabur'],
        'guilt': ['Al-Ghafur', 'Al-Ghaffar', 'At-Tawwab', 'Ar-Rahman', 'Al-Afuww'],
        'shame': ['As-Sattir', 'Al-Ghafur', 'Ar-Rahman', 'Al-Karim', 'Al-Halim'],
        'loneliness': ['Al-Wali', 'Ar-Rahman', 'Al-Wadud', 'As-Sahib', 'Al-Mu\'min'],
        'confusion': ['Al-Hadi', 'Al-Hakim', 'An-Nur', 'Al-Aleem', 'Ar-Rashid'],
        'doubt': ['Al-Haqq', 'Al-Mu\'min', 'Al-Hakim', 'Al-Aleem', 'Al-Hadi'],
        'pride': ['Al-Mutakabbir', 'Al-Aziz', 'Al-Khafid', 'At-Tawwab', 'As-Sabur'],
        'arrogance': ['Al-Mutakabbir', 'Al-Khafid', 'Al-Hakim', 'As-Sabur', 'Ar-Rahman'],
        
        // Physical and material needs
        'weakness': ['Al-Qawi', 'Al-Aziz', 'Al-Matin', 'Al-Qadir', 'Al-Muqtadir'],
        'powerless': ['Al-Qawi', 'Al-Qadir', 'Al-Muqtadir', 'Al-Aziz', 'Al-Hakam'],
        'sick': ['Ash-Shafi', 'Ar-Rahman', 'Al-Latif', 'As-Sabur', 'Al-Qawi'],
        'poor': ['Ar-Razzaq', 'Al-Ghani', 'Al-Mughni', 'Al-Wahhab', 'Al-Karim'],
        'money': ['Ar-Razzaq', 'Al-Wahhab', 'Al-Mughni', 'Al-Ghani', 'Al-Karim'],
        'debt': ['Al-Qadi', 'Ar-Razzaq', 'Al-Mughni', 'Al-Ghani', 'Al-Wahhab'],
        
        // Spiritual needs
        'guidance': ['Al-Hadi', 'An-Nur', 'Ar-Rashid', 'Al-Hakim', 'Al-Aleem'],
        'forgiveness': ['Al-Ghafur', 'Al-Ghaffar', 'At-Tawwab', 'Al-Afuww', 'Ar-Rahman'],
        'patience': ['As-Sabur', 'Al-Halim', 'As-Shakur', 'Ar-Rahman', 'Al-Hakim'],
        'wisdom': ['Al-Hakim', 'Al-Aleem', 'Al-Khabir', 'Ar-Rashid', 'Al-Latif'],
        'peace': ['As-Salaam', 'Al-Mu\'min', 'As-Sabur', 'Al-Halim', 'Ar-Rahman'],
        'love': ['Al-Wadud', 'Ar-Rahman', 'Ar-Raheem', 'Al-Karim', 'Al-Latif'],
        'protection': ['Al-Hafiz', 'Al-Muhaymin', 'Al-Wali', 'Al-Mani', 'Al-Qawi'],
        
        // Relationship issues
        'marriage': ['Al-Wadud', 'As-Sabur', 'Al-Halim', 'Al-Jami', 'Ar-Rahman'],
        'family': ['Ar-Rahman', 'Al-Wadud', 'As-Sabur', 'Al-Jami', 'Al-Karim'],
        'conflict': ['As-Sabur', 'Al-Halim', 'Al-Hakim', 'Al-Adl', 'As-Salaam']
    };
    
    let score = 0;
    let reasons = [];
    
    Object.keys(specialKeywords).forEach(keyword => {
        if (query.includes(keyword)) {
            const recommendedNames = specialKeywords[keyword];
            if (recommendedNames.includes(name.transliteration)) {
                score += 5; // High relevance bonus
                reasons.push('specially-recommended');
            }
        }
    });
    
    return { score, reasons };
}

function calculateRelevance(score, reasonCount) {
    return score * (1 + reasonCount * 0.1);
}

function displayHealingResults(results, query) {
    const resultsContainer = document.getElementById('healing-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-healing-results">
                <h3>🔍 No Specific Healing Matches Found</h3>
                <p>We couldn't find names specifically for "${query}", but remember that all of Allah's names can bring healing and comfort to your heart.</p>
                <button class="try-different-btn" onclick="clearHealingSearch()">Try Different Keywords</button>
            </div>
        `;
        return;
    }
    
    const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
    
    resultsContainer.innerHTML = `
        <div class="healing-results-header">
            <h3>🌿 Names for Healing: ${capitalizedQuery}</h3>
            <p>Found ${results.length} names that can help with your spiritual needs</p>
        </div>
        <div class="healing-names-grid">
            ${results.map(result => createHealingNameCard(result)).join('')}
        </div>
    `;
}

function createHealingNameCard(result) {
    const { name, score, reasons } = result;
    const matchPercentage = Math.min(Math.round((score / 10) * 100), 100);
    
    return `
        <div class="healing-name-card" onclick="showNameDetail(${name.id})">
            <div class="healing-match-score">${matchPercentage}% match</div>
            <div class="healing-name-header">
                <div class="healing-name-number">${name.id}</div>
            </div>
            <div class="healing-name-arabic">${name.arabic}</div>
            <div class="healing-name-transliteration">${name.transliteration}</div>
            <div class="healing-name-meaning">${name.meaning}</div>
            
            ${name.healingProperties ? `
                <div class="healing-properties">
                    <h4>🌿 Healing Properties:</h4>
                    <p>${name.healingProperties}</p>
                </div>
            ` : ''}
            
            <div class="card-actions">
                <button class="favorite-btn ${favorites.includes(name.id) ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${name.id})">
                    ❤️
                </button>
                <button class="detail-btn" onclick="event.stopPropagation(); showNameDetail(${name.id})">
                    View Details
                </button>
                <button class="meditate-btn" onclick="event.stopPropagation(); startMeditationSession(${name.id})">
                    🧘‍♂️ Meditate
                </button>
            </div>
        </div>
    `;
}

function clearHealingSearch() {
    document.getElementById('healing-search-input').value = '';
    document.getElementById('healing-results').innerHTML = '';
}

// Update navigation to include healing page
function navigatePages(direction) {
    const pages = ['home', 'names', 'healing', 'favorites', 'random'];
    const currentIndex = pages.indexOf(currentPage);
    let newIndex;
    
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % pages.length;
    } else {
        newIndex = (currentIndex - 1 + pages.length) % pages.length;
    }
    
    showPage(pages[newIndex]);
    document.querySelector(`[data-page="${pages[newIndex]}"]`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.page !== pages[newIndex]) {
            btn.classList.remove('active');
        }
    });
}

// Add Enter key support for healing search
document.addEventListener('DOMContentLoaded', function() {
    const healingInput = document.getElementById('healing-search-input');
    if (healingInput) {
        healingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchByHealing();
            }
        });
    }
});