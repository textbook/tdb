const Direction = {
    DOWN: [0, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    UP: [0, -1],
    random() {
        return [Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.UP][Math.floor(4 * Math.random())];
    },
};

const Mode = {
    NORMAL: 0,
    STRING: 1,
    ENDED: 2,
};

const instructions = {
    " ": () => {},
    "@": (state) => state.mode = Mode.ENDED,
    "#": ({ program }) => program.move(),
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
    "v": setDirection(() => Direction.DOWN),
    "<": setDirection(() => Direction.LEFT),
    ">": setDirection(() => Direction.RIGHT),
    "^": setDirection(() => Direction.UP),
    "?": setDirection(Direction.random),
    "_": setDirection((stack) => stack.pop() === 0 ? Direction.RIGHT : Direction.LEFT),
    "|": setDirection((stack) => stack.pop() === 0 ? Direction.DOWN : Direction.UP),
    "$": ({ stack }) => stack.pop(),
    "!": ({ stack }) => stack.push(stack.pop() === 0 ? 1 : 0),
    ":": ({ stack }) => stack.push(stack.peek()),
    "\\": ({ stack }) => {
        const last = stack.pop(), penultimate = stack.pop();
        stack.push(last);
        stack.push(penultimate);
    },
    "+": binaryOperation((a, b) => b + a),
    "*": binaryOperation((a, b) => b * a),
    "-": binaryOperation((a, b) => b - a),
    "/": binaryOperation((a, b) => Math.trunc(b / a)),
    "%": binaryOperation((a, b) => b % a),
    "`": binaryOperation((a, b) => b > a ? 1 : 0),
    ".": ({ output, stack }) => output.push(stack.pop()),
    ",": ({ output, stack }) => output.push(String.fromCharCode(stack.pop())),
    '"': (state) => state.mode = state.mode === Mode.NORMAL ? Mode.STRING : Mode.NORMAL,
    "g": ({ program, stack }) => {
        const y = stack.pop(), x = stack.pop();
        stack.push(program.getCharAt([x, y]).charCodeAt(0));
    },
    "p": ({ program, stack }) => {
        const y = stack.pop(), x = stack.pop();
        program.setCharAt([x, y], String.fromCharCode(stack.pop()));
    },
};

function interpreter(code) {
    const state = {
        mode: Mode.NORMAL,
        output: [],
        program: Program.fromString(code),
        stack: new Stack(),
    };

    while (state.mode !== Mode.ENDED) {
        const instruction = state.program.instruction;
        if (state.mode === Mode.STRING && instruction !== '"') {
            state.stack.push(instruction.charCodeAt(0));
        } else {
            instructions[instruction](state);
        }
        state.program.move();
    }

    return state.output.join("");
}

class Program {
    static fromString(code) {
        return new Program(code.split("\n").map((row) => row.split("")));
    }

    constructor(program) {
        this._direction = Direction.RIGHT;
        this._position = [0, 0];
        this._program = program;
    }

    getCharAt([x, y]) {
        return this._program[y][x];
    }

    get instruction() {
        const [x, y] = this._position;
        return this._program[y][x];
    }

    setCharAt([x, y], char) {
        this._program[y][x] = char;
    }

    setDirection(newDirection) {
        this._direction = newDirection;
    }

    move() {
        let [x, y] = this._position;
        const [dx, dy] = this._direction;
        y = this._clamp(y + dy, this._program.length);
        x = this._clamp(x + dx, this._program[y].length)
        this._position = [x, y];
    }

    _clamp(value, length) {
        if (value >= length) return value - length;
        if (value < 0) return value + length;
        return value;
    }
}

class Stack {
    constructor() {
        this._stack = [];
    }

    get empty()  {
        return this._stack.length === 0;
    }

    peek() {
        if (this.empty) {
            return 0;
        }
        return this._stack[this._stack.length - 1];
    }

    pop() {
        if (this.empty) {
            return 0;
        }
        return this._stack.pop();
    }

    push(value) {
        this._stack.push(value);
    }
}

function pushInt(value) {
    return ({ stack }) => stack.push(value);
}

function setDirection (factory) {
    return ({ program, stack }) => program.setDirection(factory(stack));
}

function binaryOperation(func) {
    return ({ stack }) => stack.push(func(stack.pop(), stack.pop()));
}

module.exports.interpreter = interpreter;
