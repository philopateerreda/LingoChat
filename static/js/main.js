document.addEventListener('DOMContentLoaded', () => {
    // Gamification Features
    class GamificationSystem {
        constructor() {
            this.xp = 750;
            this.maxXp = 1000;
            this.level = 'B2';
            this.streak = 15;
            this.chatsToday = 24;
            this.wordsLearned = 158;

            this.initializeElements();
            this.updateDisplay();
        }

        initializeElements() {
            this.elements = {
                xpProgress: document.getElementById('xpProgress'),
                xpText: document.getElementById('xpText'),
                userLevel: document.getElementById('userLevel'),
                streakDays: document.getElementById('streakDays'),
                chatStats: document.getElementById('chatStats'),
                wordStats: document.getElementById('wordStats')
            };
        }

        updateDisplay() {
            this.elements.xpProgress.style.width = `${(this.xp / this.maxXp) * 100}%`;
            this.elements.xpText.textContent = `${this.xp}/${this.maxXp} XP`;
            this.elements.userLevel.textContent = this.level;
            this.elements.streakDays.textContent = `${this.streak} day streak`;
        }

        addXp(amount) {
            this.xp = Math.min(this.xp + amount, this.maxXp);
            if (this.xp >= this.maxXp) {
                this.levelUp();
            }
            this.updateDisplay();
        }

        levelUp() {
            // Implement level up logic
            this.xp = 0;
            // Update level based on progression system
        }

        incrementStreak() {
            this.streak++;
            this.updateDisplay();
        }
    }

    const gamification = new GamificationSystem();

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const appContainer = document.querySelector('.app-container');

    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-open');
    });
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const charCounter = document.querySelector('.char-counter');
    const modal = document.getElementById('wordModal');
    const modalClose = document.getElementById('modalClose');
    const modalDismiss = document.getElementById('modalDismiss');
    const maxLength = 500;
    let isWaitingForResponse = false;

    // Modal close functionality
    function closeModal() {
        modal.classList.remove('active');
    }

    modalClose.addEventListener('click', closeModal);
    modalDismiss.addEventListener('click', closeModal);

    messageInput.addEventListener('input', () => {
        const remaining = maxLength - messageInput.value.length;
        charCounter.textContent = `${messageInput.value.length}/${maxLength}`;

        if (remaining < 0) {
            messageInput.value = messageInput.value.slice(0, maxLength);
        }
    });

    function setWaitingState(waiting) {
        isWaitingForResponse = waiting;
        messageInput.disabled = waiting;
        sendBtn.disabled = waiting;

        if (waiting) {
            sendBtn.classList.add('disabled');
        } else {
            sendBtn.classList.remove('disabled');
        }
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && !isWaitingForResponse) {
            setWaitingState(true);

            const messageElement = document.createElement('div');
            messageElement.className = 'message message-user';

            const contentElement = processMessageContent(message);

            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            messageElement.appendChild(contentElement);
            messageElement.appendChild(timestamp);
            chatMessages.appendChild(messageElement);

            messageInput.value = '';
            charCounter.textContent = '0/500';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(botResponse, 1500);
        }
    }

    function botResponse() {
        const responses = [
            "I understand what you're saying. Please tell me more.",
            "That's interesting! How does that make you feel?",
            "I'm processing your message. Can you elaborate?",
            "Let me analyze that for a moment...",
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const messageElement = document.createElement('div');
        messageElement.className = 'message message-bot';

        const contentElement = processMessageContent(randomResponse, true);

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageElement.appendChild(contentElement);
        messageElement.appendChild(timestamp);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setWaitingState(false);
    }

    function processMessageContent(text, isBot = false) {
        const words = text.split(' ');
        const container = document.createElement('div');
        container.className = 'message-content';

        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'clickable-word';
            wordSpan.textContent = word;

            wordSpan.addEventListener('click', () => {
                const modal = document.getElementById('wordModal');
                const modalWord = document.getElementById('modalWord');
                modalWord.textContent = word;
                modal.classList.add('active');
            });

            container.appendChild(wordSpan);
            if (index < words.length - 1) {
                container.appendChild(document.createTextNode(' '));
            }
        });

        return container;
    }


    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isWaitingForResponse) {
            e.preventDefault();
            sendMessage();
        }
    });

    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        // Wrap each nav item in a container
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-item-wrapper';
        item.parentNode.insertBefore(wrapper, item);
        wrapper.appendChild(item);
        
        const createDropdown = (item) => {
            const dropdown = document.createElement('div');
            dropdown.className = 'nav-dropdown';
            const navText = item.querySelector('span').textContent.trim();

            switch(navText) {
                case 'Chat':
                    dropdown.innerHTML = `
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Recent Chats</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-comment"></i>
                                <div>Grammar Practice (2m ago)</div>
                            </div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-comment"></i>
                                <div>Vocabulary Review (1h ago)</div>
                            </div>
                        </div>
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Words Learned</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-book"></i>
                                <div>12 new words today</div>
                            </div>
                        </div>
                    `;
                    break;
                case 'Flashcards':
                    dropdown.innerHTML = `
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Progress</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    Mastered Cards (75%)
                                    <div class="progress-indicator">
                                        <div class="progress" style="width: 75%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Suggested Words</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-plus"></i>
                                <div>5 words to review</div>
                            </div>
                        </div>
                    `;
                    break;
                case 'Transcripts':
                    dropdown.innerHTML = `
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Uploaded Files</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-file-alt"></i>
                                <div>Lesson 1.txt</div>
                            </div>
                        </div>
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Extracted Words</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-lightbulb"></i>
                                <div>15 words found</div>
                            </div>
                        </div>
                    `;
                    break;
                case 'Leaderboard':
                    dropdown.innerHTML = `
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Global Rankings</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-trophy"></i>
                                <div>Rank #5 Globally</div>
                            </div>
                        </div>
                        <div class="nav-dropdown-section">
                            <div class="nav-dropdown-title">Streak Milestones</div>
                            <div class="nav-dropdown-item">
                                <i class="fas fa-fire"></i>
                                <div>15 Day Streak!</div>
                            </div>
                        </div>
                    `;
                    break;
            }
            return dropdown;
        };

        // Create and append dropdown
        const dropdown = createDropdown(item);
        item.appendChild(dropdown);

        item.addEventListener('click', (e) => {
            e.preventDefault();
            const allWrappers = document.querySelectorAll('.nav-item-wrapper');
            const thisWrapper = item.closest('.nav-item-wrapper');
            
            allWrappers.forEach(w => {
                if (w !== thisWrapper) {
                    w.classList.remove('active', 'expanded');
                }
            });
            
            thisWrapper.classList.toggle('active');
            thisWrapper.classList.toggle('expanded');
            
            // Update positions of subsequent items
            let currentOffset = 0;
            allWrappers.forEach(w => {
                if (w.classList.contains('expanded')) {
                    currentOffset += 200; // Adjust based on dropdown height
                }
                w.style.transform = currentOffset > 0 ? `translateY(${currentOffset}px)` : '';
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const wrapper = item.closest('.nav-item-wrapper');
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('active', 'expanded');
                // Reset positions
                document.querySelectorAll('.nav-item-wrapper').forEach(w => {
                    w.style.transform = '';
                });
            }
        });
    });
});