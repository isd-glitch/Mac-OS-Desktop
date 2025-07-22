class SafariBrowser {
  constructor() {
    this.window = document.getElementById('safari');
    this.tabsContainer = this.window.querySelector('.tabs');
    this.tabsContent = this.window.querySelector('.tabs-content');
    this.newTabButton = this.window.querySelector('.new-tab-button');
    this.urlInput = this.window.querySelector('.url-input');
    
    this.tabs = [];
    this.activeTabIndex = -1;

    this.initializeEventListeners();
    this.createNewTab();
  }

  initializeEventListeners() {
    this.newTabButton.addEventListener('click', () => this.createNewTab());
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.navigateToUrl();
      }
    });

    // ウィンドウコントロール
    this.window.querySelector('.close-safari').addEventListener('click', () => {
      this.window.style.display = 'none';
    });

    this.window.querySelector('.minimize-safari').addEventListener('click', () => {
      // ウィンドウの最小化処理
      this.window.style.transform = 'scale(0.8)';
      this.window.style.opacity = '0';
      setTimeout(() => {
        this.window.style.display = 'none';
        this.window.style.transform = 'scale(1)';
      }, 300);
    });

    this.window.querySelector('.maximize-safari').addEventListener('click', () => {
      this.window.classList.toggle('maximized');
    });
  }

  createNewTab() {
    const tabIndex = this.tabs.length;
    
    // タブ要素の作成
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerHTML = `
      <div class="tab-title">New Tab</div>
      <button class="close-tab">
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    `;

    // タブコンテンツの作成
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.innerHTML = `
      <iframe src="about:blank" frameborder="0"></iframe>
    `;

    // イベントリスナーの追加
    tab.addEventListener('click', () => this.activateTab(tabIndex));
    tab.querySelector('.close-tab').addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeTab(tabIndex);
    });

    // タブとコンテンツの追加
    this.tabsContainer.appendChild(tab);
    this.tabsContent.appendChild(tabContent);
    
    // タブ情報の保存
    this.tabs.push({
      tab,
      content: tabContent,
      url: 'about:blank',
      title: 'New Tab'
    });

    this.activateTab(tabIndex);
  }

  activateTab(index) {
    if (this.activeTabIndex >= 0) {
      this.tabs[this.activeTabIndex].tab.classList.remove('active');
      this.tabs[this.activeTabIndex].content.classList.remove('active');
    }

    this.activeTabIndex = index;
    this.tabs[index].tab.classList.add('active');
    this.tabs[index].content.classList.add('active');
    this.urlInput.value = this.tabs[index].url !== 'about:blank' ? this.tabs[index].url : '';
  }

  closeTab(index) {
    if (this.tabs.length === 1) {
      this.createNewTab();
    }

    this.tabs[index].tab.remove();
    this.tabs[index].content.remove();
    this.tabs.splice(index, 1);

    // タブインデックスの更新
    if (index === this.activeTabIndex) {
      this.activateTab(Math.max(0, index - 1));
    } else if (index < this.activeTabIndex) {
      this.activeTabIndex--;
    }
  }

  navigateToUrl() {
    let url = this.urlInput.value.trim();
    
    // 検索クエリの場合はGoogle検索URLに変換
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
      url = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const activeTab = this.tabs[this.activeTabIndex];
    const iframe = activeTab.content.querySelector('iframe');
    iframe.src = url;
    activeTab.url = url;

    // タイトルの更新
    iframe.onload = () => {
      try {
        const title = iframe.contentDocument.title;
        activeTab.title = title;
        activeTab.tab.querySelector('.tab-title').textContent = title;
      } catch (e) {
        // クロスオリジンエラーの場合はURLのホスト名を表示
        const hostname = new URL(url).hostname;
        activeTab.tab.querySelector('.tab-title').textContent = hostname;
      }
    };
  }
}

// Safariブラウザのインスタンス化
const safari = new SafariBrowser();