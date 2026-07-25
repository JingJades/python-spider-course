# Kimi K3 API 代理服务

基于 Node.js 的 Kimi K3 API 代理服务，提供 OpenAI 兼容的接口。

## 环境要求

- Node.js >= 18.x
- npm 或 yarn

## 安装步骤

### 第一步：安装 Node.js

**方法一：使用 winget（推荐）**

```powershell
winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
```

安装完成后，**重新打开终端**，验证安装：

```powershell
node --version
npm --version
```

**方法二：手动下载安装**

访问 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本并安装。

### 第二步：获取 Kimi API Key

1. 访问 [Kimi API Platform](https://platform.kimi.ai/)
2. 登录账号并完成充值（最低 \$1）
3. 进入 [API Keys](https://platform.kimi.ai/console/api-keys) 创建 API Key

### 第三步：配置 API Key

编辑 `.env` 文件，将 `your_api_key_here` 替换为你的 API Key：

```env
MOONSHOT_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### 第四步：安装依赖

```powershell
cd "d:\29393\Documents\ai agent"
npm install
```

### 第五步：启动服务

```powershell
npm start
```

服务启动后访问：`http://localhost:3000`

### 第六步：测试连接

```powershell
npm test
```

## API 使用方式

### 基本调用（curl）

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-any-key" \
  -d '{
    "model": "kimi-k3",
    "messages": [
      {"role": "system", "content": "你是一个智能助手"},
      {"role": "user", "content": "你好！"}
    ],
    "reasoning_effort": "max"
  }'
```

### 流式调用

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-any-key" \
  -d '{
    "model": "kimi-k3",
    "messages": [
      {"role": "user", "content": "解释一下量子计算"}
    ],
    "stream": true
  }'
```

### Python 调用示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="any-string",
    base_url="http://localhost:3000/v1"
)

response = client.chat.completions.create(
    model="kimi-k3",
    messages=[
        {"role": "user", "content": "你好！"}
    ]
)

print(response.choices[0].message.content)
```

## 支持的模型

| 模型名称 | 说明 |
|---------|------|
| `kimi-k3` | 旗舰模型，2.8T 参数，1M 上下文 |
| `kimi-k2.7-code-highspeed` | 高速编码模型 |
| `kimi-k2.6` | 通用模型 |

## 项目结构

```
ai agent/
├── package.json      # 项目依赖配置
├── server.js         # 代理服务主程序
├── .env              # 环境变量配置
├── test.js           # 连接测试脚本
└── README.md         # 使用文档
```

## 注意事项

1. **API Key 安全**：不要将 API Key 硬编码在代码中，使用环境变量配置
2. **端口冲突**：如果端口 3000 被占用，修改 `.env` 中的 `PORT` 配置
3. **网络要求**：需要能够访问 `https://api.moonshot.ai`
4. **Kimi K3 完整权重**：预计 2026年7月27日发布，目前仅支持 API 调用

## 故障排查

### 常见错误

1. **API Key 错误**：检查 `.env` 文件中的 API Key 是否正确
2. **网络连接失败**：确认可以访问 `https://api.moonshot.ai`
3. **端口占用**：使用其他端口或释放端口 3000
4. **依赖安装失败**：检查网络连接或尝试更换 npm 源

### 查看服务日志

服务启动后会输出日志信息，包含请求和错误详情。