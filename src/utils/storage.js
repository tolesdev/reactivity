export default class Storage {
    get = key => JSON.parse(localStorage.getItem(`reactivity:${key}`));
    set = (key, value) => localStorage.setItem(`reactivity:${key}`, JSON.stringify(value));
}