import { SERVERS } from '../lib/constants';

interface ServerSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const ServerSelector = ({ selected, onSelect }: ServerSelectorProps) => {
  return (
    <select 
      className="bg-gray-800 text-white p-2 rounded w-full mb-4"
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
    >
      {SERVERS.map(server => (
        <option key={server.id} value={server.id}>{server.name}</option>
      ))}
    </select>
  );
};
