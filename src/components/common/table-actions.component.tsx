import { Eye, PencilLine, Trash } from "lucide-react";

interface TableActionButtonsProps {
  id: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  loading?: boolean;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  id,
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = true,
  loading = false,
}) => {
  return (
    <div className="flex space-x-3">
      {showEdit && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(id)}
          aria-label="Edit"
          disabled={loading}
          className={`text-2xl cursor-pointer ${
            loading ? "text-gray-400" : "hover:text-gray-600"
          }`}
        >
          <PencilLine />
        </button>
      )}

      {showDelete && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label="Delete"
          disabled={loading}
          className={`text-2xl cursor-pointer ${
            loading ? "text-gray-400" : "text-red-500 hover:text-red-700"
          }`}
        >
          <Trash />
        </button>
      )}

      {showView && onView && (
        <button
          type="button"
          onClick={() => onView(id)}
          aria-label="View"
          disabled={loading}
          className={`text-2xl cursor-pointer ${
            loading ? "text-gray-400" : "text-blue-500 hover:text-blue-700"
          }`}
        >
          <Eye />
        </button>
      )}
    </div>
  );
};

export default TableActionButtons;
