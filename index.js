function interpreter(code) {
    const state = {
        direction: Direction.RIGHT,
        position: 0,
        running: true,
    };
    const stack = new Stack();
    let output = "";

    while (state.running) {
        const instruction = code[state.position];
        if (instruction in instructions) {
            instructions[instruction](state);
        } else if (instruction === ".") {
            output += `${stack.pop()}`;
        } else if (instruction === "_") {
            state.direction = stack.pop() === 0 ? Direction.RIGHT : Direction.LEFT;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
        state.position += state.direction;
        if (state.position < 0) {
            state.position += code.length;
        } else if (state.position >= code.length) {
            state.position -= code.length;
        }
    }
    return output;
}

const instructions = {
    "@": (state) => state.running = false,
    "#": (state) => state.position += state.direction,
    "<": (state) => state.direction = Direction.LEFT,
    ">": (state) => state.direction = Direction.RIGHT,
};

const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

class Stack {
    constructor() {
        this._stack = [];
    }

    pop() {
        if (this._stack.length === 0) {
            return 0;
        }
        return this._stack.pop();
    }

    push(value) {
        this._stack.push(value);
    }
}

module.exports.interpreter = interpreter;
