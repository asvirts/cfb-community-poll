import { DivisionHome } from "@/components/division-home";

import type { Props } from "./index.server";

export default function HomePage({ standings, error }: Props) {
  return <DivisionHome division="FBS" standings={standings} error={error} />;
}
