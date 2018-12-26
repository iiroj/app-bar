import styled, { createGlobalStyle } from "styled-components";
import * as React from "react";
import * as ReactDOM from "react-dom";
import reset from "react-style-reset/string";

import AppBar from "../index";

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

const StyledAppBar = styled(AppBar)`
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

class Example extends React.PureComponent<{}, {}> {
  private ref: React.Ref<HTMLElement> = React.createRef();

  render() {
    return (
      <Container>
        <Reset />
        <Padding />
        <StyledAppBar ref={this.ref}>Scroll up and down for demo</StyledAppBar>
      </Container>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById("root"));
