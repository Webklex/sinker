
function test() {
    // Some setup
    const data = getSensitiveData();
    // Violation here
    element.innerHTML = data;
}

function testSave() {
    // Some setup
    const data = getSensitiveData();
    // Violation here
    // @safe-sinker: data is not rendered as html ;)
    element.innerHTML = data;
}

function testSave2() {
    // Some setup
    const data = getSensitiveData();
    // Violation here
    /** @safe-sinker: data is not rendered as html ;) **/
    element.innerHTML = data;
}

function testSave3() {
    // Some setup
    const data = getSensitiveData();
    // Violation here
    /**
     * @safe-sinker: data is not rendered as html ;)
     **/
    element.innerHTML = data;
}

function testSave4() {
    // Some setup
    const data = getSensitiveData();
    // Violation here
    /**
     * @safe-sinker: data is not rendered as html ;)
     * **/
    element.innerHTML = data;
}
