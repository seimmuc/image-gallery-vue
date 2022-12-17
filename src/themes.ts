export type ThemeMode = 'default' | 'light' | 'dark';
export class Theme {
  name: string;
  displayName: string;
  mode: ThemeMode;
  constructor(name: string, displayName: string, mode: ThemeMode = 'default') {
    this.name = name;
    this.displayName = displayName;
    this.mode = mode;
  }
}
