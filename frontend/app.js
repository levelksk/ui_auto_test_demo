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
    resultContent.innerHTML = '';
    screenshots.innerHTML = '';

    const startTime = Date.now();

    const eventSource = new EventSource(
        `${API_BASE}/test/stream?url=${encodeURIComponent(url)}&steps=${encodeURIComponent(steps)}`
    );

    eventSource.addEventListener('start', (e) => {
        const data = JSON.parse(e.data);
        appendLog(data.message, 'info');
    });

    eventSource.addEventListener('log', (e) => {
        const data = JSON.parse(e.data);
        const msg = data.message;
        
        if (msg.includes('✅')) {
            appendLog(msg, 'success');
        } else if (msg.includes('❌')) {
            appendLog(msg, 'error');
        } else if (msg.includes('🔄')) {
            appendLog(msg, 'warning');
        } else {
            appendLog(msg, 'info');
        }
    });

    eventSource.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        timeText.textContent = `耗时: ${duration}秒`;

        if (data.success) {
            statusText.textContent = '✅ 测试完成';
            statusText.style.color = '#4ec9b0';
            
            appendLog(`\n🎉 测试执行成功！耗时 ${duration}秒`, 'success');
            appendLog(`📋 ${data.message}`, 'info');

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
            appendLog(`\n❌ ${data.message}`, 'error');
        }

        eventSource.close();
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶</span> 执行测试';
    });

    eventSource.addEventListener('error', (e) => {
        const data = JSON.parse(e.data);
        statusText.textContent = '❌ 测试失败';
        statusText.style.color = '#f14c4c';
        appendLog(`\n❌ 错误: ${data.error}`, 'error');
        
        eventSource.close();
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶</span> 执行测试';
    });

    eventSource.onerror = () => {
        statusText.textContent = '❌ 连接失败';
        statusText.style.color = '#f14c4c';
        appendLog('\n❌ 无法连接到服务器', 'error');
        
        eventSource.close();
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶</span> 执行测试';
    };
}

function appendLog(message, type = 'info') {
    const resultContent = document.getElementById('resultContent');
    const line = document.createElement('div');
    line.className = type;
    line.textContent = message;
    resultContent.appendChild(line);
    resultContent.scrollTop = resultContent.scrollHeight;
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
