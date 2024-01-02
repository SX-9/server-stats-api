#! /usr/bin/env node

const app = require('express')();
const si = require('systeminformation');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.removeHeader('X-Powered-By');
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.get('/stats', async (_, res) => {
  const { currentLoad } = await si.currentLoad();
  const { total, active } = await si.mem();
  const { uptime } = await si.time();

  const cpu = Math.round(currentLoad);
  const ram = Math.round(active / total * 100);

  res.json({
    uptime, ram, cpu
  });
});

app.get('/specs', async (_, res) => {
  const { manufacturer: man1, version, model: name } = await si.system();
  const { manufacturer: man2, brand } = await si.cpu();
  const { total: ramInBytes } = await si.mem();

  const model = [man1, version, name].join(' ');
  const ram = Math.round(ramInBytes / 1024 / 1024 / 1024);
  const cpu = [man2, brand].join(' ');

  res.json({
    model, cpu, ram
  });
});

app.listen(3000, () => {
  console.log(`Server is running... http://localhost:3000`);
});
