-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `streak` INTEGER NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
