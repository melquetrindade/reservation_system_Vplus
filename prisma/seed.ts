const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "melquetrindade654@gmail.com";

  const administradorExistente = await prisma.administrador.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (administradorExistente) {
    console.log("Seed já executada anteriormente.");
    return;
  }

  await prisma.barbearia.create({
    data: {
      nome: "Reservation System Plus",
      endereco: "Bairro: Maria Terceira,rua Brasilino Gomes Meira, Nº 311",
      imgURL:
        "https://res-console.cloudinary.com/oyitqc6z/thumbnails/v1/image/upload/v1785528414/aW1hZ2VfYmFyYmVhcmlhX243bG1ubw==/drilldown",
      administradores: {
        create: {
          nome: "Melque Trindade",
          email: adminEmail,
          role: "OWNER",
        },
      },
    },
  });

  console.log("✅ Seed executada com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
