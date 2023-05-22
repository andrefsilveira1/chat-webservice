import "./styles.css";

export default function Button({ children, ...rest }) {
  return <button {...rest}>{children}</button>;
}
