import { useCallback, useRef, useState, type RefObject } from "react";
import type {
  HeaderSearchControlStateParams,
  HeaderSearchDirection,
} from "./headerSearchControlModel";

export type HeaderSearchControlState<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = {
  handleClear: () => void;
  handleEnter: (shiftKey: boolean) => void;
  handleNavigate: (direction: TDirection) => void;
  handleSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  setValue: (value: string) => void;
  value: string;
};

export const useHeaderSearchControlState = <
  TDirection extends HeaderSearchDirection,
>({
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}: HeaderSearchControlStateParams<TDirection>): HeaderSearchControlState<TDirection> => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");

  const handleSubmit = useCallback(() => {
    onSearchSubmit(value);
  }, [onSearchSubmit, value]);
  const handleEnter = useCallback(
    (shiftKey: boolean) =>
      onSearchNavigate(value, (shiftKey ? "previous" : "next") as TDirection),
    [onSearchNavigate, value],
  );
  const handleClear = useCallback(() => {
    setValue("");
    onSearchClear();
    inputRef.current?.focus();
  }, [onSearchClear]);
  const handleNavigate = useCallback(
    (direction: TDirection) => onSearchNavigate(value, direction),
    [onSearchNavigate, value],
  );

  return {
    handleClear,
    handleEnter,
    handleNavigate,
    handleSubmit,
    inputRef,
    setValue,
    value,
  };
};
