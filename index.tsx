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

  private handleScroll = () => {
    if (!this.internalRef || this.props.disabled) {
      return;
    }

    const scroll = window.pageYOffset;

    if (scroll < 0) {
      return;
    }

    const oldScroll = this.state.scroll;
    const direction = scroll - oldScroll > 0 ? 'down' : 'up';
    const top = this.state.top + oldScroll - scroll;
    const height = this.internalRef.getBoundingClientRect().height;

    if (direction === 'down') {
      this.setState({ top: Math.max(top, -height) });
    } else {
      this.setState({ top: Math.min(top, 0) });
    }

    this.setState({ scroll });
  };

  private addEventListener() {
    if (typeof window !== 'undefined') {
      this.setState({ scroll: window.pageYOffset }, () =>
        window.addEventListener('scroll', this.handleScroll)
      );
    }
  }

  private removeEventListener() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  public componentDidMount() {
    if (!this.props.disabled) {
      this.addEventListener();
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
      top: this.state.top,
      width: '100%'
    };

    return (
      <div style={style} ref={this.createRef} {...props}>
        {children}
      </div>
    );
  }
}
