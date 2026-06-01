/**
 * FutureMe Frontend Script Logic
 * Integrates your premium Apple-style design parameters with our Express backend services.
 */

// Global state variables
let userProfile = null;
let chatHistory = [];
let loadingInterval = null;

// Helper to resolve API URLs correctly for local file protocol (file://) and custom development hosts
const getApiUrl = (endpoint) => {
    // If running in local file protocol (e.g. double clicking index.html directly)
    if (window.location.protocol === 'file:') {
        return `http://localhost:5000${endpoint}`;
    }
    // If running on a local development web server (like localhost:5500 / 127.0.0.1:3000)
    // but the backend Express server is running on port 5000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (!window.location.port || window.location.port !== '5000') {
            return `http://localhost:5000${endpoint}`;
        }
    }
    // In production, we are on the same origin (unified Express deployment on Render), so use relative paths
    return endpoint;
};

// Intersection Observer for scroll reveal animations (your original design)
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// DOM Elements - Form Inputs
const futureForm = document.getElementById('future-form');
const btnGenerate = document.getElementById('btn-generate');
const formWrapper = document.getElementById('form-wrapper');

// DOM Elements - Loading & Results panels
const loadingState = document.getElementById('loading-state');
const loaderTitle = document.getElementById('loader-title');
const loaderSubtitle = document.getElementById('loader-subtitle');
const resultState = document.getElementById('result-state');

// DOM Elements - Result Text Blocks
const resMsg = document.getElementById('res-msg');
const resIdentity = document.getElementById('res-identity');
const resMoves = document.getElementById('res-moves');
const resHabit = document.getElementById('res-habit');
const resWarning = document.getElementById('res-warning');
const resMantra = document.getElementById('res-mantra');

// DOM Elements - Utility Actions
const btnCopyResult = document.getElementById('btn-copy-result');
const btnGoChat = document.getElementById('btn-go-chat');
const btnShareTrigger = document.getElementById('btn-share-trigger');
const shareToast = document.getElementById('share-toast');

// DOM Elements - Dialogues (Chat)
const chatMessagesContainer = document.getElementById('chat-messages-container');
const chatTypingIndicator = document.getElementById('chat-typing-indicator');
const chatInputForm = document.getElementById('chat-input-form');
const chatField = document.getElementById('chat-field');
const btnSendChat = document.getElementById('btn-send-chat');

/* ==========================================================================
   Phase 2: Custom Starry Loader Portal Cycle
   ========================================================================== */

const LOADER_STAGES = [
    { title: "Opening temporal wormhole...", subtitle: "Calibrating timeline reference frames" },
    { title: "Aligning temporal matrices...", subtitle: "Isolating target year coordinate strings" },
    { title: "Connecting with Future self...", subtitle: "Synchronizing perspective frequencies" },
    { title: "Translating life outcomes...", subtitle: "Extracting letters and habits" },
    { title: "Constructing physical record...", subtitle: "Opening terminal print queues" }
];

function startLoaderSequence() {
    let stageIndex = 0;
    loaderTitle.textContent = LOADER_STAGES[0].title;
    loaderSubtitle.textContent = LOADER_STAGES[0].subtitle;

    loadingInterval = setInterval(() => {
        stageIndex = (stageIndex + 1) % LOADER_STAGES.length;
        loaderTitle.style.opacity = '0';
        loaderSubtitle.style.opacity = '0';

        setTimeout(() => {
            loaderTitle.textContent = LOADER_STAGES[stageIndex].title;
            loaderSubtitle.textContent = LOADER_STAGES[stageIndex].subtitle;
            loaderTitle.style.opacity = '1';
            loaderSubtitle.style.opacity = '1';
        }, 300);
    }, 2200);
}

function stopLoaderSequence() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}

/* ==========================================================================
   Phase 1: Form Validation & Generation Submission
   ========================================================================== */

futureForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get input field values
    const name = document.getElementById('fm-name').value.trim();
    const age = document.getElementById('fm-age').value.trim();
    const goal = document.getElementById('fm-goal').value.trim();
    const struggle = document.getElementById('fm-struggle').value.trim();
    const oneYearVision = document.getElementById('fm-timeline').value.trim();
    const rawTone = document.getElementById('fm-tone').value;

    // UI Input Validation
    if (!name || !age || !goal || !struggle || !oneYearVision || !rawTone) {
        showToast('Please fill out all fields honestly to proceed.');
        return;
    }

    // Lock generation keys to prevent spamming
    btnGenerate.disabled = true;
    
    // Switch panels: hide input form, launch cosmic loader
    futureForm.style.display = 'none';
    loadingState.style.display = 'block';
    startLoaderSequence();

    // Map lowercase select option values into Title Case for prompt engineering
    const toneMap = {
        'motivational': 'Motivational',
        'brutally_honest': 'Brutally Honest',
        'calm_mentor': 'Calm Mentor',
        'ceo_mode': 'CEO Mode'
    };
    const tone = toneMap[rawTone] || rawTone;

    // Cache user profile globally for follow-up chat loops
    userProfile = { name, age, goal, struggle, oneYearVision, tone };

    try {
        const response = await fetch(getApiUrl('/api/generate-futureme'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile)
        });

        const result = await response.json();
        stopLoaderSequence();

        if (result.success && result.data) {
            renderResults(result.data);
            
            // Switch panels: hide loader, reveal beautiful result card
            loadingState.style.display = 'none';
            resultState.style.display = 'block';
            
            // Scroll smoothly down to the result details
            resultState.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            throw new Error(result.error || 'Server processing error.');
        }

    } catch (err) {
        console.error('[Generate reflection failure]:', err);
        stopLoaderSequence();
        
        // Reset state & show input panel back
        loadingState.style.display = 'none';
        futureForm.style.display = 'block';
        btnGenerate.disabled = false;
        
        // Custom message based on API state
        if (err.message && err.message.includes('API key')) {
            showToast('API key is missing in your backend/.env file.');
        } else {
            showToast(`FutureMe could not respond right now: ${err.message}`);
        }
    }
});

/* ==========================================================================
   Phase 3: Render Result letter Details
   ========================================================================== */

function renderResults(data) {
    // Inject results cleanly
    resMsg.textContent = `"${data.message}"`;
    resIdentity.innerHTML = `The version of you who is <strong>${userProfile.oneYearVision.toLowerCase()}</strong> and has conquered the friction of today.`;
    resHabit.textContent = data.habit;
    
    // Inject premium highlights (Warning & Mantra)
    resWarning.textContent = data.warning;
    resMantra.textContent = `“${data.mantra}”`;

    const planToneBadge = document.getElementById('plan-tone-badge');
    if (planToneBadge) planToneBadge.textContent = userProfile.tone;

    // Render bullet list of next 3 moves safely
    resMoves.innerHTML = '';
    if (Array.isArray(data.nextMoves)) {
        data.nextMoves.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            resMoves.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = data.nextMoves || 'Step into consistent daily action.';
        resMoves.appendChild(li);
    }

    // Render Daily Action Plan
    const planGoalText = document.getElementById('plan-goal-text');
    const planStruggleText = document.getElementById('plan-struggle-text');
    const resDailyPlan = document.getElementById('res-daily-plan');
    const planProgress = document.getElementById('plan-progress');
    const progressPercentage = document.getElementById('progress-percentage');

    if (planGoalText) planGoalText.textContent = userProfile.goal;
    if (planStruggleText) planStruggleText.textContent = userProfile.struggle;

    if (resDailyPlan) {
        resDailyPlan.innerHTML = '';
        const dailyPlan = data.dailyPlan || [];
        
        if (dailyPlan.length === 0) {
            resDailyPlan.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 1rem 0;">No daily plan details generated. Keep executing your vision!</p>';
        } else {
            dailyPlan.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'plan-card';
                card.dataset.index = index;

                // Color energy rating
                const energyClass = (item.energyLevel || 'medium').toLowerCase();

                card.innerHTML = `
                    <div class="plan-checkbox">
                        <svg viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div style="flex: 1; padding-right: 4rem;">
                        <div class="plan-time">${item.timeSlot}</div>
                        <div class="plan-task">${item.task}</div>
                        <div class="plan-motivation">${item.motivation}</div>
                    </div>
                    <span class="plan-energy-badge ${energyClass}">${item.energyLevel || 'Medium'}</span>
                `;

                // Interactivity: Check off task
                card.addEventListener('click', (e) => {
                    // Prevent nested selector click triggers if any
                    card.classList.toggle('completed');
                    updatePlanProgress();
                });

                resDailyPlan.appendChild(card);
            });
        }
        
        // Reset progress bar to 0% initially
        if (planProgress) planProgress.style.width = '0%';
        if (progressPercentage) progressPercentage.textContent = '0% COMPLETED';
    }

    // Reset Chat panel to welcome state
    chatHistory = [];
    chatMessagesContainer.innerHTML = `
        <div class="msg msg-ai">
            <div class="msg-label">Future ${userProfile.name}</div>
            I am here. You have my letter, but I know there are things you still doubt. Ask me anything about what's ahead, how to handle today, or how I conquered the struggle of <i>"${userProfile.struggle}"</i>. I'm listening.
        </div>
    `;

    // Re-enable button key
    btnGenerate.disabled = false;
}

