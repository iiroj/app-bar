<div align="center">
  <h1 align="center">react-sticky-nav</h1>
  <p>A sticky nav bar for React that stays out of your way.</p>
  <blockquote>When the scrolling is just right</blockquote>
  <a href="https://www.npmjs.com/package/react-sticky-nav"><strong>npm</strong></a> ·
  <a href="https://gitlab.com/iiroj/react-sticky-nav"><strong>GitLab</strong></a>
  <br/>
  <br/>
  <a href="https://www.npmjs.com/package/react-sticky-nav">
    <img src="https://img.shields.io/npm/v/react-sticky-nav.svg">
  </a>
  <a href="https://gitlab.com/iiroj/react-sticky-nav">
    <img src="https://img.shields.io/github/languages/code-size/iiroj/react-sticky-nav.svg">
  </a>
  <a href="https://gitlab.com/iiroj/react-sticky-nav/commits/master">
    <img alt="pipeline status" src="https://gitlab.com/iiroj/react-sticky-nav/badges/master/pipeline.svg" />
  </a>
  <a href="https://gitlab.com/iiroj/react-sticky-nav/blob/master/package.json">
    <img src="https://img.shields.io/david/iiroj/react-sticky-nav.svg">
  </a>
  <a href="https://gitlab.com/iiroj/react-sticky-nav/blob/master/package.json">
    <img src="https://img.shields.io/david/dev/iiroj/react-sticky-nav.svg">
  </a>
  <br/>
  <br/>
</div>

## Requirements

- React
- Something to style the `<AppBar />` with, like [styled-components](https://github.com/styled-components/styled-components) or [emotion](https://github.com/emotion-js/emotion)
- `window.requestAnimationFrame`. You could use a [polyfill](https://github.com/chrisdickinson/raf) for older browsers
- `position: sticky;` support. For Safari, you should add `position: -webkit-sticky;` to your own styles. Unfortunately this is not possible to support with React's inline style syntax.

## Usage

### Basic

```jsx
// @jsx jsx

import React from "react";
import { css, jsx } from "@emotion/core";
import Navigation from "react-sticky-nav";

import { HamburgerMenu, Logo } from "./components";

...

const styles = css`
  background-color: white;
  box-shadow: ${open ? "none" : "0 1px 2px rgba(0, 0, 0, 0.08)"};
  height: 64px;
  position: -webkit-sticky /* This is needed for Safari support */
`;

...

ReactDOM.render(
  <Navigation css={styles} disabled={open}>
    <Logo />
    <HamburgerMenu open={open} />
  </Navigation>,
  document.getElementById("#root")
);
```

### Render Prop

To use `<AppBar />`'s current position (_hidden_, _pinned_, or _unfixed_) in its children, you can supply `<AppBar /` a render function as its child:

```jsx
const SizableLogo = styled(Logo)(props => ({
  height: props.large ? "128px" : "64px"
}));

ReactDOM.render(
  <Navigation css={styles} disabled={open}>
    {position => (
      <>
        <SizableLogo large={!open && position === "unfixed"} />
        <HamburgerMenu open={open} />
      </>
    )}
  </Navigation>,
  document.getElementById("#root")
);
```

### Styling

The `react-sticky-nav` comes with very little defaults, and should be styled by supplying it with a `className` property that is attached some CSS.

The `<AppBar />` component is a `<nav />` element with the following inline styles:

```css
  display: block;
  position: sticky;
  width: 100%;
```

In other words, `<AppBar />` is a fixed full-width element that sticks to the top of your screen. The only functionality is that `<AppBar />` will move out the viewport when scrolling down, and back in when scrolling up. This is done by controlling the `top` CSS property.

There are three additional classes added for the different states possible:
1. `unfixed` is applied when `<AppBar />` doesn't touch the top of the screen but is on the page
2. `hidden` is applied when `<AppBar />` is fully hidden (for example, after scrolling down or reloading page when scrolled)
3. `pinned` is applied when `<AppBar />` scrolling up from being hidden
These classes can be used for styling (see demo for example).

### Disabling

If you want to disable `<AppBar />`'s behaviour, supply the `disabled` prop. When disabled, `<AppBar />` will simply stick to the top of the screen.

### Ref

If you need to access the dom element, you can supply your own ref from `React.createRef` via the `ref?: React.Ref<HTMLDivElement>` prop.
