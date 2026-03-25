"""
browser-use 技术验证 Demo
支持阿里云千问大模型
"""
import asyncio
import os
from dotenv import load_dotenv
from browser_use import Agent
from langchain_openai import ChatOpenAI

load_dotenv()


def get_llm():
    """
    获取 LLM 实例
    支持阿里云千问 (通过 OpenAI 兼容接口)
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model = os.getenv("LLM_MODEL", "qwen-plus")
    
    if not api_key or api_key == "your_dashscope_api_key_here":
        raise ValueError("请先在 .env 文件中配置 OPENAI_API_KEY")
    
    return ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )


async def basic_navigation_demo():
    print("=" * 60)
    print("Demo 1: 基础导航演示")
    print("=" * 60)
    
    llm = get_llm()
    
    agent = Agent(
        task="打开 https://example.com，告诉我页面的标题和主要内容",
        llm=llm,
    )
    
    result = await agent.run()
    print(f"\n执行结果: {result}")
    return result


async def search_demo():
    print("\n" + "=" * 60)
    print("Demo 2: 搜索演示")
    print("=" * 60)
    
    llm = get_llm()
    
    agent = Agent(
        task="打开百度 https://www.baidu.com，搜索 'Python自动化测试'，告诉我前3个搜索结果的标题",
        llm=llm,
    )
    
    result = await agent.run()
    print(f"\n执行结果: {result}")
    return result


async def form_demo():
    print("\n" + "=" * 60)
    print("Demo 3: 表单操作演示")
    print("=" * 60)
    
    llm = get_llm()
    
    agent = Agent(
        task="打开 https://httpbin.org/forms/post，填写表单并提交，告诉我返回的结果",
        llm=llm,
    )
    
    result = await agent.run()
    print(f"\n执行结果: {result}")
    return result


async def main():
    print("🚀 browser-use 技术验证 Demo (阿里云千问)")
    print("=" * 60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_dashscope_api_key_here":
        print("❌ 错误: 请先在 .env 文件中配置 API Key")
        print("   1. 复制 .env.example 为 .env")
        print("   2. 填入你的阿里云 DashScope API Key")
        print("   3. 获取地址: https://dashscope.console.aliyun.com/apiKey")
        return
    
    print(f"✅ API Key 已配置 (前8位: {api_key[:8]}...)")
    print(f"✅ 模型: {os.getenv('LLM_MODEL', 'qwen-plus')}")
    
    demos = {
        "1": ("基础导航演示", basic_navigation_demo),
        "2": ("搜索演示", search_demo),
        "3": ("表单操作演示", form_demo),
    }
    
    print("\n请选择要运行的 Demo:")
    for key, (name, _) in demos.items():
        print(f"  {key}. {name}")
    print("  all. 运行所有 Demo")
    print("  q. 退出")
    
    choice = input("\n请输入选择: ").strip().lower()
    
    if choice == "q":
        print("👋 再见!")
        return
    elif choice == "all":
        for name, func in demos.values():
            try:
                await func()
            except Exception as e:
                print(f"❌ {name} 执行失败: {e}")
    elif choice in demos:
        name, func = demos[choice]
        try:
            await func()
        except Exception as e:
            print(f"❌ 执行失败: {e}")
    else:
        print("❌ 无效选择")


if __name__ == "__main__":
    asyncio.run(main())
