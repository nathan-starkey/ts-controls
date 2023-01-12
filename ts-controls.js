var TSControls;
(function (TSControls) {
    class Control {
        constructor() {
            this.displayMode = "inline";
        }
        notifyChange() {
            this.node.notifyChange();
        }
    }
    class Node {
        constructor(control, children) {
            this.control = control;
            this.control.node = this;
            children || (children = []);
            if (!Array.isArray(children)) {
                children = [children];
            }
            if (Array.isArray(children[0])) {
                this.labels = children.map(arr => arr[0]);
                this.children = children.map(arr => arr[1]);
            }
            else {
                this.children = children;
                this.labels = new Array(this.children.length).fill("");
            }
            for (let child of this.children) {
                child.parent = this;
            }
        }
        notifyChange() {
            var _a;
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.control.notifyChange();
        }
    }
    TSControls.Node = Node;
    class TextBox extends Control {
        constructor() {
            super();
            this.element = document.createElement("input");
            this.element.addEventListener("change", () => this.notifyChange());
        }
        getElement() {
            return this.element;
        }
        getValue() {
            return this.element.value;
        }
        setValue(value) {
            this.element.value = value || "";
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
            this.element.value = "";
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.TextBox = TextBox;
    class NumberBox extends Control {
        constructor() {
            super();
            this.element = document.createElement("input");
            this.element.type = "number";
            this.element.valueAsNumber = 0;
            this.element.addEventListener("change", () => this.notifyChange());
        }
        getElement() {
            return this.element;
        }
        getValue() {
            return this.element.valueAsNumber;
        }
        setValue(value) {
            this.element.valueAsNumber = Number(value) || 0;
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
            this.element.valueAsNumber = 0;
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.NumberBox = NumberBox;
    class CheckBox extends Control {
        constructor() {
            super();
            this.element = document.createElement("input");
            this.element.type = "checkbox";
            this.element.addEventListener("change", () => this.notifyChange());
        }
        getElement() {
            return this.element;
        }
        getValue() {
            return this.element.checked;
        }
        setValue(value) {
            this.element.checked = Boolean(value);
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
            this.element.checked = false;
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.CheckBox = CheckBox;
    class TextArea extends Control {
        constructor() {
            super();
            this.element = document.createElement("textarea");
            this.element.addEventListener("change", () => this.notifyChange());
        }
        getElement() {
            return this.element;
        }
        getValue() {
            return this.element.value;
        }
        setValue(value) {
            this.element.value = value || "";
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
            this.element.value = "";
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.TextArea = TextArea;
    class SelectBox extends Control {
        constructor(options) {
            super();
            this.element = document.createElement("select");
            this.options = options;
            for (let option of options) {
                this.element.options.add(new Option(option));
            }
            this.element.addEventListener("change", () => this.notifyChange());
        }
        getElement() {
            return this.element;
        }
        getValue() {
            return this.element.value;
        }
        setValue(value) {
            this.element.selectedIndex = Math.max(0, this.options.indexOf(value));
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
            this.element.selectedIndex = 0;
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.SelectBox = SelectBox;
    class TextOutput extends Control {
        constructor(text) {
            super();
            this.element = document.createElement("span");
            if (text) {
                this.setText(text);
            }
        }
        setText(text) {
            this.element.innerText = text;
        }
        getElement() {
            return this.element;
        }
        getValue() {
            throw new Error("control has no value");
        }
        setValue(value) {
            throw new Error("control has no value");
        }
        exportsValue() {
            return false;
        }
        isEnabled() {
            return !this.element.classList.contains("disabled");
        }
        disable() {
            this.setText("");
            this.element.classList.add("disabled");
        }
        enable() {
            this.element.classList.remove("disabled");
        }
    }
    TSControls.TextOutput = TextOutput;
    class Button extends Control {
        constructor(text, callback) {
            super();
            this.element = document.createElement("button");
            if (text) {
                this.element.innerText = text;
            }
            if (callback) {
                this.element.addEventListener("click", () => callback());
            }
        }
        getElement() {
            return this.element;
        }
        getValue() {
            throw new Error("control has no value");
        }
        setValue(value) {
            throw new Error("control has no value");
        }
        exportsValue() {
            return false;
        }
        isEnabled() {
            return !this.element.disabled;
        }
        disable() {
            this.element.disabled = true;
        }
        enable() {
            this.element.disabled = false;
        }
    }
    TSControls.Button = Button;
    class Table extends Control {
        constructor() {
            super();
            this.displayMode = "block";
            this.element = document.createElement("table");
            this.element.classList.add("table-control");
        }
        getElement() {
            this.init();
            return this.element;
        }
        getValue() {
            let value = {};
            let index = 0;
            for (let { control } of this.node.children) {
                let label = this.node.labels[index];
                if (control.exportsValue()) {
                    value[label] = control.getValue();
                }
                ++index;
            }
            return value;
        }
        setValue(value) {
            if (typeof value != "object" || value == null) {
                value = {};
            }
            let index = 0;
            for (let { control } of this.node.children) {
                let label = this.node.labels[index];
                if (control.exportsValue()) {
                    control.setValue(value[label]);
                }
                ++index;
            }
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.classList.contains("disabled");
        }
        disable() {
            this.element.classList.add("disabled");
            for (let { control } of this.node.children) {
                control.disable();
            }
        }
        enable() {
            this.element.classList.remove("disabled");
            for (let { control } of this.node.children) {
                control.enable();
            }
        }
        init() {
            let index = 0;
            for (let { control } of this.node.children) {
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
                }
                else {
                    td0.innerText = this.node.labels[index];
                    td1.append(control.getElement());
                    tr.append(td0, td1);
                }
                this.element.append(tr);
                ++index;
            }
            this.init = () => { };
        }
    }
    TSControls.Table = Table;
    class List extends Control {
        constructor(nameItem) {
            super();
            this.displayMode = "block";
            this.element = document.createElement("div");
            this.header = document.createElement("div");
            this.body = document.createElement("div");
            this.label = document.createElement("label");
            this.combo = document.createElement("select");
            this.btnAdd = document.createElement("button");
            this.btnRem = document.createElement("button");
            this.btnMUp = document.createElement("button");
            this.btnMDo = document.createElement("button");
            this.nameItem = (item, index) => String(index);
            this.nameItem || (this.nameItem = nameItem);
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
        getElement() {
            this.init();
            return this.element;
        }
        getValue() {
            return this.stack.export();
        }
        setValue(value) {
            this.stack.import(value);
        }
        exportsValue() {
            return true;
        }
        isEnabled() {
            return !this.element.classList.contains("disabled");
        }
        disable() {
            this.element.classList.add("disabled");
            this.child.disable();
        }
        enable() {
            this.element.classList.remove("disabled");
            this.child.enable();
        }
        add() {
            this.stack.add();
        }
        remove() {
            this.stack.remove();
        }
        move(offset) {
            this.stack.move(offset);
        }
        select(index) {
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
            this.init = () => { };
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
            }
            else {
                this.child.enable();
            }
        }
    }
    TSControls.List = List;
    class InstanceEditor {
        constructor(pull, push, notifyChange) {
            this.items = [];
            this.index = -1;
            this.pull = pull;
            this.push = push;
            this.notifyChange = notifyChange;
        }
        store() {
            if (this.index != -1) {
                this.items[this.index] = this.pull();
            }
        }
        restore() {
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
        move(offset) {
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
        select(index) {
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
        import(items) {
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
})(TSControls || (TSControls = {}));
