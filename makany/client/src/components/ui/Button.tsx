import { classNames } from "../../utils/helpers";

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={classNames(
      "rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

export default Button;
