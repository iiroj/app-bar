import * as React from 'react';

export type Props = React.ComponentClass<HTMLElement> & {
  readonly className?: string;
  readonly children: any;
  readonly disabled?: boolean;
  readonly innerRef?: (elem: HTMLDivElement) => void;
};

export type State = {
  scroll: number;
  top: number;
};

export default class AppBar extends React.PureComponent<Props, State> {
  public static defaultProps = {
    disabled: false
  };

  private internalRef: React.RefObject<HTMLDivElement>;

  public constructor(props: Props) {
    super(props);

    this.internalRef = React.createRef();

    this.state = {
      scroll: 0,
      top: 0
    };
  }

  private animateTop = () => {
    const ref = this.internalRef.current;

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

    let top;

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
    ref.style.top = top.toString();
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

    const ref = this.internalRef.current;

    if (ref) {
      if (typeof this.props.innerRef === 'function') {
        this.props.innerRef(ref);
      }

      const { height, top } = ref.getBoundingClientRect();

      if (top >= 0) {
        ref.classList.add('unfixed');
      } else if (top < -height) {
        ref.classList.add('hidden');
      }
    }
  }

  public componentDidUpdate({ disabled: wasDisabled }: Props) {
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
      transition: 'top 100ms'
    };

    return (
      <nav ref={this.internalRef} style={style} {...props}>
        {children}
      </nav>
    );
  }
}
