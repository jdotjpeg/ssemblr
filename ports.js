document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const gameSetup = document.getElementById('gameSetup');
    const gamePlay = document.getElementById('gamePlay');
    const gameResults = document.getElementById('gameResults');
    
    // Setup elements
    const gameModeSelect = document.getElementById('gameMode');
    const difficultySelect = document.getElementById('difficulty');
    const questionCountSelect = document.getElementById('questionCount');
    const startGameBtn = document.getElementById('startGame');
    
    // Game play elements
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const timerContainer = document.getElementById('timerContainer');
    const questionText = document.getElementById('questionText');
    
    // Answer containers
    const multipleChoiceContainer = document.getElementById('multipleChoiceContainer');
    const matchingContainer = document.getElementById('matchingContainer');
    const speedChallengeContainer = document.getElementById('speedChallengeContainer');
    
    // Feedback elements
    const feedback = document.getElementById('feedback');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const portNumber = document.getElementById('portNumber');
    const portService = document.getElementById('portService');
    const portProtocol = document.getElementById('portProtocol');
    const portDescription = document.getElementById('portDescription');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    
    // Results elements
    const finalScoreEl = document.getElementById('finalScore');
    const correctAnswersEl = document.getElementById('correctAnswers');
    const timeTakenEl = document.getElementById('timeTaken');
    const playAgainBtn = document.getElementById('playAgain');
    const changeOptionsBtn = document.getElementById('changeOptions');
    
    // Game state
    let gameState = {
        mode: 'multiple',
        difficulty: 'easy',
        questionCount: 10,
        currentQuestion: 0,
        score: 0,
        correctAnswers: 0,
        startTime: 0,
        timerInterval: null,
        elapsedTime: 0,
        questions: [],
        currentQuestionData: null,
        selectedMatches: []
    };
    
    // Port database - Common TCP/UDP ports with their services, protocols, and descriptions
    const portDatabase = [
        // Common ports (Easy)
        { port: 20, service: 'FTP Data', protocol: 'TCP', description: 'File Transfer Protocol data transfer', difficulty: 'easy' },
        { port: 21, service: 'FTP Control', protocol: 'TCP', description: 'File Transfer Protocol command control', difficulty: 'easy' },
        { port: 22, service: 'SSH', protocol: 'TCP', description: 'Secure Shell for remote login', difficulty: 'easy' },
        { port: 23, service: 'Telnet', protocol: 'TCP', description: 'Unencrypted text communications', difficulty: 'easy' },
        { port: 25, service: 'SMTP', protocol: 'TCP', description: 'Simple Mail Transfer Protocol for email', difficulty: 'easy' },
        { port: 53, service: 'DNS', protocol: 'TCP/UDP', description: 'Domain Name System for name resolution', difficulty: 'easy' },
        { port: 67, service: 'DHCP Server', protocol: 'UDP', description: 'Dynamic Host Configuration Protocol server', difficulty: 'easy' },
        { port: 68, service: 'DHCP Client', protocol: 'UDP', description: 'Dynamic Host Configuration Protocol client', difficulty: 'easy' },
        { port: 69, service: 'TFTP', protocol: 'UDP', description: 'Trivial File Transfer Protocol', difficulty: 'easy' },
        { port: 80, service: 'HTTP', protocol: 'TCP', description: 'Hypertext Transfer Protocol for web pages', difficulty: 'easy' },
        { port: 110, service: 'POP3', protocol: 'TCP', description: 'Post Office Protocol version 3 for email retrieval', difficulty: 'easy' },
        { port: 123, service: 'NTP', protocol: 'UDP', description: 'Network Time Protocol for time synchronization', difficulty: 'easy' },
        { port: 143, service: 'IMAP', protocol: 'TCP', description: 'Internet Message Access Protocol for email retrieval', difficulty: 'easy' },
        { port: 161, service: 'SNMP', protocol: 'UDP', description: 'Simple Network Management Protocol', difficulty: 'easy' },
        { port: 443, service: 'HTTPS', protocol: 'TCP', description: 'HTTP Secure for encrypted web communication', difficulty: 'easy' },
        
        // Medium difficulty ports
        { port: 137, service: 'NetBIOS Name', protocol: 'TCP/UDP', description: 'NetBIOS Name Service', difficulty: 'medium' },
        { port: 138, service: 'NetBIOS Datagram', protocol: 'UDP', description: 'NetBIOS Datagram Service', difficulty: 'medium' },
        { port: 139, service: 'NetBIOS Session', protocol: 'TCP', description: 'NetBIOS Session Service', difficulty: 'medium' },
        { port: 389, service: 'LDAP', protocol: 'TCP/UDP', description: 'Lightweight Directory Access Protocol', difficulty: 'medium' },
        { port: 445, service: 'SMB', protocol: 'TCP', description: 'Server Message Block over TCP/IP', difficulty: 'medium' },
        { port: 465, service: 'SMTPS', protocol: 'TCP', description: 'SMTP over SSL', difficulty: 'medium' },
        { port: 514, service: 'Syslog', protocol: 'UDP', description: 'System Logging Protocol', difficulty: 'medium' },
        { port: 587, service: 'SMTP Submission', protocol: 'TCP', description: 'Email message submission', difficulty: 'medium' },
        { port: 636, service: 'LDAPS', protocol: 'TCP/UDP', description: 'LDAP over SSL', difficulty: 'medium' },
        { port: 993, service: 'IMAPS', protocol: 'TCP', description: 'IMAP over SSL', difficulty: 'medium' },
        { port: 995, service: 'POP3S', protocol: 'TCP', description: 'POP3 over SSL', difficulty: 'medium' },
        { port: 1433, service: 'MSSQL', protocol: 'TCP', description: 'Microsoft SQL Server database', difficulty: 'medium' },
        { port: 1521, service: 'Oracle', protocol: 'TCP', description: 'Oracle database default listener', difficulty: 'medium' },
        { port: 3306, service: 'MySQL', protocol: 'TCP', description: 'MySQL database system', difficulty: 'medium' },
        { port: 3389, service: 'RDP', protocol: 'TCP', description: 'Remote Desktop Protocol', difficulty: 'medium' },
        
        // Hard difficulty ports
        { port: 179, service: 'BGP', protocol: 'TCP', description: 'Border Gateway Protocol', difficulty: 'hard' },
        { port: 427, service: 'SLP', protocol: 'TCP/UDP', description: 'Service Location Protocol', difficulty: 'hard' },
        { port: 500, service: 'IKE', protocol: 'UDP', description: 'Internet Key Exchange for IPsec', difficulty: 'hard' },
        { port: 546, service: 'DHCPv6 Client', protocol: 'UDP', description: 'DHCPv6 client', difficulty: 'hard' },
        { port: 547, service: 'DHCPv6 Server', protocol: 'UDP', description: 'DHCPv6 server', difficulty: 'hard' },
        { port: 902, service: 'VMware Server', protocol: 'TCP', description: 'VMware Server Console', difficulty: 'hard' },
        { port: 989, service: 'FTPS Data', protocol: 'TCP', description: 'FTP over SSL/TLS data transfer', difficulty: 'hard' },
        { port: 990, service: 'FTPS Control', protocol: 'TCP', description: 'FTP over SSL/TLS control', difficulty: 'hard' },
        { port: 1701, service: 'L2TP', protocol: 'UDP', description: 'Layer 2 Tunneling Protocol', difficulty: 'hard' },
        { port: 1723, service: 'PPTP', protocol: 'TCP', description: 'Point-to-Point Tunneling Protocol', difficulty: 'hard' },
        { port: 1812, service: 'RADIUS Auth', protocol: 'UDP', description: 'RADIUS authentication protocol', difficulty: 'hard' },
        { port: 1813, service: 'RADIUS Accounting', protocol: 'UDP', description: 'RADIUS accounting protocol', difficulty: 'hard' },
        { port: 3128, service: 'Squid Proxy', protocol: 'TCP', description: 'Squid caching proxy', difficulty: 'hard' },
        { port: 5060, service: 'SIP', protocol: 'TCP/UDP', description: 'Session Initiation Protocol', difficulty: 'hard' },
        { port: 5061, service: 'SIPS', protocol: 'TCP', description: 'SIP over TLS', difficulty: 'hard' }
    ];
    
    // Start game event
    startGameBtn.addEventListener('click', function() {
        gameState.mode = gameModeSelect.value;
        gameState.difficulty = difficultySelect.value;
        gameState.questionCount = parseInt(questionCountSelect.value);
        
        if (questionCountSelect.value === 'all') {
            gameState.questionCount = getQuestionPool().length;
        }
        
        initGame();
    });
    
    // Next question event
    nextQuestionBtn.addEventListener('click', function() {
        feedback.style.display = 'none';
        gameState.currentQuestion++;
        
        if (gameState.currentQuestion < gameState.questions.length) {
            showQuestion();
        } else {
            endGame();
        }
    });
    
    // Play again event
    playAgainBtn.addEventListener('click', function() {
        initGame();
    });
    
    // Change options event
    changeOptionsBtn.addEventListener('click', function() {
        gameResults.style.display = 'none';
        gameSetup.style.display = 'block';
    });
    
    // Handle answer submission for speed challenge
    document.getElementById('submitPortAnswer').addEventListener('click', function() {
        const answer = document.getElementById('portAnswer').value;
        handleSpeedAnswer(answer);
    });
    
    // Helper functions
    function getQuestionPool() {
        let pool = [];
        
        switch(gameState.difficulty) {
            case 'easy':
                pool = portDatabase.filter(port => port.difficulty === 'easy');
                break;
            case 'medium':
                pool = portDatabase.filter(port => port.difficulty === 'easy' || port.difficulty === 'medium');
                break;
            case 'hard':
                pool = portDatabase;
                break;
            default:
                pool = portDatabase.filter(port => port.difficulty === 'easy');
        }
        
        return pool;
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    function generateQuestions() {
        const pool = getQuestionPool();
        const shuffled = shuffleArray(pool);
        return shuffled.slice(0, gameState.questionCount);
    }
    
    function initGame() {
        // Reset game state
        gameState.currentQuestion = 0;
        gameState.score = 0;
        gameState.correctAnswers = 0;
        gameState.elapsedTime = 0;
        gameState.questions = generateQuestions();
        
        // Update UI
        gameSetup.style.display = 'none';
        gameResults.style.display = 'none';
        gamePlay.style.display = 'block';
        
        // Set total questions
        totalQuestionsEl.textContent = gameState.questions.length;
        
        // Start timer
        startTimer();
        
        // Show first question
        showQuestion();
    }
    
    function showQuestion() {
        currentQuestionEl.textContent = gameState.currentQuestion + 1;
        scoreEl.textContent = gameState.score;
        
        // Get current question data
        gameState.currentQuestionData = gameState.questions[gameState.currentQuestion];
        
        // Clear previous answers
        document.getElementById('portAnswer').value = '';
        
        // Show appropriate game mode
        switch(gameState.mode) {
            case 'multiple':
                showMultipleChoiceQuestion();
                break;
            case 'matching':
                showMatchingQuestion();
                break;
            case 'speed':
                showSpeedQuestion();
                break;
        }
    }
    
    function showMultipleChoiceQuestion() {
        // Show multiple choice container
        multipleChoiceContainer.style.display = 'block';
        matchingContainer.style.display = 'none';
        speedChallengeContainer.style.display = 'none';
        
        // Get current question data
        const currentPort = gameState.currentQuestionData;
        
        // Set question text
        questionText.textContent = `What service uses port ${currentPort.port}?`;
        
        // Create answer options container
        const answerOptions = document.getElementById('answerOptions');
        answerOptions.innerHTML = '';
        
        // Get answer options
        const correctAnswer = currentPort.service;
        let options = [correctAnswer];
        
        while (options.length < 4) {
            const randomPort = gameState.questions[Math.floor(Math.random() * gameState.questions.length)];
            if (randomPort.service !== correctAnswer && !options.includes(randomPort.service)) {
                options.push(randomPort.service);
            }
        }
        
        // Shuffle options
        options = shuffleArray(options);
        
        // Create buttons for each option
        const letters = ['A', 'B', 'C', 'D'];
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            
            const letterSpan = document.createElement('span');
            letterSpan.className = 'option-letter';
            letterSpan.textContent = letters[index];
            
            button.appendChild(letterSpan);
            button.appendChild(document.createTextNode(' ' + option));
            
            button.addEventListener('click', function() {
                handleMultipleChoiceAnswer(option, correctAnswer);
            });
            
            answerOptions.appendChild(button);
        });
    }
    
    function generateMultipleChoiceOptions(correctPort) {
        // Start with the correct option
        const options = [correctPort];
        
        // Get all ports in the database
        const allPorts = portDatabase.map(item => item.port);
        
        // Filter out the correct port
        const incorrectPorts = allPorts.filter(port => port !== correctPort);
        
        // Shuffle and take 3
        const shuffledIncorrect = shuffleArray(incorrectPorts);
        options.push(shuffledIncorrect[0], shuffledIncorrect[1], shuffledIncorrect[2]);
        
        return options;
    }
    
    function generateServiceOptions(correctService) {
        // Start with the correct option
        const options = [correctService];
        
        // Get all services in the database
        const allServices = portDatabase.map(item => item.service);
        
        // Filter out the correct service
        const incorrectServices = allServices.filter(service => service !== correctService);
        
        // Shuffle and take 3
        const shuffledIncorrect = shuffleArray(incorrectServices);
        options.push(shuffledIncorrect[0], shuffledIncorrect[1], shuffledIncorrect[2]);
        
        return options;
    }
    
    function handleMultipleChoiceAnswer(answer, correctAnswer) {
        const isCorrect = answer === correctAnswer;
        
        if (isCorrect) {
            gameState.score += 10;
            gameState.correctAnswers++;
            feedbackTitle.textContent = 'Correct!';
        } else {
            feedbackTitle.textContent = 'Incorrect!';
        }
        
        // Update feedback
        const currentPort = gameState.currentQuestionData;
        feedbackMessage.textContent = `${currentPort.service} uses port ${currentPort.port}.`;
        portNumber.textContent = currentPort.port;
        portService.textContent = currentPort.service;
        portProtocol.textContent = currentPort.protocol;
        portDescription.textContent = currentPort.description;
        
        feedback.style.display = 'flex';
    }
    
    function showMatchingQuestion() {
        // Show matching container
        multipleChoiceContainer.style.display = 'none';
        matchingContainer.style.display = 'block';
        speedChallengeContainer.style.display = 'none';
        
        // Clear previous content
        const portsContainer = matchingContainer.querySelector('.matching-ports');
        const servicesContainer = matchingContainer.querySelector('.matching-services');
        portsContainer.innerHTML = '';
        servicesContainer.innerHTML = '';
        
        questionText.textContent = 'Match the ports with their corresponding services:';
        
        // Get 5 random ports from the current question (which itself is random)
        const matchingPorts = shuffleArray(gameState.questions).slice(0, 5);
        
        // Create port buttons
        matchingPorts.forEach(port => {
            const portBtn = document.createElement('button');
            portBtn.className = 'matching-btn port-btn';
            portBtn.dataset.port = port.port;
            portBtn.textContent = port.port;
            
            portBtn.addEventListener('click', function() {
                handleMatchingSelection(this, 'port');
            });
            
            portsContainer.appendChild(portBtn);
        });
        
        // Create service buttons (shuffled)
        shuffleArray([...matchingPorts]).forEach(port => {
            const serviceBtn = document.createElement('button');
            serviceBtn.className = 'matching-btn service-btn';
            serviceBtn.dataset.service = port.service;
            serviceBtn.dataset.port = port.port;
            serviceBtn.textContent = port.service;
            
            serviceBtn.addEventListener('click', function() {
                handleMatchingSelection(this, 'service');
            });
            
            servicesContainer.appendChild(serviceBtn);
        });
        
        // Reset selected matches
        gameState.selectedMatches = [];
    }
    
    function handleMatchingSelection(button, type) {
        // Check if we already have a selection of this type
        const existingSelection = gameState.selectedMatches.find(match => match.type === type);
        
        // Remove previous selection of this type if exists
        if (existingSelection) {
            const prevButton = existingSelection.button;
            prevButton.classList.remove('selected');
            gameState.selectedMatches = gameState.selectedMatches.filter(match => match.type !== type);
        }
        
        // Add new selection
        button.classList.add('selected');
        gameState.selectedMatches.push({
            type: type,
            button: button,
            port: button.dataset.port,
            service: button.dataset.service
        });
        
        // Check if we have both port and service selected
        if (gameState.selectedMatches.length === 2) {
            // Get the port and service selections
            const portSelection = gameState.selectedMatches.find(match => match.type === 'port');
            const serviceSelection = gameState.selectedMatches.find(match => match.type === 'service');
            
            // Check if they match
            if (portSelection.port === serviceSelection.port) {
                // Correct match
                portSelection.button.classList.add('matched');
                serviceSelection.button.classList.add('matched');
                portSelection.button.disabled = true;
                serviceSelection.button.disabled = true;
                
                // Add points
                gameState.score += 5;
                scoreEl.textContent = gameState.score;
                
                // Check if all are matched
                const allMatched = document.querySelectorAll('.matching-btn.matched').length === 10; // 5 pairs = 10 buttons
                if (allMatched) {
                    handleAllMatches();
                }
            } else {
                // Incorrect match - flash red briefly
                portSelection.button.classList.add('mismatch');
                serviceSelection.button.classList.add('mismatch');
                
                setTimeout(() => {
                    portSelection.button.classList.remove('mismatch', 'selected');
                    serviceSelection.button.classList.remove('mismatch', 'selected');
                }, 500);
            }
            
            // Reset selections after processing
            gameState.selectedMatches = [];
        }
    }
    
    function handleAllMatches() {
        // All pairs have been matched correctly
        gameState.correctAnswers++;
        
        // Show feedback with the port details from the current question
        const currentPort = gameState.currentQuestionData;
        feedbackTitle.textContent = 'Excellent!';
        feedbackMessage.textContent = 'You\'ve successfully matched all ports to their services!';
        portNumber.textContent = currentPort.port;
        portService.textContent = currentPort.service;
        portProtocol.textContent = currentPort.protocol;
        portDescription.textContent = currentPort.description;
        
        feedback.style.display = 'flex';
    }
    
    function showSpeedQuestion() {
        // Show speed challenge container
        multipleChoiceContainer.style.display = 'none';
        matchingContainer.style.display = 'none';
        speedChallengeContainer.style.display = 'block';
        
        const currentPort = gameState.currentQuestionData;
        
        // Always ask for the port number in speed challenge
        questionText.textContent = `What is the default port for ${currentPort.service}?`;
        
        // Focus on the input field
        document.getElementById('portAnswer').focus();
    }
    
    function handleSpeedAnswer(answer) {
        const currentPort = gameState.currentQuestionData;
        const isCorrect = parseInt(answer) === currentPort.port;
        
        if (isCorrect) {
            // Add bonus points based on speed (up to 5 extra points)
            const timeBonus = Math.max(5 - Math.floor(gameState.elapsedTime / 10), 0);
            gameState.score += 10 + timeBonus;
            gameState.correctAnswers++;
            feedbackTitle.textContent = 'Correct!';
            feedbackMessage.textContent = `${currentPort.service} uses port ${currentPort.port}. +${10 + timeBonus} points!`;
        } else {
            feedbackTitle.textContent = 'Incorrect!';
            feedbackMessage.textContent = `${currentPort.service} uses port ${currentPort.port}.`;
        }
        
        // Update feedback
        portNumber.textContent = currentPort.port;
        portService.textContent = currentPort.service;
        portProtocol.textContent = currentPort.protocol;
        portDescription.textContent = currentPort.description;
        
        feedback.style.display = 'flex';
    }
    
    function startTimer() {
        gameState.startTime = Date.now();
        gameState.elapsedTime = 0;
        
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        gameState.timerInterval = setInterval(function() {
            gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
            timerEl.textContent = gameState.elapsedTime;
        }, 1000);
    }
    
    function endGame() {
        // Stop timer
        clearInterval(gameState.timerInterval);
        
        // Update results
        finalScoreEl.textContent = gameState.score;
        correctAnswersEl.textContent = `${gameState.correctAnswers}/${gameState.questions.length}`;
        timeTakenEl.textContent = `${gameState.elapsedTime}s`;
        
        // Show results
        gamePlay.style.display = 'none';
        gameResults.style.display = 'block';
    }
}); 