const http = require('http');

function testAPI() {
    console.log('🚀 开始测试 AI 自动化测试平台 API...');
    
    // 测试健康检查接口
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/health',
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ 健康检查接口响应:');
            console.log(JSON.stringify(JSON.parse(data), null, 2));
            
            // 测试执行测试接口
            console.log('\n🚀 开始执行测试用例...');
            testExecution();
        });
    });
    
    req.on('error', (error) => {
        console.error(`❌ 健康检查失败: ${error.message}`);
    });
    
    req.end();
}

function testExecution() {
    const url = 'https://www.baidu.com';
    const steps = '搜索123';
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/test/stream?url=${encodeURIComponent(url)}&steps=${encodeURIComponent(steps)}`,
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {
        console.log('✅ 测试执行接口响应:');
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   响应头: ${JSON.stringify(res.headers)}`);
        
        let buffer = '';
        
        res.on('data', (chunk) => {
            buffer += chunk;
            
            // 解析 SSE 事件
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留不完整的行
            
            lines.forEach(line => {
                if (line.startsWith('event:')) {
                    const eventType = line.substring(6).trim();
                    console.log(`\n📡 收到事件: ${eventType}`);
                } else if (line.startsWith('data:')) {
                    const data = line.substring(5).trim();
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.message) {
                            console.log(`   ${parsed.message}`);
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            });
        });
        
        res.on('end', () => {
            console.log('\n🎉 测试执行完成！');
        });
    });
    
    req.on('error', (error) => {
        console.error(`❌ 测试执行失败: ${error.message}`);
    });
    
    req.end();
}

testAPI();
