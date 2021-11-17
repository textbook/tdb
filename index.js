function interpreter(code) {
    const state = {
        direction: Direction.RIGHT,
        output: "",
        position: [0, 0],
        program: code.split("\n").map((row) => row.split("")),
        running: true,
        stack: new Stack(),
        stringMode: false,
    };

    while (state.running) {
        let [x, y] = state.position;
        const instruction = state.program[y][x];
        if (state.stringMode && instruction !== '"') {
            state.stack.push(instruction.charCodeAt(0));
        } else if (instruction in instructions) {
            instructions[instruction](state);
        }
        [x, y] = newPosition(state.position, state.direction);
        y = wrap(y, state.program.length);
        state.position = [wrap(x, state.program[y].length), y];
    }
    return state.output;
}

const instructions = {
    "g": (state) => {
        const y = state.stack.pop(), x = state.stack.pop();
        state.stack.push(state.program[y][x].charCodeAt(0));

    },
    ".": (state) => state.output += `${state.stack.pop()}`,
    ",": (state) => state.output += String.fromCharCode(state.stack.pop()),
    '"': (state) => state.stringMode = !state.stringMode,
    "@": (state) => state.running = false,
    "#": (state) => state.position = newPosition(state.position, state.direction),
    "<": setDirection(() => Direction.LEFT),
    ">": setDirection(() => Direction.RIGHT),
    "v": setDirection(() => Direction.DOWN),
    "^": setDirection(() => Direction.UP),
    "?": setDirection(() => Direction.random()),
    "_": setDirection(({ stack }) => stack.pop() === 0 ? Direction.RIGHT : Direction.LEFT),
    "|": setDirection(({ stack }) => stack.pop() === 0 ? Direction.DOWN : Direction.UP),
    "$": ({ stack }) => stack.pop(),
    "!": ({ stack }) => stack.push(stack.pop() === 0 ? 1 : 0),
    ":": ({ stack }) => stack.push(stack.peek()),
    "\\": ({ stack }) => {
        const last = stack.pop(), penultimate = stack.pop();
        stack.push(last);
        stack.push(penultimate);
    },
    "+": binaryOp((last, penultimate) => penultimate + last),
    "*": binaryOp((last, penultimate) => penultimate * last),
    "-": binaryOp((last, penultimate) => penultimate - last),
    "/": binaryOp((last, penultimate) => Math.trunc(penultimate / last)),
    "%": binaryOp((last, penultimate) => penultimate % last),
    "`": binaryOp((last, penultimate) => penultimate > last ? 1 : 0),
    "0": pushInt(0),
    "1": pushInt(1),
    "2": pushInt(2),
    "3": pushInt(3),
    "4": pushInt(4),
    "5": pushInt(5),
    "6": pushInt(6),
    "7": pushInt(7),
    "8": pushInt(8),
    "9": pushInt(9),
};

function setDirection(directionFactory) {
    return (state) => state.direction = directionFactory(state);
}

function newPosition([x, y], [dx,dy]) {
    return [x + dx, y + dy];
}

function pushInt(value) {
    return (state) => state.stack.push(value);
}

function binaryOp(func) {
    return ({ stack }) => stack.push(func(stack.pop(), stack.pop()));
}

function wrap(value, limit) {
    if (value < 0) {
        return value + limit;
    } else if (value >= limit) {
        return value - limit;
    } else {
        return value;
    }
}

const Direction = {
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    DOWN: [0, 1],
    UP: [0, -1],
    random() {
        return [this.LEFT, this.RIGHT, this.DOWN, this.UP][Math.floor(4 * Math.random())];
    }
};

class Stack {
    constructor() {
        this._stack = [];
    }

    get empty() {
        return this.length === 0;
    }

    get length() {
        return this._stack.length;
    }

    peek() {
        return this.empty ? 0 : this._stack[this.length - 1];
    }

    pop() {
        return this.empty ? 0 : this._stack.pop();
    }

    push(value) {
        this._stack.push(value);
    }
}

module.exports.interpreter = interpreter;
