// Global variables
let saveTimeout;
let musicAudio = null;

// DOM Elements
const storyText = document.getElementById('story-text');
const saveBtn = document.getElementById('save-btn');
const clearStoryBtn = document.getElementById('clear-story');
const downloadPdfBtn = document.getElementById('download-pdf');
const aiMuseBtn = document.getElementById('ai-muse');
const saveIndicator = document.getElementById('save-indicator');
const themeBtns = document.querySelectorAll('.theme-btn');
const musicToggle = document.getElementById('music-toggle');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    loadTheme();
    setupEventListeners();
    
    // Show quote popup on first load (with a small delay)
    setTimeout(showQuotePopup, 1000);
});

// Setup event listeners
function setupEventListeners() {
    // Story text auto-save
    storyText.addEventListener('input', debounce(autoSave, 1000));
    
    // Button events
    saveBtn.addEventListener('click', saveToStorage);
    clearStoryBtn.addEventListener('click', clearStory);
    aiMuseBtn.addEventListener('click', showCreativePrompt);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    musicToggle.addEventListener('click', toggleMusic);
    
    // Theme buttons
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.className = '';
            const theme = btn.dataset.theme;
            if (theme) {
                document.body.classList.add(theme);
                localStorage.setItem('dreamInkTheme', theme);
            }
        });
    });
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('dreamInkTheme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
}

// Load from localStorage
function loadFromStorage() {
    const savedData = localStorage.getItem('dreamInkData');
    if (savedData) {
        const data = JSON.parse(savedData);
        storyText.value = data.story || '';
    }
}

// Save to localStorage with debounce
function autoSave() {
    const data = {
        story: storyText.value,
        sketch: getCanvasData() // This function is in sketch.js
    };
    localStorage.setItem('dreamInkData', JSON.stringify(data));
    
    // Show save indicator
    saveIndicator.classList.add('show');
    setTimeout(() => {
        saveIndicator.classList.remove('show');
    }, 2000);
    
    // Also save to stories library
    saveToStoriesLibrary();
}

// Manual save function
function saveToStorage() {
    autoSave();
}

// Clear story
function clearStory() {
    if (confirm('Are you sure you want to clear your story?')) {
        storyText.value = '';
        autoSave();
    }
}

// Save to stories library
function saveToStoriesLibrary() {
    const stories = JSON.parse(localStorage.getItem('dreamInkStories')) || [];
    const currentData = JSON.parse(localStorage.getItem('dreamInkData'));
    
    if (currentData && (currentData.story.trim() || currentData.sketch)) {
        // Check if we already have a draft
        const existingIndex = stories.findIndex(story => story.isDraft);
        
        if (existingIndex !== -1) {
            // Update existing draft
            stories[existingIndex] = {
                ...stories[existingIndex],
                story: currentData.story,
                sketch: currentData.sketch,
                timestamp: Date.now()
            };
        } else {
            // Create new draft
            stories.unshift({
                title: currentData.story.substring(0, 30) + (currentData.story.length > 30 ? '...' : ''),
                story: currentData.story,
                sketch: currentData.sketch,
                timestamp: Date.now(),
                isDraft: true
            });
        }
        
        localStorage.setItem('dreamInkStories', JSON.stringify(stories));
    }
}

// Creative prompts for AI Muse
const creativePrompts = [
    "Write about a character who discovers a hidden door in their childhood bedroom.",
    "Sketch a creature that lives in the space between raindrops.",
    "Tell the story of the last letter that was never sent.",
    "Draw a tree that grows memories instead of leaves.",
    "Write about someone who can taste colors and smell sounds.",
    "Sketch a library where books write themselves.",
    "Tell the story of a person who collects lost dreams.",
    "Draw a city that exists only at twilight.",
    "Write about an object that changes its purpose every day.",
    "Sketch a bridge made of crystallized music."
];

// Show creative prompt
function showCreativePrompt() {
    const randomPrompt = creativePrompts[Math.floor(Math.random() * creativePrompts.length)];
    alert(`✨ AI Muse says: ${randomPrompt}`);
}

// Quote of the day popup
function showQuotePopup() {
    const quotes = [
        { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
        { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
        { text: "Creativity takes courage.", author: "Henri Matisse" },
        { text: "Art is the only way to run away without leaving home.", author: "Twyla Tharp" },
        { text: "The true work of art is but a shadow of the divine perfection.", author: "Michelangelo" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const popup = document.createElement('div');
    popup.className = 'quote-popup';
    popup.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-author">- ${randomQuote.author}</p>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 20px; cursor: pointer;">Continue Creating</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Download PDF functionality (simplified for demo)
function downloadPDF() {
    alert("PDF download functionality would be implemented here. In a real application, this would combine your story and sketch into a downloadable PDF file.");
}

// Toggle background music
function toggleMusic() {
    if (!musicAudio) {
        musicAudio = new Audio('assets/music/calm-music.mp3'); // Placeholder
        musicAudio.loop = true;
    }
    
    if (musicAudio.paused) {
        musicAudio.play();
        musicToggle.textContent = '🎵';
        musicToggle.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
    } else {
        musicAudio.pause();
        musicToggle.textContent = '🔇';
        musicToggle.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
    }
}

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
                  }
