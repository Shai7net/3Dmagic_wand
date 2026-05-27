import fetch from 'node-fetch';

async function check() {
  const url = 'https://raw.githubusercontent.com/Shai7net/3Dmagic_wand/main/Dmagic_wand%20model/Dmagic_wand%20model.glb';
  const res = await fetch(url);
  console.log('STATUS:', res.status);
}

check();
