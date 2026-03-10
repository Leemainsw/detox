"use client";

import * as React from "react";
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */
const SelectBoxRoot = SelectPrimitive;

/* ---------------------------------------------------------------------------
 * Label
 * ------------------------------------------------------------------------- */
const SelectBoxLabel = React.forwardRef<
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-base font-semibold text-gray-400", className)}
    {...props}
  />
));
SelectBoxLabel.displayName = "SelectBoxLabel";

/* ---------------------------------------------------------------------------
 * Trigger - Input 스타일, children으로 Prefix/Value/Suffix 합성
 * ------------------------------------------------------------------------- */
const PREFIX_TYPE = Symbol("SelectBox.Prefix");
const SUFFIX_TYPE = Symbol("SelectBox.Suffix");

const SelectBoxPrefix = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "body-md font-bold text-brand-primary whitespace-nowrap shrink-0",
      className
    )}
    {...props}
  />
);
(SelectBoxPrefix as React.FC & { type?: symbol }).type = PREFIX_TYPE;

const SelectBoxSuffix = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "body-md font-bold text-gray-400 whitespace-nowrap shrink-0",
      className
    )}
    {...props}
  />
);
(SelectBoxSuffix as React.FC & { type?: symbol }).type = SUFFIX_TYPE;

const SelectBoxTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTriggerPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectTriggerPrimitive>
>(({ className, children, ...props }, ref) => {
  const childArray = React.Children.toArray(children);
  const prefix = childArray.find(
    (child): child is React.ReactElement => React.isValidElement(child) && (child.type as { type?: symbol })?.type === PREFIX_TYPE
  );
  const suffix = childArray.find(
    (child): child is React.ReactElement => React.isValidElement(child) && (child.type as { type?: symbol })?.type === SUFFIX_TYPE
  );
  const rest = childArray.filter(
    (child) =>
      !React.isValidElement(child) ||
      (child.type as { type?: symbol })?.type !== PREFIX_TYPE &&
      (child.type as { type?: symbol })?.type !== SUFFIX_TYPE
  );

  return (
    <SelectTriggerPrimitive ref={ref} className={cn("w-full", className)} {...props}>
      <div className="flex justify-between items-center gap-2 w-full min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {prefix}
          {rest}
        </div>
        {suffix}
      </div>
    </SelectTriggerPrimitive>
  );
});
SelectBoxTrigger.displayName = "SelectBoxTrigger";

/* ---------------------------------------------------------------------------
 * Value
 * ------------------------------------------------------------------------- */
const SelectBoxValue = SelectValue;

/* ---------------------------------------------------------------------------
 * Content, Item, Group, Separator
 * ------------------------------------------------------------------------- */
const SelectBoxContent = SelectContent;
const SelectBoxItem = SelectItem;
const SelectBoxGroup = SelectGroup;
const SelectBoxItemLabel = SelectLabel;
const SelectBoxItemSeparator = SelectSeparator;

/* ---------------------------------------------------------------------------
 * Wrapper - Label + Trigger + Content을 감싸는 컨테이너
 * ------------------------------------------------------------------------- */
const SelectBoxWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full flex flex-col gap-2", className)}
    {...props}
  />
));
SelectBoxWrapper.displayName = "SelectBoxWrapper";

/* ---------------------------------------------------------------------------
 * Compound Component Export
 * ------------------------------------------------------------------------- */
const SelectBox = Object.assign(SelectBoxRoot, {
  Root: SelectBoxRoot,
  Label: SelectBoxLabel,
  Trigger: SelectBoxTrigger,
  Value: SelectBoxValue,
  Prefix: SelectBoxPrefix,
  Suffix: SelectBoxSuffix,
  Content: SelectBoxContent,
  Item: SelectBoxItem,
  Group: SelectBoxGroup,
  ItemLabel: SelectBoxItemLabel,
  ItemSeparator: SelectBoxItemSeparator,
  Wrapper: SelectBoxWrapper,
});

export default SelectBox;
export {
  SelectBoxRoot,
  SelectBoxLabel,
  SelectBoxTrigger,
  SelectBoxValue,
  SelectBoxPrefix,
  SelectBoxSuffix,
  SelectBoxContent,
  SelectBoxItem,
  SelectBoxGroup,
  SelectBoxItemLabel,
  SelectBoxItemSeparator,
  SelectBoxWrapper,
};
