
document.addEventListener('DOMContentLoaded', () => {
    const flashcardsManager = {
        init() {
            this.setupElements();
            this.setupEventListeners();
            this.loadUserPreferences();
            this.loadDictionary();
        },

        setupElements() {
            this.flipCard = document.getElementById('flipCard');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.sidebarToggle = document.getElementById('sidebarToggle');
            this.themeToggle = document.getElementById('themeToggle');
            this.themeMenu = document.querySelector('.theme-menu');
            this.dictionaryBtn = document.querySelector('.fa-book').parentElement;
            this.currentWord = document.querySelector('.word').textContent;
        },

        setupEventListeners() {
            // Card flip - only when clicking the card area, not buttons
            this.flipCard.addEventListener('click', (e) => {
                if (!e.target.closest('.icon-btn') && !e.target.closest('.control-btn')) {
                    this.toggleFlip();
                }
            });
            
            // Navigation
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.previousCard();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextCard();
            });
            
            // Sidebar toggle
            this.sidebarToggle.addEventListener('click', () => {
                document.querySelector('.app-container').classList.toggle('sidebar-open');
            });

            // Theme toggle
            this.themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.themeMenu.classList.toggle('active');
            });

            // Dictionary lookup
            this.dictionaryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDictionary(this.currentWord);
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.previousCard();
                if (e.key === 'ArrowRight') this.nextCard();
                if (e.key === ' ') this.toggleFlip();
            });

            // Close theme menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.themeToggle.contains(e.target)) {
                    this.themeMenu.classList.remove('active');
                }
            });
        },

        toggleFlip() {
            this.flipCard.classList.toggle('flipped');
        },

        previousCard() {
            // Implementation for previous card
            console.log('Previous card');
        },

        nextCard() {
            // Implementation for next card
            console.log('Next card');
        },

        loadUserPreferences() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
        },

        async showDictionary(word) {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                const data = await response.json();
                
                if (data && data[0]) {
                    const wordData = data[0];
                    const meanings = wordData.meanings;
                    const phonetics = wordData.phonetics[0]?.text || '';
                    const audioUrl = wordData.phonetics[0]?.audio || '';
                    
                    // Create and show modal
                    const modal = document.createElement('div');
                    modal.className = 'dictionary-modal';
                    
                    const meaningsHTML = meanings.map(meaning => {
                        const examples = meaning.definitions
                            .filter(def => def.example)
                            .map(def => `<li class="example-item">"${def.example}"</li>`)
                            .join('');
                            
                        const synonyms = meaning.synonyms
                            .map(syn => `<span class="synonym-chip">${syn}</span>`)
                            .join('');
                            
                        return `
                            <div class="meaning-block">
                                <div class="meaning-header">
                                    <span class="part-of-speech">${meaning.partOfSpeech}</span>
                                    ${phonetics ? `<span class="phonetic">${phonetics}</span>` : ''}
                                    ${audioUrl ? `<button class="play-audio" data-audio="${audioUrl}">
                                        <i class="fas fa-volume-up"></i>
                                    </button>` : ''}
                                </div>
                                <div class="definitions-list">
                                    ${meaning.definitions.map((def, idx) => `
                                        <div class="definition-item">
                                            <span class="definition-number">${idx + 1}.</span>
                                            <p class="definition-text">${def.definition}</p>
                                        </div>
                                    `).join('')}
                                </div>
                                ${examples ? `
                                    <div class="examples-section">
                                        <h4>Examples:</h4>
                                        <ul class="examples-list">${examples}</ul>
                                    </div>
                                ` : ''}
                                ${synonyms ? `
                                    <div class="synonyms-section">
                                        <h4>Synonyms:</h4>
                                        <div class="synonyms-list">${synonyms}</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('');

                    modal.innerHTML = `
                        <div class="dictionary-content">
                            <div class="dictionary-header">
                                <h2>${word}</h2>
                                <button class="close-modal-btn" id="closeDict"><i class="fas fa-times"></i></button>
                            </div>
                            <div class="dictionary-body">
                                <div class="meanings-container">
                                    ${meaningsHTML}
                                </div>
                                <div class="chat-section">
                                    <div class="chat-messages" id="chatMessages"></div>
                                    <div class="chat-input-container">
                                        <textarea class="chat-input" 
                                            placeholder="Ask a question about this word..."></textarea>
                                        <button class="chat-send-btn">
                                            <i class="fas fa-paper-plane"></i>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    // Chat functionality
                    const chatInput = modal.querySelector('.chat-input');
                    const chatMessages = modal.querySelector('.chat-messages');
                    const sendBtn = modal.querySelector('.chat-send-btn');

                    const addMessage = (text, isUser = true) => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
                        msgDiv.innerHTML = `
                            <div class="message-content">
                                <span class="message-text">${text}</span>
                                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                            </div>
                        `;
                        chatMessages.appendChild(msgDiv);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    };

                    sendBtn.addEventListener('click', () => {
                        const text = chatInput.value.trim();
                        if (text) {
                            addMessage(text);
                            // Simulate bot response
                            setTimeout(() => {
                                addMessage(`Here's some information about "${text}" related to "${word}"...`, false);
                            }, 1000);
                            chatInput.value = '';
                        }
                    });

                    chatInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            sendBtn.click();
                        }
                    });

                    // Close modal functionality
                    const closeBtn = modal.querySelector('#closeDict');
                    closeBtn.addEventListener('click', () => {
                        modal.remove();
                    });

                    // Close on outside click
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.remove();
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching dictionary data:', error);
            }
        },

        loadDictionary() {
            // Preload dictionary data if needed
        }
    };

    flashcardsManager.init();
});
