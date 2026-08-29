function ConfirmModal({ show, title, message, onConfirm, onCancel, confirming }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title" id="confirmModalTitle">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Cancel"
              ></button>
            </div>
            <div className="modal-body pt-2">
              <p className="mb-0 text-muted">{message}</p>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={confirming}
              >
                {confirming ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;