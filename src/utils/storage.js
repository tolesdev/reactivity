export default class Storage {
    get = key => JSON.parse(localStorage.getItem(`reactit:${key}`));
    set = (key, value) => localStorage.setItem(`reactit:${key}`, JSON.stringify(value));
}