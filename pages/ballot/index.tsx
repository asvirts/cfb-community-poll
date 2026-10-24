import { DivisionBallot } from "@/components/division-ballot";
import type { Props } from "./index.server";

export default function BallotPage(props: Props) {
  return <DivisionBallot division="FBS" {...props} />;
}
