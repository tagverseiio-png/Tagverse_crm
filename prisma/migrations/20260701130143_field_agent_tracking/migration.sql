-- CreateTable
CREATE TABLE "FieldAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Idle',
    "location" TEXT,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "battery" TEXT,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldActivityFeed" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "iconType" TEXT NOT NULL DEFAULT 'activity',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldActivityFeed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldActivityFeed" ADD CONSTRAINT "FieldActivityFeed_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "FieldAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
