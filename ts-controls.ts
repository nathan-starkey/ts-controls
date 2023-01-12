namespace TSControls {
  abstract class Control<TValue> {
    displayMode: "inline" | "block" = "inline";
    node: Node;

    notifyChange() {
      this.node.notifyChange();
    }

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

    constructor(control: Control<any>, children?: Node | Node[] | [string, Node][]) {
      this.control = control;
      this.control.node = this;

      children ||= [];

      if (!Array.isArray(children)) {
        children = [children];
      }

      if (Array.isArray(children[0])) {
        this.labels = children.map(arr => arr[0]);
        this.children = children.map(arr => arr[1]);
      } else {
        this.children = <Node[]> children;
        this.labels = new Array(this.children.length).fill("");
      }

      for (let child of this.children) {
        child.parent = this;
      }
    }

    notifyChange() {
      this.parent?.control.notifyChange();
    }
  }

  export class TextBox extends Control<string> {
    element = document.createElement("input");

    constructor() {
      super();

      this.element.addEventListener("change", () => this.notifyChange());
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): string {
      return this.element.value;
    }

    setValue(value: any): void {
      this.element.value = value || "";
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
      this.element.value = "";
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class NumberBox extends Control<number> {
    element = document.createElement("input");

    constructor() {
      super();

      this.element.type = "number";
      this.element.valueAsNumber = 0;
      this.element.addEventListener("change", () => this.notifyChange());
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): number {
      return this.element.valueAsNumber;
    }

    setValue(value: any): void {
      this.element.valueAsNumber = Number(value) || 0;
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
      this.element.valueAsNumber = 0;
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class CheckBox extends Control<boolean> {
    element = document.createElement("input");

    constructor() {
      super();

      this.element.type = "checkbox";
      this.element.addEventListener("change", () => this.notifyChange());
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): boolean {
      return this.element.checked;
    }
    
    setValue(value: any): void {
      this.element.checked = Boolean(value);
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
      this.element.checked = false;
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class TextArea extends Control<string> {
    element = document.createElement("textarea");

    constructor() {
      super();

      this.element.addEventListener("change", () => this.notifyChange());
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): string {
      return this.element.value;
    }

    setValue(value: any): void {
      this.element.value = value || "";
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
      this.element.value = "";
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class SelectBox extends Control<string> {
    element = document.createElement("select");
    options: string[];

    constructor(options: string[]) {
      super();

      this.options = options;

      for (let option of options) {
        this.element.options.add(new Option(option));
      }

      this.element.addEventListener("change", () => this.notifyChange());
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): string {
      return this.element.value;
    }

    setValue(value: any): void {
      this.element.selectedIndex = Math.max(0, this.options.indexOf(value));
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
      this.element.selectedIndex = 0;
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class TextOutput extends Control<never> {
    element = document.createElement("span");

    constructor(text?: string) {
      super();

      if (text) {
        this.setText(text);
      }
    }

    setText(text: string) {
      this.element.innerText = text;
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): never {
      throw new Error("control has no value");
    }

    setValue(value: any): void {
      throw new Error("control has no value");
    }

    exportsValue(): boolean {
      return false;
    }

    isEnabled(): boolean {
      return !this.element.classList.contains("disabled");
    }

    disable(): void {
      this.setText("");
      this.element.classList.add("disabled");
    }

    enable(): void {
      this.element.classList.remove("disabled");
    }
  }

  export class Button extends Control<never> {
    element = document.createElement("button");

    constructor(text?: string, callback?: () => void) {
      super();

      if (text) {
        this.element.innerText = text;
      }

      if (callback) {
        this.element.addEventListener("click", () => callback());
      }
    }

    getElement(): HTMLElement {
      return this.element;
    }

    getValue(): never {
      throw new Error("control has no value");
    }

    setValue(value: any): void {
      throw new Error("control has no value");
    }

    exportsValue(): boolean {
      return false;
    }

    isEnabled(): boolean {
      return !this.element.disabled;
    }

    disable(): void {
      this.element.disabled = true;
    }

    enable(): void {
      this.element.disabled = false;
    }
  }

  export class Table extends Control<{}> {
    displayMode: "inline" | "block" = "block";
    element = document.createElement("table");

    constructor() {
      super();
      
      this.element.classList.add("table-control");
    }

    getElement(): HTMLElement {
      this.init();

      return this.element;
    }

    getValue(): {} {
      let value = {};
      let index = 0;

      for (let {control} of this.node.children) {
        let label = this.node.labels[index];

        if (control.exportsValue()) {
          value[label] = control.getValue();
        }
        
        ++index;
      }

      return value;
    }

    setValue(value: any): void {
      if (typeof value != "object" || value == null) {
        value = {};
      }

      let index = 0;

      for (let {control} of this.node.children) {
        let label = this.node.labels[index];

        if (control.exportsValue()) {
          control.setValue(value[label]);
        }

        ++index;
      }
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.classList.contains("disabled");
    }

    disable(): void {
      this.element.classList.add("disabled");

      for (let {control} of this.node.children) {
        control.disable();
      }
    }

    enable(): void {
      this.element.classList.remove("disabled");

      for (let {control} of this.node.children) {
        control.enable();
      }
    }
    
    init() {
      let index = 0;

      for (let {control} of this.node.children) {
        let tr = document.createElement("tr");
        let td0 = document.createElement("td");
        let td1 = document.createElement("td");
        
        tr.classList.add("table-control-row");
        td0.classList.add("table-control-label");
        td1.classList.add("table-control-child");

        if (control.displayMode == "block") {
          td1.colSpan = 2;
          td1.append(control.getElement());
          tr.append(td1);
        } else {
          td0.innerText = this.node.labels[index];
          td1.append(control.getElement());
          tr.append(td0, td1);
        }
        
        this.element.append(tr);
        ++index;
      }

      this.init = () => {};
    }
  }

  export class List<TValue> extends Control<TValue[]> {
    displayMode: "inline" | "block" = "block";
    stack: InstanceEditor<TValue>;
    child: Control<TValue>;
    element = document.createElement("div");
    header = document.createElement("div");
    body = document.createElement("div");
    label = document.createElement("label");
    combo = document.createElement("select");
    btnAdd = document.createElement("button");
    btnRem = document.createElement("button");
    btnMUp = document.createElement("button");
    btnMDo = document.createElement("button");
    nameItem: (item: TValue, index: number) => string = (item, index) => String(index);

    constructor(nameItem?: (item: TValue, index: number) => string) {
      super();

      this.nameItem ||= nameItem;
      this.stack = new InstanceEditor(() => this.child.getValue(), (value) => this.child.setValue(value), (clean) => (clean || this.notifyChange(), this.render()));

      this.label.innerText = "list";
      this.btnAdd.innerText = "Add";
      this.btnRem.innerText = "Remove";
      this.btnMUp.innerHTML = "&#9650;";
      this.btnMDo.innerHTML = "&#9660;";

      this.combo.disabled = true;
      this.btnRem.disabled = true;
      this.btnMUp.disabled = true;
      this.btnMDo.disabled = true;

      this.header.append(this.label, this.combo, this.btnAdd, this.btnRem, this.btnMUp, this.btnMDo);
      this.element.append(this.header, this.body);

      this.element.classList.add("list-control");
      this.header.classList.add("list-control-header");
      this.body.classList.add("list-control-body");

      this.combo.addEventListener("change", () => this.select(this.combo.selectedIndex));
      this.btnAdd.addEventListener("click", () => this.add());
      this.btnRem.addEventListener("click", () => this.remove());
      this.btnMUp.addEventListener("click", () => this.move(-1));
      this.btnMDo.addEventListener("click", () => this.move(1));
    }

    getElement(): HTMLElement {
      this.init();

      return this.element;
    }

    getValue(): TValue[] {
      return this.stack.export();
    }

    setValue(value: any): void {
      this.stack.import(value);
    }

    exportsValue(): boolean {
      return true;
    }

    isEnabled(): boolean {
      return !this.element.classList.contains("disabled");
    }

    disable(): void {
      this.element.classList.add("disabled");
      this.child.disable();
    }

    enable(): void {
      this.element.classList.remove("disabled");
      this.child.enable();
    }

    add() {
      this.stack.add();
    }

    remove() {
      this.stack.remove();
    }

    move(offset: number) {
      this.stack.move(offset);
    }

    select(index: number) {
      this.stack.select(index);
    }

    init() {
      this.child = this.node.children[0].control;
      this.child.disable();

      if (this.node.parent) {
        let index = this.node.parent.children.indexOf(this.node);
        let label = this.node.parent.labels[index];
        this.label.innerText = label;
      }

      this.body.append(this.child.getElement());
      this.init = () => {};
    }

    render() {
      this.combo.innerHTML = "";
      
      let values = this.stack.export();
      let index = 0;

      for (let value of values) {
        this.combo.options.add(new Option(this.nameItem(value, index)));
        ++index;
      }
      
      this.combo.selectedIndex = this.stack.index;

      let isDisabled = !this.isEnabled();
      let isEmpty = values.length == 0;
      let isFirst = this.stack.index == 0;
      let isLast = this.stack.index == values.length - 1;

      this.combo.disabled = isDisabled || isEmpty;
      this.btnAdd.disabled = isDisabled;
      this.btnRem.disabled = isDisabled || isEmpty;
      this.btnMUp.disabled = isDisabled || isEmpty || isFirst;
      this.btnMDo.disabled = isDisabled || isEmpty || isLast;

      if (isDisabled || isEmpty) {
        this.child.disable();
      } else {
        this.child.enable();
      }
    }
  }

  class InstanceEditor<T> {
    items: T[] = [];
    index: number = -1;
    private pull: () => T;
    private push: (item: any) => void;
    private notifyChange: (clean: boolean) => void;
  
    constructor(pull: () => T, push: (item: any) => void, notifyChange: (clean: boolean) => void) {
      this.pull = pull;
      this.push = push;
      this.notifyChange = notifyChange;
    }
  
    private store() {
      if (this.index != -1) {
        this.items[this.index] = this.pull();
      }
    }
  
    private restore() {
      this.push(this.index == -1 ? undefined : this.items[this.index]);
    }
  
    clear() {
      this.items.length = 0;
      this.index = -1;
      this.notifyChange(false);
    }
  
    add() {
      this.store();
      this.push(undefined);
      this.items.push(this.pull());
      this.index = this.items.length - 1;
      this.restore();
      this.notifyChange(false);
    }
  
    move(offset: number) {
      let index = this.index + offset;
      
      if (Number.isInteger(offset) && offset != 0 && index >= 0 && index < this.items.length && this.index != -1) {
        let other = this.items[index];
  
        this.items[index] = this.items[this.index];
        this.items[this.index] = other;
        this.index = index;
        this.notifyChange(false);
      }
    }
  
    remove() {
      this.items.splice(this.index, 1);
      this.index = Math.min(this.index, this.items.length - 1);
      this.restore();
      this.notifyChange(false);
    }
  
    select(index: number) {
      if (Number.isInteger(index) && index >= -1 && index < this.items.length) {
        this.store();
        this.index = index;
        this.restore();
        this.notifyChange(true);
      }
    }
  
    export() {
      this.store();
  
      return Array.from(this.items);
    }
  
    import(items: any) {
      if (!Array.isArray(items)) {
        items = [];
      }
  
      this.items.length = 0;
  
      for (let item of items) {
        this.push(item);
        this.items.push(this.pull());
      }
  
      this.index = this.items.length - 1;
      this.notifyChange(true);
    }
  }
}