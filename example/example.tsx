import reset from "react-style-reset/string";
import * as ReactDOM from "react-dom";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

import Base from "../index";

const Reset = createGlobalStyle`
  ${reset};

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  background-color: silver;
  min-height: 1000vh;
`;

const Padding = styled.div`
  background-color: rgb(242, 242, 242);
  height: 128px;
`;

const Position = styled.p`
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ReactStickyNav = styled(Base)`
  background-color: white;
  height: 64px;
  padding: 20px 32px;
  position: -webkit-sticky;
  line-height: 24px;
  top: 0;
  transition: all 125ms;

  &.pinned {
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
  }
`;

ReactDOM.render(
  <Container>
    <Reset />
    <Padding />
    <ReactStickyNav>
      {(position) => (
        <>
          {`<ReactStickyNav />`} is currently {position} — Scroll up and down
          for demo
          <Position>Current position: {position}</Position>
        </>
      )}
    </ReactStickyNav>
  </Container>,
  document.getElementById("root")
);
