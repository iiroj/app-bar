import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { css, injectGlobal } from 'emotion';
import reset from 'css-wipe';

import AppBar from '../index';

const containerStyles = css`
  background-color: silver;
  min-height: 1000vh;
`;

const padding = css`
  background-color: rgb(242, 242, 242);
  height: 128px;
`;

const appBarStyles = css`
  background-color: white;
  height: 64px;
  padding: 20px 32px;
  position: -webkit-sticky;
  line-height: 24px;
  transition: box-shadow 125ms;

  &.pinned {
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
  }
`;

const Example = () => (
  <div className={containerStyles}>
    <div className={padding} />
    <AppBar className={appBarStyles}>Scroll up and down for demo</AppBar>
  </div>
);

injectGlobal`
  ${reset}

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;

ReactDOM.render(<Example />, document.getElementById('root'));
