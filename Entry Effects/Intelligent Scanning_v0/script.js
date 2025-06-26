// AI轉診系統文字特效控制器
class AITextAnimationController {
    constructor() {
        this.isAnimating = false;
        this.animationTimeout = null;
        this.init();
    }

    init() {
        // 綁定控制按鈕事件
        document.getElementById('playAnimation').addEventListener('click', () => {
            this.playAnimation();
        });

        document.getElementById('resetAnimation').addEventListener('click', () => {
            this.resetAnimation();
        });

        // 頁面載入完成後自動播放一次
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.playAnimation();
            }, 1000);
        });

        // 添加鍵盤控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.playAnimation();
            } else if (e.code === 'KeyR') {
                this.resetAnimation();
            }
        });
    }

    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.resetAnimation();
        
        // 啟動掃描線
        setTimeout(() => {
            this.startScanLine();
        }, 500);

        // 啟動文字動畫序列
        setTimeout(() => {
            this.animateTextSequence();
        }, 800);

        // 啟動背景效果
        setTimeout(() => {
            this.activateBackgroundEffects();
        }, 1200);

        // 動畫完成後重置狀態
        setTimeout(() => {
            this.isAnimating = false;
        }, 8000);
    }

    startScanLine() {
        const scanLine = document.querySelector('.scan-line');
        scanLine.classList.add('active');
        
        // 4秒後移除active類
        setTimeout(() => {
            scanLine.classList.remove('active');
        }, 4000);
    }

    animateTextSequence() {
        const sequences = [
            {
                selector: '.medical-term .char',
                delay: 0,
                interval: 150
            },
            {
                selector: '.prediction .char',
                delay: 1500,
                interval: 80
            },
            {
                selector: '.ai-referral .char',
                delay: 3000,
                interval: 60
            },
            {
                selector: '.platform .char',
                delay: 4500,
                interval: 100
            }
        ];

        sequences.forEach(sequence => {
            setTimeout(() => {
                this.animateCharacters(sequence.selector, sequence.interval);
            }, sequence.delay);
        });
    }

    animateCharacters(selector, interval) {
        const chars = document.querySelectorAll(selector);
        
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.classList.add('visible');
                
                // 添加隨機粒子效果
                if (Math.random() > 0.7) {
                    this.createParticleEffect(char);
                }
            }, index * interval);
        });
    }

    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.className = 'temp-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 3px;
            height: 3px;
            background: #00bfff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleBurst 1s ease-out forwards;
        `;

        document.body.appendChild(particle);

        // 1秒後移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    activateBackgroundEffects() {
        // 啟動心電圖
        const ecgContainer = document.querySelector('.ecg-container');
        const ecgPath = document.querySelector('.ecg-path');
        
        ecgContainer.classList.add('active');
        ecgPath.classList.add('animate');

        // 啟動數據粒子
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });

        // 添加脈衝效果到醫學術語
        setTimeout(() => {
            const medicalChars = document.querySelectorAll('.medical-term .char.visible');
            medicalChars.forEach(char => {
                char.style.animationPlayState = 'running';
            });
        }, 1000);
    }

    resetAnimation() {
        // 重置所有字符
        const allChars = document.querySelectorAll('.char');
        allChars.forEach(char => {
            char.classList.remove('visible');
        });

        // 重置掃描線
        const scanLine = document.querySelector('.scan-line');
        scanLine.classList.remove('active');

        // 重置心電圖
        const ecgContainer = document.querySelector('.ecg-container');
        const ecgPath = document.querySelector('.ecg-path');
        ecgContainer.classList.remove('active');
        ecgPath.classList.remove('animate');

        // 重置粒子動畫
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });

        // 移除臨時粒子
        const tempParticles = document.querySelectorAll('.temp-particle');
        tempParticles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });

        // 清除動畫超時
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }

        this.isAnimating = false;
    }

    // 添加音效支持（可選）
    playSound(type) {
        // 這裡可以添加音效播放邏輯
        // 例如：掃描音效、打字音效等
        try {
            const audio = new Audio(`assets/sounds/${type}.mp3`);
            audio.volume = 0.3;
            audio.play().catch(e => {
                // 忽略音頻播放錯誤
                console.log('Audio play failed:', e);
            });
        } catch (e) {
            // 忽略音頻相關錯誤
        }
    }

    // 性能優化：節流函數
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// 添加粒子爆炸動畫CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleBurst {
        0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.5) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
        }
        100% {
            opacity: 0;
            transform: scale(0) translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px);
        }
    }
`;
document.head.appendChild(particleStyle);

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    const controller = new AITextAnimationController();
    
    // 添加全局訪問
    window.aiTextController = controller;
    
    // 添加調試信息
    console.log('AI轉診系統文字特效已載入');
    console.log('控制說明：');
    console.log('- 空格鍵：播放動畫');
    console.log('- R鍵：重置動畫');
    console.log('- 或使用頁面底部的控制按鈕');
});

// 添加頁面可見性API支持
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 頁面隱藏時暫停動畫
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    } else {
        // 頁面顯示時恢復動畫
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
});

// 響應式處理
window.addEventListener('resize', () => {
    // 重新計算粒子位置等響應式調整
    if (window.aiTextController && !window.aiTextController.isAnimating) {
        // 可以在這裡添加響應式調整邏輯
    }
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('動畫系統錯誤:', e.error);
});

// 導出控制器類供其他模塊使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITextAnimationController;
}

