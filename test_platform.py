from playwright.sync_api import sync_playwright

def test_ai_automation_platform():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            print("🚀 开始测试 AI 自动化测试平台...")
            
            # 导航到 AI 自动化测试平台
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')
            
            print("✅ 已打开 AI 自动化测试平台")
            
            # 截图查看界面
            page.screenshot(path='test_screenshot.png', full_page=True)
            print("✅ 界面截图已保存到 test_screenshot.png")
            
            # 填入测试 URL
            url_input = page.locator('#url')
            url_input.fill('https://www.baidu.com')
            print("✅ 已填入测试 URL: https://www.baidu.com")
            
            # 填入测试步骤
            steps_input = page.locator('#steps')
            steps_input.fill('搜索123')
            print("✅ 已填入测试步骤: 搜索123")
            
            # 点击执行测试按钮
            run_button = page.locator('#runBtn')
            run_button.click()
            print("✅ 已点击执行测试按钮")
            
            # 等待测试执行完成（最多等待 60 秒）
            print("⏳ 等待测试执行中...")
            page.wait_for_timeout(60000)
            
            # 再次截图查看结果
            page.screenshot(path='test_result.png', full_page=True)
            print("✅ 测试结果截图已保存到 test_result.png")
            
            # 检查测试结果
            result_section = page.locator('#resultSection')
            if result_section.is_visible():
                status_text = page.locator('#statusText').text_content()
                print(f"\n📊 测试状态: {status_text}")
                
                # 获取日志内容
                result_content = page.locator('#resultContent')
                if result_content.count() > 0:
                    logs = result_content.all_text_contents()
                    print(f"\n📝 测试日志:")
                    for log in logs:
                        print(f"   {log}")
                
                # 检查是否有测试报告链接
                screenshots = page.locator('#screenshots')
                if screenshots.count() > 0:
                    report_links = screenshots.locator('.report-link')
                    if report_links.count() > 0:
                        print(f"\n📸 生成了 {report_links.count()} 个测试报告")
            
        except Exception as e:
            print(f"❌ 测试过程中出现错误: {e}")
            page.screenshot(path='test_error.png', full_page=True)
        
        finally:
            browser.close()
            print("\n🎉 测试完成！")

if __name__ == '__main__':
    test_ai_automation_platform()