/**
 * Calculates checklist completion rates and triggers supportive feedback micro-toasts
 */
function updatePlanProgress() {
    const cards = document.querySelectorAll('.plan-card');
    if (cards.length === 0) return;
    
    const completedCards = document.querySelectorAll('.plan-card.completed');
    const percentage = Math.round((completedCards.length / cards.length) * 100);
    
    const planProgress = document.getElementById('plan-progress');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (planProgress) planProgress.style.width = `${percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}% COMPLETED`;
    
    if (percentage === 100) {
        showToast("🌟 INCREDIBLE! You've aligned your entire day. Future you is proud.");
    } else if (completedCards.length > 0 && percentage > 0) {
        const motivations = [
            "Nice move! One step closer to your future self.",
            "Consistently building. Keep going!",
            "Action beats worry every single time.",
            "Friction conquered. Maintain this pace!"
        ];
        const randomMot = motivations[Math.floor(Math.random() * motivations.length)];
        showToast(randomMot);
    }
}

/* ==========================================================================
   Phase 4: Utility Controls - Clipboard, scrolling, form resets
   ========================================================================== */

// 1. Copy full letter details to clipboard
btnCopyResult.addEventListener('click', () => {
    if (!userProfile) return;

    const movesText = Array.from(resMoves.querySelectorAll('li'))
        .map((li, index) => `${index + 1}. ${li.textContent}`)
        .join('\n');

    // Extract structured Daily Action Plan
    const planCards = document.querySelectorAll('.plan-card');
    let planText = 'No daily plan details generated.';
    if (planCards.length > 0) {
        planText = Array.from(planCards)
            .map(card => {
                const time = card.querySelector('.plan-time').textContent;
                const task = card.querySelector('.plan-task').textContent;
                const motivation = card.querySelector('.plan-motivation').textContent;
                const energy = card.querySelector('.plan-energy-badge').textContent;
                const status = card.classList.contains('completed') ? '[✓ COMPLETED]' : '[ ] PENDING';
                return `⏰ ${time} (${energy}) ${status}\n   Task: ${task}\n   Motivation: ${motivation}`;
            })
            .join('\n\n');
    }

    const copyString = `==================================================
🌟 FUTUREME AI TIMELINE REFLECTION
==================================================
To: ${userProfile.name} (Age ${userProfile.age})
From: Future ${userProfile.name}
Tone: ${userProfile.tone}
--------------------------------------------------

📝 LETTER FROM YOUR FUTURE SELF:
${resMsg.textContent}

👑 YOUR FUTURE IDENTITY:
${resIdentity.textContent.replace(/<[^>]*>/g, '')}

🚀 NEXT 3 MOVES:
${movesText}

🌱 DAILY HABIT TO ADOPT:
${resHabit.textContent}

⚠️ WARNING FROM THE FUTURE:
${resWarning.textContent}

💭 DAILY MANTRA:
${resMantra.textContent}

📅 DYNAMIC DAILY ACTION PLAN:
${planText}

==================================================
Crafted with precision on FutureMe AI. Align, Adapt, Rise.`;

    navigator.clipboard.writeText(copyString)
        .then(() => {
            showToast('Reflection letter and action plan copied!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy. Copy manually.');
        });
});

