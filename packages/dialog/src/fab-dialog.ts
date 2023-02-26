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

  render() {
    return html`
      <div class="fab-dialog${this.visible ? ' show' : ''}${this.movable ? ' draggable' : ''}">
        <div class="fab-dialog-header">
          <slot name="header">
            <h3 class="fab-dialog-title">Default Heading</h3>
          </slot>
          <slot name="icons">
            <div class="fab-dialog-icons">
              ${this.reducible ? html`<button class="reduce"></button>` : ''}
              ${this.expandable ? html`<button class="expand"></button>` : ''}
              ${this.closable ? html`<button @click=${this.hide} class="close"></button>` : ''}
            </div>
          </slot>
        </div>
        <div class="fab-dialog-body">
          <slot name="body">
            <div>Default Body</div>
          </slot>
        </div>
      </div>
    `;
  }

  private _dispatchFabModalEvent(eventName: string): void {
    this.dispatchEvent(new CustomEvent(`fabmodal:${eventName}`));
  }

  reduce() {}

  toggleExpand() {}

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
      opacity: 0;
      z-index: 998;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      box-shadow: 0 0 8px var(--fab-dialog-shadow-color);
      box-sizing: border-box;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border-radius: 5px;
      display: none;
      overflow: hidden;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }

    .fab-dialog.resizable {
      resize: both;
    }

    .fab-dialog.show,
    .fab-overlay.show,
    .fab-dialog-tab.show {
      opacity: 1;
      display: block;
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      transform: unset;
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

    .fab-dialog::-webkit-scrollbar {
      width: 5px;
    }

    .fab-dialog::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .fab-dialog::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    .fab-dialog::-webkit-scrollbar-thumb:hover {
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
      min-width: 200px;
      min-height: 181px;
      max-width: 100%;
      height: auto;
      line-height: 1.8;
      color: #0a0a0a;
      overflow: auto;
      color: var(--fab-dialog-color);
      background-color: var(--fab-dialog-background-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'fab-dialog': FabDialog;
  }
}
