import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type PartialHTMLElement = Omit<
  React.HTMLProps<HTMLDivElement>,
  "children" | "className" | "ref"
>;

const enum Position {
  HIDDEN = "hidden",
  PINNED = "pinned",
  UNFIXED = "unfixed"
}

type RenderProp = (props: Position) => JSX.Element;

interface BaseProps extends PartialHTMLElement {
  readonly children: RenderProp | React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
}

type AppBarProps = BaseProps & {
  readonly innerRef: React.Ref<HTMLDivElement>;
};

type AppBarState = {
  position: Position;
  scroll: number;
  ref: React.RefObject<HTMLDivElement>;
  top: number;
};

class AppBar extends React.PureComponent<AppBarProps, AppBarState> {
  public static defaultProps = {
    disabled: false
  };

  public state: AppBarState = {
    position: Position.UNFIXED,
    scroll: 0,
    ref:
      (this.props.innerRef as React.RefObject<HTMLDivElement>) ||
      React.createRef(),
    top: 0
  };

  private animateTop = () => {
    const ref = this.state.ref.current;

    if (!ref || this.props.disabled) {
      return;
    }

    const scroll = window.pageYOffset;

    if (scroll < 0) {
      return;
    }

    const classList = ref.classList;
    const oldScroll = this.state.scroll;
    const direction = scroll - oldScroll > 0 ? "down" : "up";
    const newTop = this.state.top + oldScroll - scroll;
    const { height, top: fromTop } = ref.getBoundingClientRect();

    let top: number;

    if (direction === "down") {
      top = Math.max(newTop, -height);
      if (!classList.contains(Position.HIDDEN) && newTop < -height) {
        classList.remove(Position.PINNED);
        classList.remove(Position.UNFIXED);
        classList.add(Position.HIDDEN);
        this.setState({ position: Position.HIDDEN });
      }
    } else {
      top = Math.min(newTop, 0);
      if (!classList.contains(Position.PINNED) && newTop > -height) {
        classList.remove(Position.HIDDEN);
        classList.remove(Position.UNFIXED);
        classList.add(Position.PINNED);
        this.setState({ position: Position.PINNED });
      }
    }

    if (
      !classList.contains(Position.UNFIXED) &&
      (fromTop > 0 || scroll === 0)
    ) {
      classList.remove(Position.HIDDEN);
      classList.remove(Position.PINNED);
      classList.add(Position.UNFIXED);
      this.setState({ position: Position.UNFIXED });
    }

    this.setState({ scroll, top });
  };

  private handleScroll = () => window.requestAnimationFrame(this.animateTop);

  private addEventListener() {
    if ((typeof window as Partial<Window>) !== "undefined") {
      this.setState({ scroll: window.pageYOffset }, () =>
        window.addEventListener("scroll", this.handleScroll)
      );
    }
  }

  private removeEventListener() {
    if ((typeof window as Partial<Window>) !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  public componentDidMount() {
    if (!this.props.disabled) {
      this.addEventListener();
    }

    const ref = this.state.ref.current;

    if (ref) {
      const { height, top } = ref.getBoundingClientRect();

      if (top >= 0) {
        ref.classList.add(Position.UNFIXED);
      } else if (top < -height) {
        ref.classList.add(Position.HIDDEN);
        this.setState({ position: Position.HIDDEN });
      } else {
        ref.classList.add(Position.PINNED);
        this.setState({ position: Position.PINNED });
      }
    }
  }

  public componentDidUpdate({ disabled: wasDisabled }: AppBarProps) {
    const { disabled } = this.props;

    if (disabled === wasDisabled) {
      return;
    }

    if (disabled) {
      this.removeEventListener();
    } else {
      this.addEventListener();
    }
  }

  public componentWillUnmount() {
    if (!this.props.disabled) {
      this.removeEventListener();
    }
  }

  public render() {
    const { children, innerRef, ...props } = this.props;
    const { position, ref, top } = this.state;

    const style: React.CSSProperties = {
      position: "sticky",
      top: top + "px"
    };

    return (
      <nav ref={ref} style={style} {...props}>
        {typeof children === "function"
          ? (children as RenderProp)(position)
          : children}
      </nav>
    );
  }
}

export default React.forwardRef<HTMLDivElement, BaseProps>((props, ref) => (
  <AppBar {...props} innerRef={ref} />
));
