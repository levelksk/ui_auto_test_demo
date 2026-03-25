const API_BASE = 'http://localhost:3000/api';

let isRunning = false;

async function runTest() {
    if (isRunning) {
        alert('测试正在执行中，请等待...');
        return;
    }

    const url = document.getElementById('url').value.trim();
    const steps = document.getElementById('steps').value.trim();

    if (!url) {
        alert('请输入测试网站地址');
        return;
    }

    if (!steps) {
        alert('请输入测试步骤');
        return;
    }

    const runBtn = document.getElementById('runBtn');
    const resultSection = document.getElementById('resultSection');
    const statusText = document.getElementById('statusText');
    const timeText = document.getElementById('timeText');
    const resultContent = document.getElementById('resultContent');
    const screenshots = document.getElementById('screenshots');

    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="loading"></span> 执行中...';
    resultSection.style.display = 'block';
    statusText.textContent = '正在执行测试...';
    statusText.style.color = '#667eea';
    timeText.textContent = '';
    resultContent.innerHTML = '<span class="info">正在连接 Midscene 引擎...</span>\n<span class="warning">测试可能需要 1-3 分钟，请耐心等待</span>';
    screenshots.innerHTML = '';

    const startTime = Date.now();

    const timeoutId = setTimeout(() => {
        resultContent.innerHTML += '\n<span class="warning">⏳ 测试执行时间较长，请继续等待...</span>';
    }, 30000);

    try {
        const controller = new AbortController();
        const timeoutPromise = setTimeout(() => controller.abort(), 300000);

        const response = await fetch(`${API_BASE}/test`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, steps }),
            signal: controller.signal
        });

        clearTimeout(timeoutPromise);
        clearTimeout(timeoutId);

        const data = await response.json();
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        timeText.textContent = `耗时: ${duration}秒`;

        if (data.success) {
            statusText.textContent = '✅ 测试完成';
            statusText.style.color = '#4ec9b0';
            
            let resultHtml = '<span class="success">测试执行成功！</span>\n\n';
            resultHtml += `<span class="info">测试网站: ${url}</span>\n`;
            resultHtml += `<span class="info">执行步骤: ${data.steps.length} 个</span>\n`;
            resultHtml += `<span class="info">耗时: ${duration}秒</span>\n\n`;
            
            data.steps.forEach((step, index) => {
                const status = step.success ? '✅' : '❌';
                const className = step.success ? 'success' : 'error';
                resultHtml += `<span class="${className}">${status} 步骤${index + 1}: ${step.action}</span>\n`;
            });

            if (data.message) {
                resultHtml += `\n<span class="info">📋 ${data.message}</span>`;
            }

            resultContent.innerHTML = resultHtml;

            if (data.screenshots && data.screenshots.length > 0) {
                screenshots.innerHTML = '<h3>📸 测试报告</h3>';
                data.screenshots.forEach((report, index) => {
                    const link = document.createElement('a');
                    link.href = report;
                    link.target = '_blank';
                    link.className = 'report-link';
                    link.textContent = `📄 查看报告 ${index + 1}`;
                    screenshots.appendChild(link);
                });
            }
        } else {
            statusText.textContent = '❌ 测试失败';
            statusText.style.color = '#f14c4c';
            resultContent.innerHTML = `<span class="error">错误: ${data.error || data.message}</span>`;
        }
    } catch (error) {
        clearTimeout(timeoutId);
        statusText.textContent = '❌ 连接失败';
        statusText.style.color = '#f14c4c';
        
        if (error.name === 'AbortError') {
            resultContent.innerHTML = '<span class="error">请求超时（超过5分钟）</span>';
        } else {
            resultContent.innerHTML = `<span class="error">无法连接到服务器: ${error.message}</span>\n\n<span class="warning">请确保后端服务已启动 (npm run dev)</span>`;
        }
    } finally {
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶</span> 执行测试';
    }
}

function clearForm() {
    document.getElementById('url').value = '';
    document.getElementById('steps').value = '';
    document.getElementById('resultSection').style.display = 'none';
}

document.getElementById('url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('steps').focus();
    }
});
