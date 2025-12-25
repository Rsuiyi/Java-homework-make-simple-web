// Sidebar loader (TypeScript)
// This script attempts to fetch the sidebar partial from multiple paths and
// falls back to a minimal inline sidebar when fetch fails.

const SIDEBAR_ROOT_ID = 'sidebar-root';

const POSSIBLE_PATHS = [
  './partials/sidebar.html',
  'partials/sidebar.html',
  '/partials/sidebar.html',
  'src/partials/sidebar.html'
];

function getIdForPath(pathname: string): string | null {
  const map: Record<string, string | null> = {
    'kmp.html': 'kmp',
    'tree.html': 'tree',
    'graph.html': 'graph',
    'index.html': 'index',
    '': null
  };
  return map[pathname] ?? null;
}

async function tryFetchSidebar(): Promise<string> {
  let lastError: Error | null = null;
  for (const p of POSSIBLE_PATHS) {
    try {
      const resp = await fetch(p);
      if (!resp.ok) throw new Error(`fetch ${p} failed: ${resp.status} ${resp.statusText}`);
      const text = await resp.text();
      // Basic sanity check
      if (text && text.includes('class="sidebar"')) return text;
    } catch (err) {
      lastError = err as Error;
      // continue to next path
    }
  }
  throw lastError ?? new Error('无法加载侧栏');
}

function fallbackSidebarHTML() {
  return `
    <aside class="sidebar">
      <div class="logo"><div class="icon">序</div><div class="title">Hello 算法</div></div>
      <ul class="toc">
        <li data-id="index"><a class="toc-link" href="index.html">🏠&nbsp;目录</a></li>
        <li data-id="kmp"><a class="toc-link" href="kmp.html">🔡&nbsp;KMP（模式匹配）</a></li>
        <li data-id="tree"><a class="toc-link" href="tree.html">🌳&nbsp;树</a></li>
        <li data-id="graph"><a class="toc-link" href="graph.html">🕸️&nbsp;图</a></li>
      </ul>
    </aside>
  `;
}

async function loadSidebar() {
  const root = document.getElementById(SIDEBAR_ROOT_ID);
  if (!root) return;

  try {
    const html = await tryFetchSidebar();
    root.innerHTML = html;
  } catch (err) {
    console.error('加载侧栏失败，使用降级侧栏', err);
    root.innerHTML = fallbackSidebarHTML();
  }

  // highlight
  const path = location.pathname.split('/').pop() || '';
  const id = getIdForPath(path);
  if (id) {
    const li = root.querySelector(`li[data-id="${id}"]`);
    li && li.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
});
