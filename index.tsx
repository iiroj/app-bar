import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

/**
 * ReactStickyNav assumes that its container has `position: sticky;`
 */
export const styles = { position: "sticky" } as const;

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

const isChildFn = (input: any): input is ChildFn => typeof input === "function";

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
  const targetRef = useRef<T>(null);

  useEffect(() => {
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

/**
 * The ReactStickyNav component
 */
const StickyNav = (
  { children, disabled, render, ...props }: Props,
  forwardedRef: React.Ref<HTMLDivElement>
) => {
  const [position, setPosition] = useState<Position>(Position.UNFIXED);
  let prevScroll = React.useRef(0).current;
  let top = React.useRef(0).current;
  const innerRef = useRef<HTMLDivElement>(null);
  const ref = useCombinedRefs(forwardedRef, innerRef);

  const handleAnimateTop = React.useCallback(() => {
    if (!ref.current || disabled) return;
    const scroll = window.pageYOffset;
    if (scroll < 0) return;

    const { classList } = ref.current;
    const direction = scroll - prevScroll > 0 ? "down" : "up";
    const scrollLength = top + prevScroll - scroll;
    const { height, top: fromTop } = ref.current.getBoundingClientRect();

    const newTop =
      direction === "down"
        ? Math.max(scrollLength, -height)
        : Math.min(scrollLength, 0);
    top = newTop;
    ref.current.style.top = newTop.toString();

    if (
      direction === "down" &&
      !classList.contains(Position.HIDDEN) &&
      scrollLength < -height
    ) {
      setPosition(Position.HIDDEN);
      classList.remove(Position.PINNED, Position.UNFIXED);
      classList.add(Position.HIDDEN);
    }

    if (
      direction === "up" &&
      !classList.contains(Position.PINNED) &&
      scrollLength > -height
    ) {
      setPosition(Position.PINNED);
      classList.remove(Position.HIDDEN, Position.UNFIXED);
      classList.add(Position.PINNED);
    }

    if (
      !classList.contains(Position.UNFIXED) &&
      (fromTop > 0 || scroll === 0)
    ) {
      setPosition(Position.UNFIXED);
      classList.remove(Position.HIDDEN, Position.PINNED);
      classList.add(Position.UNFIXED);
    }

    prevScroll = scroll;
    animation.current = null;
  }, [disabled, !!render]);

  const animation = useRef<number | null>(null);
  const handleScroll = () => {
    if (animation.current) window.cancelAnimationFrame(animation.current);
    animation.current = window.requestAnimationFrame(handleAnimateTop);
  };

  const handleAddEventListener = useCallback(() => {
    if (typeof (window as UndefinedWindow) !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleRemoveEventListener = useCallback(() => {
    if (typeof (window as UndefinedWindow) !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (disabled) handleRemoveEventListener();
    else handleAddEventListener();
    return () => handleAddEventListener();
  }, [disabled]);

  useEffect(() => {
    if (!disabled) handleAnimateTop();
  }, []);

  if (render) {
    return render({ position, ref, top });
  }

  return (
    <nav {...props} ref={ref} style={styles}>
      {isChildFn(children) ? children(position) : children}
    </nav>
  );
};

export default memo(forwardRef(StickyNav));
