-- CreateTable
CREATE TABLE "StudentVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegramId" TEXT NOT NULL,
    "telegramHandle" TEXT,
    "fullName" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolEmail" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "program" TEXT,
    "yearsLeft" INTEGER,
    "idImageUrl" TEXT,
    "ideaSummary" TEXT,
    "consentGranted" BOOLEAN NOT NULL DEFAULT false,
    "proofHash" TEXT,
    "onchainTx" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubmissionPack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "roughIdea" TEXT NOT NULL,
    "refinedMarkdown" TEXT NOT NULL,
    "summaryHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubmissionPack_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentVerification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
