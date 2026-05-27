import https from 'https';

https.get('https://api.github.com/repos/Shai7net/3Dmagic_wand', { headers: { 'User-Agent': 'node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const repo = JSON.parse(data);
        console.log("Default branch:", repo.default_branch);
    });
});
