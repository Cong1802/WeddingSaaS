const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9258',
  '--user-data-dir=C:/temp/chrome-test-profile',
  'about:blank'
], {windowsHide: true, stdio: 'ignore'});

(async () => {
  try {
    let tabs;
    for (let n = 0; n < 30; n++) {
      try {
        tabs = await (await fetch('http://127.0.0.1:9258/json')).json();
        if (tabs.some(t => t.type === 'page')) break;
      } catch {}
      await pause(200);
    }
    const pageTab = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(res => ws.addEventListener('open', res, {once: true}));

    let id = 0;
    const reqs = new Map();
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      const req = reqs.get(msg.id);
      if (req) {
        reqs.delete(msg.id);
        msg.error ? req.reject(msg.error) : req.resolve(msg.result);
      }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const reqId = ++id;
      reqs.set(reqId, {resolve, reject});
      ws.send(JSON.stringify({id: reqId, method, params}));
    });
    const evalExpr = async expr => {
      const res = await send('Runtime.evaluate', {expression: expr, returnByValue: true, awaitPromise: true});
      return res.result?.value;
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2.625,
      mobile: true
    });

    console.log('Navigating...');
    await send('Page.navigate', {url: 'http://127.0.0.1:8000/templates/mau-thiep-8/mau-thiep-8.html'});
    await pause(1000);

    // Click open envelope if present
    await evalExpr(`
      const btn = document.querySelector('.royal-opening-envelope');
      if (btn) btn.click();
    `);
    await pause(2500);

    // Scroll to album section
    await evalExpr(`
      const album = document.querySelector('.royal-album');
      if (album) album.scrollIntoView({behavior: 'instant', block: 'start'});
    `);
    console.log('Scrolled to album. Waiting 1.5s...');
    await pause(1500);

    // Inspect card classes and styles
    const cardInfo = await evalExpr(`
      Array.from(document.querySelectorAll('.royal-album__card')).map((c, i) => {
        const style = window.getComputedStyle(c);
        const rect = c.getBoundingClientRect();
        return {
          index: i,
          className: c.className,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          transitionDelay: style.transitionDelay,
          top: rect.top,
          height: rect.height,
          hasIsVisible: c.classList.contains('is-visible')
        };
      })
    `);
    console.log('Card info at 1.5s:', JSON.stringify(cardInfo, null, 2));

    await pause(2500); // at 4.0s
    const cardInfoLater = await evalExpr(`
      Array.from(document.querySelectorAll('.royal-album__card')).map((c, i) => {
        const style = window.getComputedStyle(c);
        return {
          index: i,
          opacity: style.opacity,
          hasIsVisible: c.classList.contains('is-visible')
        };
      })
    `);
    console.log('Card info at 4.0s:', JSON.stringify(cardInfoLater, null, 2));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', {format: 'png'});
    fs.writeFileSync('C:/temp/album_test.png', Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to C:/temp/album_test.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
})();
