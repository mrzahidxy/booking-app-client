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
    <div className="flex items-center gap-2">
      {showEdit && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(id)}
          aria-label="Edit"
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <PencilLine className="h-4 w-4" />
        </button>
      )}

      {showDelete && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label="Delete"
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <Trash className="h-4 w-4" />
        </button>
      )}

      {showView && onView && (
        <button
          type="button"
          onClick={() => onView(id)}
          aria-label="View"
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-indigo-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default TableActionButtons;
