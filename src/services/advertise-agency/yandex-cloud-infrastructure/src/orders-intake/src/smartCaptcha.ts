import https from 'https';
import querystring from 'querystring';

const SMARTCAPTCHA_SERVER_KEY = process.env.SMARTCAPTCHA_SERVER_KEY;

function checkCaptcha(token: string, ipAddress: string, callback: (ok: boolean) => void) {
    const postData = querystring.stringify({
        secret: SMARTCAPTCHA_SERVER_KEY,
        token,
        ip: ipAddress,
    });

    const options: https.RequestOptions = {
        hostname: 'smartcaptcha.cloud.yandex.ru',
        port: 443,
        path: '/validate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 5000,
    };

    const req = https.request(options, (res) => {
        let content = '';

        res.on('data', (chunk) => {
            content += chunk;
        });

        res.on('end', () => {
            if (res.statusCode !== 200) {
                console.error(`Captcha validation error: code=${res.statusCode}; message=${content}`);
                callback(false);
                return;
            }

            try {
                const parsedContent = JSON.parse(content);
                callback(parsedContent.status === 'ok');
            } catch (err) {
                console.error('Error parsing response:', err);
                callback(false);
            }
        });
    });

    req.on('error', (error) => {
        console.error(error);
        callback(false);
    });

    req.on('timeout', () => {
        req.destroy();
        console.error('Captcha request timed out');
        callback(false);
    });

    req.write(postData);
    req.end();
}

export function checkCaptchaAsync(token: string, ipAddress: string): Promise<boolean> {
    return new Promise((resolve) => {
        checkCaptcha(token, ipAddress, resolve);
    });
}
