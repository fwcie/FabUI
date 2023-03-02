import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('fab-dialog')
export class FabDialog extends LitElement {
  @property({ type: Boolean })
  visible = false;

  @property({ type: Boolean })
  movable = false;

  @property({ type: Boolean })
  reducible = false;

  @property({ type: Boolean })
  expandable = false;

  @property({ type: Boolean })
  closable = true;

  @property({ type: String })
  colorPrimary = '#3e3e3e';

  @property({ type: Boolean })
  fullscreen = false;
  
  @property({ type: Boolean })
  resizable = false;

  private _disX = 0;
  private _disY = 0;
  
  
  public $el: HTMLDivElement = document.createElement('div');
  public isFullScreen = false;
  public reduced = false;
  public name = 'fab-dialog';
  public selector = {
    el: `${this.name}`,
    header: `${this.name}-header`,
    title: `${this.name}-title`,
    icons: `${this.name}-icons`,
    reduce: `reduce`,
    expand: `expand`,
    close: `close`,
    body: `${this.name}-body`,
    footer: `${this.name}-footer`,
    dragging: `is-dragging`
  };

  render() {
    return html`
      <div tabindex="0" class="${this.selector.el}${this.visible ? ' show' : ''}${this.movable ? ' draggable' : ''}${this.resizable ? ' resizable' : ''}">
        <div class="${this.selector.header}">
          <slot name="title">
            <h3 class="${this.selector.title}">Default Heading</h3>
          </slot>
          <slot name="icons">
            <div class="${this.selector.icons}">
              ${this.reducible ? html`<button class="${this.selector.reduce}"></button>` : ''} ${this.expandable ? html`<button class="${this.selector.expand}"></button>` : ''}
              ${this.closable ? html`<button @click=${this.destroy} class="${this.selector.close}"></button>` : ''}
            </div>
          </slot>
        </div>
        <div class="${this.selector.body}">
          <slot name="body">
            <div>Default Body</div>
          </slot>
        </div>
        <div class="${this.selector.footer}">
          <slot name="footer">
            <div>Default Footer</div>
          </slot>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    this.$el = this.renderRoot.querySelector(`.${this.selector.el}`) as HTMLDivElement;
    this._initHandler();
  }

  private _dispatchFabModalEvent(eventName: string): void {
    this.dispatchEvent(new CustomEvent(`fabmodal:${eventName}`));
  }

  toggleRecude() {
    if (this.reduced) {
      this.$el.style.minHeight = '';
      this.$el.classList.remove('reduced');
      this._dispatchFabModalEvent('restored');
      this.reduced = false;
    } else {
      this.$el.style.minHeight = '0px';
      this.$el.classList.add('reduced');
      this._dispatchFabModalEvent('reduced');
      this.reduced = true;
    }
  }

  setFocused() {
    const dialogs = document.querySelectorAll('fab-dialog');

    dialogs.forEach((dialog) => {
      if (dialog !== this) {
        dialog.$el.classList.remove('focused');
        dialog.$el.tabIndex = 0;
      } else {
        dialog.$el.classList.add('focused');
        dialog.$el.tabIndex = 1;
      }
    })

    this.$el.classList.add('focused');
  }

  blink() {
    this.$el.classList.add('blink');

    window.setTimeout(() => {
      this.$el.classList.remove('blink');
    }, 1000);
  }

  private _initDrag() {
    this.$el.addEventListener('mousedown', this._fnDown.bind(this));
  }

  private _initHandler() {
    this.$el.addEventListener('focus', this.setFocused.bind(this));

    if (this.movable) {
      this._initDrag();
    }

    if (this.expandable) {
      this.$el.querySelector(`.${this.selector.expand}`)?.addEventListener('pointerdown', this.toggleFullscreen.bind(this));
    }

    if (this.reducible) {
      this.$el.querySelector(`.${this.selector.reduce}`)?.addEventListener('pointerdown', this.toggleRecude.bind(this));
    }

    if (this.resizable) {
      const observer = new ResizeObserver((mutations) => {
        // const { right, top, bottom, left } = this.$el.getBoundingClientRect()
        // const [{ contentRect: { width, height } }] = mutations;
        // const limitTop = 0;
        // const limitBottom = window.innerHeight;
        // const limitLeft = 0;
        // const limitRight = window.innerWidth;

        // if (left > limitLeft && left < limitRight && right < limitRight && right > limitLeft) {
        //   // this.shadowRoot
        //   this.$el.style.width = `${width}px`;
        // } else {
        //   this.$el.style.width = this.$el.style.width;
        // }
    
        // if (top > limitTop && top < limitBottom) {
        //   this.$el.style.top = `${height}px`;
        // }
      });
      
      observer.observe(this.$el);
    }
  }

  /**
   * @ignore
   */
  private _fnDown(ev: MouseEvent) {
    const target = ev.target as HTMLElement

    if (!target?.classList.contains(this.selector.header) && !target?.classList.contains(this.selector.title) && (!target.slot || target.slot && target.slot !== 'title')) return

    this._disX = ev.clientX - this.$el.offsetLeft;
    this._disY = ev.clientY - this.$el.offsetTop;

    document.onmousemove = this._fnMove.bind(this);
    document.onmouseup = this._fnUp.bind(this);

    return false;
  }

  /**
   * @ignore
   */
  private _fnMove(ev: MouseEvent) {
    this.$el.classList.add(this.selector.dragging);
    const left = ev.clientX - this._disX;
    const top = ev.clientY - this._disY;
    const limitRight = window.innerWidth - this.$el.clientWidth / 2;
    const limitLeft = this.$el.clientWidth / 2;
    const limitTop = this.$el.clientHeight / 2;
    const limitBottom = window.innerHeight - this.$el.clientHeight / 2;

    if (left > limitLeft && left < limitRight) {
      this.$el.style.left = `${left}px`;
    } else if (left > limitLeft) {
      this.$el.style.left = `${limitRight}px`;
    } else if (left < limitRight) {
      this.$el.style.left = `${limitLeft}px`;
    } 

    if (top > limitTop && top < limitBottom) {
      this.$el.style.top = `${top}px`;
    } else if (top > limitBottom) {
      this.$el.style.top = `${limitBottom}px`;
    } else if (top < limitTop) {
      this.$el.style.top = `${limitTop}px`;
    } 
  }

  /**
   * @ignore
   */
  private _fnUp() {
    document.onmousemove = null;
    document.onmouseup = null;
    this.$el.classList.remove(this.selector.dragging);
  }

  toggleFullscreen(): boolean {
    if (this.$el) {
      if (this.isFullScreen) {
        if (this.movable) this._initDrag();
        this.isFullScreen = false;
        // this.$bodyElement.style.overflow = 'auto';
        this.$el.classList.remove('fullScreen');
        // if (this.$expand) this.$expand.title = 'Restore';

        this._dispatchFabModalEvent('fullscreenCancel');
      } else {
        this.$el.removeEventListener('mousedown', this._fnDown);
        this.isFullScreen = true;
        // this.$bodyElement.style.overflow = 'hidden';
        this.$el.classList.add('fullScreen');
        this._dispatchFabModalEvent('fullscreen');
      }
    }
    return this.isFullScreen;
  }

  show() {
    this._dispatchFabModalEvent('show');
    this.setAttribute('visible', '');
    this._dispatchFabModalEvent('hidden');
  }

  toggle() {
    this._dispatchFabModalEvent('toggle');
    this.toggleAttribute('visible');
    this._dispatchFabModalEvent('toggled');
  }

  hide() {
    this._dispatchFabModalEvent('hide');
    this.removeAttribute('visible');
    this._dispatchFabModalEvent('hidden');
  }

  destroy() {
    this._dispatchFabModalEvent('destroy');
    this.remove();
    this._dispatchFabModalEvent('destroyed');
  }

  static styles = css`
    :host {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      font-weight: 400;
      --fab-dialog-color: rgba(255, 255, 255, 0.87);
      --fab-dialog-background-color: #333333;
      --fab-dialog-shadow-color: rgba(255, 255, 255, 0.3);

      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-text-size-adjust: 100%;
    }
    * {
      box-sizing: border-box;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --fab-dialog-color: #213547;
        --fab-dialog-background-color: #ffffff;
        --fab-dialog-shadow-color: rgba(0, 0, 0, 0.3);
      }
    }

