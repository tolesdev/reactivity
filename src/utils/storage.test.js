import Storage from './storage';

beforeAll(() => {
    global.localStorage = {
        getItem: jest.fn(key => this[key]),
        setItem: jest.fn((key, value) => this[key] = value)
    };
});

test('get', () => {
    const storage = new Storage();
    storage.get('testKey');
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
});

test('set', () => {
    const storage = new Storage();
    storage.set('testKey', { test: 'object' });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});