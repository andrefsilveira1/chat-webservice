import Input from "../Input";
import Button from "../Button";

export default function RegisterScreen({ name, setName, register }) {
  return (
    <form
      onSubmit={register}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: "3rem", fontSize: "3rem" }}>
        Por favor, insira seu nome
      </h1>
      <Input
        style={{ width: "100%", marginBottom: "1.5rem" }}
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button style={{ width: "100%" }}>Confirmar</Button>
    </form>
  );
}