// 2. Open chat trigger button (smooth scrolls down to console)
btnGoChat.addEventListener('click', () => {
    const chatSection = document.getElementById('chat');
    if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            chatField.focus();
        }, 800);
    }
});

// 3. Main share button at bottom
btnShareTrigger.addEventListener('click', () => {
    showToast('Your FutureMe moment is ready to share. Link copied!');
});

// 4. Form Reset Handler
window.resetForm = function () {
    resultState.style.display = 'none';
    futureForm.reset();
    futureForm.style.display = 'block';
    
    // Smooth scroll back to creator pane top
    formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// 5. Reusable Minimalist toast popup alert
function showToast(message) {
    shareToast.textContent = message;
    shareToast.classList.add('show');
    
    setTimeout(() => {
        shareToast.classList.remove('show');
    }, 4000);
}

/* ==========================================================================
   Phase 5: Interactive follow-up Chat Dialogue Console
   ========================================================================== */

chatInputForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const question = chatField.value.trim();
    if (!question || !userProfile) return;

    // Render user question bubble instantly aligned right
    appendMessage('user', question, 'You');
    chatField.value = '';

    // Push to history context
    chatHistory.push({ role: 'user', message: question });
    scrollToBottom();

    // Lock console during request and show typing pulses
    setChatConsoleLocked(true);

    try {
        const response = await fetch(getApiUrl('/api/chat-futureme'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userProfile,
                chatHistory,
                question
            })
        });

        const result = await response.json();

        if (result.success && result.reply) {
            setChatConsoleLocked(false);
            
            // Append FutureSelf answer aligned left
            appendMessage('ai', result.reply, `Future ${userProfile.name}`);
            
            // Cache answer into history context
            chatHistory.push({ role: 'futureme', message: result.reply });
            scrollToBottom();
        } else {
            throw new Error(result.error || 'Server could not parse reply.');
        }

    } catch (err) {
        console.error('[Dialogue Chat Error]:', err);
        setChatConsoleLocked(false);
        
        // Append error warning bubble inside chat history timeline
        const errorBubble = document.createElement('div');
        errorBubble.className = 'msg msg-ai';
        errorBubble.style.borderColor = 'rgba(255, 82, 82, 0.3)';
        errorBubble.style.background = 'rgba(255, 82, 82, 0.05)';
        errorBubble.innerHTML = `
            <div class="msg-label" style="color: #ff5252;">Connection Error</div>
            FutureMe could not respond right now: ${err.message}. Make sure your connection is stable and try again.
        `;
        chatMessagesContainer.appendChild(errorBubble);
        scrollToBottom();
    }
});

/**
 * Creates and appends dialogue speech bubble into timeline panel
 */
function appendMessage(role, text, displayName) {
    const bubble = document.createElement('div');
    bubble.className = `msg msg-${role === 'user' ? 'user' : 'ai'}`;

    const label = document.createElement('div');
    label.className = 'msg-label';
    label.textContent = displayName;

    const body = document.createElement('div');
    body.innerHTML = escapeHtml(text).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = getFormattedTime();

    bubble.appendChild(label);
    bubble.appendChild(body);
    bubble.appendChild(time);

    chatMessagesContainer.appendChild(bubble);
}

function setChatConsoleLocked(locked) {
    if (locked) {
        chatTypingIndicator.style.display = 'flex';
        chatField.disabled = true;
        btnSendChat.disabled = true;
    } else {
        chatTypingIndicator.style.display = 'none';
        chatField.disabled = false;
        btnSendChat.disabled = false;
        chatField.focus();
    }
}

function scrollToBottom() {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
