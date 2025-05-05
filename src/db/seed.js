import prisma from "./client.js";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../utils/encryption.js";

// Number of users and folders/files per user
const NUM_USERS = 3;
const FOLDERS_PER_USER = 2;
const FILES_PER_FOLDER = 3;

async function createUserWithFoldersAndFiles() {
  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email().toLowerCase();
    const password = await hashPassword("test123", 10);

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    for (let j = 0; j < FOLDERS_PER_USER; j++) {
      const folder = await prisma.folder.create({
        data: {
          name: faker.system.directoryPath().split("/").pop(),
          userId: user.id,
        },
      });

      // Optional: Create a nested folder
      const subfolder = await prisma.folder.create({
        data: {
          name: faker.system.directoryPath().split("/").pop(),
          userId: user.id,
          parentId: folder.id,
        },
      });

      // Create files in both parent and subfolder
      await Promise.all(
        [folder.id, subfolder.id].map((folderId) =>
          Promise.all(
            Array.from({ length: FILES_PER_FOLDER }).map(() =>
              prisma.file.create({
                data: {
                  name: faker.system.fileName(),
                  size: parseFloat((Math.random() * 5 + 0.1).toFixed(2)), // Generates sizes from 0.1MB to ~5MB
                  extension: faker.system.fileExt(),
                  folderId,
                  link: faker.internet.url(),
                },
              })
            )
          )
        )
      );
    }
  }
}

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.file.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Folder_id_seq" RESTART WITH 1;`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "File_id_seq" RESTART WITH 1;`);

  await createUserWithFoldersAndFiles();

  console.log("✅ Done seeding!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
