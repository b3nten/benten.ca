import { css, html, unsafeCSS } from "lit";
import { WebComponent } from "./component";
import { property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

const HANDLE_SIZE = 14;

const ResizeHandles = {
  TopLeft: "rh-top-left",
  TopRight: "rh-top-right",
  BottomLeft: "rh-bottom-left",
  BottomRight: "rh-bottom-right",
  Top: "rh-top",
  Bottom: "rh-bottom",
  Left: "rh-left",
  Right: "rh-right",
} as const;

type ResizeHandle = (typeof ResizeHandles)[keyof typeof ResizeHandles];

export class Window extends WebComponent("ui-window") {
  static styles = css`
    :host {
      box-sizing: border-box;
      margin: 0;
      display: block;
      position: fixed;
      top: 0px;
      left: 0px;
    }

    #title-bar {
      cursor: default;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden;
    }

    #content-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #${unsafeCSS(ResizeHandles.BottomLeft)} {
      position: absolute;
      bottom: -${HANDLE_SIZE / 2}px;
      left: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: nesw-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.BottomRight)} {
      position: absolute;
      bottom: -${HANDLE_SIZE / 2}px;
      right: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: nwse-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.TopLeft)} {
      position: absolute;
      top: -${HANDLE_SIZE / 2}px;
      left: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: nwse-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.TopRight)} {
      position: absolute;
      top: -${HANDLE_SIZE / 2}px;
      right: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: nesw-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.Left)} {
      position: absolute;
      top: ${HANDLE_SIZE / 2}px;
      left: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: calc(100% - ${HANDLE_SIZE}px);

      &:hover {
        cursor: ew-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.Right)} {
      position: absolute;
      top: ${HANDLE_SIZE / 2}px;
      right: -${HANDLE_SIZE / 2}px;
      width: ${HANDLE_SIZE}px;
      height: calc(100% - ${HANDLE_SIZE}px);

      &:hover {
        cursor: ew-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.Top)} {
      position: absolute;
      top: -${HANDLE_SIZE / 2}px;
      left: ${HANDLE_SIZE / 2}px;
      width: calc(100% - ${HANDLE_SIZE}px);
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: ns-resize;
      }
    }

    #${unsafeCSS(ResizeHandles.Bottom)} {
      position: absolute;
      bottom: -${HANDLE_SIZE / 2}px;
      left: ${HANDLE_SIZE / 2}px;
      width: calc(100% - ${HANDLE_SIZE}px);
      height: ${HANDLE_SIZE}px;

      &:hover {
        cursor: ns-resize;
      }
    }
  `;

  @property({ attribute: "window-width", type: Number })
  accessor window_width = 500;

  @property({ attribute: "window-height", type: Number })
  accessor window_height = 500;

  @property({ attribute: "window-x", type: Number })
  accessor window_x = 0;

  @property({ attribute: "window-y", type: Number })
  accessor window_y = 0;

  @property({ attribute: "min-width", type: Number })
  accessor min_width = 200;

  @property({ attribute: "min-width", type: Number })
  accessor min_height = 200;

  @state() accessor contentRef = createRef<HTMLElement>();

  @state() accessor titleBarRef = createRef<HTMLElement>();

  @state() accessor titleBarHeight = 0;

  @state() accessor focused = true;

  override onMount() {
    const children = Array.from(this.parentElement!.childNodes).filter(
      (x) => x instanceof Window,
    );
    let highest = -1;
    for (const c of children) {
      const z = parseInt(window.getComputedStyle(c).zIndex);
      if (z > highest) {
        highest = z;
      }
      c.focused = false;
    }
    this.focused = true;
    this.style.zIndex = `${highest + 1}`;
    this.addEventListener("mousedown", this.on_mouse_down.bind(this));
  }

  override onMounted() {
    let existingWindows = Array.from(this.parentElement!.childNodes).filter(
      (x) => x instanceof Window,
    );

    const WINDOW_OFFSET = 20;

    if (existingWindows.length > 0) {
      this.window_x =
        window.innerWidth / 2 -
        this.window_width / 2 +
        WINDOW_OFFSET * existingWindows.length;
      this.window_y =
        window.innerHeight / 2 -
        this.window_height / 2 +
        WINDOW_OFFSET * existingWindows.length;
    } else {
      // center
      this.window_x = window.innerWidth / 2 - this.window_width / 2;
      this.window_y = window.innerHeight / 2 - this.window_height / 2;
    }

    // observe title bar size
    this.titleBarHeight = this.titleBarRef.value!.clientHeight;
    this.title_bar_resizer = new ResizeObserver(() => {
      this.titleBarHeight = this.titleBarRef.value!.clientHeight;
    });
    this.title_bar_resizer.observe(this.titleBarRef.value!);
  }

  override onUpdate() {
    this.style.transform = `translate(${this.window_x}px, ${this.window_y}px)`;
    this.style.width = `${this.window_width}px`;
    this.style.height = `${this.window_height}px`;
  }

  override onUnmount() {
    this.title_bar_resizer?.disconnect();
  }

  close() {
    this.remove();
  }

  override render = () => {
    const focus_style = `--focused: ${this.focused ? "initial" : " "}; --unfocused: ${!this.focused ? "initial" : " "};`;
    return html`
      <div
        id="title-bar"
        ${ref(this.titleBarRef)}
        onmousedown=${this.on_drag_start}
      >
        <slot name="title-bar" style=${focus_style} />
      </div>
      <div
        id="content-wrapper"
        ref="{this.content_ref}"
        style=${`height: calc(100% - ${this.titleBarHeight}px);`}
      >
        <slot name="content" style=${focus_style} />
      </div>
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.Bottom} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.Top} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.Left} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.Right} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.BottomLeft} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.BottomRight} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.TopLeft} />
      <div onmousedown=${this.on_resize_down} id=${ResizeHandles.TopRight} />
    `;
  };

  protected title_bar_resizer: ResizeObserver | null = null;
  protected active_resize_handle: ResizeHandle | null = null;

  protected resize_vars = {
    prev_position: { x: 0, y: 0 },
  };

  protected drag_vars = {
    prev_position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  };

  protected getTransform() {
    const style = window.getComputedStyle(this);
    const matrix = style.transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
      const coords = matrix[1].split(", ");
      return {
        x: parseInt(coords[4]),
        y: parseInt(coords[5]),
      };
    }
    return { x: 0, y: 0 };
  }

  protected on_resize_down(e: MouseEvent) {
    this.active_resize_handle = (e.target as HTMLElement).id as ResizeHandle;

    this.style.userSelect = "none";

    window.addEventListener("mousemove", this.on_resize_move);
    window.addEventListener("mouseup", this.on_resize_up);

    this.resize_vars.prev_position = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  protected on_resize_move(e: MouseEvent) {
    let resize_x = (e: MouseEvent, dir: number) => {
      let x = (e.clientX - this.resize_vars.prev_position.x) * dir;
      let newPos = this.window_width + x;
      if (
        newPos < this.min_width ||
        e.clientX > window.innerWidth ||
        e.clientX < 0
      ) {
        return;
      }
      this.window_width = this.window_width + x;
      this.resize_vars.prev_position.x = e.clientX;
      if (dir < 0) {
        let transform = this.getTransform();
        // this.style.transform = `translate(${transform.x - x}px, ${transform.y}px)`;
        this.window_x = transform.x - x;
        this.window_y = transform.y;
      }
    };

    let resize_y = (e: MouseEvent, dir: number) => {
      let y = (e.clientY - this.resize_vars.prev_position.y) * dir;
      let newPos = this.window_height + y;
      if (
        newPos < this.min_height ||
        e.clientY > window.innerHeight ||
        e.clientY < 0
      ) {
        return;
      }
      this.window_height = this.window_height + y;
      this.resize_vars.prev_position.y = e.clientY;
      if (dir < 0) {
        let transform = this.getTransform();
        // this.style.transform = `translate(${transform.x}px, ${transform.y - y}px)`;
        this.window_x = transform.x;
        this.window_y = transform.y - y;
      }
    };

    switch (this.active_resize_handle) {
      case ResizeHandles.Top: {
        resize_y(e, -1);
        break;
      }
      case ResizeHandles.TopLeft: {
        resize_x(e, -1);
        resize_y(e, -1);
        break;
      }
      case ResizeHandles.TopRight: {
        resize_x(e, 1);
        resize_y(e, -1);
        break;
      }
      case ResizeHandles.Bottom: {
        resize_y(e, 1);
        break;
      }
      case ResizeHandles.BottomLeft: {
        resize_x(e, -1);
        resize_y(e, 1);
        break;
      }
      case ResizeHandles.BottomRight: {
        resize_x(e, 1);
        resize_y(e, 1);
        break;
      }
      case ResizeHandles.Left: {
        resize_x(e, -1);
        break;
      }
      case ResizeHandles.Right: {
        resize_x(e, 1);
        break;
      }
    }
  }

  protected on_resize_up() {
    this.active_resize_handle = null;
    this.style.userSelect = "auto";
    window.removeEventListener("mousemove", this.on_resize_move);
    window.removeEventListener("mouseup", this.on_resize_up);
  }

  protected on_drag_start(e: MouseEvent) {
    let x = this.getTransform().x;
    let y = this.getTransform().y;

    this.drag_vars.offset = {
      x: e.clientX - x,
      y: e.clientY - y,
    };

    window.addEventListener("mousemove", this.on_drag_move);
    window.addEventListener("mouseup", this.on_drag_end);
    this.titleBarRef.value!.style.cursor = "move";
  }

  protected on_drag_move(e: MouseEvent) {
    let bounds = this.getBoundingClientRect();

    let x = Math.max(
      -bounds.width + 100,
      Math.min(e.clientX - this.drag_vars.offset.x, window.innerWidth - 100),
    );
    let y = Math.max(
      0,
      Math.min(e.clientY - this.drag_vars.offset.y, window.innerHeight - 100),
    );

    this.drag_vars.prev_position = { x, y };

    this.window_x = x;
    this.window_y = y;
  }

  protected on_drag_end() {
    this.titleBarRef.value!.style.cursor = "default";
    window.removeEventListener("mousemove", this.on_drag_move);
    window.removeEventListener("mouseup", this.on_drag_end);
  }

  protected on_window_resize() {
    let bounds = this.getBoundingClientRect();

    this.window_x = Math.max(
      0,
      Math.min(
        this.drag_vars.prev_position.x,
        window.innerWidth - bounds.width,
      ),
    );
    this.window_y = Math.max(
      0,
      Math.min(
        this.drag_vars.prev_position.y,
        window.innerHeight - bounds.height,
      ),
    );
  }

  protected on_mouse_down() {
    let children = Array.from(this.parentElement!.childNodes).filter(
      (x) => x instanceof Window,
    );

    this.focused = true;
    if (children.length <= 1) return;

    let highest = 0;
    let highest_el: Window | null = null;
    children.sort((a, b) => {
      let a_z = parseInt(window.getComputedStyle(a).zIndex);
      let b_z = parseInt(window.getComputedStyle(b).zIndex);
      if (a_z > highest) {
        highest = a_z;
        highest_el = a;
      } else if (b_z > highest) {
        highest = b_z;
        highest_el = b;
      }
      return a_z - b_z;
    });

    this.focused = true;

    if (highest_el === this) return;

    let this_z = parseInt(window.getComputedStyle(this).zIndex);
    this.style.zIndex = `${highest}`;
    children.push(this);

    for (let i = this_z + 1; i < children.length - 1; i++) {
      children[i].focused = false;
      children[i].style.zIndex = `${i - 1}`;
    }
  }
}

Window.define();
