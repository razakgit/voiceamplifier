const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Generate self-signed certificate
try {
    execSync('openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"', { stdio: 'inherit' });
} catch (error) {
    console.log('Certificate generation failed, trying alternative method...');
}

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, (req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './voice-amplifier.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8443;
server.listen(PORT, () => {
    console.log(`HTTPS Server running at https://192.168.1.18:${PORT}/voice-amplifier.html`);
    console.log('Note: You will see a security warning - click "Advanced" and "Proceed" to continue');
});
