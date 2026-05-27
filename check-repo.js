import https from 'https';

https.get('https://api.github.com/repos/Shai7net/3Dmagic_wand/git/trees/main?recursive=1', { headers: { 'User-Agent': 'node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(data);
    });
});
