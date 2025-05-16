/*
  Warnings:

  - Added the required column `userId` to the `TaskGroup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "TaskGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskGroup" ("color", "description", "id", "label") SELECT "color", "description", "id", "label" FROM "TaskGroup";
DROP TABLE "TaskGroup";
ALTER TABLE "new_TaskGroup" RENAME TO "TaskGroup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
