import { Eye, PencilLine, Trash } from "lucide-react";

interface TableActionButtonsProps {
  id: string | number;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onView?: (id: string | number) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  loading?: boolean;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  id,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  showEdit = true,
  showDelete = true,
  showView = true,
  loading,
}) => (
  <div className="flex space-x-3">
    {showEdit && (
      <button
        className={`text-2xl cursor-pointer ${
          loading ? "text-gray-500" : "hover:text-gray-500"
        } `}
        onClick={() => onEdit(id)} // ✅ Correctly passing ID
        aria-label="Edit"
        disabled={loading}
      >
        <PencilLine />
      </button>
    )}

    {showDelete && (
      <button
        className={`text-2xl cursor-pointer ${
          loading ? "text-gray-500" : "text-red-500 hover:text-red-700"
        }`}
        onClick={() => onDelete(id)} // ✅ Correctly passing ID
        aria-label="Delete"
        disabled={loading}
      >
        <Trash />
      </button>
    )}

    {showView && (
      <button
        className={`text-2xl cursor-pointer ${
          loading ? "text-gray-500" : "text-blue-500 hover:text-blue-700"
        }`}
        onClick={() => onView(id)} // ✅ Correctly passing ID
        aria-label="View"
        disabled={loading}
      >
        <Eye />
      </button>
    )}
  </div>
);

export default TableActionButtons;
