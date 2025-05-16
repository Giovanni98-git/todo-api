-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "emailTo" TEXT NOT NULL,
    "emailsCC" TEXT,
    "emailCci" TEXT,
    "attachements" TEXT,
    "emailCCStatus" BOOLEAN NOT NULL DEFAULT false,
    "emailCciStatus" BOOLEAN NOT NULL DEFAULT false,
    "emailToStatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Mail" ("attachements", "createdAt", "emailCci", "emailTo", "emailsCC", "id", "message", "title", "updatedAt") SELECT "attachements", "createdAt", "emailCci", "emailTo", "emailsCC", "id", "message", "title", "updatedAt" FROM "Mail";
DROP TABLE "Mail";
ALTER TABLE "new_Mail" RENAME TO "Mail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
