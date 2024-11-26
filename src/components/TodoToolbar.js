const TodoToolbar = ({
    filter,
    onFilterChange,
    onCompleteAll,
    onClearCompleted,
    completedCount,
    totalCount,
    allVisibleCompleted,
    isLoading
}) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="btn-group" role="group" aria-label="Filter tasks">
                <button
                    type="button"
                    className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                >
                    All
                </button>
                <button
                    type="button"
                    className={`btn btn-outline-secondary ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => onFilterChange('active')}
                >
                    Active
                </button>
                <button
                    type="button"
                    className={`btn btn-outline-secondary ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => onFilterChange('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="d-flex gap-2">
                <button
                    onClick={onCompleteAll}
                    disabled={isLoading || allVisibleCompleted}
                    className="btn btn-outline-success"
                >
                    {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                    ) : null}
                    Complete All Visible
                </button>
                <button
                    onClick={onClearCompleted}
                    disabled={isLoading || completedCount === 0}
                    className="btn btn-outline-danger"
                >
                    {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                    ) : null}
                    Clear Completed
                </button>
            </div>

            <div className="text-muted">
                {completedCount} of {totalCount} completed
            </div>
        </div>
    );
};

export default TodoToolbar;