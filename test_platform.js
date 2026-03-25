const puppeteer = require('puppeteer');

async function testAIPlatform() {
    console.log('🚀 开始测试 AI 自动化测试平台...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // 导航到 AI 自动化测试平台
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        console.log('✅ 已打开 AI 自动化测试平台');
        
        // 截图查看界面
        await page.screenshot({ path: 'test_screenshot.png', fullPage: true });
        console.log('✅ 界面截图已保存到 test_screenshot.png');
        
        // 填入测试 URL
        await page.type('#url', 'https://www.baidu.com');
        console.log('✅ 已填入测试 URL: https://www.baidu.com');
        
        // 填入测试步骤
        await page.type('#steps', '搜索123');
        console.log('✅ 已填入测试步骤: 搜索123');
        
        // 点击执行测试按钮
        await page.click('#runBtn');
        console.log('✅ 已点击执行测试按钮');
        
        // 等待测试执行完成（最多等待 60 秒）
        console.log('⏳ 等待测试执行中...');
        await page.waitForTimeout(60000);
        
        // 再次截图查看结果
        await page.screenshot({ path: 'test_result.png', fullPage: true });
        console.log('✅ 测试结果截图已保存到 test_result.png');
        
        // 检查测试结果
        const resultSection = await page.$('#resultSection');
        if (resultSection) {
            const isVisible = await page.evaluate(el => {
                return window.getComputedStyle(el).display !== 'none';
            }, resultSection);
            
            if (isVisible) {
                const statusText = await page.$eval('#statusText', el => el.textContent);
                console.log(`\n📊 测试状态: ${statusText}`);
                
                // 获取日志内容
                const logs = await page.$$eval('#resultContent div', elements => {
                    return elements.map(el => el.textContent);
                });
                
                if (logs.length > 0) {
                    console.log('\n📝 测试日志:');
                    logs.forEach(log => console.log(`   ${log}`));
                }
                
                // 检查是否有测试报告链接
                const reportLinks = await page.$$('.report-link');
                if (reportLinks.length > 0) {
                    console.log(`\n📸 生成了 ${reportLinks.length} 个测试报告`);
                }
            }
        }
        
    } catch (error) {
        console.error(`❌ 测试过程中出现错误: ${error.message}`);
    } finally {
        await browser.close();
        console.log('\n🎉 测试完成！');
    }
}

testAIPlatform();
