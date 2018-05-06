# app-bar

[![npm](https://img.shields.io/npm/v/app-bar.svg)](https://www.npmjs.com/package/app-bar)
[![Build Status](https://travis-ci.org/iiroj/app-bar.svg?branch=master)](https://travis-ci.com/iiroj/app-bar)
[![GitHub issues](https://img.shields.io/github/issues-raw/iiroj/app-bar.svg)](https://github.com/iiroj/app-bar/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/iiroj/app-bar.svg)](https://github.com/iiroj/app-bar/pulls)

An App Bar for React that stays out of your way.

>When the scrolling is just right

Also known as a Header, a Navigation Bar, or a Navbar. I chose App Bar because it was available on npm.

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

The `<AppBar />` component is `<div />` element with the following inline styles:

```css
  display: block;
  position: sticky;
  width: 100%;
```

In other words, `<AppBar />` is a fixed full-width element that sticks to the top of your screen. The only functionality is that `<AppBar />` will move out the viewport when scrolling down, and back in when scrolling up. This is done by controlling the `top` CSS property.

### Disabling

If you want to disable `<AppBar />`'s behaviour, supply the `disabled` prop. When disabled, `<AppBar />` will simply stick to the top of the screen.

### Ref

If you need to access the dom element, you can supply a function via the `innerRef` prop.