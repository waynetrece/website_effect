// 心率監測式文字特效控制器
class HeartbeatTextController {
    constructor() {
        this.isAnimating = false;
        this.heartbeatInterval = null;
        this.currentHeartRate = 72; // BPM
        this.heartbeatCount = 0;
        this.textSequences = [
            {
                selector: '.medical-term .char',
                beatsPerChar: 1, // 每個心跳顯示一個字符
                priority: 'high'
            },
            {
                selector: '.prediction .char',
                beatsPerChar: 0.5, // 每半個心跳顯示一個字符
                priority: 'medium'
            },
            {
                selector: '.ai-referral .char',
                beatsPerChar: 0.3, // 更快的顯示速度
                priority: 'high'
            },
            {
                selector: '.platform .char',
                beatsPerChar: 0.8,
                priority: 'low'
            }
        ];
        this.init();
    }

    init() {
        // 綁定控制按鈕
        document.getElementById('playAnimation').addEventListener('click', () => {
            this.playAnimation();
        });

        document.getElementById('resetAnimation').addEventListener('click', () => {
            this.resetAnimation();
        });

        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.playAnimation();
            } else if (e.code === 'KeyR') {
                this.resetAnimation();
            }
        });

        // 頁面載入後自動播放
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.playAnimation();
            }, 1000);
        });

        // 初始化心率顯示
        this.updateHeartRateDisplay();
    }

    playAnimation() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.heartbeatCount = 0;
        this.resetAnimation();

        // 啟動心跳節奏
        setTimeout(() => {
            this.startHeartbeat();
        }, 80);

        // 啟動文字動畫序列
        setTimeout(() => {
            this.startTextSequence();
        }, 160);

        // 動畫完成後重置狀態
        setTimeout(() => {
            this.isAnimating = false;
        }, 1800); // 1.8秒
    }

    startHeartbeat() {
        const heartbeatDuration = 120; // 維持較快
        this.heartbeatInterval = setInterval(() => {
            this.heartbeatCount++;
            this.triggerHeartbeat();
            this.updateHeartRateDisplay();
            this.processTextSequences();
        }, heartbeatDuration);
    }

    triggerHeartbeat() {
        // 觸發心跳視覺效果
        const pulseElements = document.querySelectorAll('.pulse-dot, .pulse-ring');
        pulseElements.forEach(element => {
            element.style.animationDuration = `${60000 / this.currentHeartRate}ms`;
        });

        // 觸發心電圖繪製
        const ecgLines = document.querySelectorAll('.ecg-line, .ecg-line-2');
        ecgLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.1}s`;
        });

        // 播放心跳音效（如果有）
        this.playHeartbeatSound();
    }

    processTextSequences() {
        this.textSequences.forEach((sequence, sequenceIndex) => {
            const chars = document.querySelectorAll(sequence.selector);
            const beatsPerChar = sequence.beatsPerChar;

            chars.forEach((char, charIndex) => {
                const requiredBeats = Math.ceil((charIndex + 1) / beatsPerChar);

                if (this.heartbeatCount >= requiredBeats && !char.classList.contains('visible')) {
                    // 延遲顯示以配合心跳節奏
                    setTimeout(() => {
                        this.showCharacter(char, sequence.priority);
                    }, charIndex * 50); // 輕微的延遲以創造流動效果
                }
            });
        });
    }

    showCharacter(char, priority) {
        char.classList.add('visible');
        if (priority === 'high') {
            char.classList.add('heartbeat-sync');
            this.createHeartbeatParticle(char);
        }
        // 出現時的脈衝效果
        char.style.animation = 'heartbeatText 0.16s ease-out';
        setTimeout(() => {
            char.style.animation = '';
            if (priority === 'high') {
                char.style.animation = 'heartbeatText 0.6s ease-in-out infinite';
            }
        }, 160);
    }

    createHeartbeatParticle(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');

        particle.className = 'heartbeat-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 4px;
            height: 4px;
            background: #ff4757;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: heartbeatParticle 1s ease-out forwards;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    updateHeartRateDisplay() {
        const heartRateElement = document.getElementById('heartRate');
        if (heartRateElement) {
            // 模擬心率的輕微變化
            const variation = Math.random() * 4 - 2; // ±2 BPM
            const displayRate = Math.round(this.currentHeartRate + variation);
            heartRateElement.textContent = displayRate;

            // 根據心率調整顏色
            if (displayRate < 60) {
                heartRateElement.style.color = '#ffa502';
            } else if (displayRate > 100) {
                heartRateElement.style.color = '#ff4757';
            } else {
                heartRateElement.style.color = '#00ff88';
            }
        }
    }

    resetAnimation() {
        // 停止心跳
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        // 重置所有字符
        const allChars = document.querySelectorAll('.char');
        allChars.forEach(char => {
            char.classList.remove('visible', 'heartbeat-sync');
            char.style.animation = '';
        });

        // 清除粒子效果
        const particles = document.querySelectorAll('.heartbeat-particle');
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });

        // 重置計數器
        this.heartbeatCount = 0;
        this.isAnimating = false;

        // 重置心率顯示
        this.updateHeartRateDisplay();
    }

    playHeartbeatSound() {
        // 創建心跳音效（可選）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // 忽略音頻相關錯誤
        }
    }

    // 調整心率
    adjustHeartRate(newRate) {
        this.currentHeartRate = Math.max(40, Math.min(180, newRate));

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.startHeartbeat();
        }
    }

    // 模擬不同的心率模式
    simulateHeartRatePattern(pattern) {
        switch (pattern) {
            case 'resting':
                this.adjustHeartRate(72);
                break;
            case 'exercise':
                this.adjustHeartRate(120);
                break;
            case 'stress':
                this.adjustHeartRate(95);
                break;
            case 'calm':
                this.adjustHeartRate(60);
                break;
        }
    }
}

// 添加粒子動畫CSS
const heartbeatParticleStyle = document.createElement('style');
heartbeatParticleStyle.textContent = `
    @keyframes heartbeatParticle {
        0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
        }
        50% {
            opacity: 0.8;
            transform: scale(2) translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
        }
        100% {
            opacity: 0;
            transform: scale(0) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
        }
    }
