//formato requerido
function formatResponse(success, message = "", errors = [], data = []) {
    return {
        success,
        message,
        errors,
        data,
    };
}

module.exports = formatResponse;