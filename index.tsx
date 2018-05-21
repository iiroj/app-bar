import * as React from 'react';

export interface AppBarProps {
  readonly children: any;
  readonly disabled?: boolean;
  readonly innerRef?: (elem: HTMLDivElement) => void;
  readonly [key: string]: any;
}

export interface AppBarState {
  scroll: number;
  top: number;
}

export default class AppBar extends React.PureComponent<
  AppBarProps,
  AppBarState
> {
  public static defaultProps = {
    disabled: false
  };

  public constructor(props: AppBarProps) {
    super(props);
    this.state = {
      scroll: 0,
      top: 0
    };
  }

  private internalRef: HTMLDivElement | null = null;

  private createRef = (elem: HTMLDivElement) => {
    this.internalRef = elem;
    if (this.props.innerRef) {
      this.props.innerRef(elem);
    }
  };

  private animateTop = () => {
    if (!this.internalRef || this.props.disabled) {
      return;
    }

    const scroll = window.pageYOffset;

    if (scroll < 0) {
      return;
    }

    const classList = this.internalRef.classList;
    const oldScroll = this.state.scroll;
    const direction = scroll - oldScroll > 0 ? 'down' : 'up';
    const newTop = this.state.top + oldScroll - scroll;
    const { height, top: fromTop } = this.internalRef.getBoundingClientRect();

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

    if (!classList.contains('unfixed') && fromTop > 0) {
      classList.remove('hidden');
      classList.remove('pinned');
      classList.add('unfixed');
    }

    this.setState({ scroll, top });
    this.internalRef.style.top = top.toString();
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

    if (this.internalRef) {
      const { height, top } = this.internalRef.getBoundingClientRect();

      if (top >= 0) {
        this.internalRef.classList.add('unfixed');
      } else if (top < -height) {
        this.internalRef.classList.add('hidden');
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
      display: 'block',
      position: 'sticky',
      transition: 'top 100ms',
      width: '100%'
    };

    return (
      <nav ref={this.createRef} style={style} {...props}>
        {children}
      </nav>
    );
  }
}
