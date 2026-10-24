import { DivisionBallot } from "@/components/division-ballot";
import type { Props } from "./fcs.server";

export default function FcsBallotPage(props: Props) {
  return <DivisionBallot division="FCS" {...props} />;
}
