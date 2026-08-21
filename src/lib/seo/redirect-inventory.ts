export type RedirectInventoryHealth = {
  readonly state: "blocked";
  readonly total: 0;
  readonly validated: 0;
  readonly detail: string;
};

export function getRedirectInventoryHealth(): RedirectInventoryHealth {
  return {
    state: "blocked",
    total: 0,
    validated: 0,
    detail: "Legacy URL export and approved redirect matrix are not available.",
  };
}