    .fab-dialog {
      outline: none;
      z-index: 998;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      box-shadow: 0 0 8px var(--fab-dialog-shadow-color);
      box-sizing: border-box;
      width: 500px;
      height: 400px;
      max-width: 100%;
      max-height: 100%;
      min-width: 30%;
      min-height: 40%;
      border-radius: 5px;
      display: none;
      overflow: hidden;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }

    .fab-dialog.resizable {
      resize: both;
    }

    .fab-dialog.focused {
      z-index: 999;
    }

    .fab-dialog.is-dragging {
      user-select: none;
    }

    .blink {
      animation: blinker .5s linear infinite;
    }
    
    @keyframes blinker {
      50% {
        box-shadow: var(--fab-dialog-shadow-color) 0px 4px 16px, var(--fab-dialog-shadow-color) 0px 8px 24px, var(--fab-dialog-shadow-color) 0px 16px 30px;
      }
    }

    .fab-dialog.show,
    .fab-overlay.show,
    .fab-dialog-tab.show {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
    }

    .fab-tab-close {
      border: 0;
      background-color: transparent;
      color: white;
      cursor: pointer;
    }

    .fab-dialog.draggable .fab-dialog-header {
      cursor: move;
    }

    .fab-dialog.fullScreen {
      top: 0!important;
      left: 0!important;
      right: 0!important;
      bottom: 0!important;
      width: 100%!important;
      height: 100%!important;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      transform: unset;
      resize: none;
    }

