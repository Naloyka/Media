function coords(x1, x2) {
    if (/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(x1) && /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(x2)) {
        return true
    } else return false
}

test('valid', () => {
    let loc = '60.0538397'
    let loc2 = '30.4181857'
    expect(coords(loc, loc2)).toEqual(true);
});

test('invalid', () => {
    let loc = '600538397'
    let loc2 = '30/4181857'
    expect(coords(loc, loc2)).toEqual(false);
});

// let c = '60.0538397, 30.4181857'


