const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const app = express();
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------ 日志配置 ------

// 简单的日志函数
function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
}

// 请求日志中间件
app.use((req, res, next) => {
    const start = Date.now();
    const { method, url, query, body } = req;
    
    // 对敏感数据进行简单的脱敏处理（如果 body 中有 password）
    const safeBody = { ...body };
    if (safeBody.password) safeBody.password = '***';

    log('info', `Incoming Request: ${method} ${url}`, {
        query,
        body: safeBody
    });

    // 劫持 res.json 以捕获响应
    const originalJson = res.json;
    res.json = function (data) {
        const duration = Date.now() - start;
        const statusCode = res.statusCode || 200;
        
        let logLevel = 'info';
        if (statusCode >= 400) logLevel = 'warn';
        if (statusCode >= 500) logLevel = 'error';

        log(logLevel, `Response Sent: ${method} ${url} ${statusCode} (${duration}ms)`, {
            code: data.code,
            msg: data.msg
        });
        
        return originalJson.call(this, data);
    };

    next();
});


// 简单的文件数据库
const DB_FILE = path.join(__dirname, 'db.json');

// 初始化数据库文件
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        configs: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// 读取数据库
function readDb() {
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        // log('debug', 'Database read successfully');
        return data;
    } catch (error) {
        log('error', 'Failed to read database', { error: error.message });
        throw error;
    }
}

// 写入数据库
function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        log('info', 'Database updated successfully');
    } catch (error) {
        log('error', 'Failed to write database', { error: error.message });
        throw error;
    }
}

// 统一返回格式
function response(res, code, msg, data = null) {
    res.json({
        code,
        msg,
        data,
        success: code === 200
    });
}

// ------ 路由 ------

// 1. 登录
app.post('/index/login', (req, res) => {
    const { account, password } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.account === account && u.password === password);

    if (user) {
        // 生成一个简单的 token (实际应使用 JWT)
        const token = `token_${user.account}_${Date.now()}`;
        // 更新 token
        user.token = token;
        writeDb(db);

        response(res, 200, '登录成功', {
            token,
            userInfo: {
                // 排除密码
                account: user.account,
                id: user.id,
                headImg: user.headImg || ''
            }
        });
    } else {
        response(res, 500, '账号或密码错误');
    }
});

// 2. 注册
app.post('/index/register', (req, res) => {
    const { account, password } = req.body;
    const db = readDb();

    if (db.users.find(u => u.account === account)) {
        return response(res, 500, '账号已存在');
    }

    const newUser = {
        id: Date.now(),
        account,
        password,
        createTime: new Date().toISOString()
    };

    db.users.push(newUser);
    
    // 初始化该用户的配置
    db.configs[account] = {}; // 默认空配置

    writeDb(db);
    response(res, 200, '注册成功');
});

// 3. 保存配置
app.post('/configInfo/saveOrUpdate', (req, res) => {
    const token = req.headers.token;
    if (!token) return response(res, 400, '未登录');

    const db = readDb();
    const user = db.users.find(u => u.token === token);

    if (!user) return response(res, 400, '无效的 token');

    const configData = req.body;
    // 保存用户的配置
    db.configs[user.account] = { ...db.configs[user.account], ...configData };
    writeDb(db);

    response(res, 200, '保存成功');
});

// 4. 获取配置
app.get('/configInfo/curInfo', (req, res) => {
    const token = req.headers.token;
    if (!token) return response(res, 400, '未登录');

    const db = readDb();
    const user = db.users.find(u => u.token === token);

    if (!user) return response(res, 400, '无效的 token');

    const config = db.configs[user.account] || {};
    response(res, 200, '获取成功', config);
});

// 5. 获取位置 (Mock)
app.get('/api/getLocation', async (req, res) => {
    // 这里可以调用真实的 IP 定位 API，或者返回 Mock 数据
    // 简单 Mock
    res.json({
        code: 200,
        data: {
            city: '本地',
            ip: '127.0.0.1',
            id: 'CN101010100', // 北京
            cid: 'CN101010100',
            name: '北京'
        }
    });
});

