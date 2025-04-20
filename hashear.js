import bcrypt from "bcryptjs";

const run = async () => {
  const hash = await bcrypt.hash("1234", 10);
  console.log("Contraseña hasheada:", hash);
};

run();
