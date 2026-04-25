export type PaletteEvent = CustomEvent<{ prefill?: string }>;

declare global {
  interface WindowEventMap {
    'palette:toggle': PaletteEvent;
    'palette:open': PaletteEvent;
    'help:toggle': Event;
    'overlay:close': Event;
  }
}

export {};
