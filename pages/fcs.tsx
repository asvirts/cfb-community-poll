import { DivisionHome } from "@/components/division-home";

import type { Props } from "./fcs.server";

export default function FcsPage({ standings, error }: Props) {
  return <DivisionHome division="FCS" standings={standings} error={error} />;
}
