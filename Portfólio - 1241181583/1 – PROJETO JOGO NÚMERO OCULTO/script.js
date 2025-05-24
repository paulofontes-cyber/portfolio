        document.addEventListener('DOMContentLoaded', function() {
            
            const modeScreen = document.getElementById('mode-screen');
            const setupScreen = document.getElementById('setup-screen');
            const guessingScreen = document.getElementById('guessing-screen');
            const resultScreen = document.getElementById('result-screen');
            
            const randomModeButton = document.getElementById('random-mode-button');
            const twoPlayerModeButton = document.getElementById('two-player-mode-button');
            
            const hiddenNumberInput = document.getElementById('hiddenNumber');
            const guessInput = document.getElementById('guess');
            
            const setupButton = document.getElementById('setup-button');
            const guessButton = document.getElementById('guess-button');
            const playAgainButton = document.getElementById('play-again-button');
            const changeModeButton = document.getElementById('change-mode-button');
            
            const playerIndicator = document.getElementById('player-indicator');
            const setupMessage = document.getElementById('setup-message');
            const guessMessage = document.getElementById('guess-message');
            const resultMessage = document.getElementById('result-message');
            const resultTitle = document.getElementById('result-title');
            
            const attemptsLeft = document.getElementById('attempts-left');
            const rangeText = document.getElementById('range-text');
            
            const guessHistory = document.getElementById('guess-history');
            const resultHistory = document.getElementById('result-history');

           
            let gameState = {
                mode: null,
                hiddenNumber: null,
                attempts: 0,
                maxAttempts: 5,
                guessHistory: [],
                minRange: 1,
                maxRange: 100
            };

           
            function showScreen(screen) {
                [modeScreen, setupScreen, guessingScreen, resultScreen].forEach(s => {
                    s.classList.add('hidden');
                });
                
                screen.classList.remove('hidden');
                
                if (screen === setupScreen) {
                    setTimeout(() => hiddenNumberInput.focus(), 100);
                } else if (screen === guessingScreen) {
                    setTimeout(() => guessInput.focus(), 100);
                }
            }

            function showMessage(element, text, type = '') {
                element.textContent = text;
                element.style.display = 'block';
                element.className = 'message ' + type;
                setTimeout(() => {
                    element.classList.remove(type);
                }, 600);
            }

            function updateRangeText() {
                rangeText.textContent = `🎯 O número secreto está entre ${gameState.minRange} e ${gameState.maxRange}`;
            }

            function updateGuessHistory() {
                guessHistory.innerHTML = '';
                resultHistory.innerHTML = '';
                
                gameState.guessHistory.forEach((item, index) => {
                    const historyItem = createHistoryItem(item);
                    historyItem.style.animationDelay = `${index * 0.1}s`;
                    guessHistory.appendChild(historyItem.cloneNode(true));
                    resultHistory.appendChild(historyItem.cloneNode(true));
                });
            }

            function createHistoryItem(item) {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const historyValue = document.createElement('span');
                historyValue.className = 'history-value';
                historyValue.textContent = item.value;
                
                const historyResult = document.createElement('span');
                historyResult.className = 'history-result';
                
                if (item.result === 'high') {
                    historyResult.textContent = '⬆️';
                    historyResult.style.color = '#ff6b6b';
                } else if (item.result === 'low') {
                    historyResult.textContent = '⬇️';
                    historyResult.style.color = '#4ecdc4';
                } else {
                    historyResult.textContent = '✅';
                    historyResult.style.color = '#56ab2f';
                }
                
                historyItem.appendChild(historyValue);
                historyItem.appendChild(historyResult);
                
                return historyItem;
            }

            function generateRandomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function startRandomMode() {
                gameState.mode = 'random';
                gameState.hiddenNumber = generateRandomNumber(1, 100);
                gameState.attempts = 0;
                gameState.maxAttempts = 5;
                gameState.guessHistory = [];
                gameState.minRange = 1;
                gameState.maxRange = 100;
                
                playerIndicator.classList.add('hidden');
                attemptsLeft.textContent = gameState.maxAttempts;
                updateRangeText();
                updateGuessHistory();
                
                showScreen(guessingScreen);
                
                guessInput.value = '';
                guessMessage.style.display = 'none';
            }

            function startTwoPlayerMode() {
                gameState.mode = 'two-player';
                showScreen(setupScreen);
                setupMessage.style.display = 'none';
            }

            function setupTwoPlayerGame() {
                const num = parseInt(hiddenNumberInput.value);
                
                if (isNaN(num) || num < 1 || num > 100) {
                    showMessage(setupMessage, '⚠️ Por favor, insira um número válido entre 1 e 100.', 'error');
                    return;
                }
                
                gameState.hiddenNumber = num;
                gameState.attempts = 0;
                gameState.maxAttempts = 5;
                gameState.guessHistory = [];
                gameState.minRange = 1;
                gameState.maxRange = 100;
                
                playerIndicator.classList.remove('hidden');
                attemptsLeft.textContent = gameState.maxAttempts;
                updateRangeText();
                updateGuessHistory();
                
                showScreen(guessingScreen);
                
                hiddenNumberInput.value = '';
                guessInput.value = '';
                setupMessage.style.display = 'none';
                guessMessage.style.display = 'none';
            }

            function checkGuess() {
                const num = parseInt(guessInput.value);
                
                if (isNaN(num) || num < gameState.minRange || num > gameState.maxRange) {
                    showMessage(guessMessage, `⚠️ Por favor, insira um número válido entre ${gameState.minRange} e ${gameState.maxRange}.`, 'error');
                    return;
                }
                
                gameState.attempts++;
                attemptsLeft.textContent = gameState.maxAttempts - gameState.attempts;
                
                if (num === gameState.hiddenNumber) {
                    gameState.guessHistory.push({ value: num, result: 'correct' });
                    updateGuessHistory();
                    
                    resultTitle.textContent = '🎉 Parabéns!';
                    resultMessage.textContent = `Você acertou o número ${gameState.hiddenNumber} em ${gameState.attempts} tentativa(s)!`;
                    
                    showScreen(resultScreen);
                } else {
                    const isHigh = num > gameState.hiddenNumber;
                    
                    if (isHigh) {
                        gameState.maxRange = Math.min(gameState.maxRange, num - 1);
                    } else {
                        gameState.minRange = Math.max(gameState.minRange, num + 1);
                    }
                    
                    gameState.guessHistory.push({ value: num, result: isHigh ? 'high' : 'low' });
                    updateGuessHistory();
                    updateRangeText();
                    
                    if (gameState.attempts >= gameState.maxAttempts) {
                        resultTitle.textContent = '😔 Que pena!';
                        resultMessage.textContent = `Você perdeu! O número oculto era ${gameState.hiddenNumber}.`;
                        showScreen(resultScreen);
                    } else {
                        const direction = isHigh ? 'maior' : 'menor';
                        const emoji = isHigh ? '⬇️' : '⬆️';
                        showMessage(guessMessage, `${emoji} Seu palpite é ${direction} que o número oculto.`);
                        guessInput.value = '';
                        guessInput.focus();
                    }
                }
            }

            function playAgain() {
                if (gameState.mode === 'random') {
                    startRandomMode();
                } else {
                    startTwoPlayerMode();
                }
            }

           
            randomModeButton.addEventListener('click', startRandomMode);
            twoPlayerModeButton.addEventListener('click', startTwoPlayerMode);
            setupButton.addEventListener('click', setupTwoPlayerGame);
            guessButton.addEventListener('click', checkGuess);
            playAgainButton.addEventListener('click', playAgain);
            changeModeButton.addEventListener('click', () => showScreen(modeScreen));

            hiddenNumberInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    setupTwoPlayerGame();
                }
            });

            guessInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    checkGuess();
                }
            });

           
            showScreen(modeScreen);
        });