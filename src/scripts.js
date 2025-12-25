(function(){
  const SIDEBAR_ROOT_ID = 'sidebar-root';
  const POSSIBLE_PATHS = [
    './partials/sidebar.html',
    'partials/sidebar.html',
    '/partials/sidebar.html',
    'src/partials/sidebar.html'
  ];

  // 初始化页面过渡：页面加载时淡入，点击侧栏链接时先淡出再跳转
  function enablePageTransitions(){
    try{
      const body = document.body;
      // 使用类控制透明度：添加隐藏类，后续在准备就绪时移除以淡入
      body.classList.add('transition-hidden');
    }catch(e){ /* ignore */ }
  }

  // 为侧栏内的链接绑定平滑跳转处理
  function bindSidebarLinks(root){
    if(!root) return;
    const links = root.querySelectorAll('.toc-link');
    links.forEach(a => {
      a.addEventListener('click', function(evt){
        // 允许用户使用 Ctrl/Cmd/Shift/中键 打开新标签页
        if(evt.defaultPrevented) return;
        if(evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.button === 1) return;

        const href = a.getAttribute('href');
        if(!href || href.startsWith('#') || href.startsWith('mailto:')) return;

        // 外部链接或跨域链接不拦截
        try{
          const url = new URL(href, location.href);
          if(url.origin !== location.origin) return;
        }catch(e){ /* 如果无法解析，则不拦截 */ return; }

        evt.preventDefault();
        const body = document.body;
        // 触发淡出（依赖 styles.css 中的 transition）——使用类以保持一致
        body.classList.add('transition-hidden');
        // 在过渡结束后导航（260ms 对应 CSS）
        setTimeout(() => { location.href = href; }, 280);
      });
    });
  }

  // 避免 Mermaid 渲染前显示原始文本造成闪烁：
  // - CSS 中默认隐藏 .mermaid（styles.css），
  // - 返回一个 Promise，当所有 .mermaid 容器生成 <svg> 或超时后 resolve
  function revealMermaidWhenReady(timeout = 1200){
    const containers = Array.from(document.querySelectorAll('.mermaid'));
    if(containers.length === 0) return Promise.resolve();

    return new Promise(resolve => {
      let remaining = containers.length;
      const timers = [];

      function markVisible(c, mo){
        if(!c.classList.contains('visible')) c.classList.add('visible');
        if(mo) mo.disconnect();
        remaining -= 1;
        if(remaining <= 0){
          timers.forEach(t => clearTimeout(t));
          resolve();
        }
      }

      containers.forEach(c => {
        if(c.querySelector('svg')){
          markVisible(c, null);
          return;
        }

        const mo = new MutationObserver((mutations, obs) => {
          if(c.querySelector('svg')){
            markVisible(c, obs);
          }
        });
        mo.observe(c, { childList: true, subtree: true });

        // 超时备份，避免永久隐藏
        const t = setTimeout(() => {
          markVisible(c, mo);
        }, timeout);
        timers.push(t);
      });
    });
  }

  function getIdForPath(pathname){
    const map = { 'kmp.html': 'kmp', 'tree.html': 'tree', 'graph.html': 'graph', 'index.html': 'index', '': null };
    return map[pathname] || null;
  }

  async function tryFetchSidebar(){
    let lastErr = null;
    for(const p of POSSIBLE_PATHS){
      try{
        const r = await fetch(p);
        if(!r.ok) throw new Error(`fetch ${p} failed: ${r.status} ${r.statusText}`);
        const text = await r.text();
        if(text && text.indexOf('class="sidebar"') !== -1) return text;
      }catch(err){ lastErr = err; }
    }
    throw lastErr || new Error('无法加载侧栏');
  }

  function fallbackSidebarHTML(){
    return '\n        <aside class="sidebar">\n          <div class="logo"><div class="icon">序</div><div class="title">Hello 算法</div></div>\n          <ul class="toc">\n            <li data-id="index"><a class="toc-link" href="index.html">🏠&nbsp;目录</a></li>\n            <li data-id="kmp"><a class="toc-link" href="kmp.html">🔡&nbsp;KMP（模式匹配）</a></li>\n            <li data-id="tree"><a class="toc-link" href="tree.html">🌳&nbsp;树</a></li>\n            <li data-id="graph"><a class="toc-link" href="graph.html">🕸️&nbsp;图</a></li>\n          </ul>\n        </aside>\n      ';
  }

  async function loadSidebar(){
    const root = document.getElementById(SIDEBAR_ROOT_ID);
    if(!root) return;
    try{
      const html = await tryFetchSidebar();
      root.innerHTML = html;
    }catch(err){
      console.error('加载侧栏失败，使用降级侧栏', err);
      root.innerHTML = fallbackSidebarHTML();
    }

    const path = location.pathname.split('/').pop() || '';
    const id = getIdForPath(path);
    if(id){
      const li = root.querySelector(`li[data-id="${id}"]`);
      li && li.classList.add('active');
    }
    // 绑定侧栏链接的平滑跳转
    bindSidebarLinks(root);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 初始隐藏（enablePageTransitions 会添加隐藏类）
    enablePageTransitions();

    // 并行等待侧栏加载和 mermaid 渲染，全部准备好后再淡入页面
    const mermaidReady = revealMermaidWhenReady(1400);
    const sidebarReady = loadSidebar();

    // 整体超时，避免长时间白屏
    const overallTimeout = new Promise(resolve => setTimeout(resolve, 1600));

    Promise.race([Promise.allSettled([mermaidReady, sidebarReady]), overallTimeout]).then(() => {
      // 所有准备就绪或超时，移除隐藏类淡入显示页面
      requestAnimationFrame(() => { document.body.classList.remove('transition-hidden'); });
    });
  });

  //登出按钮点击事件（模拟登出，避免405）
  function initLogoutModal() {
    const signoutBtn = document.getElementById('signout');
    const logoutModal = document.getElementById('logout-modal');
    const confirmBtn = document.getElementById('confirm-logout');
    const cancelBtn = document.getElementById('cancel-logout');

    // 点击登出按钮 → 显示弹窗
    signoutBtn?.addEventListener('click', () => {
      logoutModal.style.display = 'flex';
    });

    // 点击返回 → 关闭弹窗
    cancelBtn?.addEventListener('click', () => {
      logoutModal.style.display = 'none';
    });

    // 点击确认 → 延迟跳转（保留原有1.5秒），并清理本地 token
    confirmBtn?.addEventListener('click', () => {
      logoutModal.style.display = 'none'; // 先关闭弹窗
      // 清理 token，本地登出
      try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
      setTimeout(() => {
        window.location.href = '/'; // 根路径映射到 Login.html
      }, 1500);
    });

    // 可选：点击遮罩层关闭弹窗
    logoutModal?.addEventListener('click', (e) => {
      if (e.target === logoutModal) {
        logoutModal.style.display = 'none';
      }
    });
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', () => {
    enablePageTransitions();
    const mermaidReady = revealMermaidWhenReady(1400);
    const sidebarReady = loadSidebar();
    const overallTimeout = new Promise(resolve => setTimeout(resolve, 1600));

    // 初始化登出弹窗
    initLogoutModal();

    Promise.race([Promise.allSettled([mermaidReady, sidebarReady]), overallTimeout]).then(() => {
      requestAnimationFrame(() => { document.body.classList.remove('transition-hidden'); });
    });
  });

})();