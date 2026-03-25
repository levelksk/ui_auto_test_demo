"""
browser-use 技术验证 Demo
使用百度搜索验证 + 成本统计
"""
import asyncio
import os
import time
from dotenv import load_dotenv
from browser_use import Agent, ChatOpenAI

load_dotenv()


async def baidu_search_demo():
    """
    百度搜索演示 + 成本统计
    """
    print("=" * 60)
    print("browser-use 技术验证 Demo (阿里云千问)")
    print("=" * 60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model = os.getenv("LLM_MODEL", "qwen3.5-plus")
    
    if not api_key or api_key == "your_dashscope_api_key_here":
        print("❌ 错误: 请先在 .env 文件中配置 API Key")
        return
    
    print(f"✅ API Key: {api_key[:8]}...")
    print(f"✅ 模型: {model}")
    print(f"✅ API Base: {base_url}")
    
    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )
    
    print("\n🚀 开始执行任务: 在百度搜索 'Python自动化测试'...")
    print("   (浏览器窗口将自动打开，请稍候...)")
    
    agent = Agent(
        task="打开百度 https://www.baidu.com，在搜索框输入 'Python自动化测试'，点击搜索按钮，然后告诉我前3个搜索结果的标题",
        llm=llm,
    )
    
    start_time = time.time()
    
    try:
        result = await agent.run()
        end_time = time.time()
        elapsed_time = end_time - start_time
        
        print("\n" + "=" * 60)
        print("✅ 任务执行完成!")
        print("=" * 60)
        print(f"结果: {result}")
        
        print("\n" + "=" * 60)
        print("📊 成本统计")
        print("=" * 60)
        print(f"⏱️  总耗时: {elapsed_time:.2f} 秒")
        
        if hasattr(agent, 'state') and agent.state:
            state = agent.state
            if hasattr(state, 'n_steps'):
                print(f"📝 执行步数: {state.n_steps}")
            if hasattr(state, 'history'):
                print(f"📜 历史记录: {len(state.history) if state.history else 0} 条")
        
        if hasattr(result, 'final_result'):
            print(f"🎯 最终结果: {result.final_result}")
        
        if hasattr(agent, 'model') and hasattr(agent.model, 'last_run_metadata'):
            metadata = agent.model.last_run_metadata
            if metadata:
                print(f"📈 模型元数据: {metadata}")
        
        if hasattr(result, '__dict__'):
            print(f"\n📋 结果对象属性: {result.__dict__.keys()}")
        
        return result
        
    except Exception as e:
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"\n❌ 执行失败: {e}")
        print(f"⏱️  失败前耗时: {elapsed_time:.2f} 秒")
        import traceback
        traceback.print_exc()


async def detailed_cost_demo():
    """
    详细成本分析演示
    """
    print("=" * 60)
    print("browser-use 详细成本分析")
    print("=" * 60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model = os.getenv("LLM_MODEL", "qwen3.5-plus")
    
    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )
    
    print("\n🚀 执行简单任务: 打开 example.com 并获取标题...")
    
    agent = Agent(
        task="打开 https://example.com，告诉我页面的标题",
        llm=llm,
    )
    
    start_time = time.time()
    result = await agent.run()
    end_time = time.time()
    
    print("\n" + "=" * 60)
    print("📊 详细成本分析")
    print("=" * 60)
    print(f"⏱️  总耗时: {end_time - start_time:.2f} 秒")
    
    print(f"\n📋 Agent 状态信息:")
    print(f"   - state 类型: {type(agent.state)}")
    print(f"   - state 属性: {dir(agent.state)}")
    
    if hasattr(agent.state, 'n_steps'):
        print(f"   - 执行步数: {agent.state.n_steps}")
    
    if hasattr(agent.state, 'history'):
        history = agent.state.history
        print(f"   - 历史记录数: {len(history) if history else 0}")
        
        total_input_tokens = 0
        total_output_tokens = 0
        
        if hasattr(history, '__iter__'):
            for i, h in enumerate(history):
                if hasattr(h, 'token_usage'):
                    usage = h.token_usage
                    if usage:
                        print(f"   - 步骤 {i+1} token: {usage}")
                        if hasattr(usage, 'input_tokens'):
                            total_input_tokens += usage.input_tokens or 0
                        if hasattr(usage, 'output_tokens'):
                            total_output_tokens += usage.output_tokens or 0
        
        print(f"\n💰 Token 统计:")
        print(f"   - 输入 tokens: {total_input_tokens}")
        print(f"   - 输出 tokens: {total_output_tokens}")
        print(f"   - 总计 tokens: {total_input_tokens + total_output_tokens}")
        
        qwen_input_price = 0.0004
        qwen_output_price = 0.002
        cost = (total_input_tokens * qwen_input_price / 1000) + (total_output_tokens * qwen_output_price / 1000)
        print(f"   - 预估费用: ¥{cost:.4f}")
    
    return result


if __name__ == "__main__":
    print("\n请选择运行模式:")
    print("  1. 百度搜索演示")
    print("  2. 详细成本分析 (example.com)")
    choice = input("\n请输入选择: ").strip()
    
    if choice == "1":
        asyncio.run(baidu_search_demo())
    elif choice == "2":
        asyncio.run(detailed_cost_demo())
    else:
        print("❌ 无效选择")
