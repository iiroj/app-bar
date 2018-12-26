import * as React from 'react';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type PartialHTMLElement = Omit<
  React.HTMLProps<HTMLDivElement>,
  'children' | 'className' | 'ref'
>;

interface BaseProps extends PartialHTMLElement {
  readonly children: any;
  readonly className?: string;
  readonly disabled?: boolean;
}

type AppBarProps = BaseProps & {
  readonly innerRef?: React.RefObject<any>;
};

type AppBarState = {
  scroll: number;
  ref: React.RefObject<HTMLDivElement>;
  top: number;
};

class AppBar extends React.PureComponent<AppBarProps, AppBarState> {
  public static defaultProps = {
    disabled: false
  };

  public constructor(props: AppBarProps) {
    super(props);

    this.state = {
      scroll: 0,
      ref: this.props.innerRef || React.createRef(),
      top: 0
    };
  }

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
    const direction = scroll - oldScroll > 0 ? 'down' : 'up';
    const newTop = this.state.top + oldScroll - scroll;
    const { height, top: fromTop } = ref.getBoundingClientRect();

    let top: number;

    if (direction === 'down') {
      top = Math.max(newTop, -height);
      if (!classList.contains('hidden') && newTop < -height) {
        classList.remove('pinned');
        classList.remove('unfixed');
        classList.add('hidden');
      }
    } else {
      top = Math.min(newTop, 0);
      if (!classList.contains('pinned') && newTop > -height) {
        classList.remove('hidden');
        classList.remove('unfixed');
        classList.add('pinned');
      }
    }

    if (!classList.contains('unfixed') && (fromTop > 0 || scroll === 0)) {
      classList.remove('hidden');
      classList.remove('pinned');
      classList.add('unfixed');
    }

    this.setState({ scroll, top });
  };

  private handleScroll = () => window.requestAnimationFrame(this.animateTop);

  private addEventListener() {
    if ((typeof window as Partial<Window>) !== 'undefined') {
      this.setState({ scroll: window.pageYOffset }, () =>
        window.addEventListener('scroll', this.handleScroll)
      );
    }
  }

  private removeEventListener() {
    if ((typeof window as Partial<Window>) !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
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
        ref.classList.add('unfixed');
      } else if (top < -height) {
        ref.classList.add('hidden');
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

    const style: React.CSSProperties = {
      position: 'sticky',
      top: this.state.top + 'px'
    };

    return (
      <nav ref={this.state.ref} style={style} {...props}>
        {children}
      </nav>
    );
  }
}

export default React.forwardRef<HTMLElement, BaseProps>((props, ref) => (
  <AppBar {...props} innerRef={ref} />
));
