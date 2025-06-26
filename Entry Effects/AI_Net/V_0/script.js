// AI神經網絡文字特效控制器
class NeuralNetworkTextController {
    constructor() {
        this.isAnimating = false;
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.showConnections = true;
        this.networkStats = {
            nodeCount: 0,
            connectionCount: 0,
            accuracy: 94.7
        };
        this.init();
    }

    init() {
        // 初始化畫布
        this.initCanvas();
        
        // 綁定控制按鈕
        document.getElementById('playAnimation').addEventListener('click', () => {
            this.playAnimation();
        });

        document.getElementById('resetAnimation').addEventListener('click', () => {
            this.resetAnimation();
        });

        document.getElementById('toggleNetwork').addEventListener('click', () => {
            this.toggleNetworkConnections();
        });

        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.playAnimation();
            } else if (e.code === 'KeyR') {
                this.resetAnimation();
            } else if (e.code === 'KeyT') {
                this.toggleNetworkConnections();
            }
        });

        // 頁面載入後自動播放
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.playAnimation();
            }, 1000);
        });

        // 窗口大小變化時重新初始化畫布
        window.addEventListener('resize', () => {
            this.initCanvas();
        });
    }

    initCanvas() {
        this.canvas = document.getElementById('neuralCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 設置畫布大小
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 設置畫布樣式
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.resetAnimation();
        
        // 啟動神經網絡構建
        setTimeout(() => {
            this.buildNeuralNetwork();
        }, 500);

        // 啟動文字生成序列
        setTimeout(() => {
            this.startTextGeneration();
        }, 1500);

        // 啟動網絡活動
        setTimeout(() => {
            this.activateNetwork();
        }, 3000);

        // 動畫完成後重置狀態
        setTimeout(() => {
            this.isAnimating = false;
        }, 12000);
    }

    buildNeuralNetwork() {
        // 清空現有節點和連接
        this.nodes = [];
        this.connections = [];
        
        // 創建網絡節點
        this.createNetworkNodes();
        
        // 創建連接
        if (this.showConnections) {
            this.createNetworkConnections();
        }
        
        // 開始渲染
        this.startNetworkRendering();
        
        // 更新統計信息
        this.updateNetworkStats();
    }

    createNetworkNodes() {
        const layers = [
            { count: 8, y: 0.2, color: '#00bfff', label: 'input' },
            { count: 12, y: 0.4, color: '#ffa502', label: 'hidden1' },
            { count: 10, y: 0.6, color: '#ffa502', label: 'hidden2' },
            { count: 6, y: 0.8, color: '#00ff88', label: 'output' }
        ];

        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < layer.count; i++) {
                const node = {
                    x: (this.canvas.width / (layer.count + 1)) * (i + 1),
                    y: this.canvas.height * layer.y,
                    radius: Math.random() * 3 + 2,
                    color: layer.color,
                    layer: layer.label,
                    layerIndex: layerIndex,
                    nodeIndex: i,
                    activation: 0,
                    targetActivation: Math.random(),
                    pulsePhase: Math.random() * Math.PI * 2,
                    visible: false,
                    creationTime: Date.now() + (layerIndex * 500) + (i * 100)
                };
                this.nodes.push(node);
            }
        });

        this.networkStats.nodeCount = this.nodes.length;
    }

    createNetworkConnections() {
        this.connections = [];
        
        // 連接相鄰層的節點
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            
            for (let j = 0; j < this.nodes.length; j++) {
                const targetNode = this.nodes[j];
                
                // 只連接相鄰層
                if (targetNode.layerIndex === currentNode.layerIndex + 1) {
                    // 隨機決定是否創建連接（70%概率）
                    if (Math.random() > 0.3) {
                        const connection = {
                            from: currentNode,
                            to: targetNode,
                            weight: Math.random() * 2 - 1, // -1 到 1
                            activity: 0,
                            visible: false,
                            creationTime: Date.now() + Math.random() * 2000 + 1000
                        };
                        this.connections.push(connection);
                    }
                }
            }
        }

        this.networkStats.connectionCount = this.connections.length;
    }

    startNetworkRendering() {
        const render = () => {
            if (!this.isAnimating) return;
            
            this.clearCanvas();
            this.updateNodes();
            this.updateConnections();
            this.renderNetwork();
            
            this.animationFrame = requestAnimationFrame(render);
        };
        
        render();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateNodes() {
        const currentTime = Date.now();
        
        this.nodes.forEach(node => {
            // 節點出現動畫
            if (currentTime > node.creationTime && !node.visible) {
                node.visible = true;
            }
            
            // 更新激活值
            if (node.visible) {
                node.activation += (node.targetActivation - node.activation) * 0.02;
                node.pulsePhase += 0.05;
                
                // 隨機改變目標激活值
                if (Math.random() < 0.005) {
                    node.targetActivation = Math.random();
                }
            }
        });
    }

    updateConnections() {
        const currentTime = Date.now();
        
        this.connections.forEach(connection => {
            // 連接出現動畫
            if (currentTime > connection.creationTime && !connection.visible) {
                connection.visible = true;
            }
            
            // 更新連接活動
            if (connection.visible && connection.from.visible && connection.to.visible) {
                const fromActivation = connection.from.activation;
                const toActivation = connection.to.activation;
                connection.activity = Math.abs(fromActivation - toActivation) * Math.abs(connection.weight);
            }
        });
    }

    renderNetwork() {
        // 渲染連接
        if (this.showConnections) {
            this.connections.forEach(connection => {
                if (connection.visible) {
                    this.renderConnection(connection);
                }
            });
        }
        
        // 渲染節點
        this.nodes.forEach(node => {
            if (node.visible) {
                this.renderNode(node);
            }
        });
    }

    renderConnection(connection) {
        const opacity = Math.min(connection.activity * 2, 0.6);
        const weight = Math.abs(connection.weight);
        
        this.ctx.beginPath();
        this.ctx.moveTo(connection.from.x, connection.from.y);
        this.ctx.lineTo(connection.to.x, connection.to.y);
        
        // 連接線顏色基於權重
        if (connection.weight > 0) {
            this.ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
        } else {
            this.ctx.strokeStyle = `rgba(255, 71, 87, ${opacity})`;
        }
        
        this.ctx.lineWidth = weight * 2;
        this.ctx.stroke();
        
        // 添加數據流動效果
        if (connection.activity > 0.3) {
            this.renderDataFlow(connection);
        }
    }

    renderDataFlow(connection) {
        const progress = (Date.now() * 0.005) % 1;
        const x = connection.from.x + (connection.to.x - connection.from.x) * progress;
        const y = connection.from.y + (connection.to.y - connection.from.y) * progress;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
    }

    renderNode(node) {
        const pulseSize = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const radius = node.radius + node.activation * 3 + pulseSize * 2;
        
        // 節點主體
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        // 根據激活程度調整顏色
        const alpha = 0.3 + node.activation * 0.7;
        this.ctx.fillStyle = node.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        this.ctx.fill();
        
        // 節點邊框
        this.ctx.strokeStyle = node.color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // 高激活節點的光暈效果
        if (node.activation > 0.7) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color.replace(')', `, 0.1)`).replace('rgb', 'rgba');
            this.ctx.fill();
        }
    }

    startTextGeneration() {
        const textSequences = [
            {
                selector: '.medical-term .char[data-layer="input"]',
                delay: 0,
                interval: 200,
                layer: 'input'
            },
            {
                selector: '.prediction .char[data-layer="hidden"]',
                delay: 2000,
                interval: 100,
                layer: 'hidden'
            },
            {
                selector: '.ai-referral .char[data-layer="hidden"]',
                delay: 4000,
                interval: 80,
                layer: 'hidden'
            },
            {
                selector: '.ai-referral .char[data-layer="output"]',
                delay: 6000,
                interval: 120,
                layer: 'output'
            },
            {
                selector: '.platform .char[data-layer="output"]',
                delay: 8000,
                interval: 150,
                layer: 'output'
            }
        ];

        textSequences.forEach(sequence => {
            setTimeout(() => {
                this.animateTextSequence(sequence);
                this.activateLayerIndicator(sequence.layer);
            }, sequence.delay);
        });
    }

    animateTextSequence(sequence) {
        const chars = document.querySelectorAll(sequence.selector);
        
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.classList.add('visible');
                char.classList.add('neural-node');
                
                // 添加神經激活效果
                setTimeout(() => {
                    char.classList.add('active');
                }, 300);
                
                // 創建神經連接視覺效果
                this.createTextNodeConnection(char);
                
            }, index * sequence.interval);
        });
    }

    createTextNodeConnection(element) {
        // 為文字節點創建連接線到背景網絡
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 找到最近的網絡節點
        let nearestNode = null;
        let minDistance = Infinity;
        
        this.nodes.forEach(node => {
            const distance = Math.sqrt(
                Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = node;
            }
        });
        
        // 激活最近的節點
        if (nearestNode) {
            nearestNode.targetActivation = 1;
            nearestNode.pulsePhase = 0;
        }
    }

    activateLayerIndicator(layer) {
        // 激活對應的層級指示器
        const indicators = document.querySelectorAll('.layer-indicator');
        indicators.forEach(indicator => {
            if (indicator.classList.contains(`${layer}-layer`)) {
                indicator.classList.add('active');
                
                // 3秒後移除激活狀態
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 3000);
            }
        });
    }

    activateNetwork() {
        // 激活整個網絡的動態效果
        this.nodes.forEach(node => {
            node.targetActivation = Math.random() * 0.8 + 0.2;
        });
        
        // 更新準確率動畫
        this.animateAccuracy();
    }

    animateAccuracy() {
        const accuracyElement = document.getElementById('accuracy');
        let currentAccuracy = 0;
        const targetAccuracy = this.networkStats.accuracy;
        
        const updateAccuracy = () => {
            currentAccuracy += (targetAccuracy - currentAccuracy) * 0.05;
            accuracyElement.textContent = `${currentAccuracy.toFixed(1)}%`;
            
            if (Math.abs(targetAccuracy - currentAccuracy) > 0.1) {
                requestAnimationFrame(updateAccuracy);
            }
        };
        
        updateAccuracy();
    }

    updateNetworkStats() {
        document.getElementById('nodeCount').textContent = this.networkStats.nodeCount;
        document.getElementById('connectionCount').textContent = this.networkStats.connectionCount;
        document.getElementById('layerCount').textContent = '4';
    }

    toggleNetworkConnections() {
        this.showConnections = !this.showConnections;
        
        const toggleBtn = document.getElementById('toggleNetwork');
        const btnText = toggleBtn.querySelector('.btn-text');
        
        if (this.showConnections) {
            btnText.textContent = '隱藏連接';
            this.createNetworkConnections();
        } else {
            btnText.textContent = '顯示連接';
            this.connections = [];
        }
        
        this.updateNetworkStats();
    }

    resetAnimation() {
        // 停止動畫
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // 清空畫布
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 重置所有文字
        const allChars = document.querySelectorAll('.char');
        allChars.forEach(char => {
            char.classList.remove('visible', 'neural-node', 'active');
        });

        // 重置層級指示器
        const indicators = document.querySelectorAll('.layer-indicator');
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // 重置網絡數據
        this.nodes = [];
        this.connections = [];
        this.networkStats = {
            nodeCount: 0,
            connectionCount: 0,
            accuracy: 94.7
        };

        // 重置統計顯示
        document.getElementById('nodeCount').textContent = '0';
        document.getElementById('connectionCount').textContent = '0';
        document.getElementById('accuracy').textContent = '94.7%';
    }

    // 性能優化方法
    optimizePerformance() {
        // 限制節點數量以提高性能
        if (this.nodes.length > 100) {
            this.nodes = this.nodes.slice(0, 100);
        }
        
        // 限制連接數量
        if (this.connections.length > 200) {
            this.connections = this.connections.slice(0, 200);
        }
    }
}

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    const controller = new NeuralNetworkTextController();
    
    // 全局訪問
    window.neuralController = controller;
    
    console.log('AI神經網絡文字特效已載入');
    console.log('控制說明：');
    console.log('- 空格鍵：啟動神經網絡');
    console.log('- R鍵：重置網絡');
    console.log('- T鍵：切換連接顯示');
});

// 頁面可見性處理
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.neuralController) {
        window.neuralController.isAnimating = false;
    }
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('神經網絡動畫系統錯誤:', e.error);
});

// 性能監控
let performanceMonitor = {
    frameCount: 0,
    lastTime: performance.now(),
    
    monitor() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            
            if (fps < 30 && window.neuralController) {
                console.warn('性能警告：幀率低於30fps');
                window.neuralController.optimizePerformance();
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.monitor());
    }
};

// 啟動性能監控
performanceMonitor.monitor();

