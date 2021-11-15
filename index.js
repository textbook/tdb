function interpreter(code) {
    const state = {
        direction: Direction.RIGHT,
        position: 0,
        running: true,
    };
    const stack = [];
    let output = "";

    while (state.running) {
        const instruction = code[state.position];
        if (instruction in instructions) {
            instructions[instruction](state);
        } else if (instruction === ".") {
            output += `${stack.pop() || 0}`;
        } else if ("0123456789".indexOf(instruction) >= 0) {
            stack.push(parseInt(instruction, 10));
        }
        state.position += state.direction;
    }
    return output;
}

const instructions = {
    "@": (state) => state.running = false,
    "#": (state) => state.position += state.direction,
    "<": (state) => state.direction = Direction.LEFT,
};

const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

module.exports.interpreter = interpreter;
