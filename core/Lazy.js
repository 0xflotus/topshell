//: ({} -> a) -> Lazy a
exports.of = f => new self.tsh.Lazy(f);

//: a -> Lazy a
exports.ofValue = x => {
    var lazy = new self.tsh.Lazy(null);
    lazy.value = x;
    return lazy;
};

//: Lazy a -> a
exports.force = l => {
    if(!Object.prototype.hasOwnProperty.call(l, "value")) l.value = l.compute({});
    return l.value;
};

//: (a -> String) -> ((a -> b) -> (a -> b)) -> a -> b
exports.memoBy = g => f => v => {
    var cache = {};
    function h(x) {
        var k = g(x);
        if(!Object.prototype.hasOwnProperty.call(cache, k)) cache[k] = f(h)(x);
        return cache[k];
    }
    return h(v);
};

//: ((String -> a) -> (String -> a)) -> String -> a
exports.memo = exports.memoBy(k => k);

//: ((Int -> a) -> (Int -> a)) -> Int -> a
exports.memoArray = f => x => {
    var cache = [];
    function t(x) {
        var k = x;
        if(!Object.prototype.hasOwnProperty.call(cache, k)) cache[k] = f(t)(x);
        return cache[k];
    }
    return t(x);
};

//: ((Int -> Int -> a) -> (Int -> Int -> a)) -> Int -> Int -> a
exports.memoTable = f => x => y => {
    var cache = {};
    function t(x) { return function(y) {
        var k = x + "," + y;
        if(!Object.prototype.hasOwnProperty.call(cache, k)) cache[k] = f(t)(x)(y);
        return cache[k];
    }}
    return t(x)(y);
};

//: ((Int -> Int -> Int -> a) -> (Int -> Int -> Int -> a)) -> Int -> Int -> Int -> a
exports.memoCube = f => x => y => z => {
    var cache = {};
    function t(x) { return function(y) {
        var k = x + "," + y + "," + z;
        if(!Object.prototype.hasOwnProperty.call(cache, k)) cache[k] = f(t)(x)(y)(z);
        return cache[k];
    }}
    return t(x)(y)(z);
};
