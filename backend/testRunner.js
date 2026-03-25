const { PuppeteerAgent } = require('@midscene/web/puppeteer');
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const AI_ACTION_TIMEOUT = 120000;

function withTimeout(promise, ms, errorMsg) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error(errorMsg || `操作超时 (${ms}ms)`)), ms)
        )
    ]);
}

async function runMidsceneTest(url, stepsText, onLog) {
    const steps = stepsText.split('\n').filter(s => s.trim());
    const results = {
        success: true,
        steps: [],
        screenshots: [],
        message: ''
    };

    const screenshotsDir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const log = (msg) => {
        console.log(msg);
        if (onLog) onLog(msg);
    };

    log('\n📋 执行测试步骤:');
    log(`   🌐 目标网站: ${url}`);
    log(`   📝 步骤数量: ${steps.length}`);

    let browser = null;
    let agent = null;

    try {
        log(`   🔗 启动浏览器...`);
        
        const chromePath = findChrome();
        if (!chromePath) {
            throw new Error('未找到 Chrome 浏览器，请安装 Chrome');
        }

        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--window-size=1280,800',
                '--font-render-hinting=none'
            ]
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        log(`   🔗 连接到: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        log(`   ✅ 已连接到: ${url}`);

        agent = new PuppeteerAgent(page, {
            generateReport: true,
            waitAfterAction: 200
        });

        log(`   📸 截取初始截图...`);
        await agent.logScreenshot('初始页面');
        log(`   ✅ 已截取初始截图`);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i].trim();
            if (!step) continue;

            log(`   🔄 执行步骤 ${i + 1}: ${step}`);
            
            try {
                await withTimeout(
                    agent.aiAct(step),
                    AI_ACTION_TIMEOUT,
                    `AI 执行超时 (${AI_ACTION_TIMEOUT / 1000}秒)，请检查网络或模型配置`
                );
                results.steps.push({
                    action: step,
                    success: true,
                    message: '执行成功'
                });
                log(`   ✅ 步骤 ${i + 1} 完成`);

                log(`   📸 截取步骤 ${i + 1} 截图...`);
                await withTimeout(
                    agent.logScreenshot(`步骤 ${i + 1}: ${step}`),
                    30000,
                    '截图超时'
                );
                log(`   ✅ 已截取步骤 ${i + 1} 截图`);
            } catch (stepError) {
                results.steps.push({
                    action: step,
                    success: false,
                    message: stepError.message
                });
                log(`   ❌ 步骤 ${i + 1} 失败: ${stepError.message}`);
                results.success = false;
            }
        }

        log(`   🔌 关闭浏览器...`);
        await browser.close();
        log(`   ✅ 已关闭浏览器`);

        const reportDir = path.join(__dirname, '../midscene_run/report');
        if (fs.existsSync(reportDir)) {
            const reports = fs.readdirSync(reportDir)
                .filter(f => f.endsWith('.html'))
                .map(f => ({
                    name: f,
                    time: fs.statSync(path.join(reportDir, f)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);
            
            if (reports.length > 0) {
                results.screenshots = [`/reports/${reports[0].name}`];
            }
        }

        results.message = `成功执行 ${results.steps.filter(s => s.success).length}/${results.steps.length} 个步骤`;

    } catch (error) {
        results.success = false;
        results.message = `执行失败: ${error.message}`;
        log(`   ❌ 执行失败: ${error.message}`);
        
        if (browser) {
            try {
                await browser.close();
            } catch (e) {
                // ignore
            }
        }
    }

    return results;
}

function findChrome() {
    const envPath = process.env.CHROME_PATH;
    if (envPath && fs.existsSync(envPath)) {
        return envPath;
    }

    const dockerPath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
    if (fs.existsSync(dockerPath)) {
        return dockerPath;
    }

    const defaultPaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
    ];

    for (const p of defaultPaths) {
        if (p && fs.existsSync(p)) {
            return p;
        }
    }
    return null;
}

module.exports = { runMidsceneTest };
