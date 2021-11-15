function interpreter(code) {
    const state = {
        direction: Direction.RIGHT,
        position: [0, 0],
        running: true,
        stack: new Stack(),
    };
    let output = "";
    const program = code.split("\n");

    while (state.running) {
        const instruction = program[state.position[1]][state.position[0]];
        if (instruction in instructions) {
            instructions[instruction](state);
        } else if (instruction === ".") {
            output += `${state.stack.pop()}`;
        }
        state.position = [state.position[0] + state.direction[0], state.position[1] + state.direction[1]];
        if (state.position[0] < 0) {
            state.position[0] += program[0].length;
        } else if (state.position[0] >= program[0].length) {
            state.position[0] -= program[0].length;
        }
    }
    return output;
}

const instructions = {
    "@": (state) => state.running = false,
    "#": (state) => state.position = [state.position[0] + state.direction[0], state.position[1] + state.direction[1]],
    "<": (state) => state.direction = Direction.LEFT,
    ">": (state) => state.direction = Direction.RIGHT,
    "v": (state) => state.direction = Direction.DOWN,
    "_": (state) => state.direction = state.stack.pop() === 0 ? Direction.RIGHT : Direction.LEFT,
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

function pushInt(value) {
    return (state) => state.stack.push(value);
}

function binaryOp(func) {
    return ({ stack }) => stack.push(func(stack.pop(), stack.pop()));
}

const Direction = {
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    DOWN: [0, 1],
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
