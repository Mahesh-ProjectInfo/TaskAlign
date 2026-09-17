// Business Rule Engine + Hungarian Algorithm helpers

const INELIGIBLE = 999999;

export function computeEligibility(resources, tasks) {
  const rows = [];
  resources.forEach((r) => {
    tasks.forEach((t) => {
      const need = t.requiredSkills || [];
      const have = new Set(r.skills || []);
      const missing = need.filter((s) => !have.has(s));
      const eligible = missing.length === 0;
      rows.push({
        resourceId: r.id,
        resourceName: r.name,
        taskId: t.id,
        taskName: t.name,
        eligible,
        reason: eligible
          ? "All required skills available"
          : `${missing.join(", ")} skill${missing.length > 1 ? "s" : ""} missing`,
      });
    });
  });
  return rows;
}

export function buildCostMatrix(resources, tasks, workingDays) {
  const wd = Number(workingDays) || 1;
  return resources.map((r) => {
    const costPerDay = Number(r.salary) / wd;
    return tasks.map((t) => {
      const need = t.requiredSkills || [];
      const have = new Set(r.skills || []);
      const eligible = need.every((s) => have.has(s));
      if (!eligible) return INELIGIBLE;
      return Math.round(costPerDay * Number(t.days));
    });
  });
}

// Hungarian algorithm — minimize. Returns array assignment[row] = col (or -1).
function hungarian(costMatrix) {
  const n = costMatrix.length;
  if (n === 0) return [];
  const m = costMatrix[0].length;
  const size = Math.max(n, m);
  const BIG = 1e12;
  // Pad to square with BIG
  const a = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i < n && j < m ? costMatrix[i][j] : BIG)),
  );

  // Kuhn-Munkres / Jonker-Volgenant style using potentials.
  const u = new Array(size + 1).fill(0);
  const v = new Array(size + 1).fill(0);
  const p = new Array(size + 1).fill(0);
  const way = new Array(size + 1).fill(0);

  for (let i = 1; i <= size; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(size + 1).fill(Infinity);
    const used = new Array(size + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= size; j++) {
        if (!used[j]) {
          const cur = a[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }
      for (let j = 0; j <= size; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0);
  }

  const assignment = new Array(n).fill(-1);
  for (let j = 1; j <= size; j++) {
    const i = p[j] - 1;
    if (i >= 0 && i < n && j - 1 < m) assignment[i] = j - 1;
  }
  return assignment;
}

export function optimize(draft) {
  const { resources, tasks, workingDays, budget, timeline, optimizationType } = draft;
  const started = performance.now();
  const isCost = optimizationType === "Cost Minimization";
  const costMatrix = buildCostMatrix(resources, tasks, workingDays);
  // Both strategies intentionally solve the same cost matrix. Any profit
  // metrics are calculated only after the allocation has been selected.
  const assignment = hungarian(costMatrix);

  const rows = [];
  let totalCost = 0;
  let totalDays = 0;

  assignment.forEach((taskIdx, resIdx) => {
    if (taskIdx < 0) return;
    const r = resources[resIdx];
    const t = tasks[taskIdx];
    if (!r || !t) return;
    const cost = costMatrix[resIdx][taskIdx];
    if (cost === INELIGIBLE) return;
    rows.push({
      resource: r.name,
      resourceId: r.id,
      role: r.role,
      task: t.name,
      taskId: t.id,
      days: Number(t.days),
      cost,
    });
    totalCost += cost;
    totalDays += Number(t.days);
  });

  const executionMs = Math.max(1, Math.round(performance.now() - started));
  const budgetOk = Number(budget) === 0 || totalCost <= Number(budget);
  const timelineOk = Number(timeline) === 0 || totalDays <= Number(timeline);
  return {
    rows,
    totalCost,
    totalDays,
    executionMs,
    budgetOk,
    timelineOk,
    isCost,
    costMatrix,
  };
}

export const INELIGIBLE_VALUE = INELIGIBLE;
