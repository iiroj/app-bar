<div align="center">
  <h1 align="center">app-bar</h1>
  <p>An App Bar for React that stays out of your way.</p>
  <blockquote>When the scrolling is just right</blockquote>
  <p>Also known as a Header, a Navigation Bar, or a Navbar. I chose App Bar because it was available on npm.</p>
  <a href="https://www.npmjs.com/package/app-bar"><strong>npm</strong></a> ·
  <a href="https://gitlab.com/iiroj/app-bar"><strong>GitLab</strong></a>
  <br/>
  <br/>
  <a href="https://www.npmjs.com/package/app-bar">
    <img src="https://img.shields.io/npm/v/app-bar.svg">
  </a>
  <a href="https://gitlab.com/iiroj/app-bar">
    <img src="https://img.shields.io/github/languages/code-size/iiroj/app-bar.svg">
  </a>
  <a href="https://gitlab.com/iiroj/app-bar/commits/master">
    <img alt="pipeline status" src="https://gitlab.com/iiroj/app-bar/badges/master/pipeline.svg" />
  </a>
  <a href="https://gitlab.com/iiroj/app-bar/blob/master/package.json">
    <img src="https://img.shields.io/david/iiroj/app-bar.svg">
  </a>
  <a href="https://gitlab.com/iiroj/app-bar/blob/master/package.json">
    <img src="https://img.shields.io/david/dev/iiroj/app-bar.svg">
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

Basic usage:

```javascript
import React from 'react';
import { css } from 'emotion';
import Navigation from 'app-bar';

import { HamburgerMenu, Logo } from './components';

...

const styles = css`
  background-color: white;
  box-shadow: ${open ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.08)'};
  height: 64px;
  position: -webkit-sticky /* This is needed for Safari support */
`;

...

<Navigation className={styles} disabled={open}>
  <Logo />
  <HamburgerMenu open={open} />
</Navigation>
```

### Styling

The `app-bar` comes with very little defaults, and should be styled by supplying it with a `className` property that is attached some CSS.

The `<AppBar />` component is `<nav />` element with the following inline styles:

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

If you need to access the dom element, you can supply a function via the `innerRef` prop.