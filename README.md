# 🤖 AI 自动化测试平台

基于 [Midscene.js](https://midscenejs.com/) 的 AI 驱动自动化测试平台，支持自然语言描述测试步骤，让 UI 自动化测试变得简单高效。

## ✨ 特性

- 🎯 **自然语言驱动** - 用中文/英文描述测试步骤，AI 自动执行
- 🚀 **快速执行** - 使用 JavaScript API 直接调用，性能优异
- 📊 **可视化报告** - 自动生成 HTML 测试报告
- 🔄 **实时输出** - 支持 SSE 实时显示测试进度
- 🌐 **Web 界面** - 简洁易用的 Web 操作界面

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/levelksk/ui_auto_test_demo.git
cd ui_auto_test_demo

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 AI 模型 API Key
```

## ⚙️ 配置

在 `.env` 文件中配置 AI 模型：

### 支持的 AI 模型

| 模型 | 提供商 | 特点 |
|------|--------|------|
| **Qwen3-VL** | 阿里云 | 推荐，视觉能力强，速度快 |
| **Qwen3.5** | 阿里云 | 通用模型，性价比高 |
| **GPT-4o** | OpenAI | 视觉能力强，国际用户推荐 |
| **Doubao-Seed** | 火山引擎 | 豆包模型，国内访问稳定 |
| **GLM-4.6V** | 智谱 AI | 国产视觉模型，性能优秀 |
| **DeepSeek-VL** | DeepSeek | 开源模型，可私有部署 |

### 配置示例

#### 阿里千问 Qwen3-VL（推荐）

```env
MIDSCENE_MODEL_NAME=qwen3-vl-plus
MIDSCENE_MODEL_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MIDSCENE_MODEL_API_KEY=your-api-key-here
MIDSCENE_MODEL_FAMILY=qwen-vl
```

#### 阿里千问 Qwen3.5

```env
MIDSCENE_MODEL_NAME=qwen3.5-plus
MIDSCENE_MODEL_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MIDSCENE_MODEL_API_KEY=your-api-key-here
MIDSCENE_MODEL_FAMILY=qwen3.5
MIDSCENE_MODEL_REASONING_ENABLED=false
```

#### OpenAI GPT-4o

```env
MIDSCENE_MODEL_NAME=gpt-4o
MIDSCENE_MODEL_API_KEY=your-openai-api-key
```

#### 火山引擎 豆包 Seed

```env
MIDSCENE_MODEL_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
MIDSCENE_MODEL_API_KEY=your-api-key-here
MIDSCENE_MODEL_NAME=your-endpoint-id
MIDSCENE_MODEL_FAMILY=doubao-seed
```

#### 智谱 AI GLM-4.6V

```env
MIDSCENE_MODEL_BASE_URL=https://open.bigmodel.cn/api/paas/v4
MIDSCENE_MODEL_API_KEY=your-api-key-here
MIDSCENE_MODEL_NAME=glm-4.6v
MIDSCENE_MODEL_FAMILY=glm-v
```

#### DeepSeek VL

```env
MIDSCENE_MODEL_BASE_URL=https://api.deepseek.com
MIDSCENE_MODEL_API_KEY=your-api-key-here
MIDSCENE_MODEL_NAME=deepseek-vl
MIDSCENE_MODEL_FAMILY=deepseek-vl
```

> 💡 更多模型配置请参考 [Midscene.js 官方文档](https://midscenejs.com/zh/model-common-config.html)

## 🚀 使用

### 启动服务

```bash
npm run dev
```

访问 http://localhost:3000 打开 Web 界面。

### Web 界面使用

1. 输入测试网站 URL
2. 输入测试步骤（每行一个步骤），例如：
   ```
   点击登录按钮
   在用户名输入框输入 admin
   在密码输入框输入 123456
   点击提交按钮
   验证页面显示欢迎信息
   ```
3. 点击「执行测试」按钮
4. 查看实时执行日志和测试报告

## 📁 项目结构

```
ui_auto_test_demo/
├── backend/
│   ├── server.js        # Express 服务器
│   └── testRunner.js    # 测试执行引擎
├── frontend/
│   ├── index.html       # Web 界面
│   ├── style.css        # 样式
│   └── app.js           # 前端逻辑
├── Dockerfile           # Docker 镜像配置
├── docker-compose.yml   # Docker 编排配置
├── .env.example         # 环境变量示例
└── package.json         # Node.js 配置
```

## 🔧 技术栈

- **前端**: HTML, CSS, JavaScript
- **后端**: Node.js, Express
- **自动化引擎**: Midscene.js
- **浏览器**: Puppeteer + Chrome
- **AI 模型**: 支持阿里千问、OpenAI 等

## 📝 示例

### 百度搜索测试

```
URL: https://www.baidu.com
步骤:
搜索123
```

### 登录流程测试

```
URL: https://example.com/login
步骤:
点击用户名输入框
输入 testuser
点击密码输入框
输入 password123
点击登录按钮
验证登录成功
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [Midscene.js](https://midscenejs.com/) - AI 驱动的 UI 自动化框架
- [Puppeteer](https://pptr.dev/) - 浏览器自动化工具
- [阿里千问](https://tongyi.aliyun.com/) - AI 大模型服务
