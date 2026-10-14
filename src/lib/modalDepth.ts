// Reference-counted body.modal-open toggle so two independent modal
// owners (AdmissionsModal, the project confirmation modal) can each
// push the page back (§12) without one closing early stomping on the
// other if they were ever open at the same time.
let openCount = 0

function applyClass() {
  document.body.classList.toggle('modal-open', openCount > 0)
}

export function pushModalOpen() {
  openCount += 1
  applyClass()
}

export function popModalOpen() {
  openCount = Math.max(0, openCount - 1)
  applyClass()
}
