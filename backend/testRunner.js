const { PuppeteerAgent, launchPuppeteer } = require('@midscene/web/puppeteer');
const path = require('path');
const fs = require('fs');

async function runMidsceneTest(url, stepsText) {
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

    console.log('\n📋 执行测试步骤:');
    console.log(`   🌐 目标网站: ${url}`);
    console.log(`   📝 步骤数量: ${steps.length}`);

    let browser = null;
    let agent = null;

    try {
        console.log(`   🔗 启动浏览器...`);
        
        const { browser: puppeteerBrowser, page } = await launchPuppeteer({
            headless: true,
        });
        browser = puppeteerBrowser;

        console.log(`   🔗 连接到: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log(`   ✅ 已连接到: ${url}`);

        agent = new PuppeteerAgent(page, {
            generateReport: true,
            waitAfterAction: 200
        });

        console.log(`   📸 截取初始截图...`);
        await agent.aiScreenshot();
        console.log(`   ✅ 已截取初始截图`);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i].trim();
            if (!step) continue;

            console.log(`   🔄 执行步骤 ${i + 1}: ${step}`);
            
            try {
                await agent.aiAct(step);
                results.steps.push({
                    action: step,
                    success: true,
                    message: '执行成功'
                });
                console.log(`   ✅ 步骤 ${i + 1} 完成`);

                console.log(`   📸 截取步骤 ${i + 1} 截图...`);
                await agent.aiScreenshot();
                console.log(`   ✅ 已截取步骤 ${i + 1} 截图`);
            } catch (stepError) {
                results.steps.push({
                    action: step,
                    success: false,
                    message: stepError.message
                });
                console.log(`   ❌ 步骤 ${i + 1} 失败: ${stepError.message}`);
                results.success = false;
            }
        }

        console.log(`   🔌 关闭浏览器...`);
        await browser.close();
        console.log(`   ✅ 已关闭浏览器`);

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
        console.log(`   ❌ 执行失败: ${error.message}`);
        
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

module.exports = { runMidsceneTest };
