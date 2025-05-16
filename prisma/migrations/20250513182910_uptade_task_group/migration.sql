-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskGroup" ("color", "createdAt", "description", "id", "label", "updatedAt", "userId") SELECT "color", "createdAt", "description", "id", "label", "updatedAt", "userId" FROM "TaskGroup";
DROP TABLE "TaskGroup";
ALTER TABLE "new_TaskGroup" RENAME TO "TaskGroup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
