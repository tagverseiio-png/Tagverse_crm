import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  try {
    // ── 1. Pipeline: default pipeline with stages + deals ─────────────────────
    const pipeline = await prisma.pipeline.findFirst({
      where: { isDefault: true },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: {
            // No direct relation to deals on PipelineStage — query separately
          },
        },
      },
    });

    // For each stage, fetch the deals belonging to it
    const pipelineStages = pipeline
      ? await Promise.all(
          pipeline.stages.map(async (stage) => {
            const deals = await prisma.deal.findMany({
              where: {
                pipelineId: pipeline.id,
                pipelineStageKey: stage.key,
              },
              orderBy: { createdAt: 'desc' },
              take: 10,
              select: {
                id: true,
                title: true,
                client: true,
                value: true,
                assignedTo: { select: { name: true } },
              },
            });
            return {
              id: stage.id,
              label: stage.label,
              key: stage.key,
              color: stage.color,
              headerColor: stage.headerColor,
              deals: deals.map((d) => ({
                id: d.id,
                name: d.title || d.client || 'Untitled Deal',
                company: d.client ?? '',
                value: d.value
                  ? d.value >= 10000000
                    ? `₹${(d.value / 10000000).toFixed(1)}Cr`
                    : d.value >= 100000
                    ? `₹${(d.value / 100000).toFixed(1)}L`
                    : d.value >= 1000
                    ? `₹${(d.value / 1000).toFixed(0)}K`
                    : `₹${d.value}`
                  : '₹0',
                owner: d.assignedTo?.name
                  ? d.assignedTo.name
                      .split(' ')
                      .map((w: string) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'UN',
              })),
            };
          })
        )
      : [];

    // ── 2. Funnel: deal counts per stage with percentages ────────────────────
    const funnelColors = [
      '#7B2FFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    ];
    const maxCount = pipelineStages.reduce(
      (m, s) => Math.max(m, s.deals.length),
      0
    ) || 1;

    // Get total deal counts per stage (not capped at 10)
    const rawFunnelData = pipeline
      ? await Promise.all(
          pipeline.stages.map(async (stage, i) => {
            const count = await prisma.deal.count({
              where: { pipelineId: pipeline.id, pipelineStageKey: stage.key },
            });
            return {
              stage: stage.label,
              count,
              pct: 0, // will compute below
              color: funnelColors[i % funnelColors.length],
            };
          })
        )
      : [];

    // Apply cumulative logic (deals in a stage include all deals in subsequent stages)
    const funnelData: typeof rawFunnelData = [];
    let runningTotal = 0;
    for (let i = rawFunnelData.length - 1; i >= 0; i--) {
      runningTotal += rawFunnelData[i].count;
      funnelData.unshift({
        ...rawFunnelData[i],
        count: runningTotal,
      });
    }

    // Compute percentages relative to first-stage (largest expected)
    const firstCount = funnelData[0]?.count || 1;
    funnelData.forEach((f) => {
      f.pct = Math.round((f.count / firstCount) * 100);
    });

    // Overall conversion rate: last winning stage count / first stage count
    const wonCount = funnelData[funnelData.length - 1]?.count ?? 0;
    const conversionRate =
      firstCount > 0 ? ((wonCount / firstCount) * 100).toFixed(1) : '0.0';

    // ── 3. Recent Leads ───────────────────────────────────────────────────────
    const leads = await prisma.contact.findMany({
      where: { type: 'lead' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        name: true,
        company: true,
        source: true,
        stage: true,
        leadScore: true,
        createdAt: true,
        assignedTo: { select: { name: true } },
      },
    });

    const recentLeads = leads.map((l) => {
      const mins = Math.floor(
        (Date.now() - new Date(l.createdAt).getTime()) / 60000
      );
      const timeAgo =
        mins < 60
          ? `${mins}m ago`
          : mins < 1440
          ? `${Math.floor(mins / 60)}h ago`
          : `${Math.floor(mins / 1440)}d ago`;

      return {
        id: l.id,
        name: l.name,
        company: l.company ?? '—',
        source: l.source ?? 'Direct',
        stage: l.stage,
        score: l.leadScore,
        owner: l.assignedTo?.name
          ? l.assignedTo.name
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : 'UN',
        time: timeAgo,
      };
    });

    return apiSuccess({ pipelineStages, funnelData, conversionRate, recentLeads });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