// Mock 天气
app.get('/api/weather', (req, res) => {
    // 构造和声天气接口返回的结构
    res.json({
        "HeWeather6": [
            {
                "basic": {
                    "cid": "CN101010100",
                    "location": "北京",
                    "parent_city": "北京",
                    "admin_area": "北京",
                    "cnty": "中国",
                    "lat": "39.90498734",
                    "lon": "116.4052887",
                    "tz": "+8.00"
                },
                "update": {
                    "loc": "2020-10-23 11:51",
                    "utc": "2020-10-23 03:51"
                },
                "status": "ok",
                "now": {
                    "cloud": "0",
                    "cond_code": "100",
                    "cond_txt": "晴",
                    "fl": "14",
                    "hum": "21",
                    "pcpn": "0.0",
                    "pres": "1020",
                    "tmp": "18",
                    "vis": "30",
                    "wind_deg": "230",
                    "wind_dir": "西南风",
                    "wind_sc": "2",
                    "wind_spd": "6"
                },
                "sun":{
                    "rise":"06:00",
                    "set":"18:00"
                }
            }
        ]
    });
});

// Mock 一言
app.get('/api/yiyan', (req, res) => {
    res.json({
        "id": 1,
        "hitokoto": "人生若只如初见，何事秋风悲画扇。",
        "type": "i",
        "from": "纳兰性德",
        "from_who": null,
        "creator": "hitokoto",
        "created_at": "1468605910"
    });
});

// 6. 百度搜索建议代理
app.get('/api/baidu_sugrec/:word', async (req, res) => {
    const word = req.params.word;
    try {
        // 百度建议 API 返回的是 GBK 编码
        const result = await axios.get(`http://suggestion.baidu.com/su?wd=${encodeURIComponent(word)}&p=3&cb=`, {
            responseType: 'arraybuffer'
        });
        
        // 使用 iconv-lite 解码 GBK
        const data = iconv.decode(result.data, 'gbk');
        
        // 百度返回的是 JSONP 格式: window.bdsug.sug({q:"...",s:["..."]});
        // 我们需要解析它，或者直接把原始数据发给前端（如果前端处理了 JSONP）
        // 只要前端是用的这个接口，通常期望获得 s 数组。
        // 为了简化，我们解析出数组返回 json
        // 提取括号内的内容
        const start = data.indexOf('({');
        const end = data.lastIndexOf('})');
        if (start > -1 && end > -1) {
             const jsonStr = data.substring(start + 1, end + 1);
             // 百度返回的 key 没有引号，JSON.parse 解析不了，简单的正则提取 s: [...]
             // 也可以构建一个简单的解析
             // 比如 {q:"a",p:false,s:["爱奇艺","阿里云","奥特曼"]}
             // 简单的办法：直接返回 JSONP 字符串给前端，如果前端是当做 json 请求的，那我们得转换成 json
             
             // 假设前端想要的是标准 JSON 格式 { s: [] }
             // 使用 eval 或者 new Function 不安全，用正则提取 s 数组部分
             const sMatch = jsonStr.match(/s:(\[.*?\])/);
             if (sMatch) {
                 const listStr = sMatch[1];
                 // 里面的字符串是双引号，可以 parse
                 const list = JSON.parse(listStr);
                 return res.json({
                     s: list
                 });
             }
        }
        
        res.json({ s: [] });

    } catch (error) {
        log('error', `Baidu suggestion proxy error: ${word}`, { error: error.message });
        console.error(error);
        res.json({ s: [] });
    }
});

