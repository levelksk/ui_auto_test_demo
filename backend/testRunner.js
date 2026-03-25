const { PuppeteerAgent } = require('@midscene/web/puppeteer');
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

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
                '--window-size=1280,800'
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
                await agent.aiAct(step);
                results.steps.push({
                    action: step,
                    success: true,
                    message: '执行成功'
                });
                log(`   ✅ 步骤 ${i + 1} 完成`);

                log(`   📸 截取步骤 ${i + 1} 截图...`);
                await agent.logScreenshot(`步骤 ${i + 1}: ${step}`);
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
                .map(f => `/reports/${f}`);
            results.screenshots = reports;
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
    const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    ];

    for (const p of possiblePaths) {
        if (p && fs.existsSync(p)) {
            return p;
        }
    }
    return null;
}

module.exports = { runMidsceneTest };
