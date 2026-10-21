const {spawn} = require('node:child_process');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9256',
  '--user-data-dir=C:/temp/chrome-test-profile-2',
  'about:blank'
], {windowsHide: true, stdio: 'ignore'});

(async () => {
  try {
    let tabs;
    for (let n = 0; n < 30; n++) {
      try {
        tabs = await (await fetch('http://127.0.0.1:9256/json')).json();
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

    await send('Page.navigate', {url: 'http://127.0.0.1:8000/templates/mau-thiep-8/mau-thiep-8.html'});
    await pause(1000);

    // Check style properties BEFORE open
    const beforeOpen = await evalExpr(`
      Array.from(document.querySelectorAll('.royal-album__card')).map((c, i) => {
        return {
          index: i,
          className: c.className,
          inlineStyle: c.getAttribute('style'),
          revealDelay: c.style.getPropertyValue('--royal-reveal-delay'),
          computedOpacity: getComputedStyle(c).opacity
        };
      })
    `);
    console.log('BEFORE OPEN:', JSON.stringify(beforeOpen, null, 2));

    // Now click envelope
    await evalExpr(`document.querySelector('.royal-opening-envelope').click()`);
    await pause(300); // 300ms into opening

    const afterClick = await evalExpr(`
      Array.from(document.querySelectorAll('.royal-album__card')).map((c, i) => {
        return {
          index: i,
          className: c.className,
          computedOpacity: getComputedStyle(c).opacity
        };
      })
    `);
    console.log('300ms AFTER CLICK:', JSON.stringify(afterClick, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
})();
