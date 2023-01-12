declare namespace TSControls {
  abstract class Control<TValue> {
    displayMode: "inline" | "block";
    node: Node;

    notifyChange(): void;

    abstract getElement(): HTMLElement;
    abstract getValue(): TValue;
    abstract setValue(value: any): void;
    abstract exportsValue(): boolean;
    abstract isEnabled(): boolean;
    abstract disable(): void;
    abstract enable(): void;
  }
  
  export class Node {
    parent: Node | null;
    control: Control<any>;
    children: Node[];
    labels: string[];
    constructor(control: Control<any>, children?: Node | Node[] | [string, Node][]);
    notifyChange(): void;
  }
  
  export class TextBox extends Control<string> {
    getElement(): HTMLElement;
    getValue(): string;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class NumberBox extends Control<number> {
    getElement(): HTMLElement;
    getValue(): number;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class CheckBox extends Control<boolean> {
    getElement(): HTMLElement;
    getValue(): boolean;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class TextArea extends Control<string> {
    getElement(): HTMLElement;
    getValue(): string;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class SelectBox extends Control<string> {
    constructor(options: string[]);
    getElement(): HTMLElement;
    getValue(): string;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class TextOutput extends Control<never> {
    getElement(): HTMLElement;
    getValue(): never;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
    setText(text: string): void;
  }
  
  export class Button extends Control<never> {
    constructor(text?: string, callback?: () => void);
    getElement(): HTMLElement;
    getValue(): never;
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class Table extends Control<{}> {
    getElement(): HTMLElement;
    getValue(): {};
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
  
  export class List<TValue> extends Control<TValue[]> {
    constructor(nameItem?: (item: TValue, index: number) => string);
    getElement(): HTMLElement;
    getValue(): TValue[];
    setValue(value: any): void;
    exportsValue(): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
  }
}