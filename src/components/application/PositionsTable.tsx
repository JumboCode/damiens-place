/**
 * 
 *
description  *
 * Carter & Rim 
 * Date Created: 10/26/2026
 */
 
import type { Position } from "./positions-step";
 
type PositionsTableProps = {
  positions: Position[];
};
 
export default function PositionsTable({ positions }: PositionsTableProps) {
  return (
  <div className="overflow-x-auto">  
  <table className="w-full min-w-[800px] border-collapse text-left">
    <caption className="sr-only">Table Caption</caption>
      <thead className="bg-primary text-primary-foreground">          
          <tr>
            <th scope="col" className="min-w-[200px] px-6 py-4 font-medium">Positions</th>
            <th scope="col" className="min-w-[200px] px-6 py-4 font-medium">Description</th>
            <th scope="col" className="min-w-[200px] px-6 py-4 font-medium">Days</th>
            <th scope="col" className="min-w-[200px] px-6 py-4 font-medium">Times</th>
          </tr>
      </thead>    
    
    <tbody>
      {positions.map((position) => (
          <tr key={position.id} className="even:bg-[#FBE6EA] items-center gap-[60px] self-stretch px-[30px] py-5">
            <td className="text-slate-900 font-['Inclusive_Sans'] text-lg font-semibold leading-[normal]">{position.name}</td>
            <td className="text-slate-700 font-sans text-[18px] font-medium leading-[normal]">{position.description}</td>
            <td className="text-slate-700 font-sans text-[18px] font-medium leading-[normal]">{position.days}</td>
            <td className="text-slate-700 font-sans text-[18px] font-medium leading-[normal]">{position.times}</td>
          </tr>
        ))}
    </tbody>
  </table>
  </div>
  )
}