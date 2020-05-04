# ⚛ Reactivity

### Reactivity is a simple component that makes tracking user activity easy and lets you decide how to act upon a users active state. It tracks user activity with a variety of DOM events.

## 💾 Installation

_It is recommended to use [yarn](https://yarnpkg.com/)_.

```sh
yarn add @toles/reactivity
```

### or

```sh
npm install --save @toles/reactivity
```

---

## ⏳ Usage

Add the component right next to the element it will be tracking activity on. In this case, we're tracking user activity for the application in general so we add it at the root and attach it to the window.

```javascript
import { useReactivity } from '@toles/reactivity';

function TrackIdle() {
    // Here, our grace period, or time before a user idles, is 10 minutes.
    const [onIdle, onActive] = useReactivity(10000);

    onIdle(() => {
        auth.logout();
    });

    onActive(() => {
        prompt('Welcome back!');
    });
}
```

### Additional Options

#### with a specific element

```js
const [onIdle, onActive] = useReactivity(10000, {
    element: () => document.getElementById('root'),
});
```

#### with `React.createRef`

```js
// Pass a React ref
function Cmp() {
    const ref = React.createRef();

    const [onIdle, onActive] = useReactivity(10000, { ref });

    return <div ref={ref}>Tracked Div</div>;
}
```

---

## 📃Documentation

### Props

-   **element** _{[EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)}_ - The target being tracked.
-   **gracePeriod** _{number}_ - The amount of time allowed before being considered idle. (ms)

### Return

`useReactivity() => [onIdle, onActive]`

-   **onIdle** _{function}_ - Register a function to call on idle.
-   **onActive** _{function}_ - Register a function to call on return from idle.

### Default Events

-   click
-   mousedown
-   mousemove
-   mouseup
-   keypress
-   keyup
-   touchstart
-   touchend
-   touchmove
-   touchcancel
-   scroll
-   resize
