const https = require('https');
const fs = require('fs');

/**
 * Web Vitals 데이터 수집 스크립트
 * Chrome UX Report API를 사용하여 실제 사용자 데이터 수집
 */

async function fetchWebVitals(url) {
    const apiUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
    
    const postData = JSON.stringify({
        url: url,
        metrics: [
            'LARGEST_CONTENTFUL_PAINT',
            'FIRST_INPUT_DELAY',
            'CUMULATIVE_LAYOUT_SHIFT',
            'FIRST_CONTENTFUL_PAINT'
        ]
    });
    
    return new Promise((resolve) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(apiUrl, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.error) {
                        resolve({ url, hasData: false, reason: result.error.message });
                    } else {
                        resolve({ url, hasData: true, data: result });
                    }
                } catch (e) {
                    resolve({ url, hasData: false, reason: 'No real user data available' });
                }
            });
        });
        
        req.on('error', () => resolve({ url, hasData: false, reason: 'Network error' }));
        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        const urls = JSON.parse(process.argv[2]);
        const results = [];
        
        console.log('🌍 Collecting Web Vitals data...');
        
        for (const url of urls) {
            console.log(`📊 Fetching Web Vitals for: ${url}`);
            const result = await fetchWebVitals(url);
            results.push(result);
            
            // API 호출 간격
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 결과 저장
        if (!fs.existsSync('performance-data')) {
            fs.mkdirSync('performance-data', { recursive: true });
        }
        
        fs.writeFileSync(
            'performance-data/web-vitals.json',
            JSON.stringify(results, null, 2)
        );
        
        console.log('✅ Web Vitals data saved to performance-data/web-vitals.json');
        
        // 요약 출력
        const withData = results.filter(r => r.hasData).length;
        const withoutData = results.length - withData;
        console.log(`📊 Summary: ${withData} pages with data, ${withoutData} without data`);
        
    } catch (error) {
        console.error('❌ Error collecting Web Vitals:', error.message);
        process.exit(1);
    }
}

main(); 