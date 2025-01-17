-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `premium` BOOLEAN NOT NULL DEFAULT false,
    `premiumEmoji` VARCHAR(191) NULL,
    `isVisibleEmoji` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guild` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(191) NOT NULL DEFAULT '🔥',
    `isStreakVisibilityToggle` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMemberData` (
    `guildId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `streak` INTEGER NOT NULL,
    `lastMessage` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GuildMemberData_guildId_userId_key`(`guildId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildMemberData` ADD CONSTRAINT `GuildMemberData_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildMemberData` ADD CONSTRAINT `GuildMemberData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
