function interpreter(code) {
    let output = "";
    for (let character of code) {
        if (character === "@") {
            break;
        } else if (character === ".") {
            output += "0";
        }
    }
    return output;
}

module.exports.interpreter = interpreter;
