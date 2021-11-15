function interpreter(code) {
    let output = "";

    for (let instruction of code) {
        if (instruction === "@") {
            break;
        } else if (instruction === ".") {
            output += "0";
        }
    }
    return output;
}

module.exports.interpreter = interpreter;
