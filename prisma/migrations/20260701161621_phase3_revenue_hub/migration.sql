/*
  Warnings:

  - You are about to drop the column `content` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `client` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_dealId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_dealId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "content",
ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "data" JSONB,
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "start" TIMESTAMP(3),
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'Service Agreement',
ADD COLUMN     "valuePerYear" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "dealId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending Signature';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '₹',
ADD COLUMN     "dealId" TEXT,
ADD COLUMN     "delivery" TEXT,
ADD COLUMN     "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gstRate" DOUBLE PRECISION NOT NULL DEFAULT 18,
ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lineItems" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "terms" TEXT,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "quoteId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Draft',
ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoiceLabel" TEXT,
ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'UPI',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Received',
ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "discount",
DROP COLUMN "tax",
ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '₹',
ADD COLUMN     "delivery" TEXT,
ADD COLUMN     "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "gstRate" DOUBLE PRECISION NOT NULL DEFAULT 18,
ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "terms" TEXT,
ALTER COLUMN "dealId" DROP NOT NULL,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
