import React from "react";

type UndefinedWindow = Window | undefined;

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

type ChildFn = (props: Position) => JSX.Element;

type RenderProp = (props: {
  position: Position;
  ref: React.Ref<HTMLDivElement>;
  top: number;
}) => JSX.Element;

interface Props extends PartialHTMLElement {
  readonly children?: ChildFn | React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly render?: RenderProp;
}

const useCombinedRefs = function<T>(...refs: React.Ref<T>[]) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        (ref as any).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

const StickyNav = React.forwardRef<HTMLDivElement>(
  ({ children, disabled, render, ...props }: Props, forwardedRef) => {
    const [position, setPosition] = React.useState<Position>(Position.UNFIXED);
    const [prevScroll, setPrevScroll] = React.useState(0);
    const [top, setTop] = React.useState(0);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const ref = useCombinedRefs(forwardedRef, innerRef);

    const handleAnimateTop = React.useCallback(() => {
      if (!ref.current || disabled) return;
      const scroll = window.pageYOffset;
      if (scroll < 0) return;
      setPrevScroll(scroll);

      const { classList } = ref.current;
      const direction = scroll - prevScroll > 0 ? "down" : "up";
      const newTop = top + prevScroll - scroll;
      const { height, top: fromTop } = ref.current.getBoundingClientRect();

      if (direction === "down") {
        setTop(Math.max(newTop, -height));
        if (!classList.contains(Position.HIDDEN) && newTop < -height) {
          setPosition(Position.HIDDEN);
          classList.remove(Position.PINNED, Position.UNFIXED);
          classList.add(Position.HIDDEN);
        }
      } else {
        setTop(Math.min(newTop, 0));
        if (!classList.contains(Position.PINNED) && newTop > -height) {
          setPosition(Position.PINNED);
          classList.remove(Position.HIDDEN, Position.UNFIXED);
          classList.add(Position.PINNED);
        }
      }

      if (
        !classList.contains(Position.UNFIXED) &&
        (fromTop > 0 || scroll === 0)
      ) {
        setPosition(Position.UNFIXED);
        classList.remove(Position.HIDDEN, Position.PINNED);
        classList.add(Position.UNFIXED);
      }
    }, [disabled, prevScroll, top]);

    const animation = React.useRef<number | null>(null);
    const handleScroll = () => {
      if (animation.current) window.cancelAnimationFrame(animation.current);
      animation.current = window.requestAnimationFrame(handleAnimateTop);
    };

    const handleAddEventListener = React.useCallback(() => {
      if (typeof (window as UndefinedWindow) !== "undefined") {
        window.addEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    const handleRemoveEventListener = React.useCallback(() => {
      if (typeof (window as UndefinedWindow) !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    React.useEffect(() => {
      if (disabled) handleRemoveEventListener();
      else handleAddEventListener();
      return () => handleAddEventListener();
    }, [disabled]);

    if (render) {
      return render({ position, ref, top });
    }

    const style: React.CSSProperties = {
      position: "sticky",
      top: top + "px"
    };

    return (
      <nav {...props} ref={ref} style={style}>
        {typeof children === "function"
          ? (children as ChildFn)(position)
          : children}
      </nav>
    );
  }
);

export default React.memo(StickyNav);
