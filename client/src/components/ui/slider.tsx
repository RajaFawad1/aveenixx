import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(event.target.value), localValue[1] || max];
      setLocalValue(newValue);
      onValueChange?.(newValue);
    };

    const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [localValue[0] || min, Number(event.target.value)];
      setLocalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute h-full bg-primary"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              width: `${((localValue[1] || max) - localValue[0]) / (max - min) * 100}%`
            }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleChange}
          className="absolute h-2 w-full appearance-none bg-transparent cursor-pointer"
          {...props}
        />
        {localValue[1] !== undefined && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[1]}
            onChange={handleChangeMax}
            className="absolute h-2 w-full appearance-none bg-transparent cursor-pointer"
          />
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };