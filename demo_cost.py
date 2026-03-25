"""
browser-use Token 成本分析工具
使用百度搜索分析 token 消耗
"""
import asyncio
import os
import time
from dotenv import load_dotenv
from browser_use import Agent, ChatOpenAI

load_dotenv()


async def analyze_baidu_search():
    """
    分析百度搜索的 token 使用情况
    """
    print("=" * 60)
    print("browser-use Token 成本分析 (百度搜索)")
    print("=" * 60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model = os.getenv("LLM_MODEL", "qwen3.5-plus")
    
    print(f"✅ 模型: {model}")
    
    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
    )
    
    print("\n🚀 执行任务: 在百度搜索 'Python自动化测试'...")
    
    agent = Agent(
        task="打开百度 https://www.baidu.com，在搜索框输入 'Python自动化测试'，点击搜索按钮，然后告诉我前3个搜索结果的标题",
        llm=llm,
    )
    
    start_time = time.time()
    result = await agent.run()
    end_time = time.time()
    
    elapsed_time = end_time - start_time
    
    print("\n" + "=" * 60)
    print("📊 成本分析结果")
    print("=" * 60)
    print(f"⏱️  总耗时: {elapsed_time:.2f} 秒")
    print(f"📝 执行步数: {agent.state.n_steps}")
    
    total_chars = 0
    
    if hasattr(agent.state, 'message_manager_state'):
        mms = agent.state.message_manager_state
        if mms and hasattr(mms, 'history'):
            history = mms.history
            print(f"\n📋 消息历史类型: {type(history)}")
            
            if hasattr(history, '__iter__'):
                msg_count = 0
                for msg in history:
                    msg_count += 1
                    if hasattr(msg, 'content'):
                        content = str(msg.content) if msg.content else ""
                        total_chars += len(content)
                print(f"   消息数量: {msg_count}")
    
    estimated_tokens = total_chars // 4
    
    print("\n" + "=" * 60)
    print("💰 Token 统计汇总")
    print("=" * 60)
    print(f"   总字符数: {total_chars}")
    print(f"   估算 tokens (字符/4): {estimated_tokens}")
    
    qwen_avg_price = 0.001
    estimated_cost = estimated_tokens * qwen_avg_price / 1000
    print(f"\n💵 预估费用: ¥{estimated_cost:.4f}")
    
    print("\n" + "=" * 60)
    print("📊 本次执行统计汇总")
    print("=" * 60)
    print(f"| 指标 | 数值 |")
    print(f"|------|------|")
    print(f"| 总耗时 | {elapsed_time:.2f} 秒 |")
    print(f"| 执行步数 | {agent.state.n_steps} 步 |")
    print(f"| 估算 tokens | ~{estimated_tokens} |")
    print(f"| 预估费用 | ~¥{estimated_cost:.4f} |")
    
    print("\n" + "=" * 60)
    print(" 千问模型价格对比")
    print("=" * 60)
    print("| 模型 | 输入价格 | 输出价格 | 本次任务预估费用 |")
    print("|------|---------|---------|----------------|")
    print(f"| qwen-turbo | ¥0.3/百万token | ¥0.6/百万token | ~¥{estimated_tokens * 0.00045 / 1000:.4f} |")
    print(f"| qwen-plus | ¥0.4/百万token | ¥2/百万token | ~¥{estimated_tokens * 0.0012 / 1000:.4f} |")
    print(f"| qwen3.5-plus | ¥0.4/百万token | ¥2/百万token | ~¥{estimated_cost:.4f} |")
    print(f"| qwen-max | ¥20/百万token | ¥60/百万token | ~¥{estimated_tokens * 0.04 / 1000:.4f} |")
    
    print("\n" + "=" * 60)
    print("💡 成本优化建议")
    print("=" * 60)
    print("1. 简单任务用 qwen-turbo (节省约 50%)")
    print("2. 复杂任务用 qwen3.5-plus (性价比最高)")
    print("3. 使用更简洁的任务描述减少 tokens")
    print("4. 减少不必要的页面交互步骤")
    print("5. 启用 headless 模式可减少执行时间")
    
    return result


if __name__ == "__main__":
    asyncio.run(analyze_baidu_search())