// 必应每日壁纸
app.get('/api/bing', async (req, res) => {
    try {
        const bingRes = await axios.get('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
        const data = bingRes.data;
        if (data && data.images && data.images.length > 0) {
            const image = data.images[0];
            const baseUrl = 'https://cn.bing.com';
            res.json({
                code: 200,
                data: {
                    title: image.title,
                    copyright: image.copyright,
                    src: baseUrl + image.url,
                    fullSrc: baseUrl + image.urlbase + '_1920x1080.jpg&rf=LaDigue_1920x1080.jpg' // Approximate logic
                }
            });
        } else {
             response(res, 500, '获取必应壁纸失败');
        }
    } catch (error) {
        log('error', 'Bing wallpaper proxy error', { error: error.message });
        res.status(500).json({ code: 500, msg: error.message });
    }
});

// 必应壁纸列表
app.get('/api/bing/list', async (req, res) => {
    try {
        const bingRes = await axios.get('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8');
        const data = bingRes.data;
        if (data && data.images && data.images.length > 0) {
            const baseUrl = 'https://cn.bing.com';
            const list = data.images.map(image => ({
                title: image.title,
                copyright: image.copyright,
                src: baseUrl + image.url,
                fullSrc: baseUrl + image.urlbase + '_1920x1080.jpg&rf=LaDigue_1920x1080.jpg',
                urlbase: image.urlbase,
                date: image.startdate
            }));
            res.json({
                code: 200,
                data: list
            });
        } else {
             response(res, 500, '获取必应壁纸列表失败');
        }
    } catch (error) {
        log('error', 'Bing wallpaper list proxy error', { error: error.message });
        res.status(500).json({ code: 500, msg: error.message });
    }
});

// 随机壁纸 (加载更多)
app.get('/api/bing/random', async (req, res) => {
    try {
        const count = 3;
        const requests = [];
        for (let i = 0; i < count; i++) {
            // 添加随机参数防止浏览器/axios缓存
            requests.push(axios.get(`https://bing.img.run/rand_uhd.php?type=json&t=${Date.now()}${Math.random()}`));
        }
        
        const results = await Promise.all(requests);
        const list = results.map(r => {
           if(r.data && r.data.pic) {
               return {
                   title: "随机壁纸", // 第三方接口未返回标题
                   copyright: "来自 Bing 历史图库",
                   src: r.data.pic,
                   fullSrc: r.data.pic,
                   type: 'random'
               };
           }
           return null;
        }).filter(item => item !== null);

        res.json({
            code: 200,
            data: list
        });
    } catch (error) {
        log('error', 'Bing random wallpaper proxy error', { error: error.message });
        res.status(500).json({ code: 500, msg: error.message });
    }
});

// 7. 豆瓣 FM (Mock)
app.get('/api/fm/playlist', (req, res) => {
    // 返回一些假数据
    const mockList = [
        {
            title: "Mock Song 1",
            artist: "Artist 1",
            url: "http://music.163.com/song/media/outer/url?id=447925558.mp3",
            picture: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
        },
        {
            title: "Mock Song 2",
            artist: "Artist 2",
            url: "http://music.163.com/song/media/outer/url?id=447925558.mp3",
            picture: "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
        }
    ];
    
    // 模拟真实结构
    res.json({
        code: 200,
        song: mockList
    });
});

// 8. 网站列表 (Mock)
app.get('/website/list', (req, res) => {
    // 简单的网址 Mock
    const websites = [
        {
            name: "常用",
            list: [
                { title: "百度", url: "https://www.baidu.com", icon: "" },
                { title: "GitHub", url: "https://github.com", icon: "" },
                { title: "Bilibili", url: "https://www.bilibili.com", icon: "" }
            ]
        }
    ];
    res.json({
        code: 200,
        data: websites
    });
});


// === 静态资源托管 (生产环境) ===
// 假设前端构建输出在 ../search 目录（根据 vue.config.js outputDir: 'search'）
const staticPath = path.join(__dirname, '../search');
if (fs.existsSync(staticPath)) {
    log('info', `Hosting static files from ${staticPath}`);
    app.use(express.static(staticPath));

    // 处理 SPA 路由：所有未匹配的 API 请求都返回 index.html
    // 注意：要放在所有 API 路由之后
    app.get('*', (req, res) => {
        // 如果是 API 请求，不返回 index.html (通常 404)
        if (req.path.startsWith('/api') || req.path.startsWith('/index') || req.path.startsWith('/configInfo') || req.path.startsWith('/website')) {
             return res.status(404).json({ code: 404, msg: 'Not Found' });
        }
        res.sendFile(path.join(staticPath, 'index.html'));
    });
} else {
    log('warn', `Static directory not found: ${staticPath}. Run 'npm run build' in root directory first.`);
}


const os = require('os');
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log(`Server is running on:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://${ip}:${PORT}`);
});