`;
document.head.appendChild(heartbeatParticleStyle);

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    const controller = new HeartbeatTextController();

    // 全局訪問
    window.heartbeatController = controller;

    // 添加調試功能
    window.setHeartRate = (rate) => controller.adjustHeartRate(rate);
    window.simulatePattern = (pattern) => controller.simulateHeartRatePattern(pattern);

    console.log('心率監測式文字特效已載入');
    console.log('控制說明：');
    console.log('- 空格鍵：播放動畫');
    console.log('- R鍵：重置動畫');
    console.log('- setHeartRate(rate)：調整心率');
    console.log('- simulatePattern("resting"|"exercise"|"stress"|"calm")：模擬心率模式');
});

// 頁面可見性處理
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.heartbeatController) {
        // 頁面隱藏時暫停動畫
        if (window.heartbeatController.heartbeatInterval) {
            clearInterval(window.heartbeatController.heartbeatInterval);
        }
    } else if (!document.hidden && window.heartbeatController && window.heartbeatController.isAnimating) {
        // 頁面顯示時恢復動畫
        window.heartbeatController.startHeartbeat();
    }
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('心跳動畫系統錯誤:', e.error);
});

// 性能監控
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        if (fps < 30 && window.heartbeatController) {
            console.warn('性能警告：幀率低於30fps，建議簡化動畫效果');
        }

        frameCount = 0;
        lastTime = currentTime;
    }

    requestAnimationFrame(monitorPerformance);
}

// 啟動性能監控
requestAnimationFrame(monitorPerformance);