    .fab-dialog.fullScreen .fab-dialog-header {
      border-radius: 0;
      cursor: default;
    }

    .fab-dialog.fullScreen .fab-dialog-body {
      height: 100%;
      max-width: 100%;
    }

    .fab-dialog.active {
      z-index: 1000;
    }

    .fab-dialog .fab-dialog-body::-webkit-scrollbar {
      width: 5px;
    }

    .fab-dialog .fab-dialog-body::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .fab-dialog .fab-dialog-body::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    .fab-dialog .fab-dialog-body::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .fab-dialog.iframe {
      border-bottom: none;
      background-color: #000;
    }

    .fab-dialog.iframe .fab-dialog-header {
      background-color: #000;
    }

    .fab-dialog.iframe .fab-dialog-body {
      padding: 0;
      color: rgba(0, 0, 0, 0.8);
    }

    .fab-dialog .fab-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      cursor: default;
      border-bottom: 1px solid #d8d8d8;
      background-color: #d8d8d8;
      color: #000;
      width: 100%;
    }

    .fab-dialog .fab-dialog-header.draggable {
      cursor: move;
    }

    .fab-dialog .fab-dialog-header .fab-dialog-title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding: 1rem;
      margin: 0;
      font-size: 1.3rem;
      color: rgba(0, 0, 0, 0.8);
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons {
      display: flex;
      margin-right: 0.5rem;
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons button {
      outline: none;
      background: transparent;
      border: transparent;
      width: 25px;
      height: 25px;
      cursor: pointer;
      padding: 0;
      opacity: 0.3;
      transition: opacity 0.2s ease-in;
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons button:before {
      color: rgba(0, 0, 0, 0.8);
      font-weight: 300;
      font-size: 1.2rem;
      font-family: Arial, sans-serif;
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons button:hover {
      opacity: 1;
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons .reduce:before {
      content: '\\2012';
    }

    .fab-dialog .fab-dialog-header .fab-dialog-icons .expand:before {
      content: '\\26F6';
    }
    .fab-dialog .fab-dialog-header .fab-dialog-icons .close:before {
      content: '\\2715';
    }

    .fab-dialog .fab-dialog-body {
      scroll-behavior: smooth;
      position: relative;
      padding: 1rem;
      flex: 1;
      line-height: 1.8;
      color: #0a0a0a;
      overflow: auto;
      color: var(--fab-dialog-color);
      background-color: var(--fab-dialog-background-color);
      width: 100%;
    }

    .fab-dialog.reduced {
      bottom: 0!important;
      left: 0!important;
      top: inherit!important;
    }

    .fab-dialog.reduced .fab-dialog-body,
    .fab-dialog.reduced .fab-dialog-footer {
      display: none;
    }

    .fab-dialog .fab-dialog-footer {
      position: relative;
      padding: 1rem;
      max-width: 100%;
      height: auto;
      line-height: 1.8;
      color: var(--fab-dialog-color);
      background-color: var(--fab-dialog-background-color);
      border-top: 1px solid var(--fab-dialog-color);
      display: flex;
      justify-content: end;
      align-items: center;
      width: 100%;
      bottom: 0;
      min-height: 60px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'fab-dialog': FabDialog;
  }
}
