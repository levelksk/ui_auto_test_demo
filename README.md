# 🤖 AI 自动化测试平台

基于 [Midscene.js](https://midscenejs.com/) 的 AI 驱动自动化测试平台，支持自然语言描述测试步骤，让 UI 自动化测试变得简单高效。

## ✨ 特性

- 🎯 **自然语言驱动** - 用中文/英文描述测试步骤，AI 自动执行
- 🚀 **快速执行** - 使用 JavaScript API 直接调用，性能优异
- 📊 **可视化报告** - 自动生成 HTML 测试报告
- 🔄 **实时输出** - 支持 SSE 实时显示测试进度
- 🌐 **Web 界面** - 简洁易用的 Web 操作界面
- 🐳 **Docker 支持** - 一键容器化部署

## 📦 安装

### 方式一：本地运行

```bash
# 1. 克隆项目
git clone https://github.com/levelksk/ui_auto_test_demo.git
cd ui_auto_test_demo

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
```

**4. 编辑 .env 文件（重要！）**

打开 `.env` 文件，配置以下内容：

```env
# ============================================
# AI 模型配置（必填）
# ============================================
MIDSCENE_MODEL_NAME=qwen3-vl-plus
MIDSCENE_MODEL_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MIDSCENE_MODEL_API_KEY=your-api-key-here    # 替换为你的 API Key
MIDSCENE_MODEL_FAMILY=qwen-vl

# ============================================
# Chrome 浏览器路径（可选）
# ============================================
# 如果程序提示"未找到 Chrome 浏览器"，请取消下面注释并修改路径
# Windows:
# CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
# macOS:
# CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Linux:
# CHROME_PATH=/usr/bin/google-chrome
```

**5. 启动服务**

```bash
npm run dev
```

访问 http://localhost:3000 打开 Web 界面。

### 方式二：Docker 部署（推荐）

> 💡 镜像已发布到 Docker Hub：[xulingfeng/midscene-test-platform](https://hub.docker.com/r/xulingfeng/midscene-test-platform)

**Linux / macOS：**

```bash
# 1. 创建项目目录
mkdir ui_auto_test_demo && cd ui_auto_test_demo

# 2. 下载环境变量模板
curl -O https://raw.githubusercontent.com/levelksk/ui_auto_test_demo/main/.env.example
mv .env.example .env

# 3. 编辑 .env 文件，填入你的 AI 模型 API Key
# 例如：MIDSCENE_MODEL_API_KEY=sk-xxxxxx

# 4. 下载 docker-compose.yml
curl -O https://raw.githubusercontent.com/levelksk/ui_auto_test_demo/main/docker-compose.yml

# 5. 创建目录并设置权限（Linux 必须）
mkdir -p midscene_run/report midscene_run/log screenshots
chmod -R 777 midscene_run screenshots

# 6. 一键启动（自动拉取预构建镜像）
docker-compose up -d
```

**Windows PowerShell：**

```powershell
# 1. 创建项目目录
mkdir ui_auto_test_demo
cd ui_auto_test_demo

# 2. 下载环境变量模板
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/levelksk/ui_auto_test_demo/main/.env.example" -OutFile ".env"

# 3. 编辑 .env 文件，填入你的 AI 模型 API Key
# 用记事本打开：notepad .env
# 填入：MIDSCENE_MODEL_API_KEY=sk-xxxxxx

# 4. 下载 docker-compose.yml
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/levelksk/ui_auto_test_demo/main/docker-compose.yml" -OutFile "docker-compose.yml"

# 5. 一键启动（自动拉取预构建镜像）
docker-compose up -d
```

访问 http://localhost:3000 打开 Web 界面。

### 方式三：本地 Docker 构建

如果你想自己构建镜像：

```bash
# 1. 克隆项目
git clone https://github.com/levelksk/ui_auto_test_demo.git
cd ui_auto_test_demo

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 AI 模型 API Key

# 3. 创建目录并设置权限（Linux 必须）
mkdir -p midscene_run/report midscene_run/log screenshots
chmod -R 777 midscene_run screenshots

# 4. 构建并启动
docker-compose -f docker-compose.build.yml up -d --build
```

访问 http://localhost:3000 打开 Web 界面。

## ⚙️ 配置

### 环境变量说明

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `MIDSCENE_MODEL_NAME` | ✅ | AI 模型名称 |
| `MIDSCENE_MODEL_API_KEY` | ✅ | AI 模型 API Key |
| `MIDSCENE_MODEL_BASE_URL` | ❌ | API 地址（部分模型需要） |
| `MIDSCENE_MODEL_FAMILY` | ❌ | 模型家族（部分模型需要） |
| `CHROME_PATH` | ❌ | Chrome 路径（默认自动检测） |
| `PORT` | ❌ | 服务端口（默认 3000） |

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

## ⚠️ 注意事项

### 本地运行注意事项

#### 1. Chrome 浏览器配置

程序会按以下顺序查找 Chrome：

1. **环境变量 `CHROME_PATH`**（优先级最高）
2. **默认路径自动检测**

**Windows 常见路径：**
```
C:\Program Files\Google\Chrome\Application\chrome.exe
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
```

**macOS 常见路径：**
```
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

**Linux 常见路径：**
```
/usr/bin/google-chrome
/usr/bin/chromium-browser
```

**如果提示"未找到 Chrome 浏览器"，请在 `.env` 文件中添加：**

```env
# Windows 示例
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe

# macOS 示例
# CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome

# Linux 示例
# CHROME_PATH=/usr/bin/google-chrome
```

#### 2. 网络问题

- 确保 AI 模型 API 可访问
- 国内用户使用 OpenAI 需要配置代理

#### 3. 端口占用

- 默认使用 3000 端口
- 如端口被占用，可在 `.env` 中设置：
  ```env
  PORT=3001
  ```

### Docker 部署注意事项

#### 1. 环境变量传递

- 必须使用 `--env-file .env` 参数传递环境变量
- 或者在 `docker-compose.yml` 中配置环境变量
- 容器内无法直接读取宿主机的环境变量

#### 2. 镜像拉取问题

- 国内用户可能需要配置 Docker 镜像加速器
- 推荐配置阿里云、腾讯云等镜像源
- Docker Desktop 设置路径：Settings → Docker Engine

#### 3. Chrome 浏览器

- Docker 镜像已预装 Chrome，无需额外安装
- Chrome 路径已配置在环境变量中

#### 4. 权限问题

- 容器以非 root 用户运行，确保目录权限正确
- 如遇权限问题，检查 `midscene_run` 和 `screenshots` 目录权限

### 常用 Docker 命令

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs midscene-test

# 停止容器
docker stop midscene-test

# 启动容器
docker start midscene-test

# 删除容器
docker rm -f midscene-test

# 重新构建镜像
docker build -t midscene-test-platform .

# 进入容器调试
docker exec -it midscene-test bash
```

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

## ❓ 常见问题

### Q: 提示"未找到 Chrome 浏览器"

**A:** 在 `.env` 文件中配置 `CHROME_PATH` 环境变量，指向你的 Chrome 安装路径。

### Q: 提示"Model configuration is incomplete"

**A:** 检查 `.env` 文件中是否正确配置了 `MIDSCENE_MODEL_NAME` 和 `MIDSCENE_MODEL_API_KEY`。

### Q: Docker 容器启动后无法访问

**A:** 
1. 检查端口是否被占用：`netstat -ano | findstr :3000`
2. 检查容器日志：`docker logs midscene-test`
3. 确保使用了 `--env-file .env` 参数

### Q: 执行测试时报网络错误

**A:** 
1. 检查目标网站是否可访问
2. 检查 AI 模型 API 是否可访问
3. 如在国内使用 OpenAI，需要配置代理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [Midscene.js](https://midscenejs.com/) - AI 驱动的 UI 自动化框架
- [Puppeteer](https://pptr.dev/) - 浏览器自动化工具
- [阿里千问](https://tongyi.aliyun.com/) - AI 大模型服务
- [OpenAI](https://openai.com/) - GPT 系列大模型
- [火山引擎](https://www.volcengine.com/) - 豆包大模型
- [智谱 AI](https://www.bigmodel.cn/) - GLM 系列大模型
- [DeepSeek](https://www.deepseek.com/) - 开源大模型
