/**
 * PositionsTable.tsx
 *
 * Read-only table of every volunteer position, with its description, days,
 * and times. Scrolls sideways on small screens.
 *
 * Carter & Rim & Natalie
 * Date Created: 10/26/2026
 */

import type { Position } from "./positions-step";

type PositionsTableProps = {
  positions: Position[];
};

export default function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-input-regular-frame">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <caption className="sr-only">
          All volunteer positions, with their descriptions, days, and times
        </caption>
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th scope="col" className="w-48 px-4 py-3 text-left font-semibold">
              Position
            </th>
            <th scope="col" className="px-4 py-3 text-left font-semibold">
              Description
            </th>
            <th scope="col" className="w-40 px-4 py-3 text-left font-semibold">
              Days
            </th>
            <th scope="col" className="w-40 px-4 py-3 text-left font-semibold">
              Times
            </th>
          </tr>
        </thead>

        <tbody>
          {positions.map((position) => (
            <tr
              key={position.id}
              className="border-b border-input-regular-frame last:border-b-0 even:bg-primary/10"
            >
              {/* The position name is the row's header, so screen readers can read each cell with it */}
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-semibold"
              >
                {position.name}
              </th>
              <td className="px-4 py-3 align-top">{position.description}</td>
              <td className="px-4 py-3 align-top">{position.days}</td>
              <td className="px-4 py-3 align-top">{position.times}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
