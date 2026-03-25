const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { runMidsceneTest } = require('./testRunner');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/reports', express.static(path.join(__dirname, '../midscene_run/report')));
app.use('/screenshots', express.static(path.join(__dirname, '../screenshots')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/api/test', async (req, res) => {
    const { url, steps } = req.body;

    if (!url || !steps) {
        return res.status(400).json({
            success: false,
            error: '请提供测试URL和测试步骤'
        });
    }

    console.log(`\n🚀 收到测试请求:`);
    console.log(`   URL: ${url}`);
    console.log(`   步骤: ${steps.split('\n').length} 个`);

    try {
        const result = await runMidsceneTest(url, steps);
        res.json(result);
    } catch (error) {
        console.error('测试执行错误:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/test/stream', async (req, res) => {
    const { url, steps } = req.query;

    if (!url || !steps) {
        return res.status(400).json({
            success: false,
            error: '请提供测试URL和测试步骤'
        });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sendEvent = (type, data) => {
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent('start', { message: '开始执行测试...' });

    console.log(`\n🚀 收到测试请求 (SSE):`);
    console.log(`   URL: ${url}`);
    console.log(`   步骤: ${steps.split('\n').length} 个`);

    try {
        const result = await runMidsceneTest(url, steps, (log) => {
            sendEvent('log', { message: log });
        });
        sendEvent('complete', result);
    } catch (error) {
        console.error('测试执行错误:', error);
        sendEvent('error', { error: error.message });
    }

    res.end();
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🤖 AI自动化测试平台已启动');
    console.log('='.repeat(60));
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`📊 报告目录: ${path.join(__dirname, '../midscene_run/report')}`);
    console.log(`📸 截图目录: ${path.join(__dirname, '../screenshots')}`);
    console.log('='.repeat(60) + '\n');
});
